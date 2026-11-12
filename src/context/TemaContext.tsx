import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AccessibilityInfo } from 'react-native';
import { lerModoBaixoEstimulo, salvarModoBaixoEstimulo } from '../repository/local/sessaoLocal';
import { Tema, temaBaixoEstimulo, temaPadrao } from '../theme';

interface TemaInfo {
  tema: Tema;
  modoBaixoEstimulo: boolean;
  setModoBaixoEstimulo: (ativo: boolean) => void;
}

const temaInfoPadrao: TemaInfo = {
  tema: temaPadrao,
  modoBaixoEstimulo: false,
  setModoBaixoEstimulo: () => {},
};

const TemaContexto = createContext<TemaInfo>(temaInfoPadrao);

interface TemaProviderProps {
  children: ReactNode;
}

/**
 * Guarda qual tema está ativo e o entrega para qualquer tela via Context API,
 * sem precisar passar o tema por props de componente em componente.
 */
const TemaProvider = ({ children }: TemaProviderProps) => {
  const [modoBaixoEstimulo, setModo] = useState<boolean>(false);

  useEffect(() => {
    const carregar = async () => {
      // 1º: a escolha salva neste aparelho. 2º: se nunca escolheu, seguimos o pedido
      // de "reduzir movimento" feito nas configurações de acessibilidade do sistema.
      const salvo = await lerModoBaixoEstimulo();
      if (salvo !== null) {
        setModo(salvo);
        return;
      }
      const reduzir = await AccessibilityInfo.isReduceMotionEnabled().catch(() => false);
      if (reduzir) setModo(true);
    };
    carregar();
  }, []);

  const setModoBaixoEstimulo = useCallback((ativo: boolean) => {
    setModo(ativo);
    salvarModoBaixoEstimulo(ativo).catch(() => {});
  }, []);

  // useMemo evita recriar o objeto a cada render, o que faria todas as telas que
  // usam o contexto renderizarem de novo sem necessidade.
  const valor = useMemo<TemaInfo>(
    () => ({
      tema: modoBaixoEstimulo ? temaBaixoEstimulo : temaPadrao,
      modoBaixoEstimulo,
      setModoBaixoEstimulo,
    }),
    [modoBaixoEstimulo, setModoBaixoEstimulo],
  );

  return <TemaContexto.Provider value={valor}>{children}</TemaContexto.Provider>;
};

const useTema = (): TemaInfo => useContext(TemaContexto);

export { TemaContexto, TemaProvider, useTema };
export type { TemaInfo };
