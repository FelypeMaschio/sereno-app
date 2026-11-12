import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { AREA_MINIMA_DE_TOQUE, multiplicadorMaximoDeFonte } from '../theme';

interface CampoBuscaProps {
  valor: string;
  onChange: (texto: string) => void;
  placeholder: string;
  rotuloAcessivel: string;
}

const CampoBusca = ({ valor, onChange, placeholder, rotuloAcessivel }: CampoBuscaProps) => {
  const { tema } = useTema();
  const { cores } = tema;

  return (
    <View
      style={[
        estilos.caixa,
        {
          backgroundColor: cores.superficie,
          borderColor: cores.borda,
          borderRadius: tema.raios.pilula,
          paddingLeft: tema.espacamento.md,
        },
      ]}
    >
      <MaterialCommunityIcons name="magnify" size={22} color={cores.textoSecundario} />
      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={cores.textoSecundario}
        accessibilityLabel={rotuloAcessivel}
        maxFontSizeMultiplier={multiplicadorMaximoDeFonte}
        returnKeyType="search"
        autoCorrect={false}
        style={[
          estilos.campo,
          { color: cores.texto, fontFamily: tema.familias.regular, fontSize: tema.tamanhos.corpo },
        ]}
      />
      {valor.length > 0 && (
        <Pressable
          onPress={() => onChange('')}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          style={estilos.limpar}
        >
          <MaterialCommunityIcons name="close-circle" size={20} color={cores.textoSecundario} />
        </Pressable>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: AREA_MINIMA_DE_TOQUE,
  },
  campo: {
    flex: 1,
    minHeight: AREA_MINIMA_DE_TOQUE,
    paddingHorizontal: 8,
  },
  limpar: {
    width: AREA_MINIMA_DE_TOQUE,
    height: AREA_MINIMA_DE_TOQUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CampoBusca;
