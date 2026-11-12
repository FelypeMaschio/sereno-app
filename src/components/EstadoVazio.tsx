import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import Botao from './Botao';
import Texto from './Texto';

interface EstadoVazioProps {
  icone: keyof typeof MaterialCommunityIcons.glyphMap;
  titulo: string;
  descricao?: string;
  textoAcao?: string;
  onAcao?: () => void;
}

/**
 * Tela "sem dados" acolhedora: em vez de uma lista em branco, explica o que está
 * acontecendo e sugere o próximo passo.
 */
const EstadoVazio = ({ icone, titulo, descricao, textoAcao, onAcao }: EstadoVazioProps) => {
  const { tema } = useTema();

  return (
    <View style={[estilos.container, { gap: tema.espacamento.md, padding: tema.espacamento.lg }]}>
      {/* Ícone decorativo: o significado está no texto, então o leitor de tela o ignora. */}
      <View accessible={false} importantForAccessibility="no-hide-descendants">
        <MaterialCommunityIcons name={icone} size={56} color={tema.cores.primaria} />
      </View>
      <Texto variante="subtitulo" style={estilos.centro}>
        {titulo}
      </Texto>
      {descricao && (
        <Texto secundario style={estilos.centro}>
          {descricao}
        </Texto>
      )}
      {textoAcao && onAcao && <Botao titulo={textoAcao} onPress={onAcao} />}
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centro: {
    textAlign: 'center',
  },
});

export default EstadoVazio;
