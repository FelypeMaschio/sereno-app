import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { AppScreenProps } from '../navigation/types';

// Provisória: o formulário de avaliação sensorial chega na Etapa 6.
const FormAvaliacaoScreen = ({ route }: AppScreenProps<'FormAvaliacao'>) => {
  const { localId, avaliacaoId } = route.params;

  return (
    <Tela>
      <Texto secundario>
        {avaliacaoId ? `Editar avaliação ${avaliacaoId}` : 'Nova avaliação'} do lugar {localId}.
      </Texto>
    </Tela>
  );
};

export default FormAvaliacaoScreen;
