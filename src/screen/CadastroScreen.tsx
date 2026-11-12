import Botao from '../components/Botao';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { AuthScreenProps } from '../navigation/types';

// Provisória: o formulário de cadastro chega na Etapa 5.
const CadastroScreen = ({ navigation }: AuthScreenProps<'Cadastro'>) => (
  <Tela>
    <Texto secundario>Aqui ficará o formulário de cadastro.</Texto>
    <Botao titulo="Já tenho conta" variante="secundario" onPress={() => navigation.goBack()} />
  </Tela>
);

export default CadastroScreen;
