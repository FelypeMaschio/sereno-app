import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { camposDoErro, ErroApp } from '../model/comum';
import { perfilSchema } from '../model/usuario';
import { atualizarMeuPerfil, buscarMeuPerfil } from '../repository/remote/authRepository';
import { avisar, confirmar } from '../utils/feedback';
import { ErrosFormulario, validarFormulario } from '../utils/validacao';
import { chaves } from './chaves';

/** Perfil: dados do usuário logado (GET /usuarios/me), edição do nome e logout. */
export const usePerfilControl = () => {
  const { usuario, atualizarUsuario, sair } = useAuth();
  const queryClient = useQueryClient();
  const [nome, setNome] = useState<string | null>(null);
  const [erros, setErros] = useState<ErrosFormulario>({});

  const perfil = useQuery({ queryKey: chaves.perfil, queryFn: buscarMeuPerfil });
  const dados = perfil.data ?? usuario;
  // Enquanto a pessoa não mexe no campo, ele mostra o nome que veio da API.
  const nomeNoCampo = nome ?? dados?.nome ?? '';

  const salvar = useMutation({
    mutationFn: atualizarMeuPerfil,
    onSuccess: (atualizado) => {
      atualizarUsuario(atualizado);
      queryClient.setQueryData(chaves.perfil, atualizado);
      setNome(null);
      avisar('Nome atualizado');
    },
    onError: (erro) => setErros(camposDoErro(erro)),
  });

  const enviar = () => {
    const { valores, erros: errosValidacao } = validarFormulario(perfilSchema, {
      nome: nomeNoCampo,
    });
    setErros(errosValidacao);
    if (valores) salvar.mutate(valores.nome);
  };

  const sairComConfirmacao = async () => {
    const ok = await confirmar('Sair da conta?', 'Você vai precisar entrar de novo.', 'Sair');
    if (ok) await sair();
  };

  return {
    usuario: dados,
    nome: nomeNoCampo,
    setNome: (valor: string) => {
      setNome(valor);
      if (erros.nome) setErros({});
    },
    nomeAlterado: nome !== null && nome.trim() !== dados?.nome,
    erros,
    enviar,
    salvando: salvar.isPending,
    erroGeral: (salvar.error as ErroApp | null)?.message ?? null,
    carregando: perfil.isPending && !usuario,
    sair: sairComConfirmacao,
  };
};
