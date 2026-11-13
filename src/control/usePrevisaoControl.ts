import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DiaSemana } from '../model/ia';
import { preverCalma } from '../repository/remote/iaRepository';
import { chaves } from './chaves';

export const HORA_INICIAL = 6;
export const HORA_FINAL = 22;
export const horasDisponiveis = Array.from(
  { length: HORA_FINAL - HORA_INICIAL + 1 },
  (_, i) => HORA_INICIAL + i,
);

/** Abre no dia e na hora de agora (limitada ao intervalo do seletor). */
const horaAgora = () => Math.min(Math.max(new Date().getHours(), HORA_INICIAL), HORA_FINAL);

/**
 * Previsão de calma (serviço de IA) para o dia e a hora escolhidos.
 *
 * Cada combinação dia/hora tem sua chave no cache: voltar para um horário já
 * consultado é instantâneo. Ao trocar o horário, o React Query cancela a requisição
 * anterior (signal), evitando que uma resposta atrasada mostre o horário errado.
 */
export const usePrevisaoControl = (localId: number) => {
  const [dia, setDia] = useState<DiaSemana>(new Date().getDay() as DiaSemana);
  const [hora, setHora] = useState<number>(horaAgora);

  const consulta = useQuery({
    queryKey: chaves.previsao(localId, dia, hora),
    queryFn: ({ signal }) => preverCalma({ localId, diaSemana: dia, hora }, signal),
    staleTime: 10 * 60_000,
    // A IA (Azure) e o Java (Render) "dormem" sem uso: o primeiro acesso pode dar 503
    // ou estourar o tempo. Tentamos de novo UMA vez, 3 s depois, antes de esconder o cartão.
    retry: 1,
    retryDelay: 3000,
  });

  return {
    dia,
    setDia,
    hora,
    setHora,
    previsao: consulta.data,
    carregando: consulta.isFetching,
    // Erro (IA fora do ar, lugar sem dados): o cartão é escondido, nunca quebra a tela.
    indisponivel: consulta.isError,
  };
};
