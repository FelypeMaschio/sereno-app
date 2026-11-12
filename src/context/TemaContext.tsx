import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
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
  const [modoBaixoEstimulo, setModoBaixoEstimulo] = useState<boolean>(false);

  useEffect(() => {
    // Se a pessoa já pediu ao sistema para "reduzir movimento", começamos no modo
    // baixo estímulo. Depois, a preferência salva no perfil (API) tem prioridade.
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduzir) => {
        if (reduzir) setModoBaixoEstimulo(true);
      })
      .catch(() => {});
  }, []);

  // useMemo evita recriar o objeto a cada render, o que faria todas as telas que
  // usam o contexto renderizarem de novo sem necessidade.
  const valor = useMemo<TemaInfo>(
    () => ({
      tema: modoBaixoEstimulo ? temaBaixoEstimulo : temaPadrao,
      modoBaixoEstimulo,
      setModoBaixoEstimulo,
    }),
    [modoBaixoEstimulo],
  );

  return <TemaContexto.Provider value={valor}>{children}</TemaContexto.Provider>;
};

const useTema = (): TemaInfo => useContext(TemaContexto);

export { TemaContexto, TemaProvider, useTema };
export type { TemaInfo };
