import { StyleSheet, Switch, View } from 'react-native';
import Botao from '../components/Botao';
import Cartao from '../components/Cartao';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';
import { AppScreenProps } from '../navigation/types';

// Parcial: nome e sensibilidades salvos na API chegam na Etapa 8.
const PerfilScreen = ({ navigation }: AppScreenProps<'Perfil'>) => {
  const { sair } = useAuth();
  const { tema, modoBaixoEstimulo, setModoBaixoEstimulo } = useTema();

  return (
    <Tela>
      <Cartao>
        <View style={estilos.linha}>
          <Texto negrito style={estilos.flex}>
            Modo baixo estímulo
          </Texto>
          <Switch
            value={modoBaixoEstimulo}
            onValueChange={setModoBaixoEstimulo}
            accessibilityLabel="Modo baixo estímulo"
            trackColor={{ true: tema.cores.primaria, false: tema.cores.borda }}
            thumbColor={tema.cores.superficie}
          />
        </View>
        <Texto variante="legenda" secundario>
          Cores mais suaves, sem sombras e sem animações.
        </Texto>
      </Cartao>
      <Botao
        titulo="Sobre o app"
        icone="information-outline"
        variante="secundario"
        onPress={() => navigation.navigate('Sobre')}
      />
      <Botao titulo="Sair" icone="logout" variante="perigo" onPress={sair} />
    </Tela>
  );
};

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});

export default PerfilScreen;
