import { StyleSheet, Text, TextProps } from 'react-native';
import { useTema } from '../context/TemaContext';
import { multiplicadorMaximoDeFonte } from '../theme';

type Variante = 'titulo' | 'subtitulo' | 'corpo' | 'legenda';

interface TextoProps extends TextProps {
  variante?: Variante;
  negrito?: boolean;
  secundario?: boolean;
  cor?: string;
}

/**
 * Todo texto do app passa por aqui: assim a fonte, as cores e o limite de
 * ampliação ficam iguais em todas as telas.
 */
const Texto = ({
  variante = 'corpo',
  negrito = false,
  secundario = false,
  cor,
  style,
  ...props
}: TextoProps) => {
  const { tema } = useTema();
  const ehTitulo = variante === 'titulo' || variante === 'subtitulo';

  return (
    <Text
      // Títulos são anunciados como "cabeçalho" pelo TalkBack/VoiceOver, o que permite
      // pular de seção em seção.
      accessibilityRole={ehTitulo ? 'header' : undefined}
      maxFontSizeMultiplier={multiplicadorMaximoDeFonte}
      style={[
        estilos.base,
        {
          fontFamily: negrito || ehTitulo ? tema.familias.negrito : tema.familias.regular,
          fontSize: tema.tamanhos[variante],
          lineHeight: tema.alturasDeLinha[variante],
          color: cor ?? (secundario ? tema.cores.textoSecundario : tema.cores.texto),
        },
        style,
      ]}
      {...props}
    />
  );
};

const estilos = StyleSheet.create({
  base: {
    // Evita o espaço extra que o Android adiciona acima de fontes personalizadas.
    includeFontPadding: false,
  },
});

export default Texto;
