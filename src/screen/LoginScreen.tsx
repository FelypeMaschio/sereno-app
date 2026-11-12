import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Cartao from '../components/Cartao';
import HeroMarca from '../components/HeroMarca';
import MensagemErro from '../components/MensagemErro';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useLoginControl } from '../control/useLoginControl';
import { AuthScreenProps } from '../navigation/types';

const LoginScreen = ({ navigation }: AuthScreenProps<'Login'>) => {
  const { tema } = useTema();
  const { form, erros, alterar, enviar, enviando, erroGeral } = useLoginControl();

  return (
    <KeyboardAvoidingView
      style={[estilos.flex, { backgroundColor: tema.cores.fundo }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={estilos.rolagem}>
        <HeroMarca />
        <View style={[estilos.corpo, { paddingHorizontal: tema.espacamento.lg }]}>
          <Cartao style={{ gap: tema.espacamento.md, padding: tema.espacamento.lg }}>
            <Texto variante="subtitulo">Entrar</Texto>
            <CampoTexto
              rotulo="E-mail"
              placeholder="voce@exemplo.com"
              value={form.email}
              onChangeText={(valor) => alterar('email', valor)}
              erro={erros.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <CampoTexto
              rotulo="Senha"
              placeholder="Sua senha"
              value={form.senha}
              onChangeText={(valor) => alterar('senha', valor)}
              erro={erros.senha}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={enviar}
            />
            {erroGeral && !erros.email && !erros.senha && <MensagemErro mensagem={erroGeral} />}
            <Botao titulo="Entrar" icone="login" carregando={enviando} onPress={enviar} />
          </Cartao>

          <View style={[estilos.rodape, { gap: tema.espacamento.sm }]}>
            <Texto secundario>Ainda não tem conta?</Texto>
            <Botao
              titulo="Criar conta"
              variante="secundario"
              onPress={() => navigation.navigate('Cadastro')}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const estilos = StyleSheet.create({
  flex: {
    flex: 1,
  },
  rolagem: {
    flexGrow: 1,
  },
  corpo: {
    // O cartão sobe por cima da faixa verde, dando profundidade sem exagero.
    marginTop: -36,
    paddingBottom: 32,
    gap: 24,
  },
  rodape: {
    alignItems: 'stretch',
  },
});

export default LoginScreen;
