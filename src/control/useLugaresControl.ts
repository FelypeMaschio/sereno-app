import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ErroApp } from '../model/comum';
import { Categoria } from '../model/local';
import { listarLocais } from '../repository/remote/locaisRepository';
import { chaves } from './chaves';
import { useDebounce } from './useDebounce';

const TAMANHO_PAGINA = 10;

/** Próxima página, ou undefined quando já chegamos na última. */
export const proximaPagina = (ultima: { page: number; totalPages: number }) =>
  ultima.page + 1 < ultima.totalPages ? ultima.page + 1 : undefined;

/**
 * Lista de lugares com busca, filtro por categoria e rolagem infinita: a próxima
 * página só é pedida à API quando a pessoa chega perto do fim da lista.
 */
export const useLugaresControl = () => {
  const [busca, setBusca] = useState<string>('');
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const buscaAtrasada = useDebounce(busca);

  const consulta = useInfiniteQuery({
    queryKey: [...chaves.locais, buscaAtrasada, categoria],
    queryFn: ({ pageParam }) =>
      listarLocais({ nome: buscaAtrasada, categoria, page: pageParam, size: TAMANHO_PAGINA }),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
  });

  // As páginas chegam separadas; a lista precisa de um array só.
  const lugares = useMemo(
    () => consulta.data?.pages.flatMap((pagina) => pagina.items) ?? [],
    [consulta.data],
  );

  return {
    busca,
    setBusca,
    categoria,
    // Tocar na categoria já selecionada desmarca o filtro.
    alternarCategoria: (nova: Categoria) => setCategoria((atual) => (atual === nova ? null : nova)),
    lugares,
    total: consulta.data?.pages[0]?.totalItems ?? 0,
    carregando: consulta.isPending,
    erro: (consulta.error as ErroApp | null)?.message ?? null,
    recarregando: consulta.isRefetching && !consulta.isFetchingNextPage,
    recarregar: consulta.refetch,
    carregandoMais: consulta.isFetchingNextPage,
    carregarMais: () => {
      if (consulta.hasNextPage && !consulta.isFetchingNextPage) consulta.fetchNextPage();
    },
    filtrando: buscaAtrasada.trim() !== '' || categoria !== null,
  };
};
