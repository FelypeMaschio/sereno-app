import { AnyObjectSchema, InferType, ValidationError } from 'yup';

export type ErrosFormulario = Record<string, string>;

/**
 * Valida um formulário inteiro com Yup e devolve { campo: mensagem }.
 * abortEarly: false faz o Yup juntar TODOS os erros de uma vez, em vez de parar no
 * primeiro: a pessoa vê tudo o que precisa corrigir numa tentativa só.
 */
export const validarFormulario = <S extends AnyObjectSchema>(
  schema: S,
  dados: unknown,
): { valores: InferType<S> | null; erros: ErrosFormulario } => {
  try {
    const valores = schema.validateSync(dados, { abortEarly: false });
    return { valores, erros: {} };
  } catch (erro) {
    const erros: ErrosFormulario = {};
    if (erro instanceof ValidationError) {
      erro.inner.forEach(({ path, message }) => {
        if (path && !erros[path]) erros[path] = message;
      });
    }
    return { valores: null, erros };
  }
};
