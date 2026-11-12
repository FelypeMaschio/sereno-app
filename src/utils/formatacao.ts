/** 7.83 → "7,8" (padrão brasileiro, uma casa decimal). */
export const formatarNota = (valor: number): string =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** "2026-11-12T14:30:00Z" → "12/11/2026". */
export const formatarData = (iso?: string | null): string => {
  if (!iso) return '';
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '';
  return data.toLocaleDateString('pt-BR');
};

/**
 * Tempo relativo para mostrar o "frescor" de uma informação: "há 12 min", "há 3 h",
 * "há 2 dias". Um status confirmado há 10 minutos merece mais confiança que um de 3 dias.
 */
export const tempoRelativo = (iso?: string | null): string => {
  if (!iso) return '';
  const minutos = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (Number.isNaN(minutos)) return '';
  if (minutos < 1) return 'agora mesmo';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.floor(horas / 24);
  return dias === 1 ? 'há 1 dia' : `há ${dias} dias`;
};

/** Horas desde a data (para decidir se a informação está "fresca"). */
export const horasDesde = (iso?: string | null): number =>
  iso ? (Date.now() - new Date(iso).getTime()) / 3_600_000 : Infinity;

export const formatarHora = (hora: number): string => `${hora}h`;
