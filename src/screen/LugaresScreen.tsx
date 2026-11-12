import Botao from '../components/Botao';
import CabecalhoSecao from '../components/CabecalhoSecao';
import EmConstrucao from '../components/EmConstrucao';
import Tela from '../components/Tela';
import { TabScreenProps } from '../navigation/types';

// Provisória: a lista real (API Java) chega na Etapa 6.
const LugaresScreen = ({ navigation }: TabScreenProps<'Lugares'>) => (
  <Tela>
    <CabecalhoSecao
      icone="ear-hearing"
      titulo="Calmaria"
      descricao="Descubra quais lugares são mais tranquilos e em que horário."
    />
    <EmConstrucao texto="A lista de lugares com o índice de calma chega na próxima etapa." />
    <Botao
      titulo="Abrir um lugar de exemplo"
      icone="map-marker-outline"
      variante="secundario"
      onPress={() => navigation.navigate('DetalheLugar', { localId: 2 })}
    />
  </Tela>
);

export default LugaresScreen;
