import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { ErroApp } from '../model/comum';
import { LoginForm, loginSchema } from '../model/usuario';
import { login } from '../repository/remote/authRepository';
import { ErrosFormulario, validarFormulario } from '../utils/validacao';

/**
 * Control da tela de Login: guarda o formulário, valida com Yup e chama a API.
 * A tela só desenha; toda a regra fica aqui (separação de responsabilidades).
 */
export const useLoginControl = () => {
  const { entrar } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: '', senha: '' });
  const [erros, setErros] = useState<ErrosFormulario>({});

  const mutacao = useMutation({
    mutationFn: login,
    onSuccess: (resposta) => entrar(resposta),
    onError: (erro: ErroApp) => setErros(erro.campos),
  });

  const alterar = (campo: keyof LoginForm, valor: string) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    // Some com o erro do campo assim que a pessoa começa a corrigir.
    if (erros[campo]) setErros(({ [campo]: _removido, ...resto }) => resto);
  };

  const enviar = () => {
    const { valores, erros: errosValidacao } = validarFormulario(loginSchema, form);
    setErros(errosValidacao);
    if (valores) mutacao.mutate(valores);
  };

  return {
    form,
    erros,
    alterar,
    enviar,
    enviando: mutacao.isPending,
    // Erro geral (ex.: senha errada, sem internet); erros por campo já vão em `erros`.
    erroGeral: mutacao.error?.message ?? null,
  };
};
