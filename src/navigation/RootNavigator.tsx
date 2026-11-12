import { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { criarTemaNavegacao } from './temaNavegacao';

/**
 * Proteção de rotas: o navigator renderizado depende do token.
 *
 * Sem token, as telas do app logado simplesmente NÃO existem na árvore de navegação,
 * então não há como chegar nelas (nem por deep link, nem por "voltar"). Ao sair,
 * o React Navigation desmonta o AppStack inteiro e o histórico é descartado.
 * É o padrão recomendado na documentação do React Navigation ("Authentication flows").
 */
const RootNavigator = () => {
  const { token } = useAuth();
  const { tema } = useTema();
  const temaNavegacao = useMemo(() => criarTemaNavegacao(tema), [tema]);

  return (
    <NavigationContainer theme={temaNavegacao}>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
