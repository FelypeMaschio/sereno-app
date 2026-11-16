import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { EstacaoNoCaminho, RAIO_ESTACAO_UTIL_KM } from '../control/useInicioControl';
import { Equipamento, tiposEquipamento } from '../model/estacao';
import { formatarDistancia } from '../utils/distancia';
import Cartao from './Cartao';
import { resumoEstacao } from './ItemEstacao';
import Selo from './Selo';
import StatusEquipamentoSelo from './StatusEquipamentoSelo';
import Texto from './Texto';

interface CartaoEstacaoCaminhoProps {
  /** "Embarque" ou "Desembarque". */
  papel: string;
  /** Ex.: "de você" ou "do destino". */
  referencia: string;
  noCaminho: EstacaoNoCaminho;
  /** null enquanto o detalhe da estação carrega. */
  equipamentos: Equipamento[] | null;
  onPress: () => void;
}

/**
 * Uma estação do trajeto com TODOS os equipamentos e o status de cada um, para a
 * pessoa saber antes de sair se vai conseguir subir e descer.
 */
const CartaoEstacaoCaminho = ({
  papel,
  referencia,
  noCaminho,
  equipamentos,
  onPress,
}: CartaoEstacaoCaminhoProps) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const { estacao, distanciaKm } = noCaminho;
  const resumo = resumoEstacao(estacao.equipamentosParados);
  const longe = distanciaKm > RAIO_ESTACAO_UTIL_KM;

  return (
    <Cartao
      onPress={onPress}
      rotuloAcessivel={`${papel}: estação ${estacao.nome}, a ${formatarDistancia(distanciaKm)} ${referencia}. ${resumo.texto}. Toque para ver detalhes e reportar.`}
    >
      <View style={{ gap: espacamento.sm }}>
        <Texto variante="legenda" negrito cor={cores.primaria}>
          {papel.toUpperCase()}
        </Texto>
        <View style={[estilos.linha, { gap: espacamento.md }]}>
          <View style={[estilos.icone, { backgroundColor: cores.infoSuave }]}>
            <MaterialCommunityIcons name="subway-variant" size={24} color={cores.info} />
          </View>
          <View style={estilos.flex}>
            <Texto negrito>{estacao.nome}</Texto>
            <Texto variante="legenda" secundario>
              {estacao.linha ? `Linha ${estacao.linha} · ` : ''}
              {formatarDistancia(distanciaKm)} {referencia}
            </Texto>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={cores.textoSecundario} />
        </View>

        {longe && (
          <View style={[estilos.linha, { gap: espacamento.xs }]}>
            <MaterialCommunityIcons name="information-outline" size={18} color={cores.alerta} />
            <Texto variante="legenda" cor={cores.alerta} style={estilos.flex}>
              É a estação cadastrada mais próxima, mas fica longe. O Sereno ainda não tem estações
              nessa região.
            </Texto>
          </View>
        )}

        <Selo texto={resumo.texto} icone={resumo.icone} tom={resumo.tom} />

        {equipamentos === null ? (
          <ActivityIndicator color={cores.primaria} />
        ) : equipamentos.length === 0 ? (
          <Texto variante="legenda" secundario>
            Nenhum elevador ou escada cadastrado nesta estação.
          </Texto>
        ) : (
          equipamentos.map((equipamento) => {
            const tipo = tiposEquipamento[equipamento.tipo];
            return (
              <View key={equipamento.id} style={[estilos.linha, { gap: espacamento.sm }]}>
                <MaterialCommunityIcons name={tipo.icone} size={20} color={cores.info} />
                <Texto variante="legenda" style={estilos.flex} numberOfLines={2}>
                  {tipo.rotulo}
                  {equipamento.localizacao ? ` · ${equipamento.localizacao}` : ''}
                </Texto>
                <StatusEquipamentoSelo status={equipamento.statusAtual} />
              </View>
            );
          })
        )}
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
  icone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CartaoEstacaoCaminho;
