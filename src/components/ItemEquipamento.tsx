import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { Equipamento, statusEquipamento, tiposEquipamento } from '../model/estacao';
import Botao from './Botao';
import Cartao from './Cartao';
import Frescor from './Frescor';
import StatusEquipamentoSelo from './StatusEquipamentoSelo';
import Texto from './Texto';

interface ItemEquipamentoProps {
  equipamento: Equipamento;
  onReportar: () => void;
}

const ItemEquipamento = ({ equipamento, onReportar }: ItemEquipamentoProps) => {
  const { tema } = useTema();
  const tipo = tiposEquipamento[equipamento.tipo];
  const status = statusEquipamento[equipamento.statusAtual];

  return (
    <Cartao>
      <View
        accessible
        accessibilityLabel={`${tipo.rotulo}${equipamento.localizacao ? `, ${equipamento.localizacao}` : ''}: ${status.rotulo}`}
        style={[estilos.linha, { gap: tema.espacamento.md }]}
      >
        <MaterialCommunityIcons name={tipo.icone} size={28} color={tema.cores.info} />
        <View style={estilos.textos}>
          <Texto negrito>{tipo.rotulo}</Texto>
          {equipamento.localizacao ? (
            <Texto variante="legenda" secundario>
              {equipamento.localizacao}
            </Texto>
          ) : null}
        </View>
        <StatusEquipamentoSelo status={equipamento.statusAtual} />
      </View>
      <Frescor atualizadoEm={equipamento.atualizadoEm} />
      <Botao
        titulo="Reportar status"
        icone="bullhorn-outline"
        variante="secundario"
        dica={`Informe se o ${tipo.rotulo.toLowerCase()} está funcionando`}
        onPress={onReportar}
      />
    </Cartao>
  );
};

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textos: {
    flex: 1,
    gap: 2,
  },
});

export default ItemEquipamento;
