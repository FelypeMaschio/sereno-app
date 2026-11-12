import Botao from '../components/Botao';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { TabScreenProps } from '../navigation/types';

// Provisória: a lista real (API Java) chega na Etapa 6.
const LugaresScreen = ({ navigation }: TabScreenProps<'Lugares'>) => (
  <Tela>
    <Texto secundario>Aqui ficará a lista de lugares com o índice de calma.</Texto>
    <Botao
      titulo="Abrir um lugar de exemplo"
      onPress={() => navigation.navigate('DetalheLugar', { localId: 2 })}
    />
  </Tela>
);

export default LugaresScreen;
