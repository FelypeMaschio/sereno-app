import { Image, StyleSheet, View } from 'react-native';
import { useTema } from '../context/TemaContext';
import Texto from './Texto';

interface AvatarProps {
  nome?: string;
  uri?: string | null;
  tamanho?: number;
}

/** Iniciais para quando não há foto (ex.: "Felype Maschio" → "FM"). */
export const iniciais = (nome?: string) =>
  (nome ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('');

/** Foto de perfil redonda; sem foto, mostra as iniciais sobre a cor primária. */
const Avatar = ({ nome, uri, tamanho = 96 }: AvatarProps) => {
  const { tema } = useTema();
  const forma = { width: tamanho, height: tamanho, borderRadius: tamanho / 2 };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[forma, { backgroundColor: tema.cores.superficieAlternativa }]}
        accessibilityIgnoresInvertColors
        accessible={false}
      />
    );
  }

  return (
    <View
      style={[estilos.iniciais, forma, { backgroundColor: tema.cores.primaria }]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Texto variante="titulo" cor={tema.cores.textoSobrePrimaria}>
        {iniciais(nome)}
      </Texto>
    </View>
  );
};

const estilos = StyleSheet.create({
  iniciais: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Avatar;
