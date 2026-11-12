import { useEffect, useState } from 'react';

/**
 * Atrasa a atualização de um valor até a pessoa parar de digitar.
 * Sem isso, cada letra da busca faria uma chamada à API.
 */
export const useDebounce = <T>(valor: T, atrasoMs = 400): T => {
  const [atrasado, setAtrasado] = useState<T>(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setAtrasado(valor), atrasoMs);
    return () => clearTimeout(temporizador);
  }, [valor, atrasoMs]);

  return atrasado;
};
