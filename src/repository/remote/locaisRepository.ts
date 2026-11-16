import { AvaliacaoRequest, Avaliacao } from '../../model/avaliacao';
import { Pagina } from '../../model/comum';
import { Categoria, Insight, Local } from '../../model/local';
import { LocalRequest } from '../../model/lugarMapa';
import { apiJava } from './http';

/** Lugares, avaliações e insight: API Java. */

export interface FiltroLocais {
  nome?: string;
  categoria?: Categoria | null;
  page?: number;
  size?: number;
  /** Ex.: 'indiceCalma,desc' para os mais calmos primeiro. */
  sort?: string;
}

export const listarLocais = async ({
  nome,
  categoria,
  page = 0,
  size = 10,
  sort,
}: FiltroLocais): Promise<Pagina<Local>> => {
  const { data } = await apiJava.get<Pagina<Local>>('/locais', {
    // Parâmetros vazios não são enviados, para não filtrar por "".
    params: {
      nome: nome?.trim() || undefined,
      categoria: categoria ?? undefined,
      page,
      size,
      sort,
    },
  });
  return data;
};

export const buscarLocal = async (id: number): Promise<Local> => {
  const { data } = await apiJava.get<Local>(`/locais/${id}`);
  return data;
};

/** POST /api/locais: adiciona um lugar (escolhido do mapa) ao Sereno. */
export const criarLocal = async (lugar: LocalRequest): Promise<Local> => {
  const { data } = await apiJava.post<Local>('/locais', lugar);
  return data;
};

export const buscarInsight = async (localId: number): Promise<Insight> => {
  const { data } = await apiJava.get<Insight>(`/locais/${localId}/insight`);
  return data;
};

export const listarAvaliacoesDoLocal = async (
  localId: number,
  page = 0,
  size = 5,
): Promise<Pagina<Avaliacao>> => {
  const { data } = await apiJava.get<Pagina<Avaliacao>>('/avaliacoes', {
    params: { localId, page, size, sort: 'criadoEm,desc' },
  });
  return data;
};

export const listarMinhasAvaliacoes = async (page = 0, size = 10): Promise<Pagina<Avaliacao>> => {
  const { data } = await apiJava.get<Pagina<Avaliacao>>('/usuarios/me/avaliacoes', {
    params: { page, size, sort: 'criadoEm,desc' },
  });
  return data;
};

export const buscarAvaliacao = async (id: number): Promise<Avaliacao> => {
  const { data } = await apiJava.get<Avaliacao>(`/avaliacoes/${id}`);
  return data;
};

export const criarAvaliacao = async (avaliacao: AvaliacaoRequest): Promise<Avaliacao> => {
  const { data } = await apiJava.post<Avaliacao>('/avaliacoes', avaliacao);
  return data;
};

export const atualizarAvaliacao = async (
  id: number,
  { localId: _localId, ...avaliacao }: AvaliacaoRequest,
): Promise<Avaliacao> => {
  const { data } = await apiJava.put<Avaliacao>(`/avaliacoes/${id}`, avaliacao);
  return data;
};

export const excluirAvaliacao = async (id: number): Promise<void> => {
  await apiJava.delete(`/avaliacoes/${id}`);
};
