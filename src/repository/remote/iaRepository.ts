import { DireitosRequest, DireitosResposta, Previsao, PrevisaoRequest } from '../../model/ia';
import { apiIa } from './http';

/** Serviço de IA (Python): previsão de calma por horário e orientação sobre direitos. */

export const preverCalma = async (
  pedido: PrevisaoRequest,
  signal?: AbortSignal,
): Promise<Previsao> => {
  // O signal permite cancelar a chamada se a pessoa trocar o dia/hora antes da
  // resposta chegar: assim a tela nunca mostra a previsão de um horário antigo.
  const { data } = await apiIa.post<Previsao>('/previsao-calma', pedido, { signal });
  return data;
};

export const consultarDireitos = async (pedido: DireitosRequest): Promise<DireitosResposta> => {
  const { data } = await apiIa.post<DireitosResposta>('/direitos', {
    situacao: pedido.situacao.trim(),
    // O contexto vem dos dados do .NET (estação + equipamento) e é limitado a 300.
    contexto: pedido.contexto?.slice(0, 300),
  });
  return data;
};
