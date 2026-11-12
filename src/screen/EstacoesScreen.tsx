import Botao from '../components/Botao';
import CabecalhoSecao from '../components/CabecalhoSecao';
import EmConstrucao from '../components/EmConstrucao';
import Tela from '../components/Tela';
import { useTema } from '../context/TemaContext';
import { TabScreenProps } from '../navigation/types';

// Provisória: a lista real (API .NET) chega na Etapa 7.
const EstacoesScreen = ({ navigation }: TabScreenProps<'Estacoes'>) => {
  const { tema } = useTema();

  return (
    <Tela>
      <CabecalhoSecao
        icone="elevator-passenger-outline"
        titulo="Elevador Funciona?"
        descricao="Veja o status de elevadores, escadas rolantes e rampas antes de sair."
        cor={tema.cores.info}
        corFundoIcone={tema.cores.infoSuave}
      />
      <EmConstrucao texto="A lista de estações com o status dos equipamentos chega em breve." />
      <Botao
        titulo="Abrir uma estação de exemplo"
        icone="subway-variant"
        variante="secundario"
        onPress={() => navigation.navigate('DetalheEstacao', { estacaoId: 1 })}
      />
    </Tela>
  );
};

export default EstacoesScreen;
