import { CadastroForm, LoginForm, TokenResposta, Usuario } from '../../model/usuario';
import { apiJava } from './http';

/** Autenticação e dados do usuário: API Java. */

export const login = async ({ email, senha }: LoginForm): Promise<TokenResposta> => {
  const { data } = await apiJava.post<TokenResposta>('/auth/login', {
    email: email.trim().toLowerCase(),
    senha,
  });
  return data;
};

/** O cadastro já devolve o token: a pessoa entra direto, sem logar de novo. */
export const cadastrar = async ({ nome, email, senha }: CadastroForm): Promise<TokenResposta> => {
  const { data } = await apiJava.post<TokenResposta>('/auth/register', {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha,
  });
  return data;
};

export const buscarMeuPerfil = async (): Promise<Usuario> => {
  const { data } = await apiJava.get<Usuario>('/usuarios/me');
  return data;
};

export const atualizarMeuPerfil = async (nome: string): Promise<Usuario> => {
  const { data } = await apiJava.put<Usuario>('/usuarios/me', { nome: nome.trim() });
  return data;
};
