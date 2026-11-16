import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import {
  lerFotoPerfil,
  removerFotoPerfil,
  salvarFotoPerfil,
} from '../repository/local/fotoPerfilLocal';
import { avisar, confirmar } from '../utils/feedback';
import { chaves } from './chaves';

type Origem = 'galeria' | 'camera';

// Recorte quadrado e qualidade média: a foto aparece pequena, não precisa de muitos MB.
const opcoes: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.5,
};

/** Escolher, tirar e remover a foto de perfil (guardada só no aparelho). */
export const useFotoPerfilControl = () => {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const id = usuario?.id ?? 0;
  const chave = chaves.fotoPerfil(id);

  const foto = useQuery({
    queryKey: chave,
    queryFn: () => lerFotoPerfil(id),
    enabled: id > 0,
    staleTime: Infinity,
  });

  const trocar = useMutation({
    mutationFn: async (origem: Origem) => {
      if (origem === 'camera') {
        // A galeria do Android 13+ não pede permissão; a câmera sempre pede.
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (!granted) {
          avisar('Sem acesso à câmera. Você pode escolher uma foto da galeria.');
          return null;
        }
      }
      const resultado =
        origem === 'camera'
          ? await ImagePicker.launchCameraAsync(opcoes)
          : await ImagePicker.launchImageLibraryAsync(opcoes);
      if (resultado.canceled || !resultado.assets[0]) return null;
      return salvarFotoPerfil(id, resultado.assets[0].uri);
    },
    onSuccess: (uri) => {
      if (!uri) return;
      queryClient.setQueryData(chave, uri);
      avisar('Foto atualizada');
    },
    onError: () => avisar('Não foi possível usar essa foto. Tente outra.'),
  });

  const remover = async () => {
    const ok = await confirmar('Remover foto?', 'Suas iniciais voltam a aparecer.', 'Remover');
    if (!ok) return;
    await removerFotoPerfil(id).catch(() => {});
    queryClient.setQueryData(chave, null);
  };

  return {
    uri: foto.data ?? null,
    escolherDaGaleria: () => trocar.mutate('galeria'),
    tirarFoto: () => trocar.mutate('camera'),
    remover,
    trocando: trocar.isPending,
  };
};
