import Botao from '../components/Botao';
import CabecalhoSecao from '../components/CabecalhoSecao';
import EmConstrucao from '../components/EmConstrucao';
import Tela from '../components/Tela';
import { AppScreenProps } from '../navigation/types';

// Provisória: detalhe, avaliações, insight e previsão chegam nas Etapas 6 e 9.
const DetalheLugarScreen = ({ navigation, route }: AppScreenProps<'DetalheLugar'>) => {
  const { localId } = route.params;

  return (
    <Tela>
      <CabecalhoSecao icone="map-marker-outline" titulo={`Lugar #${localId}`} />
      <EmConstrucao texto="Índice de calma, previsão por horário e avaliações chegam em breve." />
      <Botao
        titulo="Avaliar este lugar"
        icone="star-outline"
        onPress={() => navigation.navigate('FormAvaliacao', { localId })}
      />
    </Tela>
  );
};

export default DetalheLugarScreen;
