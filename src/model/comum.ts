/** Envelope de paginação usado pelas APIs Java e .NET (página começa em 0). */
export interface Pagina<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

/** Corpo de erro padrão das três APIs. */
export interface ErroApiResposta {
  status: number;
  erro: string;
  mensagem: string;
  campos?: { campo: string; mensagem: string }[];
  timestamp?: string;
  path?: string;
}

/**
 * Erro já "traduzido" para o app: sempre tem uma mensagem acolhedora pronta para
 * mostrar na tela, independentemente de o problema ser rede, servidor ou validação.
 */
export class ErroApp extends Error {
  status: number | null;
  campos: Record<string, string>;
  /** Segundos para tentar de novo (header Retry-After do 429). */
  aguardarSegundos: number | null;

  constructor(
    mensagem: string,
    status: number | null,
    campos: Record<string, string> = {},
    aguardarSegundos: number | null = null,
  ) {
    super(mensagem);
    this.name = 'ErroApp';
    this.status = status;
    this.campos = campos;
    this.aguardarSegundos = aguardarSegundos;
  }
}

/**
 * Erros de campo de qualquer falha. Só o ErroApp traz `campos`; outros erros (ex.: o
 * SecureStore falhar depois do login) viram {} para a tela nunca quebrar.
 */
export const camposDoErro = (erro: unknown): Record<string, string> =>
  erro instanceof ErroApp ? erro.campos : {};

/** Mensagem amigável de qualquer falha. */
export const mensagemDoErro = (erro: unknown): string | null =>
  erro == null ? null : erro instanceof ErroApp ? erro.message : 'Algo deu errado. Tente de novo.';
