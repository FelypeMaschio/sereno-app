import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

/**
 * Estado de autenticação do app.
 *
 * PROVISÓRIO (Etapa 3): o token fica só em memória e o login é simulado, apenas para
 * testar a navegação protegida. Na Etapa 5 o token passa a vir da API Java e a ser
 * guardado no SecureStore.
 */
interface AuthInfo {
  token: string | null;
  entrar: (token: string) => void;
  sair: () => void;
}

const authInfoPadrao: AuthInfo = {
  token: null,
  entrar: () => {},
  sair: () => {},
};

const AuthContexto = createContext<AuthInfo>(authInfoPadrao);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);

  const valor = useMemo<AuthInfo>(
    () => ({
      token,
      entrar: (novoToken: string) => setToken(novoToken),
      sair: () => setToken(null),
    }),
    [token],
  );

  return <AuthContexto.Provider value={valor}>{children}</AuthContexto.Provider>;
};

const useAuth = (): AuthInfo => useContext(AuthContexto);

export { AuthContexto, AuthProvider, useAuth };
export type { AuthInfo };
