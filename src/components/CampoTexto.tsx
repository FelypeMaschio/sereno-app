import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { AREA_MINIMA_DE_TOQUE, multiplicadorMaximoDeFonte } from '../theme';
import Texto from './Texto';

interface CampoTextoProps extends TextInputProps {
  rotulo: string;
  erro?: string | null;
}

/**
 * Campo de texto com rótulo visível e mensagem de erro abaixo.
 * O rótulo fica sempre à vista (não só como placeholder), porque o placeholder some
 * quando a pessoa começa a digitar e ela pode esquecer o que o campo pede.
 */
const CampoTexto = ({ rotulo, erro, style, onFocus, onBlur, ...props }: CampoTextoProps) => {
  const { tema } = useTema();
  const { cores } = tema;
  const [focado, setFocado] = useState<boolean>(false);
  const temErro = erro != null && erro !== '';

  const corBorda = temErro ? cores.perigo : focado ? cores.primaria : cores.borda;

  return (
    <View style={{ gap: tema.espacamento.xs }}>
      <Texto negrito>{rotulo}</Texto>
      <TextInput
        accessibilityLabel={rotulo}
        // O erro é lido junto com o campo pelo leitor de tela.
        accessibilityHint={temErro ? `Erro: ${erro}` : undefined}
        maxFontSizeMultiplier={multiplicadorMaximoDeFonte}
        placeholderTextColor={cores.textoSecundario}
        onFocus={(e) => {
          setFocado(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocado(false);
          onBlur?.(e);
        }}
        style={[
          estilos.campo,
          {
            backgroundColor: cores.superficie,
            color: cores.texto,
            borderColor: corBorda,
            // Borda mais grossa no foco e no erro: o estado não depende só da cor.
            borderWidth: temErro || focado ? 2 : 1,
            borderRadius: tema.raios.pequeno,
            paddingHorizontal: tema.espacamento.md,
            fontFamily: tema.familias.regular,
            fontSize: tema.tamanhos.corpo,
          },
          style,
        ]}
        {...props}
      />
      {temErro && (
        <View style={estilos.linhaErro}>
          <MaterialCommunityIcons name="alert-circle-outline" size={18} color={cores.perigo} />
          <Texto variante="legenda" cor={cores.perigo} style={estilos.textoErro}>
            {erro}
          </Texto>
        </View>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  campo: {
    minHeight: AREA_MINIMA_DE_TOQUE,
  },
  linhaErro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textoErro: {
    flex: 1,
  },
});

export default CampoTexto;
