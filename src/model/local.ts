import { MaterialCommunityIcons } from '@expo/vector-icons';

export type Categoria =
  | 'PARQUE'
  | 'BIBLIOTECA'
  | 'MUSEU'
  | 'CENTRO_CULTURAL'
  | 'SHOPPING'
  | 'RESTAURANTE'
  | 'CAFE'
  | 'TRANSPORTE'
  | 'SAUDE'
  | 'SERVICO_PUBLICO'
  | 'EDUCACAO'
  | 'OUTRO';

export type Periodo = 'MANHA' | 'TARDE' | 'NOITE';

/** Lugar avaliado (API Java). O índice de calma vai de 0 a 10: quanto maior, mais calmo. */
export interface Local {
  id: number;
  nome: string;
  descricao?: string | null;
  categoria: Categoria;
  endereco: string;
  latitude: number;
  longitude: number;
  recursosAcessibilidade?: string | null;
  indiceCalma: number | null;
  classificacaoCalma?: string | null;
  totalAvaliacoes: number;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface IndicePeriodo {
  periodo: Periodo;
  totalAvaliacoes: number;
  indiceCalma: number | null;
}

/** GET /api/locais/{id}/insight: resumo das avaliações gerado por IA (Spring AI). */
export interface Insight {
  localId: number;
  nomeLocal: string;
  indiceCalma: number | null;
  classificacaoCalma?: string | null;
  totalAvaliacoes: number;
  indicePorPeriodo: IndicePeriodo[];
  resumo: string;
  melhorPeriodo?: Periodo | string | null;
  pontosDeAtencao: string[];
  dicas: string[];
  perfilRecomendado?: string | null;
  fonte?: string | null;
  geradoEm?: string;
}

type NomeIcone = keyof typeof MaterialCommunityIcons.glyphMap;

export const categorias: Record<Categoria, { rotulo: string; icone: NomeIcone }> = {
  PARQUE: { rotulo: 'Parque', icone: 'tree-outline' },
  BIBLIOTECA: { rotulo: 'Biblioteca', icone: 'bookshelf' },
  MUSEU: { rotulo: 'Museu', icone: 'bank-outline' },
  CENTRO_CULTURAL: { rotulo: 'Centro cultural', icone: 'drama-masks' },
  SHOPPING: { rotulo: 'Shopping', icone: 'shopping-outline' },
  RESTAURANTE: { rotulo: 'Restaurante', icone: 'silverware-fork-knife' },
  CAFE: { rotulo: 'Café', icone: 'coffee-outline' },
  TRANSPORTE: { rotulo: 'Transporte', icone: 'bus' },
  SAUDE: { rotulo: 'Saúde', icone: 'hospital-box-outline' },
  SERVICO_PUBLICO: { rotulo: 'Serviço público', icone: 'office-building-outline' },
  EDUCACAO: { rotulo: 'Educação', icone: 'school-outline' },
  OUTRO: { rotulo: 'Outro', icone: 'map-marker-outline' },
};

export const periodos: Record<Periodo, { rotulo: string; icone: NomeIcone }> = {
  MANHA: { rotulo: 'Manhã', icone: 'weather-sunset-up' },
  TARDE: { rotulo: 'Tarde', icone: 'weather-sunny' },
  NOITE: { rotulo: 'Noite', icone: 'weather-night' },
};

export const rotuloCategoria = (categoria: string): string =>
  categorias[categoria as Categoria]?.rotulo ?? categoria;

export const iconeCategoria = (categoria: string): NomeIcone =>
  categorias[categoria as Categoria]?.icone ?? 'map-marker-outline';

export const rotuloPeriodo = (periodo?: string | null): string =>
  periodo ? (periodos[periodo as Periodo]?.rotulo ?? periodo) : '';
