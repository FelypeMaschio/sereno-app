import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import Botao from './Botao';
import Texto from './Texto';

interface MensagemErroProps {
  mensagem: string;
  onTentarDeNovo?: () => void;
}

/** Erro com ícone + texto (nunca só cor) e, se possível, um caminho para resolver. */
const MensagemErro = ({ mensagem, onTentarDeNovo }: MensagemErroProps) => {
  const { tema } = useTema();
  const { cores } = tema;

  return (
    <View
      accessibilityRole="alert"
      style={[
        estilos.caixa,
        {
          backgroundColor: cores.perigoSuave,
          borderColor: cores.perigo,
          borderRadius: tema.raios.medio,
          padding: tema.espacamento.md,
          gap: tema.espacamento.md,
        },
      ]}
    >
      <View style={[estilos.linha, { gap: tema.espacamento.sm }]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={24} color={cores.perigo} />
        <Texto style={estilos.texto}>{mensagem}</Texto>
      </View>
      {onTentarDeNovo && (
        <Botao
          titulo="Tentar de novo"
          icone="refresh"
          variante="secundario"
          onPress={onTentarDeNovo}
        />
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  caixa: {
    borderWidth: 1,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  texto: {
    flex: 1,
  },
});

export default MensagemErro;
