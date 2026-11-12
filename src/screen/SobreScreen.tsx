import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { AppScreenProps } from '../navigation/types';

// Provisória: versão e hash do commit chegam na Etapa 12.
const SobreScreen = (_props: AppScreenProps<'Sobre'>) => (
  <Tela>
    <Texto variante="subtitulo">Sereno</Texto>
    <Texto secundario>Acessibilidade urbana, física e sensorial.</Texto>
  </Tela>
);

export default SobreScreen;
