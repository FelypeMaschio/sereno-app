import { InferType, mixed, number, object, string } from 'yup';
import { Periodo } from './local';

/**
 * Avaliação sensorial (API Java). As três notas vão de 1 a 5, e 1 é sempre o mais
 * tranquilo: 1 = silencioso / luz suave / vazio; 5 = muito barulhento / luz intensa / lotado.
 */
export interface Avaliacao {
  id: number;
  localId: number;
  nomeLocal: string;
  usuarioId: number;
  nomeUsuario: string;
  nivelRuido: number;
  nivelIluminacao: number;
  nivelLotacao: number;
  periodoVisita: Periodo;
  comentario?: string | null;
  indiceCalmaDaAvaliacao?: number | null;
  criadoEm: string;
  atualizadoEm?: string;
}

const nota = (rotulo: string) =>
  number()
    .typeError(`Escolha uma nota para ${rotulo}`)
    .required(`Escolha uma nota para ${rotulo}`)
    .integer()
    .min(1, `Escolha uma nota para ${rotulo}`)
    .max(5, `A nota de ${rotulo} vai até 5`);

export const avaliacaoSchema = object({
  nivelRuido: nota('o ruído'),
  nivelIluminacao: nota('a luz'),
  nivelLotacao: nota('a lotação'),
  periodoVisita: mixed<Periodo>()
    .oneOf(['MANHA', 'TARDE', 'NOITE'], 'Escolha quando você foi')
    .required('Escolha quando você foi'),
  comentario: string().trim().max(500, 'O comentário pode ter até 500 caracteres').default(''),
});
export type AvaliacaoForm = InferType<typeof avaliacaoSchema>;

/** Corpo do POST /api/avaliacoes. O PUT usa o mesmo corpo, sem o localId. */
export interface AvaliacaoRequest extends AvaliacaoForm {
  localId: number;
}

type Escala = { rotulo: string; extremos: [string, string]; niveis: string[] };

/** Textos de cada nível: a nota nunca aparece só como número. */
export const escalas: Record<'nivelRuido' | 'nivelIluminacao' | 'nivelLotacao', Escala> = {
  nivelRuido: {
    rotulo: 'Ruído',
    extremos: ['Silencioso', 'Muito barulhento'],
    niveis: ['Silencioso', 'Pouco barulho', 'Moderado', 'Barulhento', 'Muito barulhento'],
  },
  nivelIluminacao: {
    rotulo: 'Luz',
    extremos: ['Luz suave', 'Luz muito intensa'],
    niveis: ['Luz suave', 'Pouca luz forte', 'Moderada', 'Intensa', 'Muito intensa'],
  },
  nivelLotacao: {
    rotulo: 'Lotação',
    extremos: ['Vazio', 'Lotado'],
    niveis: ['Vazio', 'Pouca gente', 'Movimentado', 'Cheio', 'Lotado'],
  },
};
