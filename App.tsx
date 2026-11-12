import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { TemaProvider } from './src/context/TemaContext';
import RootNavigator from './src/navigation/RootNavigator';
import { arquivosDeFonte } from './src/theme';

// Mantém a splash na tela até as fontes carregarem, para o texto não "piscar"
// trocando da fonte do sistema para a Atkinson Hyperlegible.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontesCarregadas, erroFontes] = useFonts(arquivosDeFonte);

  useEffect(() => {
    // Se a fonte falhar, seguimos com a fonte do sistema em vez de travar o app.
    if (fontesCarregadas || erroFontes) {
      SplashScreen.hideAsync();
    }
  }, [fontesCarregadas, erroFontes]);

  if (!fontesCarregadas && !erroFontes) {
    return null;
  }

  // Ordem dos providers: o tema por fora (todas as telas usam), a autenticação
  // dentro dele, e a navegação por último, porque ela depende dos dois.
  return (
    <SafeAreaProvider>
      <TemaProvider>
        <AuthProvider>
          <RootNavigator />
          <StatusBar style="dark" />
        </AuthProvider>
      </TemaProvider>
    </SafeAreaProvider>
  );
}
