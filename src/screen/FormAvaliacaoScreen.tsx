import CabecalhoSecao from '../components/CabecalhoSecao';
import EmConstrucao from '../components/EmConstrucao';
import Tela from '../components/Tela';
import { AppScreenProps } from '../navigation/types';

// Provisória: o formulário de avaliação sensorial chega na Etapa 6.
const FormAvaliacaoScreen = ({ route }: AppScreenProps<'FormAvaliacao'>) => {
  const { localId, avaliacaoId } = route.params;

  return (
    <Tela>
      <CabecalhoSecao
        icone="star-outline"
        titulo={avaliacaoId ? 'Editar avaliação' : 'Como foi lá?'}
        descricao={`Lugar #${localId}: conte como estavam o ruído, a luz e a lotação.`}
      />
      <EmConstrucao texto="O formulário de avaliação sensorial chega na próxima etapa." />
    </Tela>
  );
};

export default FormAvaliacaoScreen;
