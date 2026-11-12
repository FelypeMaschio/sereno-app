/**
 * Chaves do cache do React Query, num lugar só. Depois de criar/editar/excluir, o app
 * "invalida" as chaves afetadas e as telas buscam os dados atualizados sozinhas.
 */
export const chaves = {
  locais: ['locais'] as const,
  local: (id: number) => ['local', id] as const,
  insight: (id: number) => ['insight', id] as const,
  avaliacoesDoLocal: (id: number) => ['avaliacoes', 'local', id] as const,
  avaliacao: (id: number) => ['avaliacao', id] as const,
  minhasAvaliacoes: ['avaliacoes', 'minhas'] as const,
  estacoes: ['estacoes'] as const,
  estacao: (id: number) => ['estacao', id] as const,
  equipamento: (id: number) => ['equipamento', id] as const,
  reporte: (id: number) => ['reporte', id] as const,
  meusReportes: ['reportes', 'meus'] as const,
  perfil: ['perfil'] as const,
  previsao: (localId: number, dia: number, hora: number) =>
    ['previsao', localId, dia, hora] as const,
};
