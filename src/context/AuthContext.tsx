import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TokenResposta, Usuario } from '../model/usuario';
import { limparSessao, lerSessao, salvarSessao } from '../repository/local/sessaoLocal';
import { definirAoPerderSessao, definirToken } from '../repository/remote/http';
import { tokenExpirado } from '../utils/jwt';

interface AuthInfo {
  token: string | null;
  usuario: Usuario | null;
  /** true enquanto lemos a sessão salva no SecureStore (o app mostra a splash). */
  restaurando: boolean;
  entrar: (resposta: TokenResposta) => Promise<void>;
  sair: () => Promise<void>;
  atualizarUsuario: (usuario: Usuario) => void;
}

const authInfoPadrao: AuthInfo = {
  token: null,
  usuario: null,
  restaurando: true,
  entrar: async () => {},
  sair: async () => {},
  atualizarUsuario: () => {},
};

const AuthContexto = createContext<AuthInfo>(authInfoPadrao);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Sessão do usuário. O token vem da API Java e vale para as três APIs do grupo.
 * - entrar: guarda token + usuário no SecureStore e no cliente HTTP
 * - sair: apaga tudo e limpa o cache das consultas (nada do usuário anterior sobra)
 * - ao abrir o app: restaura a sessão salva, se o token ainda não venceu
 */
const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [restaurando, setRestaurando] = useState<boolean>(true);

  const sair = useCallback(async () => {
    definirToken(null);
    setToken(null);
    setUsuario(null);
    queryClient.clear();
    await limparSessao();
  }, [queryClient]);

  const entrar = useCallback(async (resposta: TokenResposta) => {
    await salvarSessao({ token: resposta.token, usuario: resposta.usuario });
    definirToken(resposta.token);
    setUsuario(resposta.usuario);
    setToken(resposta.token);
  }, []);

  useEffect(() => {
    // Qualquer 401 em qualquer API encerra a sessão e volta ao login.
    definirAoPerderSessao(() => {
      sair();
    });
    return () => definirAoPerderSessao(null);
  }, [sair]);

  useEffect(() => {
    const restaurar = async () => {
      const sessao = await lerSessao();
      if (sessao && !tokenExpirado(sessao.token)) {
        definirToken(sessao.token);
        setUsuario(sessao.usuario);
        setToken(sessao.token);
      } else if (sessao) {
        await limparSessao();
      }
      setRestaurando(false);
    };
    restaurar();
  }, []);

  const valor = useMemo<AuthInfo>(
    () => ({ token, usuario, restaurando, entrar, sair, atualizarUsuario: setUsuario }),
    [token, usuario, restaurando, entrar, sair],
  );

  return <AuthContexto.Provider value={valor}>{children}</AuthContexto.Provider>;
};

const useAuth = (): AuthInfo => useContext(AuthContexto);

export { AuthContexto, AuthProvider, useAuth };
export type { AuthInfo };
