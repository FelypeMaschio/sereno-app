import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Cartao from '../components/Cartao';
import HeroMarca from '../components/HeroMarca';
import Texto from '../components/Texto';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';
import { AuthScreenProps } from '../navigation/types';

// Provisória: a validação com Yup e o login na API Java chegam na Etapa 5.
const LoginScreen = ({ navigation }: AuthScreenProps<'Login'>) => {
  const { entrar } = useAuth();
  const { tema } = useTema();
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

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
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <CampoTexto
              rotulo="Senha"
              placeholder="Sua senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoComplete="password"
            />
            <Botao titulo="Entrar" icone="login" onPress={() => entrar('token-de-teste')} />
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
