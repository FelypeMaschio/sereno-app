import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ErroApp } from '../model/comum';
import { listarEstacoes } from '../repository/remote/estacoesRepository';
import { chaves } from './chaves';
import { useDebounce } from './useDebounce';
import { proximaPagina } from './useLugaresControl';

/** Lista de estações com busca e rolagem infinita (API .NET). */
export const useEstacoesControl = () => {
  const [busca, setBusca] = useState<string>('');
  const [soComProblema, setSoComProblema] = useState<boolean>(false);
  const buscaAtrasada = useDebounce(busca);

  const consulta = useInfiniteQuery({
    queryKey: [...chaves.estacoes, buscaAtrasada],
    queryFn: ({ pageParam }) => listarEstacoes({ busca: buscaAtrasada, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
  });

  const todas = useMemo(
    () => consulta.data?.pages.flatMap((pagina) => pagina.items) ?? [],
    [consulta.data],
  );

  // O filtro "com problema" é aplicado no app sobre o que já foi carregado: a API
  // .NET já devolve equipamentosParados em cada estação da lista.
  const estacoes = useMemo(
    () => (soComProblema ? todas.filter((e) => e.equipamentosParados > 0) : todas),
    [todas, soComProblema],
  );

  return {
    busca,
    setBusca,
    soComProblema,
    alternarSoComProblema: () => setSoComProblema((atual) => !atual),
    estacoes,
    total: consulta.data?.pages[0]?.totalItems ?? 0,
    carregando: consulta.isPending,
    erro: (consulta.error as ErroApp | null)?.message ?? null,
    recarregando: consulta.isRefetching && !consulta.isFetchingNextPage,
    recarregar: consulta.refetch,
    carregandoMais: consulta.isFetchingNextPage,
    carregarMais: () => {
      if (consulta.hasNextPage && !consulta.isFetchingNextPage) consulta.fetchNextPage();
    },
    filtrando: buscaAtrasada.trim() !== '' || soComProblema,
  };
};
