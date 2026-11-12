import { Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { AREA_MINIMA_DE_TOQUE } from '../theme';
import Texto from './Texto';

interface ChipProps {
  rotulo: string;
  selecionado: boolean;
  onPress: () => void;
  icone?: keyof typeof MaterialCommunityIcons.glyphMap;
  rotuloAcessivel?: string;
}

/** Opção selecionável (filtros, período, dia da semana). */
const Chip = ({ rotulo, selecionado, onPress, icone, rotuloAcessivel }: ChipProps) => {
  const { tema } = useTema();
  const { cores } = tema;
  const corTexto = selecionado ? cores.textoSobrePrimaria : cores.texto;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel ?? rotulo}
      // "selected" faz o TalkBack dizer "selecionado" — o estado não depende só da cor.
      accessibilityState={{ selected: selecionado }}
      style={({ pressed }) => [
        estilos.chip,
        {
          backgroundColor: selecionado ? cores.primaria : cores.superficie,
          borderColor: selecionado ? cores.primaria : cores.borda,
          borderRadius: tema.raios.pilula,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {selecionado && !icone && <MaterialCommunityIcons name="check" size={16} color={corTexto} />}
      {icone && <MaterialCommunityIcons name={icone} size={18} color={corTexto} />}
      <Texto variante="legenda" negrito cor={corTexto}>
        {rotulo}
      </Texto>
    </Pressable>
  );
};

const estilos = StyleSheet.create({
  chip: {
    minHeight: AREA_MINIMA_DE_TOQUE,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
});

export default Chip;
