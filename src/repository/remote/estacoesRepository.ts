import { Pagina } from '../../model/comum';
import { Equipamento, Estacao, Reporte, ReporteForm } from '../../model/estacao';
import { apiDotnet } from './http';

/** Estações, equipamentos e reportes: API .NET. */

export interface FiltroEstacoes {
  busca?: string;
  page?: number;
  size?: number;
}

export const listarEstacoes = async ({
  busca,
  page = 0,
  size = 10,
}: FiltroEstacoes): Promise<Pagina<Estacao>> => {
  const { data } = await apiDotnet.get<Pagina<Estacao>>('/estacoes', {
    params: { busca: busca?.trim() || undefined, page, size },
  });
  return data;
};

export const buscarEstacao = async (id: number): Promise<Estacao> => {
  const { data } = await apiDotnet.get<Estacao>(`/estacoes/${id}`);
  return data;
};

export const buscarEquipamento = async (id: number): Promise<Equipamento> => {
  const { data } = await apiDotnet.get<Equipamento>(`/equipamentos/${id}`);
  return data;
};

/**
 * Cria um reporte. A Idempotency-Key é gerada quando o formulário abre e reaproveitada
 * em toques repetidos ou novas tentativas: se a primeira requisição chegou ao servidor
 * mas a resposta se perdeu na rede, o reenvio NÃO duplica o reporte.
 */
export const criarReporte = async (
  equipamentoId: number,
  reporte: ReporteForm,
  chaveIdempotencia: string,
): Promise<Reporte> => {
  const { data } = await apiDotnet.post<Reporte>(
    '/reportes',
    { equipamentoId, status: reporte.status, observacao: reporte.observacao || null },
    { headers: { 'Idempotency-Key': chaveIdempotencia } },
  );
  return data;
};

export const listarMeusReportes = async (page = 0, size = 10): Promise<Pagina<Reporte>> => {
  const { data } = await apiDotnet.get<Pagina<Reporte>>('/reportes/meus', {
    params: { page, size },
  });
  return data;
};

export const buscarReporte = async (id: number): Promise<Reporte> => {
  const { data } = await apiDotnet.get<Reporte>(`/reportes/${id}`);
  return data;
};

export const atualizarReporte = async (id: number, reporte: ReporteForm): Promise<Reporte> => {
  const { data } = await apiDotnet.put<Reporte>(`/reportes/${id}`, {
    status: reporte.status,
    observacao: reporte.observacao || null,
  });
  return data;
};

export const excluirReporte = async (id: number): Promise<void> => {
  await apiDotnet.delete(`/reportes/${id}`);
};
