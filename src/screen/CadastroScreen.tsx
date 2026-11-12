import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Cartao from '../components/Cartao';
import HeroMarca from '../components/HeroMarca';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { AuthScreenProps } from '../navigation/types';

// Provisória: a validação com Yup e o cadastro na API Java chegam na Etapa 5.
const CadastroScreen = ({ navigation }: AuthScreenProps<'Cadastro'>) => {
  const { tema } = useTema();
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [confirmacao, setConfirmacao] = useState<string>('');

  return (
    <KeyboardAvoidingView
      style={[estilos.flex, { backgroundColor: tema.cores.fundo }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={estilos.rolagem}>
        <HeroMarca
          compacto
          titulo="Criar conta"
          subtitulo="Avalie lugares e reporte equipamentos para ajudar outras pessoas."
        />
        <View style={[estilos.corpo, { paddingHorizontal: tema.espacamento.lg }]}>
          <Cartao style={{ gap: tema.espacamento.md, padding: tema.espacamento.lg }}>
            <CampoTexto
              rotulo="Nome"
              placeholder="Como quer ser chamado(a)"
              value={nome}
              onChangeText={setNome}
              autoComplete="name"
            />
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
              placeholder="Pelo menos 6 caracteres"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoComplete="new-password"
            />
            <CampoTexto
              rotulo="Confirmar senha"
              placeholder="Repita a senha"
              value={confirmacao}
              onChangeText={setConfirmacao}
              secureTextEntry
              autoComplete="new-password"
            />
            <Botao titulo="Criar conta" icone="account-plus-outline" onPress={() => {}} />
          </Cartao>

          <View style={{ gap: tema.espacamento.sm }}>
            <Texto secundario>Já tem conta?</Texto>
            <Botao
              titulo="Voltar para o login"
              variante="secundario"
              onPress={() => navigation.goBack()}
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
    marginTop: -36,
    paddingBottom: 32,
    gap: 24,
  },
});

export default CadastroScreen;
