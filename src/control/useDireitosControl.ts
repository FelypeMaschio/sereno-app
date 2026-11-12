import { useState } from 'react';
import { Linking } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { camposDoErro, ErroApp } from '../model/comum';
import { Equipamento, Estacao, statusEquipamento, tiposEquipamento } from '../model/estacao';
import { direitosSchema } from '../model/ia';
import { consultarDireitos } from '../repository/remote/iaRepository';
import { avisar } from '../utils/feedback';
import { validarFormulario } from '../utils/validacao';

/** Frase pronta a partir do primeiro equipamento com problema. A pessoa pode editar. */
const situacaoSugerida = (estacao: Estacao, equipamento?: Equipamento) => {
  if (!equipamento)
    return `Um equipamento de acessibilidade da estação ${estacao.nome} não está funcionando. Quais são meus direitos?`;
  const tipo = tiposEquipamento[equipamento.tipo].rotulo.toLowerCase();
  const status = statusEquipamento[equipamento.statusAtual].rotulo.toLowerCase();
  return `O ${tipo} da estação ${estacao.nome} está ${status} e eu preciso dele para me locomover. Quais são meus direitos?`;
};

/**
 * Contexto enviado à IA com os dados reais da API .NET (estação + equipamentos com
 * problema). É o que liga a IA do Pedro à API do Eduardo e melhora a busca na lei.
 */
const montarContexto = (estacao: Estacao, comProblema: Equipamento[]) =>
  [
    `Estação ${estacao.nome}${estacao.linha ? ` (linha ${estacao.linha})` : ''}`,
    ...comProblema.map(
      (e) =>
        `${tiposEquipamento[e.tipo].rotulo}${e.localizacao ? ` (${e.localizacao})` : ''}: ${statusEquipamento[e.statusAtual].rotulo.toLowerCase()}`,
    ),
  ]
    .join('; ')
    .slice(0, 300);

export const useDireitosControl = (estacao: Estacao, comProblema: Equipamento[]) => {
  const [aberto, setAberto] = useState<boolean>(false);
  const [situacao, setSituacao] = useState<string>(() => situacaoSugerida(estacao, comProblema[0]));
  const [erro, setErro] = useState<string | null>(null);

  const consulta = useMutation({
    mutationFn: consultarDireitos,
    onError: (falha) => setErro(camposDoErro(falha).situacao ?? null),
  });

  const enviar = () => {
    const { valores, erros } = validarFormulario(direitosSchema, { situacao });
    setErro(erros.situacao ?? null);
    if (valores) {
      consulta.mutate({
        situacao: valores.situacao,
        contexto: montarContexto(estacao, comProblema),
      });
    }
  };

  /** Só abre links https: o endereço vem de um serviço externo. */
  const abrirLei = async (url: string) => {
    if (!url.startsWith('https://')) return;
    try {
      await Linking.openURL(url);
    } catch {
      avisar('Não consegui abrir o link da lei.');
    }
  };

  return {
    aberto,
    abrir: () => setAberto(true),
    situacao,
    setSituacao: (texto: string) => {
      setSituacao(texto);
      if (erro) setErro(null);
    },
    erroSituacao: erro,
    enviar,
    consultando: consulta.isPending,
    resposta: consulta.data,
    erroGeral: consulta.isError && !erro ? (consulta.error as ErroApp).message : null,
    abrirLei,
  };
};
