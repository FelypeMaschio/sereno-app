import { StatusEquipamento, statusEquipamento } from '../model/estacao';
import Selo from './Selo';

/** Status do equipamento com ícone + texto + cor. */
const StatusEquipamentoSelo = ({ status }: { status: StatusEquipamento }) => {
  const info = statusEquipamento[status];
  return <Selo texto={info.rotulo} icone={info.icone} tom={info.tom} />;
};

export default StatusEquipamentoSelo;
