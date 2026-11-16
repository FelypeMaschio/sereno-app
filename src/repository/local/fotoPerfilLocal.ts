import { Directory, File, Paths } from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

/**
 * Foto de perfil guardada SÓ neste aparelho.
 *
 * As APIs do grupo não têm campo de foto, e uma foto de rosto é dado pessoal (LGPD).
 * Por isso ela nunca sai do celular: o arquivo vai para a pasta de documentos do app
 * (o sistema não apaga) e o SecureStore guarda só o caminho, separado por usuário,
 * para quem dividir o aparelho não ver a foto de outra pessoa.
 */
const pasta = () => new Directory(Paths.document, 'fotos-perfil');
const chave = (usuarioId: number) => `sereno.fotoPerfil.${usuarioId}`;

export const lerFotoPerfil = async (usuarioId: number): Promise<string | null> => {
  try {
    const uri = await SecureStore.getItemAsync(chave(usuarioId));
    // O arquivo pode ter sumido (ex.: dados do app limpos): aí volta para as iniciais.
    return uri && new File(uri).exists ? uri : null;
  } catch {
    return null;
  }
};

export const removerFotoPerfil = async (usuarioId: number): Promise<void> => {
  const atual = await lerFotoPerfil(usuarioId);
  if (atual) new File(atual).delete();
  await SecureStore.deleteItemAsync(chave(usuarioId));
};

/** Copia a imagem escolhida (que vem de uma pasta temporária) para um lugar permanente. */
export const salvarFotoPerfil = async (usuarioId: number, uriTemporaria: string) => {
  const destino = pasta();
  if (!destino.exists) destino.create({ intermediates: true });
  await removerFotoPerfil(usuarioId);
  // Nome com horário: um arquivo novo a cada troca, para a imagem não ficar em cache.
  const arquivo = new File(destino, `usuario-${usuarioId}-${Date.now()}.jpg`);
  new File(uriTemporaria).copy(arquivo);
  await SecureStore.setItemAsync(chave(usuarioId), arquivo.uri);
  return arquivo.uri;
};
