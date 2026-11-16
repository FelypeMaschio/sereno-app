import { ReactNode, useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface AreaTecladoProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Faz o conteúdo "subir" quando o teclado abre, para o campo digitado ficar à vista.
 *
 * No Android atual (edge-to-edge, padrão do Expo SDK 57) a janela NÃO encolhe sozinha
 * quando o teclado aparece, então o teclado cobria os campos de baixo. O
 * KeyboardAvoidingView com behavior "padding" resolve nas duas plataformas: ele soma
 * um espaço embaixo do tamanho do teclado e a ScrollView de dentro encolhe junto.
 *
 * Ele só precisa saber onde a tela começa (abaixo do cabeçalho). Em vez de calcular a
 * altura de cada cabeçalho, medimos a posição real desta área na tela.
 */
const AreaTeclado = ({ children, style }: AreaTecladoProps) => {
  const ref = useRef<View>(null);
  const [topo, setTopo] = useState<number>(0);

  return (
    <View
      ref={ref}
      style={[estilos.flex, style]}
      onLayout={() => ref.current?.measureInWindow((_x, y) => setTopo(Math.max(0, y)))}
    >
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={topo} style={estilos.flex}>
        {children}
      </KeyboardAvoidingView>
    </View>
  );
};

const estilos = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default AreaTeclado;
