import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { TabScreenProps } from '../navigation/types';

// Provisória: a tela "Pronto para ir?" chega na Etapa 10.
const InicioScreen = (_props: TabScreenProps<'Inicio'>) => (
  <Tela>
    <Texto variante="titulo">Pronto para ir?</Texto>
    <Texto secundario>
      Escolha um lugar e veja se o caminho e o destino são tranquilos para você.
    </Texto>
  </Tela>
);

export default InicioScreen;
