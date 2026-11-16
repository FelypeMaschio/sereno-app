import { AxiosError, AxiosInstance, create, isAxiosError } from 'axios';
import { ErroApiResposta, ErroApp } from '../../model/comum';
import { tokenExpirado } from '../../utils/jwt';

/**
 * Camada HTTP: três clientes Axios, um para cada serviço do grupo.
 *
 * - apiJava: login, lugares, avaliações e insight (Spring Boot, Render)
 * - apiDotnet: estações, equipamentos e reportes (.NET, Render)
 * - apiIa: previsão de calma e direitos (Python, Azure)
 *
 * Os três usam o MESMO token JWT emitido pelo Java. Os interceptors fazem, num lugar
 * só, o que senão se repetiria em cada chamada: enviar o token, tratar o 401 e
 * transformar qualquer erro numa mensagem amigável.
 */

// O plano gratuito do Render "dorme" sem uso e pode levar ~1 min para acordar.
const TEMPO_LIMITE_PADRAO = 60_000;
// O LLM do serviço de IA pode levar até ~10 s (combinado com o Pedro).
const TEMPO_LIMITE_IA = 15_000;

export const apiJava = create({
  baseURL: `${process.env.EXPO_PUBLIC_API_JAVA_URL}/api`,
  timeout: TEMPO_LIMITE_PADRAO,
});

export const apiDotnet = create({
  baseURL: `${process.env.EXPO_PUBLIC_API_DOTNET_URL}/api`,
  timeout: TEMPO_LIMITE_PADRAO,
});

export const apiIa = create({
  baseURL: `${process.env.EXPO_PUBLIC_API_IA_URL}/ia`,
  timeout: TEMPO_LIMITE_IA,
});

// O token fica numa variável do módulo: o AuthContext o define ao entrar/restaurar a
// sessão e o interceptor o lê a cada requisição, sem acessar o SecureStore toda hora.
let tokenAtual: string | null = null;
let aoPerderSessao: (() => void) | null = null;

export const definirToken = (token: string | null) => {
  tokenAtual = token;
};

/** Registra o que fazer quando qualquer API responder 401 (logout automático). */
export const definirAoPerderSessao = (callback: (() => void) | null) => {
  aoPerderSessao = callback;
};

const mensagemPorStatus = (status: number | null): string => {
  if (status === null) {
    return 'Não consegui falar com o servidor. Verifique sua internet e tente de novo.';
  }
  if (status === 401) return 'Sua sessão expirou. Entre de novo, por favor.';
  if (status === 403) return 'Você não tem permissão para fazer isso.';
  if (status === 404) return 'Não encontramos o que você procurou.';
  if (status === 409) return 'Esse envio já foi feito com outros dados. Abra o formulário de novo.';
  if (status === 429) return 'Muitos envios seguidos. Aguarde um pouco e tente de novo.';
  if (status >= 500) return 'O servidor teve um problema agora. Tente de novo em instantes.';
  return 'Algo deu errado. Tente de novo.';
};

/** Converte qualquer erro do Axios num ErroApp com mensagem pronta para a tela. */
export const converterErro = (erro: unknown): ErroApp => {
  if (erro instanceof ErroApp) return erro;
  if (!isAxiosError(erro)) {
    return new ErroApp(mensagemPorStatus(null), null);
  }

  const axiosErro = erro as AxiosError<ErroApiResposta>;
  if (axiosErro.code === 'ECONNABORTED') {
    return new ErroApp('O servidor demorou demais para responder. Tente de novo.', null);
  }

  const status = axiosErro.response?.status ?? null;
  const corpo = axiosErro.response?.data;

  // Erros de validação viram { campo: mensagem } para aparecer embaixo de cada campo.
  const campos: Record<string, string> = {};
  corpo?.campos?.forEach(({ campo, mensagem }) => {
    if (!campos[campo]) campos[campo] = mensagem;
  });

  const retryAfter = axiosErro.response?.headers?.['retry-after'];
  const aguardar = retryAfter ? Number(retryAfter) : null;

  // As mensagens das APIs do grupo já vêm em português; usamos a nossa só se faltar.
  // No 401 e no 5xx preferimos a nossa, que é mais acolhedora que a técnica.
  const usarMensagemDaApi = corpo?.mensagem && status !== 401 && (status ?? 0) < 500;
  const mensagem =
    status === 429 && aguardar
      ? `Muitos envios seguidos. Aguarde ${aguardar} segundos e tente de novo.`
      : usarMensagemDaApi
        ? corpo.mensagem
        : mensagemPorStatus(status);

  return new ErroApp(mensagem, status, campos, Number.isFinite(aguardar) ? aguardar : null);
};

/**
 * `emissor` = a API que cria o token (Java). Um 401 dela significa sessão inválida.
 * Nas outras (.NET e IA), um 401 com o token ainda dentro da validade quer dizer que
 * AQUELE serviço não aceitou o token (configuração diferente do segredo, por exemplo):
 * deslogar a pessoa não resolveria nada, então mostramos o erro e mantemos a sessão.
 */
const configurar = (cliente: AxiosInstance, emissor: boolean, nomeServico: string) => {
  cliente.interceptors.request.use((config) => {
    if (tokenAtual) {
      config.headers.Authorization = `Bearer ${tokenAtual}`;
    }
    return config;
  });

  cliente.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
      const erroApp = converterErro(erro);
      if (erroApp.status !== 401 || !tokenAtual) return Promise.reject(erroApp);

      // No login, 401 só quer dizer "senha errada": não há sessão para encerrar.
      const rotaDeLogin = erro?.config?.url?.startsWith('/auth/');
      if (emissor && rotaDeLogin) return Promise.reject(erroApp);

      if (emissor || tokenExpirado(tokenAtual)) {
        aoPerderSessao?.();
        return Promise.reject(erroApp);
      }

      return Promise.reject(
        new ErroApp(
          `O serviço de ${nomeServico} não aceitou seu acesso agora. Tente de novo em instantes; se continuar, saia e entre de novo.`,
          401,
        ),
      );
    },
  );
};

configurar(apiJava, true, 'lugares');
configurar(apiDotnet, false, 'estações');
configurar(apiIa, false, 'inteligência artificial');
