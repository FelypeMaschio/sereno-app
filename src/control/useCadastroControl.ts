import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { camposDoErro, mensagemDoErro } from '../model/comum';
import { CadastroForm, cadastroSchema } from '../model/usuario';
import { cadastrar } from '../repository/remote/authRepository';
import { ErrosFormulario, validarFormulario } from '../utils/validacao';

export const useCadastroControl = () => {
  const { entrar } = useAuth();
  const [form, setForm] = useState<CadastroForm>({
    nome: '',
    email: '',
    senha: '',
    confirmacao: '',
  });
  const [erros, setErros] = useState<ErrosFormulario>({});

  const mutacao = useMutation({
    mutationFn: cadastrar,
    // A API devolve o token no cadastro: a pessoa já entra no app.
    onSuccess: (resposta) => entrar(resposta),
    onError: (erro) => setErros(camposDoErro(erro)),
  });

  const alterar = (campo: keyof CadastroForm, valor: string) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros(({ [campo]: _removido, ...resto }) => resto);
  };

  const enviar = () => {
    const { valores, erros: errosValidacao } = validarFormulario(cadastroSchema, form);
    setErros(errosValidacao);
    if (valores) mutacao.mutate(valores);
  };

  return {
    form,
    erros,
    alterar,
    enviar,
    enviando: mutacao.isPending,
    erroGeral: mensagemDoErro(mutacao.error),
  };
};
