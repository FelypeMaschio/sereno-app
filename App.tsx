import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashAnimada from './src/components/SplashAnimada';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TemaProvider } from './src/context/TemaContext';
import { ErroApp } from './src/model/comum';
import RootNavigator from './src/navigation/RootNavigator';
import { arquivosDeFonte } from './src/theme';

// Mantém a splash nativa na tela até as fontes carregarem, para o texto não "piscar"
// trocando da fonte do sistema para a Atkinson Hyperlegible.
SplashScreen.preventAutoHideAsync();

/**
 * React Query: guarda em cache o que veio das APIs, controla carregamento/erro e
 * atualiza as listas depois de criar, editar ou excluir (invalidateQueries).
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tenta de novo uma vez em falha de rede/servidor, mas nunca em erro 4xx
      // (repetir um "não encontrado" ou "sem permissão" não muda o resultado).
      retry: (tentativas, erro) => {
        const status = erro instanceof ErroApp ? erro.status : null;
        if (status !== null && status >= 400 && status < 500) return false;
        return tentativas < 1;
      },
      staleTime: 30_000,
    },
  },
});

/** Conteúdo do app: a splash animada fica por cima até a sessão ser restaurada. */
const Conteudo = () => {
  const { restaurando } = useAuth();
  const [animacaoConcluida, setAnimacaoConcluida] = useState<boolean>(false);
  // useCallback mantém a mesma função entre renders, para não reiniciar a animação.
  const finalizarSplash = useCallback(() => setAnimacaoConcluida(true), []);
  const mostrarSplash = !animacaoConcluida || restaurando;

  return (
    <View style={estilos.flex}>
      {!restaurando && <RootNavigator />}
      {mostrarSplash && <SplashAnimada onFim={finalizarSplash} />}
      <StatusBar style={mostrarSplash ? 'light' : 'dark'} />
    </View>
  );
};

export default function App() {
  const [fontesCarregadas, erroFontes] = useFonts(arquivosDeFonte);
  const prontoParaMostrar = fontesCarregadas || erroFontes != null;

  useEffect(() => {
    // Se a fonte falhar, seguimos com a fonte do sistema em vez de travar o app.
    if (prontoParaMostrar) {
      SplashScreen.hideAsync();
    }
  }, [prontoParaMostrar]);

  if (!prontoParaMostrar) {
    return null;
  }

  // Ordem dos providers: o cache das consultas e o tema por fora; a autenticação
  // dentro deles (ela limpa o cache ao sair); a navegação por último.
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <TemaProvider>
          <AuthProvider>
            <Conteudo />
          </AuthProvider>
        </TemaProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
