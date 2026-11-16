import { Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTema } from '../context/TemaContext';
import { useFotoPerfilControl } from '../control/useFotoPerfilControl';
import ContribuicoesScreen from '../screen/ContribuicoesScreen';
import EstacoesScreen from '../screen/EstacoesScreen';
import InicioScreen from '../screen/InicioScreen';
import LugaresScreen from '../screen/LugaresScreen';
import PerfilScreen from '../screen/PerfilScreen';
import { MainTabsParamList } from './types';

const { Navigator, Screen } = createBottomTabNavigator<MainTabsParamList>();

type NomeIcone = keyof typeof MaterialCommunityIcons.glyphMap;

/** Ícone de cada aba: contorno quando inativa, preenchido quando ativa. */
const icones: Record<keyof MainTabsParamList, [NomeIcone, NomeIcone]> = {
  Inicio: ['home-outline', 'home'],
  Lugares: ['map-marker-outline', 'map-marker'],
  Estacoes: ['subway-variant', 'subway-variant'],
  Contribuicoes: ['account-heart-outline', 'account-heart'],
  Perfil: ['account-circle-outline', 'account-circle'],
};

interface IconeAbaProps {
  focused: boolean;
  color: string;
  size: number;
}

/** Na aba Perfil, a própria foto da pessoa vira o ícone (se ela tiver colocado uma). */
const IconePerfil = ({ focused, color, size }: IconeAbaProps) => {
  const { uri } = useFotoPerfilControl();
  if (!uri) {
    return (
      <MaterialCommunityIcons name={icones.Perfil[focused ? 1 : 0]} size={size} color={color} />
    );
  }
  return (
    <Image
      source={{ uri }}
      accessible={false}
      style={{
        width: size + 2,
        height: size + 2,
        borderRadius: (size + 2) / 2,
        // Anel na cor da aba: mostra que ela está ativa sem depender só da foto.
        borderWidth: focused ? 2 : 1,
        borderColor: color,
      }}
    />
  );
};

const MainTabs = () => {
  const { tema } = useTema();

  return (
    <Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) =>
          route.name === 'Perfil' ? (
            <IconePerfil {...props} />
          ) : (
            <MaterialCommunityIcons
              name={icones[route.name][props.focused ? 1 : 0]}
              size={props.size}
              color={props.color}
            />
          ),
        tabBarActiveTintColor: tema.cores.primaria,
        tabBarInactiveTintColor: tema.cores.textoSecundario,
        tabBarLabelStyle: { fontFamily: tema.familias.negrito, fontSize: 12 },
        tabBarStyle: {
          backgroundColor: tema.cores.superficie,
          borderTopColor: tema.cores.superficieAlternativa,
        },
        // O teclado cobre a barra de abas em vez de empurrá-la para cima dos campos.
        tabBarHideOnKeyboard: true,
        // Cabeçalho da mesma cor do fundo e sem sombra: a tela parece uma peça só.
        headerStyle: { backgroundColor: tema.cores.fundo },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: tema.familias.negrito, fontSize: 20 },
        // Troca de aba sem animação, sempre. Mudar esse valor com o app aberto (ao ligar
        // o modo baixo estímulo) recriava o contêiner das abas e deixava as telas em branco.
        animation: 'none',
      })}
    >
      <Screen name="Inicio" component={InicioScreen} options={{ title: 'Início' }} />
      <Screen name="Lugares" component={LugaresScreen} />
      <Screen name="Estacoes" component={EstacoesScreen} options={{ title: 'Estações' }} />
      <Screen
        name="Contribuicoes"
        component={ContribuicoesScreen}
        options={{ title: 'Minhas contribuições', tabBarLabel: 'Atividade' }}
      />
      <Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: 'Meu perfil', tabBarLabel: 'Perfil' }}
      />
    </Navigator>
  );
};

export default MainTabs;
