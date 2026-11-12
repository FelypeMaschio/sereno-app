import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTema } from '../context/TemaContext';
import DetalheEstacaoScreen from '../screen/DetalheEstacaoScreen';
import DetalheLugarScreen from '../screen/DetalheLugarScreen';
import FormAvaliacaoScreen from '../screen/FormAvaliacaoScreen';
import FormReporteScreen from '../screen/FormReporteScreen';
import PerfilScreen from '../screen/PerfilScreen';
import SobreScreen from '../screen/SobreScreen';
import MainTabs from './MainTabs';
import { AppStackParamList } from './types';

const { Navigator, Screen } = createNativeStackNavigator<AppStackParamList>();

/**
 * Pilha do app logado. As abas ficam na base; detalhes e formulários abrem por cima,
 * com botão de voltar. Assim as abas não ficam cheias de telas secundárias.
 */
const AppStack = () => {
  const { tema } = useTema();

  return (
    <Navigator
      screenOptions={{
        // Modo baixo estímulo: troca de tela instantânea, sem deslizar.
        animation: tema.animacoes ? 'default' : 'none',
        headerStyle: { backgroundColor: tema.cores.fundo },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: tema.familias.negrito },
        headerTintColor: tema.cores.primaria,
      }}
    >
      <Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Screen name="DetalheLugar" component={DetalheLugarScreen} options={{ title: 'Lugar' }} />
      <Screen
        name="FormAvaliacao"
        component={FormAvaliacaoScreen}
        options={({ route }) => ({
          title: route.params.avaliacaoId ? 'Editar avaliação' : 'Avaliar lugar',
        })}
      />
      <Screen
        name="DetalheEstacao"
        component={DetalheEstacaoScreen}
        options={{ title: 'Estação' }}
      />
      <Screen
        name="FormReporte"
        component={FormReporteScreen}
        options={({ route }) => ({
          title: route.params.reporteId ? 'Editar reporte' : 'Reportar status',
        })}
      />
      <Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil e preferências' }} />
      <Screen name="Sobre" component={SobreScreen} options={{ title: 'Sobre o app' }} />
    </Navigator>
  );
};

export default AppStack;
