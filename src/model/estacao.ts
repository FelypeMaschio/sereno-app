import { MaterialCommunityIcons } from '@expo/vector-icons';
import { InferType, mixed, object, string } from 'yup';

export type TipoEquipamento = 'ELEVADOR' | 'ESCADA_ROLANTE' | 'RAMPA' | 'PLATAFORMA';
export type StatusEquipamento = 'FUNCIONANDO' | 'PARADO' | 'EM_MANUTENCAO';

export interface Equipamento {
  id: number;
  estacaoId: number;
  tipo: TipoEquipamento;
  localizacao?: string | null;
  statusAtual: StatusEquipamento;
  /** Última mudança de status (UTC): mostra o quanto a informação é recente. */
  atualizadoEm?: string;
}

/** Estação (API .NET). Latitude e longitude são opcionais nessa API. */
export interface Estacao {
  id: number;
  nome: string;
  linha?: string | null;
  endereco?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  equipamentosParados: number;
  /** Só vem no detalhe (GET /api/estacoes/{id}). */
  equipamentos?: Equipamento[] | null;
}

export interface Reporte {
  id: number;
  equipamentoId: number;
  usuarioId?: number | null;
  status: StatusEquipamento;
  observacao?: string | null;
  criadoEm: string;
}

export const reporteSchema = object({
  status: mixed<StatusEquipamento>()
    .oneOf(['FUNCIONANDO', 'PARADO', 'EM_MANUTENCAO'], 'Escolha como está o equipamento')
    .required('Escolha como está o equipamento'),
  observacao: string().trim().max(300, 'A observação pode ter até 300 caracteres').default(''),
});
export type ReporteForm = InferType<typeof reporteSchema>;

type NomeIcone = keyof typeof MaterialCommunityIcons.glyphMap;

export const tiposEquipamento: Record<TipoEquipamento, { rotulo: string; icone: NomeIcone }> = {
  ELEVADOR: { rotulo: 'Elevador', icone: 'elevator-passenger-outline' },
  ESCADA_ROLANTE: { rotulo: 'Escada rolante', icone: 'escalator' },
  RAMPA: { rotulo: 'Rampa', icone: 'wheelchair-accessibility' },
  PLATAFORMA: { rotulo: 'Plataforma elevatória', icone: 'human-wheelchair' },
};

/** Status sempre com ícone + texto + cor (a cor sozinha nunca carrega o significado). */
export const statusEquipamento: Record<
  StatusEquipamento,
  { rotulo: string; icone: NomeIcone; tom: 'sucesso' | 'perigo' | 'alerta' }
> = {
  FUNCIONANDO: { rotulo: 'Funcionando', icone: 'check-circle-outline', tom: 'sucesso' },
  PARADO: { rotulo: 'Parado', icone: 'close-octagon-outline', tom: 'perigo' },
  EM_MANUTENCAO: { rotulo: 'Em manutenção', icone: 'wrench-outline', tom: 'alerta' },
};
