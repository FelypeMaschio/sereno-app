import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AvaliacaoForm, avaliacaoSchema } from '../model/avaliacao';
import { camposDoErro, ErroApp } from '../model/comum';
import { Periodo } from '../model/local';
import {
  atualizarAvaliacao,
  buscarAvaliacao,
  buscarLocal,
  criarAvaliacao,
  excluirAvaliacao,
} from '../repository/remote/locaisRepository';
import { avisar, confirmar } from '../utils/feedback';
import { ErrosFormulario, validarFormulario } from '../utils/validacao';
import { chaves } from './chaves';

type Rascunho = {
  nivelRuido: number | null;
  nivelIluminacao: number | null;
  nivelLotacao: number | null;
  periodoVisita: Periodo | null;
  comentario: string;
};

/** Sugere o período pela hora atual: a pessoa costuma avaliar logo depois de ir. */
const periodoAgora = (): Periodo => {
  const hora = new Date().getHours();
  if (hora < 12) return 'MANHA';
  if (hora < 18) return 'TARDE';
  return 'NOITE';
};

/**
 * Formulário de avaliação. O mesmo control serve para criar (sem avaliacaoId) e para
 * editar (com avaliacaoId): na edição, os campos são preenchidos com o que veio da API.
 */
export const useAvaliacaoFormControl = (
  localId: number,
  avaliacaoId: number | undefined,
  aoConcluir: () => void,
) => {
  const queryClient = useQueryClient();
  const editando = avaliacaoId !== undefined;
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [form, setForm] = useState<Rascunho>({
    nivelRuido: null,
    nivelIluminacao: null,
    nivelLotacao: null,
    periodoVisita: editando ? null : periodoAgora(),
    comentario: '',
  });

  const local = useQuery({ queryKey: chaves.local(localId), queryFn: () => buscarLocal(localId) });

  const existente = useQuery({
    queryKey: chaves.avaliacao(avaliacaoId ?? 0),
    queryFn: () => buscarAvaliacao(avaliacaoId as number),
    enabled: editando,
  });

  // Quando a avaliação existente chega da API, preenche o formulário uma única vez.
  // (Ajuste de estado durante o render, padrão recomendado pelo React no lugar de um
  // useEffect, que causaria um render extra.)
  const [preenchido, setPreenchido] = useState<boolean>(false);
  if (existente.data && !preenchido) {
    const { nivelRuido, nivelIluminacao, nivelLotacao, periodoVisita, comentario } = existente.data;
    setPreenchido(true);
    setForm({
      nivelRuido,
      nivelIluminacao,
      nivelLotacao,
      periodoVisita,
      comentario: comentario ?? '',
    });
  }

  const atualizarCaches = () => {
    queryClient.invalidateQueries({ queryKey: chaves.local(localId) });
    queryClient.invalidateQueries({ queryKey: chaves.avaliacoesDoLocal(localId) });
    queryClient.invalidateQueries({ queryKey: chaves.insight(localId) });
    queryClient.invalidateQueries({ queryKey: chaves.locais });
    queryClient.invalidateQueries({ queryKey: chaves.minhasAvaliacoes });
    if (avaliacaoId) queryClient.invalidateQueries({ queryKey: chaves.avaliacao(avaliacaoId) });
  };

  const salvar = useMutation({
    mutationFn: (dados: AvaliacaoForm) =>
      editando
        ? atualizarAvaliacao(avaliacaoId, { ...dados, localId })
        : criarAvaliacao({ ...dados, localId }),
    onSuccess: () => {
      atualizarCaches();
      avisar(editando ? 'Avaliação atualizada' : 'Obrigado! Sua avaliação foi publicada');
      aoConcluir();
    },
    onError: (erro) => setErros(camposDoErro(erro)),
  });

  const exclusao = useMutation({
    mutationFn: () => excluirAvaliacao(avaliacaoId as number),
    onSuccess: () => {
      atualizarCaches();
      avisar('Avaliação excluída');
      aoConcluir();
    },
  });

  const alterar = <K extends keyof Rascunho>(campo: K, valor: Rascunho[K]) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros(({ [campo]: _removido, ...resto }) => resto);
  };

  const enviar = () => {
    const { valores, erros: errosValidacao } = validarFormulario(avaliacaoSchema, form);
    setErros(errosValidacao);
    if (valores) salvar.mutate(valores);
  };

  const excluir = async () => {
    const ok = await confirmar(
      'Excluir avaliação?',
      'Ela deixa de contar no índice de calma deste lugar. Não dá para desfazer.',
      'Excluir',
    );
    if (ok) exclusao.mutate();
  };

  return {
    editando,
    nomeLocal: local.data?.nome ?? existente.data?.nomeLocal ?? '',
    form,
    erros,
    alterar,
    enviar,
    excluir,
    carregando: editando && existente.isPending,
    erroCarregar: (existente.error as ErroApp | null)?.message ?? null,
    recarregar: existente.refetch,
    salvando: salvar.isPending,
    excluindo: exclusao.isPending,
    erroGeral:
      (salvar.error as ErroApp | null)?.message ?? (exclusao.error as ErroApp | null)?.message,
  };
};
