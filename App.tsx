import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashAnimada from './src/components/SplashAnimada';
import { AuthProvider } from './src/context/AuthContext';
import { TemaProvider } from './src/context/TemaContext';
import RootNavigator from './src/navigation/RootNavigator';
import { arquivosDeFonte } from './src/theme';

// Mantém a splash nativa na tela até as fontes carregarem, para o texto não "piscar"
// trocando da fonte do sistema para a Atkinson Hyperlegible.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontesCarregadas, erroFontes] = useFonts(arquivosDeFonte);
  const [splashConcluida, setSplashConcluida] = useState<boolean>(false);
  const prontoParaMostrar = fontesCarregadas || erroFontes != null;

  useEffect(() => {
    // Se a fonte falhar, seguimos com a fonte do sistema em vez de travar o app.
    if (prontoParaMostrar) {
      SplashScreen.hideAsync();
    }
  }, [prontoParaMostrar]);

  // useCallback mantém a mesma função entre renders, para não reiniciar a animação.
  const finalizarSplash = useCallback(() => setSplashConcluida(true), []);

  if (!prontoParaMostrar) {
    return null;
  }

  // Ordem dos providers: o tema por fora (todas as telas usam), a autenticação
  // dentro dele, e a navegação por último, porque ela depende dos dois.
  // A splash animada fica por cima do app e some com fade, revelando a primeira tela.
  return (
    <SafeAreaProvider>
      <TemaProvider>
        <AuthProvider>
          <View style={{ flex: 1 }}>
            <RootNavigator />
            {!splashConcluida && <SplashAnimada onFim={finalizarSplash} />}
          </View>
          <StatusBar style={splashConcluida ? 'dark' : 'light'} />
        </AuthProvider>
      </TemaProvider>
    </SafeAreaProvider>
  );
}
