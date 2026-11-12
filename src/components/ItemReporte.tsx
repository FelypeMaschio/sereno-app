import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { Equipamento, Reporte, tiposEquipamento } from '../model/estacao';
import { formatarData } from '../utils/formatacao';
import Botao from './Botao';
import Cartao from './Cartao';
import StatusEquipamentoSelo from './StatusEquipamentoSelo';
import Texto from './Texto';

interface ItemReporteProps {
  reporte: Reporte;
  equipamento?: Equipamento;
  onEditar: () => void;
  onExcluir: () => void;
  excluindo?: boolean;
}

const ItemReporte = ({
  reporte,
  equipamento,
  onEditar,
  onExcluir,
  excluindo,
}: ItemReporteProps) => {
  const { tema } = useTema();
  const tipo = equipamento ? tiposEquipamento[equipamento.tipo] : null;

  return (
    <Cartao>
      <View style={[estilos.linha, { gap: tema.espacamento.md }]}>
        <MaterialCommunityIcons
          name={tipo?.icone ?? 'elevator-passenger-outline'}
          size={28}
          color={tema.cores.info}
        />
        <View style={estilos.flex}>
          <Texto negrito numberOfLines={1}>
            {tipo?.rotulo ?? `Equipamento #${reporte.equipamentoId}`}
          </Texto>
          <Texto variante="legenda" secundario numberOfLines={2}>
            {[equipamento?.localizacao, formatarData(reporte.criadoEm)].filter(Boolean).join(' · ')}
          </Texto>
        </View>
        <StatusEquipamentoSelo status={reporte.status} />
      </View>
      {reporte.observacao ? <Texto>“{reporte.observacao}”</Texto> : null}
      <View style={[estilos.linha, { gap: tema.espacamento.sm }]}>
        <View style={estilos.flex}>
          <Botao titulo="Editar" icone="pencil-outline" variante="secundario" onPress={onEditar} />
        </View>
        <View style={estilos.flex}>
          <Botao
            titulo="Excluir"
            icone="trash-can-outline"
            variante="perigo"
            carregando={excluindo}
            onPress={onExcluir}
          />
        </View>
      </View>
    </Cartao>
  );
};

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});

export default ItemReporte;
