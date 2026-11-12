/**
 * Lê a data de expiração (claim "exp") do JWT, sem validar a assinatura.
 *
 * Quem valida a assinatura são as APIs, que conhecem o segredo. O app nunca conhece o
 * segredo: aqui só olhamos o "exp" para não restaurar uma sessão que já venceu
 * (o token vale 2 horas).
 */
export const tokenExpirado = (token: string): boolean => {
  try {
    const payload = token.split('.')[1];
    // O JWT usa base64url: troca - e _ e completa o padding antes de decodificar.
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const completo = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const { exp } = JSON.parse(atob(completo)) as { exp?: number };
    if (!exp) return false;
    // Margem de 30 s para não usar um token que vence no meio da requisição.
    return Date.now() >= exp * 1000 - 30_000;
  } catch {
    return true;
  }
};
