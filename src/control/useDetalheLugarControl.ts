import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Avaliacao } from '../model/avaliacao';
import { ErroApp } from '../model/comum';
import {
  buscarLocal,
  excluirAvaliacao,
  listarAvaliacoesDoLocal,
} from '../repository/remote/locaisRepository';
import { avisar, confirmar } from '../utils/feedback';
import { chaves } from './chaves';
import { proximaPagina } from './useLugaresControl';

/** Detalhe do lugar: dados, avaliações (paginadas) e exclusão da própria avaliação. */
export const useDetalheLugarControl = (localId: number) => {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  const local = useQuery({
    queryKey: chaves.local(localId),
    queryFn: () => buscarLocal(localId),
  });

  const avaliacoes = useInfiniteQuery({
    queryKey: chaves.avaliacoesDoLocal(localId),
    queryFn: ({ pageParam }) => listarAvaliacoesDoLocal(localId, pageParam),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
  });

  const exclusao = useMutation({
    mutationFn: excluirAvaliacao,
    onSuccess: () => {
      // O índice de calma muda quando uma avaliação sai: atualiza tudo que depende dela.
      queryClient.invalidateQueries({ queryKey: chaves.local(localId) });
      queryClient.invalidateQueries({ queryKey: chaves.avaliacoesDoLocal(localId) });
      queryClient.invalidateQueries({ queryKey: chaves.insight(localId) });
      queryClient.invalidateQueries({ queryKey: chaves.locais });
      queryClient.invalidateQueries({ queryKey: chaves.minhasAvaliacoes });
      avisar('Avaliação excluída');
    },
    onError: (erro: ErroApp) => avisar(erro.message),
  });

  const listaAvaliacoes = useMemo(
    () => avaliacoes.data?.pages.flatMap((pagina) => pagina.items) ?? [],
    [avaliacoes.data],
  );

  const excluir = async (avaliacao: Avaliacao) => {
    const ok = await confirmar(
      'Excluir avaliação?',
      'Ela deixa de contar no índice de calma deste lugar. Não dá para desfazer.',
      'Excluir',
    );
    if (ok) exclusao.mutate(avaliacao.id);
  };

  return {
    local: local.data,
    carregando: local.isPending,
    erro: (local.error as ErroApp | null)?.message ?? null,
    recarregar: () => {
      local.refetch();
      avaliacoes.refetch();
    },
    recarregando: local.isRefetching,
    avaliacoes: listaAvaliacoes,
    totalAvaliacoes: avaliacoes.data?.pages[0]?.totalItems ?? 0,
    carregandoAvaliacoes: avaliacoes.isPending,
    erroAvaliacoes: (avaliacoes.error as ErroApp | null)?.message ?? null,
    temMaisAvaliacoes: avaliacoes.hasNextPage,
    carregandoMaisAvaliacoes: avaliacoes.isFetchingNextPage,
    carregarMaisAvaliacoes: () => avaliacoes.fetchNextPage(),
    ehMinha: (avaliacao: Avaliacao) => avaliacao.usuarioId === usuario?.id,
    excluir,
    excluindoId: exclusao.isPending ? exclusao.variables : null,
  };
};
