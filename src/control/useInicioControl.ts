import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErroApp } from '../model/comum';
import { Estacao } from '../model/estacao';
import { Local } from '../model/local';
import { listarEstacoes } from '../repository/remote/estacoesRepository';
import { listarLocais } from '../repository/remote/locaisRepository';
import { distanciaKm, temCoordenadas } from '../utils/distancia';
import { chaves } from './chaves';
import { useDebounce } from './useDebounce';
import { EstadoLocalizacao, useLocalizacao } from './useLocalizacao';

const RAIO_CALMA_KM = 1;
const INDICE_CALMO = 7;

export interface SugestaoCalma {
  local: Local;
  distanciaKm: number | null;
}

/**
 * Tela "Pronto para ir?": junta as duas frentes do Sereno numa resposta só.
 * 1. A pessoa escolhe um lugar (API Java) → vê o índice de calma e a previsão (IA).
 * 2. O app acha a estação mais próxima desse lugar (API .NET), calculando a distância
 *    no celular, e mostra se os equipamentos dela estão funcionando.
 * Além disso, "Preciso de calma agora" sugere lugares calmos perto da pessoa.
 */
export const useInicioControl = () => {
  const [busca, setBusca] = useState<string>('');
  const [escolhido, setEscolhido] = useState<Local | null>(null);
  const buscaAtrasada = useDebounce(busca);
  const localizacao = useLocalizacao();
  const [pediuCalma, setPediuCalma] = useState<boolean>(false);

  const resultadosBusca = useQuery({
    queryKey: [...chaves.locais, 'inicio', buscaAtrasada],
    queryFn: () => listarLocais({ nome: buscaAtrasada, size: 5 }),
    enabled: buscaAtrasada.trim().length >= 2 && !escolhido,
  });

  // Até 50 estações (limite da API .NET por página): base para achar a mais próxima.
  const estacoes = useQuery({
    queryKey: [...chaves.estacoes, 'proximidade'],
    queryFn: () => listarEstacoes({ size: 50 }),
    enabled: escolhido !== null,
    staleTime: 5 * 60_000,
  });

  const estacaoProxima = useMemo((): { estacao: Estacao; distanciaKm: number } | null => {
    if (!escolhido || !estacoes.data) return null;
    const candidatas = estacoes.data.items.filter(temCoordenadas);
    let melhor: { estacao: Estacao; distanciaKm: number } | null = null;
    for (const estacao of candidatas) {
      const d = distanciaKm(escolhido, estacao);
      if (!melhor || d < melhor.distanciaKm) melhor = { estacao, distanciaKm: d };
    }
    return melhor;
  }, [escolhido, estacoes.data]);

  // Lugares mais calmos primeiro (ordenados pela própria API Java).
  const maisCalmos = useQuery({
    queryKey: [...chaves.locais, 'mais-calmos'],
    queryFn: () => listarLocais({ size: 50, sort: 'indiceCalma,desc' }),
    enabled: pediuCalma,
    staleTime: 5 * 60_000,
  });

  const sugestoes = useMemo((): SugestaoCalma[] => {
    const avaliados = (maisCalmos.data?.items ?? []).filter((l) => l.indiceCalma != null);
    const estado: EstadoLocalizacao = localizacao.estado;
    if (estado.tipo !== 'ok') {
      // Sem localização: os mais calmos no geral. A tela nunca fica vazia.
      return avaliados
        .filter((l) => (l.indiceCalma ?? 0) >= INDICE_CALMO)
        .slice(0, 3)
        .map((local) => ({ local, distanciaKm: null }));
    }
    const comDistancia = avaliados
      .filter(temCoordenadas)
      .map((local) => ({ local, distanciaKm: distanciaKm(estado.coordenada, local) }));
    // "Calmo" de verdade: só entram lugares com índice alto (nada de sugerir um
    // lugar agitado para quem está precisando de calma).
    const perto = comDistancia
      .filter((s) => s.distanciaKm <= RAIO_CALMA_KM && (s.local.indiceCalma ?? 0) >= INDICE_CALMO)
      .sort(
        (a, b) =>
          (b.local.indiceCalma ?? 0) - (a.local.indiceCalma ?? 0) || a.distanciaKm - b.distanciaKm,
      );
    if (perto.length > 0) return perto.slice(0, 3);
    // Nada a 1 km: os lugares calmos mais próximos.
    return comDistancia
      .filter((s) => (s.local.indiceCalma ?? 0) >= INDICE_CALMO)
      .sort((a, b) => a.distanciaKm - b.distanciaKm)
      .slice(0, 3);
  }, [maisCalmos.data, localizacao.estado]);

  const pedirCalma = async () => {
    setPediuCalma(true);
    await localizacao.obter();
  };

  return {
    busca,
    setBusca,
    resultados: resultadosBusca.data?.items ?? [],
    buscando: resultadosBusca.isFetching,
    erroBusca: (resultadosBusca.error as ErroApp | null)?.message ?? null,
    escolhido,
    escolher: (local: Local) => {
      setEscolhido(local);
      setBusca('');
    },
    trocarLugar: () => setEscolhido(null),
    estacaoProxima,
    carregandoEstacao: estacoes.isPending && escolhido !== null,
    erroEstacao: (estacoes.error as ErroApp | null)?.message ?? null,
    pediuCalma,
    pedirCalma,
    estadoLocalizacao: localizacao.estado,
    abrirConfiguracoes: localizacao.abrirConfiguracoes,
    sugestoes,
    carregandoSugestoes: maisCalmos.isPending || localizacao.estado.tipo === 'carregando',
    erroSugestoes: (maisCalmos.error as ErroApp | null)?.message ?? null,
    raioKm: RAIO_CALMA_KM,
  };
};
