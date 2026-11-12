import * as SecureStore from 'expo-secure-store';
import { Usuario } from '../../model/usuario';

/**
 * Armazenamento local com SecureStore.
 *
 * O token é uma credencial: com ele qualquer pessoa age em nome do usuário. O
 * SecureStore guarda os dados criptografados pelo próprio sistema (Keystore no
 * Android, Keychain no iOS). O AsyncStorage guardaria em texto puro.
 *
 * Os dados do app (lugares, avaliações, reportes) NÃO ficam aqui: vivem nas APIs.
 * Aqui só fica o que é da sessão e das preferências deste aparelho.
 */
const CHAVE_TOKEN = 'sereno.token';
const CHAVE_USUARIO = 'sereno.usuario';
const CHAVE_BAIXO_ESTIMULO = 'sereno.modoBaixoEstimulo';

export interface SessaoSalva {
  token: string;
  usuario: Usuario;
}

export const salvarSessao = async ({ token, usuario }: SessaoSalva): Promise<void> => {
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
  await SecureStore.setItemAsync(CHAVE_USUARIO, JSON.stringify(usuario));
};

export const lerSessao = async (): Promise<SessaoSalva | null> => {
  try {
    const token = await SecureStore.getItemAsync(CHAVE_TOKEN);
    const usuario = await SecureStore.getItemAsync(CHAVE_USUARIO);
    if (!token || !usuario) return null;
    return { token, usuario: JSON.parse(usuario) as Usuario };
  } catch {
    // Dado corrompido ou ilegível: melhor pedir login de novo do que travar o app.
    return null;
  }
};

export const limparSessao = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
  await SecureStore.deleteItemAsync(CHAVE_USUARIO);
};

export const salvarModoBaixoEstimulo = async (ativo: boolean): Promise<void> => {
  await SecureStore.setItemAsync(CHAVE_BAIXO_ESTIMULO, ativo ? '1' : '0');
};

/** null = a pessoa nunca escolheu (aí seguimos a configuração do sistema). */
export const lerModoBaixoEstimulo = async (): Promise<boolean | null> => {
  try {
    const valor = await SecureStore.getItemAsync(CHAVE_BAIXO_ESTIMULO);
    return valor === null ? null : valor === '1';
  } catch {
    return null;
  }
};
