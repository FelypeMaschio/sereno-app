import Botao from '../components/Botao';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useAuth } from '../context/AuthContext';
import { AuthScreenProps } from '../navigation/types';

// Provisória: o formulário real (com validação e API) chega na Etapa 5.
const LoginScreen = ({ navigation }: AuthScreenProps<'Login'>) => {
  const { entrar } = useAuth();

  return (
    <Tela bordas={['top', 'left', 'right', 'bottom']}>
      <Texto variante="titulo">Sereno</Texto>
      <Texto secundario>
        Saiba antes de sair se o caminho e o destino são acessíveis para você.
      </Texto>
      <Botao titulo="Entrar (teste)" icone="login" onPress={() => entrar('token-de-teste')} />
      <Botao
        titulo="Criar conta"
        variante="secundario"
        onPress={() => navigation.navigate('Cadastro')}
      />
    </Tela>
  );
};

export default LoginScreen;
