import Botao from '../components/Botao';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { AppScreenProps } from '../navigation/types';

// Provisória: detalhe, avaliações, insight e previsão chegam nas Etapas 6 e 9.
const DetalheLugarScreen = ({ navigation, route }: AppScreenProps<'DetalheLugar'>) => {
  const { localId } = route.params;

  return (
    <Tela>
      <Texto secundario>Detalhe do lugar {localId}.</Texto>
      <Botao
        titulo="Avaliar este lugar"
        icone="star-outline"
        onPress={() => navigation.navigate('FormAvaliacao', { localId })}
      />
    </Tela>
  );
};

export default DetalheLugarScreen;
