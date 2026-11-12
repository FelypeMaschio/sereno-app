import { useMemo, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { Avaliacao } from '../model/avaliacao';
import { ErroApp } from '../model/comum';
import { Equipamento, Reporte } from '../model/estacao';
import {
  buscarEquipamento,
  excluirReporte,
  listarMeusReportes,
} from '../repository/remote/estacoesRepository';
import { excluirAvaliacao, listarMinhasAvaliacoes } from '../repository/remote/locaisRepository';
import { avisar, confirmar } from '../utils/feedback';
import { chaves } from './chaves';
import { proximaPagina } from './useLugaresControl';

export type Aba = 'avaliacoes' | 'reportes';

/**
 * "Minhas contribuições": as avaliações (API Java) e os reportes (API .NET) da pessoa,
 * com editar e excluir. Cada aba só busca seus dados quando é aberta.
 */
export const useContribuicoesControl = () => {
  const queryClient = useQueryClient();
  const [aba, setAba] = useState<Aba>('avaliacoes');

  const avaliacoes = useInfiniteQuery({
    queryKey: chaves.minhasAvaliacoes,
    queryFn: ({ pageParam }) => listarMinhasAvaliacoes(pageParam),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
    enabled: aba === 'avaliacoes',
  });

  const reportes = useInfiniteQuery({
    queryKey: chaves.meusReportes,
    queryFn: ({ pageParam }) => listarMeusReportes(pageParam),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
    enabled: aba === 'reportes',
  });

  const listaAvaliacoes = useMemo(
    () => avaliacoes.data?.pages.flatMap((p) => p.items) ?? [],
    [avaliacoes.data],
  );
  const listaReportes = useMemo(
    () => reportes.data?.pages.flatMap((p) => p.items) ?? [],
    [reportes.data],
  );

  // O reporte só traz o id do equipamento; buscamos tipo e localização de cada um
  // (ids repetidos saem do cache do React Query, sem nova chamada).
  const idsEquipamentos = useMemo(
    () => [...new Set(listaReportes.map((r) => r.equipamentoId))],
    [listaReportes],
  );
  // combine junta os resultados num mapa { id → equipamento } para a tela consultar.
  const equipamentoPorId = useQueries({
    queries: idsEquipamentos.map((id) => ({
      queryKey: chaves.equipamento(id),
      queryFn: () => buscarEquipamento(id),
      staleTime: 5 * 60_000,
    })),
    combine: (resultados) => {
      const mapa = new Map<number, Equipamento>();
      resultados.forEach(({ data }) => {
        if (data) mapa.set(data.id, data);
      });
      return mapa;
    },
  });

  const exclusaoAvaliacao = useMutation({
    mutationFn: excluirAvaliacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chaves.minhasAvaliacoes });
      queryClient.invalidateQueries({ queryKey: chaves.locais });
      queryClient.invalidateQueries({ queryKey: ['local'] });
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
      avisar('Avaliação excluída');
    },
    onError: (erro: ErroApp) => avisar(erro.message),
  });

  const exclusaoReporte = useMutation({
    mutationFn: excluirReporte,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chaves.meusReportes });
      queryClient.invalidateQueries({ queryKey: chaves.estacoes });
      queryClient.invalidateQueries({ queryKey: ['estacao'] });
      queryClient.invalidateQueries({ queryKey: ['equipamento'] });
      avisar('Reporte excluído');
    },
    onError: (erro: ErroApp) => avisar(erro.message),
  });

  const consultaAtual = aba === 'avaliacoes' ? avaliacoes : reportes;

  return {
    aba,
    setAba,
    avaliacoes: listaAvaliacoes,
    reportes: listaReportes,
    equipamentoDe: (reporte: Reporte) => equipamentoPorId.get(reporte.equipamentoId),
    carregando: consultaAtual.isPending,
    erro: (consultaAtual.error as ErroApp | null)?.message ?? null,
    recarregando: consultaAtual.isRefetching && !consultaAtual.isFetchingNextPage,
    recarregar: consultaAtual.refetch,
    carregandoMais: consultaAtual.isFetchingNextPage,
    carregarMais: () => {
      if (consultaAtual.hasNextPage && !consultaAtual.isFetchingNextPage) {
        consultaAtual.fetchNextPage();
      }
    },
    excluirAvaliacao: async (avaliacao: Avaliacao) => {
      const ok = await confirmar(
        'Excluir avaliação?',
        `A avaliação de "${avaliacao.nomeLocal}" deixa de contar no índice de calma. Não dá para desfazer.`,
        'Excluir',
      );
      if (ok) exclusaoAvaliacao.mutate(avaliacao.id);
    },
    excluirReporte: async (reporte: Reporte) => {
      const ok = await confirmar(
        'Excluir reporte?',
        'O status do equipamento será recalculado com os outros reportes. Não dá para desfazer.',
        'Excluir',
      );
      if (ok) exclusaoReporte.mutate(reporte.id);
    },
    excluindoAvaliacaoId: exclusaoAvaliacao.isPending ? exclusaoAvaliacao.variables : null,
    excluindoReporteId: exclusaoReporte.isPending ? exclusaoReporte.variables : null,
  };
};
