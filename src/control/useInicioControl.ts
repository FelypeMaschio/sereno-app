import { useEffect, useMemo, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { mensagemDoErro } from '../model/comum';
import { Estacao } from '../model/estacao';
import { Local } from '../model/local';
import { LugarMapa } from '../model/lugarMapa';
import { buscarEstacao, listarEstacoes } from '../repository/remote/estacoesRepository';
import { listarLocais } from '../repository/remote/locaisRepository';
import { buscarNoMapa } from '../repository/remote/mapaRepository';
import { Coordenada, distanciaKm, temCoordenadas } from '../utils/distancia';
import { chaves } from './chaves';
import { useDebounce } from './useDebounce';
import { useLocalizacao } from './useLocalizacao';

const INDICE_CALMO = 7;
const INDICE_MODERADO = 4;
const MAXIMO_SUGESTOES = 3;
/** Mesmo nome a menos de 150 m: o resultado do mapa é um lugar que já está no Sereno. */
const RAIO_MESMO_LUGAR_KM = 0.15;
/** Acima disso, a estação "mais próxima" não ajuda de verdade: avisamos a pessoa. */
export const RAIO_ESTACAO_UTIL_KM = 2;

/**
 * Destino da viagem. Pode ser um lugar do Sereno (com índice de calma e previsão)
 * ou um lugar real do mapa que ainda não foi avaliado (só posição e endereço).
 */
export interface Destino {
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  local: Local | null;
  lugarMapa: LugarMapa | null;
}

export interface SugestaoCalma {
  local: Local;
  distanciaKm: number | null;
}

export interface EstacaoNoCaminho {
  estacao: Estacao;
  distanciaKm: number;
}

const maisProxima = (ponto: Coordenada, estacoes: Estacao[]): EstacaoNoCaminho | null => {
  let melhor: EstacaoNoCaminho | null = null;
  for (const estacao of estacoes.filter(temCoordenadas)) {
    const d = distanciaKm(ponto, estacao);
    if (!melhor || d < melhor.distanciaKm) melhor = { estacao, distanciaKm: d };
  }
  return melhor;
};

/** "1-Azul, 3-Vermelha" → ["1-azul", "3-vermelha"], para comparar linhas. */
const linhas = (estacao: Estacao) =>
  (estacao.linha ?? '')
    .split(',')
    .map((linha) => linha.trim())
    .filter(Boolean);

/**
 * Tela "Pronto para ir?": junta as frentes do Sereno numa resposta só.
 * 1. Destino: um lugar do Sereno (índice de calma + previsão da IA) ou do mapa.
 * 2. Caminho: estação de embarque (perto da pessoa) e de desembarque (perto do
 *    destino), com o status de cada elevador e escada (API .NET).
 * 3. "Preciso de calma agora": os lugares mais tranquilos perto da pessoa.
 * As distâncias são calculadas no celular: a localização nunca vai para uma API.
 */
export const useInicioControl = () => {
  const [busca, setBusca] = useState<string>('');
  const [destino, setDestino] = useState<Destino | null>(null);
  const [pediuCalma, setPediuCalma] = useState<boolean>(false);
  const buscaAtrasada = useDebounce(busca.trim(), 500);
  const localizacao = useLocalizacao();
  const { obter } = localizacao;
  const estadoLocal = localizacao.estado;
  const minhaPosicao = estadoLocal.tipo === 'ok' ? estadoLocal.coordenada : null;

  // Se a pessoa JÁ liberou a localização antes, usamos sem perguntar de novo.
  // Se não liberou, a tela mostra um botão; o pedido nunca aparece sozinho.
  useEffect(() => {
    Location.getForegroundPermissionsAsync()
      .then(({ granted }) => {
        if (granted) obter();
      })
      .catch(() => {});
  }, [obter]);

  // ---- 1. Destino: Sereno primeiro, depois o mapa ----
  const doSereno = useQuery({
    queryKey: [...chaves.locais, 'inicio', buscaAtrasada],
    queryFn: () => listarLocais({ nome: buscaAtrasada, size: 5 }),
    enabled: buscaAtrasada.length >= 2 && !destino,
  });

  const doMapa = useQuery({
    queryKey: ['mapa', buscaAtrasada, minhaPosicao?.latitude, minhaPosicao?.longitude],
    queryFn: ({ signal }) => buscarNoMapa(buscaAtrasada, minhaPosicao, signal, true),
    enabled: buscaAtrasada.length >= 3 && !destino,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const resultadosSereno = useMemo(() => doSereno.data?.items ?? [], [doSereno.data]);
  // Tira do mapa o que já aparece na lista do Sereno (mesmo nome, mesmo ponto).
  const resultadosMapa = useMemo(
    () =>
      (doMapa.data ?? [])
        .filter(
          (lugar) =>
            !resultadosSereno.some(
              (local) =>
                local.nome.toLowerCase() === lugar.nome.toLowerCase() ||
                distanciaKm(local, lugar) <= RAIO_MESMO_LUGAR_KM,
            ),
        )
        .slice(0, 5),
    [doMapa.data, resultadosSereno],
  );

  // ---- 2. Caminho: estações de embarque e de desembarque ----
  const estacoes = useQuery({
    queryKey: [...chaves.estacoes, 'proximidade'],
    // Até 50 estações (limite por página da API .NET): base para achar as mais próximas.
    queryFn: () => listarEstacoes({ size: 50 }),
    enabled: destino !== null,
    staleTime: 5 * 60_000,
  });

  const caminho = useMemo(() => {
    const lista = estacoes.data?.items ?? [];
    if (!destino || lista.length === 0) return null;
    const desembarque = maisProxima(destino, lista);
    const embarque = minhaPosicao ? maisProxima(minhaPosicao, lista) : null;
    const mesmaEstacao =
      embarque !== null && desembarque !== null && embarque.estacao.id === desembarque.estacao.id;
    const linhasEmComum =
      embarque && desembarque && !mesmaEstacao
        ? linhas(embarque.estacao).filter((linha) =>
            linhas(desembarque.estacao).some(
              (outra) => outra.toLowerCase() === linha.toLowerCase(),
            ),
          )
        : [];
    return { embarque, desembarque, mesmaEstacao, linhasEmComum };
  }, [destino, estacoes.data, minhaPosicao]);

  // A lista só traz quantos equipamentos estão parados; o detalhe traz cada um deles.
  const idsDoCaminho = [caminho?.embarque?.estacao.id, caminho?.desembarque?.estacao.id].filter(
    (id, indice, todos): id is number => id != null && todos.indexOf(id) === indice,
  );
  const detalhes = useQueries({
    queries: idsDoCaminho.map((id) => ({
      queryKey: chaves.estacao(id),
      queryFn: () => buscarEstacao(id),
      staleTime: 60_000,
    })),
    combine: (respostas) =>
      new Map(
        respostas
          .filter((resposta) => resposta.data)
          .map((resposta) => [resposta.data!.id, resposta.data!.equipamentos ?? []]),
      ),
  });

  // ---- 3. Preciso de calma agora ----
  const avaliados = useQuery({
    queryKey: [...chaves.locais, 'mais-calmos'],
    queryFn: () => listarLocais({ size: 50, sort: 'indiceCalma,desc' }),
    // Busca já ao abrir a tela: quando a pessoa toca em "Preciso de calma agora",
    // a lista já está pronta (no momento difícil, cada segundo de espera pesa).
    staleTime: 5 * 60_000,
  });

  const calma = useMemo(() => {
    const lista = (avaliados.data?.items ?? []).filter((local) => local.indiceCalma != null);
    const comDistancia: SugestaoCalma[] = lista.map((local) => ({
      local,
      distanciaKm: minhaPosicao && temCoordenadas(local) ? distanciaKm(minhaPosicao, local) : null,
    }));
    // Mais perto primeiro quando sabemos onde a pessoa está; senão, mais calmo primeiro.
    const ordenar = (a: SugestaoCalma, b: SugestaoCalma) =>
      a.distanciaKm != null && b.distanciaKm != null
        ? a.distanciaKm - b.distanciaKm
        : (b.local.indiceCalma ?? 0) - (a.local.indiceCalma ?? 0);
    const calmos = comDistancia.filter((s) => (s.local.indiceCalma ?? 0) >= INDICE_CALMO);
    if (calmos.length > 0) {
      return { sugestoes: calmos.sort(ordenar).slice(0, MAXIMO_SUGESTOES), soModerados: false };
    }
    // Nenhum lugar calmo ainda: os moderados, avisando. Agitados nunca são sugeridos.
    const moderados = comDistancia.filter((s) => (s.local.indiceCalma ?? 0) >= INDICE_MODERADO);
    return { sugestoes: moderados.sort(ordenar).slice(0, MAXIMO_SUGESTOES), soModerados: true };
  }, [avaliados.data, minhaPosicao]);

  return {
    // Destino
    busca,
    setBusca,
    poucasLetras: buscaAtrasada.length < 2,
    resultadosSereno,
    resultadosMapa,
    buscando: doSereno.isFetching || doMapa.isFetching,
    erroBusca: mensagemDoErro(doSereno.error),
    erroMapa: mensagemDoErro(doMapa.error),
    destino,
    escolherLocal: (local: Local) => {
      setDestino({ ...local, local, lugarMapa: null });
      setBusca('');
    },
    escolherDoMapa: (lugar: LugarMapa) => {
      setDestino({ ...lugar, local: null, lugarMapa: lugar });
      setBusca('');
    },
    trocarDestino: () => setDestino(null),

    // Caminho
    caminho,
    equipamentosDa: (estacaoId: number) => detalhes.get(estacaoId) ?? null,
    carregandoEstacoes: estacoes.isPending && destino !== null,
    erroEstacoes: mensagemDoErro(estacoes.error),

    // Localização (embarque e calma)
    estadoLocalizacao: estadoLocal,
    usarLocalizacao: obter,
    abrirConfiguracoes: localizacao.abrirConfiguracoes,

    // Calma
    pediuCalma,
    pedirCalma: async () => {
      setPediuCalma(true);
      if (estadoLocal.tipo !== 'ok') await obter();
    },
    sugestoes: calma.sugestoes,
    soModerados: calma.soModerados,
    // Mostra os lugares assim que a lista chega; a localização, se ainda estiver
    // vindo, só reordena por distância depois.
    carregandoSugestoes: avaliados.isPending,
    procurandoLocalizacao: estadoLocal.tipo === 'carregando',
    erroSugestoes: mensagemDoErro(avaliados.error),
  };
};
