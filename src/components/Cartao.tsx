import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTema } from '../context/TemaContext';

interface CartaoProps {
  children: ReactNode;
  /** Se informado, o cartão inteiro vira um botão (ex.: item de lista). */
  onPress?: () => void;
  rotuloAcessivel?: string;
  style?: StyleProp<ViewStyle>;
}

const Cartao = ({ children, onPress, rotuloAcessivel, style }: CartaoProps) => {
  const { tema } = useTema();
  const { cores } = tema;

  const estiloCartao: ViewStyle = {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderRadius: tema.raios.grande,
    padding: tema.espacamento.md,
    gap: tema.espacamento.sm,
    // No modo baixo estímulo não há sombra: só a borda separa os elementos.
    ...(tema.sombras ? estilos.sombra : null),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={rotuloAcessivel}
        style={({ pressed }) => [
          estilos.cartao,
          estiloCartao,
          { opacity: pressed ? 0.85 : 1 },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[estilos.cartao, estiloCartao, style]}>{children}</View>;
};

const estilos = StyleSheet.create({
  cartao: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  sombra: {
    // iOS
    shadowColor: '#1E2B2F',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    // Android
    elevation: 2,
  },
});

export default Cartao;
