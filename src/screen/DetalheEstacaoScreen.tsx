import Botao from '../components/Botao';
import CabecalhoSecao from '../components/CabecalhoSecao';
import EmConstrucao from '../components/EmConstrucao';
import Tela from '../components/Tela';
import { useTema } from '../context/TemaContext';
import { AppScreenProps } from '../navigation/types';

// Provisória: equipamentos e "quais meus direitos?" chegam nas Etapas 7 e 9.
const DetalheEstacaoScreen = ({ navigation, route }: AppScreenProps<'DetalheEstacao'>) => {
  const { estacaoId } = route.params;
  const { tema } = useTema();

  return (
    <Tela>
      <CabecalhoSecao
        icone="subway-variant"
        titulo={`Estação #${estacaoId}`}
        cor={tema.cores.info}
        corFundoIcone={tema.cores.infoSuave}
      />
      <EmConstrucao texto="A lista de equipamentos e o botão de direitos chegam em breve." />
      <Botao
        titulo="Reportar status de um equipamento"
        icone="bullhorn-outline"
        onPress={() => navigation.navigate('FormReporte', { equipamentoId: 1 })}
      />
    </Tela>
  );
};

export default DetalheEstacaoScreen;
