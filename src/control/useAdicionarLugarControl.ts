import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { camposDoErro, mensagemDoErro } from '../model/comum';
import { Categoria, Local } from '../model/local';
import { LugarMapa, NovoLugarForm, novoLugarSchema } from '../model/lugarMapa';
import { criarLocal, listarLocais } from '../repository/remote/locaisRepository';
import { buscarNoMapa } from '../repository/remote/mapaRepository';
import { Coordenada, distanciaKm } from '../utils/distancia';
import { ErrosFormulario, validarFormulario } from '../utils/validacao';
import { chaves } from './chaves';
import { useDebounce } from './useDebounce';

/** Mesmo nome a menos de 150 m = o mesmo lugar (evita cadastro duplicado). */
const RAIO_DUPLICADO_KM = 0.15;
const MINIMO_LETRAS = 3;

/** Resultado do envio: lugar criado agora ou um que já existia no Sereno. */
export type ResultadoNovoLugar = { local: Local; jaExistia: boolean };

/**
 * Adicionar lugar em 2 passos:
 * 1. buscar e escolher um lugar REAL no mapa (nome, endereço e posição vêm de lá);
 * 2. confirmar a categoria, escrever descrição/acessibilidade (opcionais) e enviar.
 */
export const useAdicionarLugarControl = (
  nomeInicial: string,
  aoConcluir: (resultado: ResultadoNovoLugar) => void,
) => {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState<string>(nomeInicial);
  const [escolhido, setEscolhido] = useState<LugarMapa | null>(null);
  const [categoria, setCategoria] = useState<Categoria>('OUTRO');
  const [form, setForm] = useState<NovoLugarForm>({ descricao: '', recursosAcessibilidade: '' });
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [perto, setPerto] = useState<Coordenada | null>(null);
  // Busca a cada pausa de meio segundo: respeita o uso justo do serviço gratuito.
  const buscaAtrasada = useDebounce(busca.trim(), 500);

  // Resultados perto da pessoa primeiro, mas SÓ se ela já liberou a localização antes.
  // Esta tela nunca abre o pedido de permissão sozinha.
  useEffect(() => {
    const carregar = async () => {
      try {
        const { granted } = await Location.getForegroundPermissionsAsync();
        if (!granted) return;
        const posicao = await Location.getLastKnownPositionAsync({ maxAge: 30 * 60_000 });
        if (posicao) {
          setPerto({ latitude: posicao.coords.latitude, longitude: posicao.coords.longitude });
        }
      } catch {
        // Sem localização, a busca usa São Paulo como referência.
      }
    };
    carregar();
  }, []);

  const resultados = useQuery({
    queryKey: ['mapa', buscaAtrasada, perto?.latitude, perto?.longitude],
    queryFn: ({ signal }) => buscarNoMapa(buscaAtrasada, perto, signal),
    enabled: escolhido === null && buscaAtrasada.length >= MINIMO_LETRAS,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const enviar = useMutation({
    mutationFn: async (dados: NovoLugarForm): Promise<ResultadoNovoLugar> => {
      if (!escolhido) throw new Error('Escolha um lugar no mapa');
      // Antes de criar, procura o mesmo lugar no Sereno: mesmo nome e bem perto.
      const parecidos = await listarLocais({ nome: escolhido.nome, size: 20 });
      const existente = parecidos.items.find(
        (local) => distanciaKm(local, escolhido) <= RAIO_DUPLICADO_KM,
      );
      if (existente) return { local: existente, jaExistia: true };

      const local = await criarLocal({
        nome: escolhido.nome,
        endereco: escolhido.endereco,
        latitude: escolhido.latitude,
        longitude: escolhido.longitude,
        categoria,
        descricao: dados.descricao || undefined,
        recursosAcessibilidade: dados.recursosAcessibilidade || undefined,
      });
      return { local, jaExistia: false };
    },
    onSuccess: (resultado) => {
      // As listas de lugares (busca, Início) passam a mostrar o lugar novo.
      queryClient.invalidateQueries({ queryKey: chaves.locais });
      aoConcluir(resultado);
    },
    onError: (erro) => setErros(camposDoErro(erro)),
  });

  return {
    busca,
    setBusca: (texto: string) => setBusca(texto),
    poucasLetras: buscaAtrasada.length < MINIMO_LETRAS,
    resultados: resultados.data ?? [],
    buscando: resultados.isFetching,
    erroBusca: mensagemDoErro(resultados.error),
    tentarBuscarDeNovo: resultados.refetch,

    escolhido,
    escolher: (lugar: LugarMapa) => {
      setEscolhido(lugar);
      setCategoria(lugar.categoria);
      setErros({});
      enviar.reset();
    },
    trocarLugar: () => setEscolhido(null),

    categoria,
    setCategoria,
    form,
    alterar: (campo: keyof NovoLugarForm, valor: string) => {
      setForm((atual) => ({ ...atual, [campo]: valor }));
      if (erros[campo]) {
        setErros(({ [campo]: _removido, ...resto }) => resto);
      }
    },
    erros,
    salvar: () => {
      const { valores, erros: errosValidacao } = validarFormulario(novoLugarSchema, form);
      setErros(errosValidacao);
      if (valores) enviar.mutate(valores);
    },
    salvando: enviar.isPending,
    erroGeral: mensagemDoErro(enviar.error),
  };
};
