import CabecalhoSecao from '../components/CabecalhoSecao';
import EmConstrucao from '../components/EmConstrucao';
import Tela from '../components/Tela';
import { useTema } from '../context/TemaContext';
import { AppScreenProps } from '../navigation/types';

// Provisória: o formulário de reporte (com Idempotency-Key) chega na Etapa 7.
const FormReporteScreen = ({ route }: AppScreenProps<'FormReporte'>) => {
  const { equipamentoId, reporteId } = route.params;
  const { tema } = useTema();

  return (
    <Tela>
      <CabecalhoSecao
        icone="bullhorn-outline"
        titulo={reporteId ? 'Editar reporte' : 'Como está o equipamento?'}
        descricao={`Equipamento #${equipamentoId}: funcionando, parado ou em manutenção.`}
        cor={tema.cores.info}
        corFundoIcone={tema.cores.infoSuave}
      />
      <EmConstrucao texto="O formulário de reporte chega em breve." />
    </Tela>
  );
};

export default FormReporteScreen;
