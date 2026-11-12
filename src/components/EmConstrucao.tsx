import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import Texto from './Texto';

interface EmConstrucaoProps {
  texto: string;
}

/**
 * Aviso discreto para partes ainda não implementadas.
 * Usado só durante o desenvolvimento; some quando cada etapa fica pronta.
 */
const EmConstrucao = ({ texto }: EmConstrucaoProps) => {
  const { tema } = useTema();
  const { cores } = tema;

  return (
    <View
      style={[
        estilos.caixa,
        {
          borderColor: cores.borda,
          borderRadius: tema.raios.medio,
          padding: tema.espacamento.md,
          gap: tema.espacamento.sm,
        },
      ]}
    >
      <MaterialCommunityIcons name="hammer-wrench" size={20} color={cores.textoSecundario} />
      <Texto variante="legenda" secundario style={estilos.texto}>
        {texto}
      </Texto>
    </View>
  );
};

const estilos = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  texto: {
    flex: 1,
  },
});

export default EmConstrucao;
