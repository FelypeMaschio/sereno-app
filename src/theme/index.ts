import { Cores, coresBaixoEstimulo, coresPadrao } from './cores';
import { espacamento, raios } from './espacamento';
import { alturasDeLinha, familias, tamanhos } from './tipografia';

export interface Tema {
  cores: Cores;
  espacamento: typeof espacamento;
  raios: typeof raios;
  familias: typeof familias;
  tamanhos: typeof tamanhos;
  alturasDeLinha: typeof alturasDeLinha;
  /** No modo baixo estímulo, nada se move sozinho na tela. */
  animacoes: boolean;
  /** Sombras criam profundidade e "ruído" visual; no baixo estímulo usamos só bordas. */
  sombras: boolean;
}

const base = { espacamento, raios, familias, tamanhos, alturasDeLinha };

export const temaPadrao: Tema = {
  ...base,
  cores: coresPadrao,
  animacoes: true,
  sombras: true,
};

export const temaBaixoEstimulo: Tema = {
  ...base,
  cores: coresBaixoEstimulo,
  animacoes: false,
  sombras: false,
};

export { AREA_MINIMA_DE_TOQUE } from './espacamento';
export { arquivosDeFonte, multiplicadorMaximoDeFonte } from './tipografia';
export type { Cores } from './cores';
