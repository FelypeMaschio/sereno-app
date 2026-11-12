import Botao from '../components/Botao';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { AppScreenProps } from '../navigation/types';

// Provisória: equipamentos e "quais meus direitos?" chegam nas Etapas 7 e 9.
const DetalheEstacaoScreen = ({ navigation, route }: AppScreenProps<'DetalheEstacao'>) => {
  const { estacaoId } = route.params;

  return (
    <Tela>
      <Texto secundario>Detalhe da estação {estacaoId}.</Texto>
      <Botao
        titulo="Reportar status de um equipamento"
        icone="elevator-passenger-outline"
        onPress={() => navigation.navigate('FormReporte', { equipamentoId: 1 })}
      />
    </Tela>
  );
};

export default DetalheEstacaoScreen;
