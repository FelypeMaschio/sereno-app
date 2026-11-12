import { Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useTema } from '../context/TemaContext';
import { AREA_MINIMA_DE_TOQUE } from '../theme';
import ContribuicoesScreen from '../screen/ContribuicoesScreen';
import EstacoesScreen from '../screen/EstacoesScreen';
import InicioScreen from '../screen/InicioScreen';
import LugaresScreen from '../screen/LugaresScreen';
import { MainTabsParamList } from './types';

const { Navigator, Screen } = createBottomTabNavigator<MainTabsParamList>();

type NomeIcone = keyof typeof MaterialCommunityIcons.glyphMap;

/** Ícone de cada aba: contorno quando inativa, preenchido quando ativa. */
const icones: Record<keyof MainTabsParamList, [NomeIcone, NomeIcone]> = {
  Inicio: ['home-outline', 'home'],
  Lugares: ['map-marker-outline', 'map-marker'],
  Estacoes: ['subway-variant', 'subway-variant'],
  Contribuicoes: ['account-heart-outline', 'account-heart'],
};

/** Botão do cabeçalho que leva ao Perfil (fica acessível em todas as abas). */
const BotaoPerfil = () => {
  const navigation = useNavigation();
  const { tema } = useTema();

  return (
    <Pressable
      onPress={() => navigation.navigate('Perfil')}
      accessibilityRole="button"
      accessibilityLabel="Perfil e preferências"
      style={estilos.botaoPerfil}
    >
      <MaterialCommunityIcons name="account-circle-outline" size={28} color={tema.cores.primaria} />
    </Pressable>
  );
};

const MainTabs = () => {
  const { tema } = useTema();

  return (
    <Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialCommunityIcons
            name={icones[route.name][focused ? 1 : 0]}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: tema.cores.primaria,
        tabBarInactiveTintColor: tema.cores.textoSecundario,
        tabBarLabelStyle: { fontFamily: tema.familias.negrito, fontSize: 12 },
        tabBarStyle: {
          backgroundColor: tema.cores.superficie,
          borderTopColor: tema.cores.superficieAlternativa,
        },
        // Cabeçalho da mesma cor do fundo e sem sombra: a tela parece uma peça só.
        headerStyle: { backgroundColor: tema.cores.fundo },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: tema.familias.negrito, fontSize: 20 },
        headerRight: () => <BotaoPerfil />,
        animation: tema.animacoes ? 'fade' : 'none',
      })}
    >
      <Screen name="Inicio" component={InicioScreen} options={{ title: 'Início' }} />
      <Screen name="Lugares" component={LugaresScreen} />
      <Screen name="Estacoes" component={EstacoesScreen} options={{ title: 'Estações' }} />
      <Screen
        name="Contribuicoes"
        component={ContribuicoesScreen}
        options={{ title: 'Minhas contribuições', tabBarLabel: 'Contribuições' }}
      />
    </Navigator>
  );
};

const estilos = StyleSheet.create({
  botaoPerfil: {
    width: AREA_MINIMA_DE_TOQUE,
    height: AREA_MINIMA_DE_TOQUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});

export default MainTabs;
