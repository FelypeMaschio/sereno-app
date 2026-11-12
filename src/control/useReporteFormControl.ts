import { useEffect, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErroApp } from '../model/comum';
import { ReporteForm, reporteSchema, StatusEquipamento } from '../model/estacao';
import {
  atualizarReporte,
  buscarEquipamento,
  buscarEstacao,
  buscarReporte,
  criarReporte,
  excluirReporte,
} from '../repository/remote/estacoesRepository';
import { avisar, confirmar } from '../utils/feedback';
import { ErrosFormulario, validarFormulario } from '../utils/validacao';
import { chaves } from './chaves';

type Rascunho = { status: StatusEquipamento | null; observacao: string };

/**
 * Formulário de reporte (criar ou editar) com Idempotency-Key.
 *
 * A chave é um UUID criado UMA vez, quando o formulário abre. Se a pessoa tocar duas
 * vezes em "Enviar", ou se a rede cair e ela tentar de novo, a mesma chave vai junto e
 * a API .NET devolve o reporte original em vez de criar um duplicado.
 * Se a pessoa MUDAR os dados depois de uma falha, é um envio novo: geramos outra chave
 * (mesma chave com corpo diferente daria 409).
 */
export const useReporteFormControl = (
  equipamentoId: number,
  reporteId: number | undefined,
  aoConcluir: () => void,
) => {
  const queryClient = useQueryClient();
  const editando = reporteId !== undefined;
  const [chaveIdempotencia, setChaveIdempotencia] = useState<string>(() => Crypto.randomUUID());
  const [falhouAntes, setFalhouAntes] = useState<boolean>(false);
  const [form, setForm] = useState<Rascunho>({ status: null, observacao: '' });
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [segundosParaTentar, setSegundosParaTentar] = useState<number>(0);

  const equipamento = useQuery({
    queryKey: chaves.equipamento(equipamentoId),
    queryFn: () => buscarEquipamento(equipamentoId),
  });

  const estacaoId = equipamento.data?.estacaoId;
  const estacao = useQuery({
    queryKey: chaves.estacao(estacaoId ?? 0),
    queryFn: () => buscarEstacao(estacaoId as number),
    enabled: estacaoId !== undefined,
  });

  const existente = useQuery({
    queryKey: chaves.reporte(reporteId ?? 0),
    queryFn: () => buscarReporte(reporteId as number),
    enabled: editando,
  });

  // Preenche o formulário com o reporte existente (edição), uma única vez.
  const [preenchido, setPreenchido] = useState<boolean>(false);
  if (existente.data && !preenchido) {
    setPreenchido(true);
    setForm({ status: existente.data.status, observacao: existente.data.observacao ?? '' });
  }

  // Contagem regressiva do 429 ("aguarde X segundos").
  useEffect(() => {
    if (segundosParaTentar <= 0) return;
    const temporizador = setTimeout(() => setSegundosParaTentar((s) => s - 1), 1000);
    return () => clearTimeout(temporizador);
  }, [segundosParaTentar]);

  const atualizarCaches = () => {
    queryClient.invalidateQueries({ queryKey: chaves.estacoes });
    queryClient.invalidateQueries({ queryKey: chaves.meusReportes });
    queryClient.invalidateQueries({ queryKey: chaves.equipamento(equipamentoId) });
    if (estacaoId) queryClient.invalidateQueries({ queryKey: chaves.estacao(estacaoId) });
    if (reporteId) queryClient.invalidateQueries({ queryKey: chaves.reporte(reporteId) });
  };

  const salvar = useMutation({
    mutationFn: (dados: ReporteForm) =>
      editando
        ? atualizarReporte(reporteId, dados)
        : criarReporte(equipamentoId, dados, chaveIdempotencia),
    onSuccess: () => {
      atualizarCaches();
      avisar(editando ? 'Reporte atualizado' : 'Obrigado! O status foi atualizado para todos');
      aoConcluir();
    },
    onError: (erro: ErroApp) => {
      setFalhouAntes(true);
      setErros(erro.campos);
      if (erro.status === 429) setSegundosParaTentar(erro.aguardarSegundos ?? 30);
    },
  });

  const exclusao = useMutation({
    mutationFn: () => excluirReporte(reporteId as number),
    onSuccess: () => {
      atualizarCaches();
      avisar('Reporte excluído');
      aoConcluir();
    },
  });

  const alterar = <K extends keyof Rascunho>(campo: K, valor: Rascunho[K]) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros(({ [campo]: _removido, ...resto }) => resto);
    if (falhouAntes && !editando) {
      setChaveIdempotencia(Crypto.randomUUID());
      setFalhouAntes(false);
    }
  };

  const enviar = () => {
    if (segundosParaTentar > 0) return;
    const { valores, erros: errosValidacao } = validarFormulario(reporteSchema, form);
    setErros(errosValidacao);
    if (valores) salvar.mutate(valores);
  };

  const excluir = async () => {
    const ok = await confirmar(
      'Excluir reporte?',
      'O status do equipamento será recalculado com os outros reportes. Não dá para desfazer.',
      'Excluir',
    );
    if (ok) exclusao.mutate();
  };

  return {
    editando,
    equipamento: equipamento.data,
    nomeEstacao: estacao.data?.nome ?? '',
    form,
    erros,
    alterar,
    enviar,
    excluir,
    carregando: equipamento.isPending || (editando && existente.isPending),
    erroCarregar:
      (equipamento.error as ErroApp | null)?.message ??
      (existente.error as ErroApp | null)?.message ??
      null,
    recarregar: () => {
      equipamento.refetch();
      if (editando) existente.refetch();
    },
    salvando: salvar.isPending,
    excluindo: exclusao.isPending,
    segundosParaTentar,
    erroGeral:
      segundosParaTentar > 0
        ? `Muitos envios seguidos. Aguarde ${segundosParaTentar} segundos para enviar de novo.`
        : ((salvar.error as ErroApp | null)?.message ??
          (exclusao.error as ErroApp | null)?.message ??
          null),
  };
};
