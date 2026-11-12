import { Image, StyleSheet, View } from 'react-native';
import Cartao from '../components/Cartao';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { AppScreenProps } from '../navigation/types';

// Parcial: versão e hash do commit chegam na Etapa 12.
const SobreScreen = (_props: AppScreenProps<'Sobre'>) => {
  const { tema } = useTema();

  return (
    <Tela>
      <View style={[estilos.topo, { gap: tema.espacamento.sm }]}>
        <Image
          source={require('../../assets/icon.png')}
          style={[estilos.icone, { borderRadius: tema.raios.grande }]}
          accessible={false}
        />
        <Texto variante="titulo">Sereno</Texto>
        <Texto secundario style={estilos.centro}>
          Acessibilidade urbana, física e sensorial.
        </Texto>
      </View>
      <Cartao>
        <Texto negrito>Global Solution FIAP 2026/2 · CitizenTech</Texto>
        <Texto variante="legenda" secundario>
          Turma 2TDSPI · ODS 3, 10 e 11
        </Texto>
      </Cartao>
    </Tela>
  );
};

const estilos = StyleSheet.create({
  topo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  icone: {
    width: 96,
    height: 96,
  },
  centro: {
    textAlign: 'center',
  },
});

export default SobreScreen;
