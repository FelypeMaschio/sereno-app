import { useQuery } from '@tanstack/react-query';
import { ErroApp } from '../model/comum';
import { buscarEstacao } from '../repository/remote/estacoesRepository';
import { chaves } from './chaves';

/** Detalhe da estação com a lista de equipamentos e o status de cada um. */
export const useDetalheEstacaoControl = (estacaoId: number) => {
  const consulta = useQuery({
    queryKey: chaves.estacao(estacaoId),
    queryFn: () => buscarEstacao(estacaoId),
  });

  const equipamentos = consulta.data?.equipamentos ?? [];
  const comProblema = equipamentos.filter((e) => e.statusAtual !== 'FUNCIONANDO');

  return {
    estacao: consulta.data,
    equipamentos,
    comProblema,
    carregando: consulta.isPending,
    erro: (consulta.error as ErroApp | null)?.message ?? null,
    recarregando: consulta.isRefetching,
    recarregar: consulta.refetch,
  };
};
