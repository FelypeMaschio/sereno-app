import { InferType, object, string } from 'yup';

export type FaixaCalma = 'TRANQUILO' | 'MODERADO' | 'AGITADO';
export type GeradoPor = 'llm' | 'regra';
/** 0 = domingo … 6 = sábado, igual a Date.getDay(). */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface PrevisaoRequest {
  localId: number;
  diaSemana: DiaSemana;
  hora: number;
}

/** POST /ia/previsao-calma. Atenção: nivelPrevisto vai de 0 (calmo) a 100 (intenso). */
export interface Previsao {
  nivelPrevisto: number;
  faixa: FaixaCalma;
  explicacao: string;
  /** Hora (0–23) mais calma do dia; null = o lugar costuma estar fechado. */
  melhorHorario: number | null;
  alertas: string[];
  geradoPor: GeradoPor;
}

export interface FonteLegal {
  lei: string;
  artigo: string;
  trecho: string;
  url: string;
  relevancia: number;
}

export interface DireitosRequest {
  situacao: string;
  contexto?: string;
}

/** POST /ia/direitos: resposta com base na LBI e na Lei Berenice Piana (RAG). */
export interface DireitosResposta {
  resposta: string;
  fontes: FonteLegal[];
  encontrouBase: boolean;
  geradoPor: GeradoPor;
  aviso: string;
}

export const direitosSchema = object({
  situacao: string()
    .trim()
    .required('Conte o que está acontecendo')
    .min(5, 'Escreva um pouco mais (pelo menos 5 caracteres)')
    .max(500, 'Use até 500 caracteres'),
});
export type DireitosForm = InferType<typeof direitosSchema>;

/**
 * Converte o nível previsto pela IA (0 = calmo … 100 = intenso) para a mesma escala do
 * índice de calma da API Java (0 a 10, maior = mais calmo). Assim a tela inteira usa
 * uma escala só e "7" nunca significa "calmo" num cartão e "agitado" no outro.
 */
export const calmaPrevista = (nivelPrevisto: number): number =>
  Math.round(100 - nivelPrevisto) / 10; // ex.: nível 78 → calma 2,2

export const faixas: Record<FaixaCalma, { rotulo: string; tom: 'sucesso' | 'alerta' | 'perigo' }> =
  {
    TRANQUILO: { rotulo: 'Tranquilo', tom: 'sucesso' },
    MODERADO: { rotulo: 'Moderado', tom: 'alerta' },
    AGITADO: { rotulo: 'Agitado', tom: 'perigo' },
  };

export const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;
export const diasSemanaExtenso = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const;
