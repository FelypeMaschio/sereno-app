import CabecalhoSecao from '../components/CabecalhoSecao';
import EmConstrucao from '../components/EmConstrucao';
import Tela from '../components/Tela';
import { useTema } from '../context/TemaContext';
import { TabScreenProps } from '../navigation/types';

// Provisória: as listas de avaliações e reportes do usuário chegam na Etapa 8.
const ContribuicoesScreen = (_props: TabScreenProps<'Contribuicoes'>) => {
  const { tema } = useTema();

  return (
    <Tela>
      <CabecalhoSecao
        icone="hand-heart-outline"
        titulo="Suas contribuições"
        descricao="Cada avaliação e cada reporte ajudam alguém a sair de casa com mais segurança."
        cor={tema.cores.destaque}
        corFundoIcone={tema.cores.alertaSuave}
      />
      <EmConstrucao texto="Aqui você poderá editar e excluir suas avaliações e seus reportes." />
    </Tela>
  );
};

export default ContribuicoesScreen;
