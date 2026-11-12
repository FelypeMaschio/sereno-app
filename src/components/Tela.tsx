import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTema } from '../context/TemaContext';

interface TelaProps {
  children: ReactNode;
  /** false para telas com FlatList, que já tem rolagem própria. */
  rolavel?: boolean;
  /**
   * Bordas que precisam respeitar a área segura (notch, barra de gestos).
   * Telas com cabeçalho do navigator não precisam da borda de cima.
   */
  bordas?: Edge[];
}

/** Contêiner padrão de toda tela: fundo do tema, área segura e espaçamento. */
const Tela = ({ children, rolavel = true, bordas = ['left', 'right'] }: TelaProps) => {
  const { tema } = useTema();
  const estiloConteudo = { padding: tema.espacamento.lg, gap: tema.espacamento.md };

  return (
    <SafeAreaView edges={bordas} style={[estilos.flex, { backgroundColor: tema.cores.fundo }]}>
      {rolavel ? (
        <ScrollView contentContainerStyle={estiloConteudo} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[estilos.flex, estiloConteudo]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const estilos = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default Tela;
