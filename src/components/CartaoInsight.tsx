import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTema } from '../context/TemaContext';
import { chaves } from '../control/chaves';
import { periodos, rotuloPeriodo } from '../model/local';
import { buscarInsight } from '../repository/remote/locaisRepository';
import { formatarData, formatarNota } from '../utils/formatacao';
import Cartao from './Cartao';
import Selo from './Selo';
import Texto from './Texto';

/**
 * "O que as pessoas contam": resumo das avaliações gerado pela IA da API Java
 * (Spring AI). Responde "como É o lugar", com base no que foi relatado.
 */
const CartaoInsight = ({ localId }: { localId: number }) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const consulta = useQuery({
    queryKey: chaves.insight(localId),
    queryFn: () => buscarInsight(localId),
    retry: false,
    staleTime: 5 * 60_000,
  });
  const insight = consulta.data;

  // Sem avaliações ou IA indisponível: o cartão não aparece (nunca quebra a tela).
  if (consulta.isError || consulta.isPending || !insight || insight.totalAvaliacoes === 0) {
    return null;
  }

  return (
    <Cartao style={{ gap: espacamento.md }}>
      <View style={[estilos.linha, { gap: espacamento.sm }]}>
        <MaterialCommunityIcons name="comment-quote-outline" size={24} color={cores.primaria} />
        <Texto variante="subtitulo" style={estilos.flex}>
          O que as pessoas contam
        </Texto>
      </View>
      <Texto>{insight.resumo}</Texto>

      {insight.indicePorPeriodo.length > 0 && (
        <View style={{ gap: espacamento.sm }}>
          <Texto negrito>Calma por período</Texto>
          {insight.indicePorPeriodo.map(({ periodo, indiceCalma, totalAvaliacoes }) => (
            <View
              key={periodo}
              style={[estilos.linha, { gap: espacamento.sm }]}
              accessible
              accessibilityLabel={`${rotuloPeriodo(periodo)}: ${indiceCalma != null ? `calma ${formatarNota(indiceCalma)} de 10` : 'sem avaliações'}`}
            >
              <MaterialCommunityIcons
                name={periodos[periodo]?.icone ?? 'clock-outline'}
                size={18}
                color={cores.textoSecundario}
              />
              <Texto variante="legenda" style={estilos.rotulo}>
                {rotuloPeriodo(periodo)}
              </Texto>
              {/* Barra proporcional ao índice (0 a 10). */}
              <View style={[estilos.trilho, { backgroundColor: cores.superficieAlternativa }]}>
                <View
                  style={[
                    estilos.barra,
                    {
                      width: `${Math.min((indiceCalma ?? 0) * 10, 100)}%`,
                      backgroundColor: cores.primaria,
                    },
                  ]}
                />
              </View>
              <Texto variante="legenda" negrito style={estilos.valor}>
                {indiceCalma != null && totalAvaliacoes > 0 ? formatarNota(indiceCalma) : '—'}
              </Texto>
            </View>
          ))}
        </View>
      )}

      {insight.melhorPeriodo ? (
        <Selo
          texto={`Mais calmo: ${rotuloPeriodo(insight.melhorPeriodo).toLowerCase()}`}
          icone="clock-check-outline"
          tom="sucesso"
        />
      ) : null}

      {insight.pontosDeAtencao.map((ponto) => (
        <View key={ponto} style={[estilos.linha, { gap: espacamento.sm }]}>
          <MaterialCommunityIcons name="alert-outline" size={18} color={cores.alerta} />
          <Texto variante="legenda" style={estilos.flex}>
            <Texto variante="legenda" negrito>
              Relatado:{' '}
            </Texto>
            {ponto}
          </Texto>
        </View>
      ))}
      {insight.dicas.map((dica) => (
        <View key={dica} style={[estilos.linha, { gap: espacamento.sm }]}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={cores.primaria} />
          <Texto variante="legenda" style={estilos.flex}>
            {dica}
          </Texto>
        </View>
      ))}
      {insight.perfilRecomendado ? (
        <Texto variante="legenda" secundario>
          Indicado para: {insight.perfilRecomendado}
        </Texto>
      ) : null}
      <Texto variante="legenda" secundario>
        Baseado em {insight.totalAvaliacoes}{' '}
        {insight.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
        {insight.geradoEm ? ` · gerado em ${formatarData(insight.geradoEm)}` : ''}
      </Texto>
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
  rotulo: {
    width: 52,
  },
  trilho: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barra: {
    height: '100%',
    borderRadius: 5,
  },
  valor: {
    width: 32,
    textAlign: 'right',
  },
});

export default CartaoInsight;
