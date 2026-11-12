/** Escala de espaçamento em múltiplos de 4, para manter o ritmo visual consistente. */
export const espacamento = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const raios = {
  pequeno: 8,
  medio: 12,
  grande: 20,
  pilula: 999,
} as const;

/** Área mínima de toque recomendada pelo Material Design (48 dp). A Apple pede 44 pt. */
export const AREA_MINIMA_DE_TOQUE = 48;
