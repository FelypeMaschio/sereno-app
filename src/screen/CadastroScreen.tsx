import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Cartao from '../components/Cartao';
import HeroMarca from '../components/HeroMarca';
import MensagemErro from '../components/MensagemErro';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useCadastroControl } from '../control/useCadastroControl';
import { AuthScreenProps } from '../navigation/types';

const CadastroScreen = ({ navigation }: AuthScreenProps<'Cadastro'>) => {
  const { tema } = useTema();
  const { form, erros, alterar, enviar, enviando, erroGeral } = useCadastroControl();

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
              value={form.nome}
              onChangeText={(valor) => alterar('nome', valor)}
              erro={erros.nome}
              autoComplete="name"
            />
            <CampoTexto
              rotulo="E-mail"
              placeholder="voce@exemplo.com"
              value={form.email}
              onChangeText={(valor) => alterar('email', valor)}
              erro={erros.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <CampoTexto
              rotulo="Senha"
              placeholder="8 caracteres ou mais, com letras e números"
              value={form.senha}
              onChangeText={(valor) => alterar('senha', valor)}
              erro={erros.senha}
              secureTextEntry
              autoComplete="new-password"
            />
            <CampoTexto
              rotulo="Confirmar senha"
              placeholder="Repita a senha"
              value={form.confirmacao}
              onChangeText={(valor) => alterar('confirmacao', valor)}
              erro={erros.confirmacao}
              secureTextEntry
              autoComplete="new-password"
            />
            {erroGeral && Object.keys(erros).length === 0 && <MensagemErro mensagem={erroGeral} />}
            <Botao
              titulo="Criar conta"
              icone="account-plus-outline"
              carregando={enviando}
              onPress={enviar}
            />
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
