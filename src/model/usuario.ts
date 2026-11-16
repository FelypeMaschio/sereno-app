import { InferType, object, ref, string } from 'yup';

export type Papel = 'CIDADAO' | 'GESTOR';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: Papel;
  criadoEm?: string;
}

/** Resposta de POST /api/auth/login e /api/auth/register (API Java). */
export interface TokenResposta {
  token: string;
  tipo: string;
  expiraEmSegundos: number;
  usuario: Usuario;
}

// As regras abaixo são as mesmas que a API Java valida. Validar também no app dá
// retorno imediato à pessoa, sem esperar a ida e volta ao servidor.
const regraEmail = string()
  .trim()
  .required('Informe seu e-mail')
  .email('Digite um e-mail válido, como voce@exemplo.com');

export const loginSchema = object({
  email: regraEmail,
  senha: string().required('Informe sua senha'),
});
export type LoginForm = InferType<typeof loginSchema>;

/**
 * Regras da senha no cadastro, mostradas como checklist enquanto a pessoa digita.
 * A API Java exige 8 a 72 caracteres com letras e números; o app pede também
 * maiúscula e minúscula, deixando a senha mais forte (a API aceita do mesmo jeito).
 */
export const regrasSenha: { rotulo: string; teste: (senha: string) => boolean }[] = [
  { rotulo: 'Pelo menos 8 caracteres', teste: (senha) => senha.length >= 8 },
  { rotulo: 'Uma letra maiúscula', teste: (senha) => /[A-ZÀ-Ý]/.test(senha) },
  { rotulo: 'Uma letra minúscula', teste: (senha) => /[a-zà-ÿ]/.test(senha) },
  { rotulo: 'Um número', teste: (senha) => /\d/.test(senha) },
];

export const cadastroSchema = object({
  nome: string()
    .trim()
    .required('Informe seu nome')
    .min(2, 'O nome precisa ter pelo menos 2 letras')
    .max(100, 'O nome pode ter até 100 caracteres'),
  email: regraEmail.max(150, 'O e-mail pode ter até 150 caracteres'),
  senha: string()
    .required('Crie uma senha')
    .min(8, 'A senha precisa ter pelo menos 8 caracteres')
    .max(72, 'A senha pode ter até 72 caracteres')
    .test('regras', 'A senha ainda não atende a todas as regras', (senha = '') =>
      regrasSenha.every(({ teste }) => teste(senha)),
    ),
  confirmacao: string()
    .required('Repita a senha')
    .oneOf([ref('senha')], 'As senhas não são iguais'),
});
export type CadastroForm = InferType<typeof cadastroSchema>;

export const perfilSchema = object({
  nome: string()
    .trim()
    .required('Informe seu nome')
    .min(2, 'O nome precisa ter pelo menos 2 letras')
    .max(100, 'O nome pode ter até 100 caracteres'),
});
export type PerfilForm = InferType<typeof perfilSchema>;
