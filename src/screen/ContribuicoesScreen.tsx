import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { TabScreenProps } from '../navigation/types';

// Provisória: as listas de avaliações e reportes do usuário chegam na Etapa 8.
const ContribuicoesScreen = (_props: TabScreenProps<'Contribuicoes'>) => (
  <Tela>
    <Texto secundario>Aqui ficarão suas avaliações e seus reportes.</Texto>
  </Tela>
);

export default ContribuicoesScreen;
