import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { AppScreenProps } from '../navigation/types';

// Provisória: o formulário de reporte (com Idempotency-Key) chega na Etapa 7.
const FormReporteScreen = ({ route }: AppScreenProps<'FormReporte'>) => {
  const { equipamentoId, reporteId } = route.params;

  return (
    <Tela>
      <Texto secundario>
        {reporteId ? `Editar reporte ${reporteId}` : 'Novo reporte'} do equipamento {equipamentoId}.
      </Texto>
    </Tela>
  );
};

export default FormReporteScreen;
