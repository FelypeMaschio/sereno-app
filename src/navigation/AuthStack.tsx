import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTema } from '../context/TemaContext';
import CadastroScreen from '../screen/CadastroScreen';
import LoginScreen from '../screen/LoginScreen';
import { AuthStackParamList } from './types';

const { Navigator, Screen } = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const { tema } = useTema();

  return (
    <Navigator
      screenOptions={{
        animation: tema.animacoes ? 'default' : 'none',
        headerStyle: { backgroundColor: tema.cores.fundo },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: tema.familias.negrito },
        headerTintColor: tema.cores.primaria,
      }}
    >
      <Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
    </Navigator>
  );
};

export default AuthStack;
