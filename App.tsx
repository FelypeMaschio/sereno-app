import { useEffect } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { TemaProvider, useTema } from './src/context/TemaContext';
import { arquivosDeFonte } from './src/theme';
import Botao from './src/components/Botao';
import CampoTexto from './src/components/CampoTexto';
import Cartao from './src/components/Cartao';
import EstadoVazio from './src/components/EstadoVazio';
import MensagemErro from './src/components/MensagemErro';
import Texto from './src/components/Texto';

// Mantém a splash na tela até as fontes carregarem, para o texto não "piscar"
// trocando da fonte do sistema para a Atkinson Hyperlegible.
SplashScreen.preventAutoHideAsync();

/**
 * Vitrine temporária dos componentes base, para testar o tema no celular.
 * Na Etapa 3 ela é substituída pela navegação real.
 */
const Vitrine = () => {
  const { tema, modoBaixoEstimulo, setModoBaixoEstimulo } = useTema();
  const { cores, espacamento } = tema;

  return (
    <ScrollView
      style={{ backgroundColor: cores.fundo }}
      contentContainerStyle={[estilos.conteudo, { padding: espacamento.lg, gap: espacamento.lg }]}
    >
      <Texto variante="titulo">Sereno</Texto>
      <Texto secundario>Vitrine do tema e dos componentes base.</Texto>

      <Cartao>
        <View style={estilos.linha}>
          <Texto negrito style={estilos.flex}>
            Modo baixo estímulo
          </Texto>
          <Switch
            value={modoBaixoEstimulo}
            onValueChange={setModoBaixoEstimulo}
            accessibilityLabel="Modo baixo estímulo"
            trackColor={{ true: cores.primaria, false: cores.borda }}
            thumbColor={cores.superficie}
          />
        </View>
        <Texto variante="legenda" secundario>
          Cores mais suaves, sem sombras e sem animações.
        </Texto>
      </Cartao>

      <CampoTexto rotulo="E-mail" placeholder="voce@exemplo.com" keyboardType="email-address" />
      <CampoTexto rotulo="Senha" secureTextEntry erro="A senha deve ter pelo menos 6 caracteres" />

      <Botao titulo="Entrar" icone="login" onPress={() => {}} />
      <Botao titulo="Criar conta" variante="secundario" onPress={() => {}} />
      <Botao titulo="Salvando" carregando onPress={() => {}} />

      <MensagemErro
        mensagem="Não consegui falar com o servidor. Verifique sua internet."
        onTentarDeNovo={() => {}}
      />

      <Cartao>
        <EstadoVazio
          icone="map-marker-question-outline"
          titulo="Ainda ninguém avaliou este lugar"
          descricao="Que tal ser a primeira pessoa?"
        />
      </Cartao>

      <StatusBar style="dark" />
    </ScrollView>
  );
};

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

  return (
    <TemaProvider>
      <Vitrine />
    </TemaProvider>
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    paddingTop: 64,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});
