import Botao from '../components/Botao';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { TabScreenProps } from '../navigation/types';

// Provisória: a lista real (API .NET) chega na Etapa 7.
const EstacoesScreen = ({ navigation }: TabScreenProps<'Estacoes'>) => (
  <Tela>
    <Texto secundario>Aqui ficará a lista de estações com o status dos equipamentos.</Texto>
    <Botao
      titulo="Abrir uma estação de exemplo"
      onPress={() => navigation.navigate('DetalheEstacao', { estacaoId: 1 })}
    />
  </Tela>
);

export default EstacoesScreen;
