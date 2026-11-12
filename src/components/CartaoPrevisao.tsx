import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { horasDisponiveis, usePrevisaoControl } from '../control/usePrevisaoControl';
import { calmaPrevista, DiaSemana, diasSemana, diasSemanaExtenso, faixas } from '../model/ia';
import { formatarHora, formatarNota } from '../utils/formatacao';
import Cartao from './Cartao';
import Chip from './Chip';
import Selo from './Selo';
import Texto from './Texto';

interface CartaoPrevisaoProps {
  localId: number;
}

/**
 * "Quando ir": previsão do serviço de IA para o dia e a hora escolhidos.
 * Responde à pergunta "como VAI estar". O cartão do insight responde "como É".
 */
const CartaoPrevisao = ({ localId }: CartaoPrevisaoProps) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const controle = usePrevisaoControl(localId);
  const { previsao } = controle;

  // Serviço de IA fora do ar: o cartão some e o resto da tela continua funcionando.
  if (controle.indisponivel) return null;

  const faixa = previsao ? faixas[previsao.faixa] : null;
  const corFaixa = faixa
    ? { sucesso: cores.sucesso, alerta: cores.alerta, perigo: cores.perigo }[faixa.tom]
    : cores.texto;

  return (
    <Cartao style={{ gap: espacamento.md }}>
      <View style={[estilos.linha, { gap: espacamento.sm }]}>
        <MaterialCommunityIcons name="calendar-clock" size={24} color={cores.primaria} />
        <Texto variante="subtitulo" style={estilos.flex}>
          Quando ir?
        </Texto>
        <Selo texto="Previsão por IA" icone="creation" tom="primaria" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: espacamento.sm }}
      >
        {diasSemana.map((rotulo, indice) => (
          <Chip
            key={rotulo}
            rotulo={rotulo}
            rotuloAcessivel={diasSemanaExtenso[indice]}
            selecionado={controle.dia === indice}
            onPress={() => controle.setDia(indice as DiaSemana)}
          />
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: espacamento.sm }}
      >
        {horasDisponiveis.map((hora) => (
          <Chip
            key={hora}
            rotulo={formatarHora(hora)}
            rotuloAcessivel={`${hora} horas`}
            selecionado={controle.hora === hora}
            onPress={() => controle.setHora(hora)}
          />
        ))}
      </ScrollView>

      <Texto negrito accessibilityLiveRegion="polite">
        {diasSemanaExtenso[controle.dia]}, {formatarHora(controle.hora)}
      </Texto>

      {controle.carregando || !previsao || !faixa ? (
        <View style={[estilos.linha, { gap: espacamento.sm }]}>
          <ActivityIndicator color={cores.primaria} />
          <Texto secundario>Calculando a previsão…</Texto>
        </View>
      ) : (
        <View style={{ gap: espacamento.sm }} accessibilityLiveRegion="polite">
          <View style={[estilos.linha, { gap: espacamento.md }]}>
            <Selo
              texto={faixa.rotulo}
              icone={
                faixa.tom === 'sucesso' ? 'leaf' : faixa.tom === 'alerta' ? 'waves' : 'volume-high'
              }
              tom={faixa.tom}
            />
            {/* Mesma escala do índice de calma (0 a 10, maior = mais calmo). */}
            <Texto negrito cor={corFaixa}>
              Calma prevista: {formatarNota(calmaPrevista(previsao.nivelPrevisto))}/10
            </Texto>
          </View>
          <Texto>{previsao.explicacao}</Texto>

          {previsao.alertas.map((alerta) => (
            <View key={alerta} style={[estilos.linha, { gap: espacamento.sm }]}>
              <MaterialCommunityIcons name="alert-outline" size={18} color={cores.alerta} />
              <Texto variante="legenda" style={estilos.flex}>
                <Texto variante="legenda" negrito>
                  Previsto:{' '}
                </Texto>
                {alerta}
              </Texto>
            </View>
          ))}

          {previsao.melhorHorario === null ? (
            <Texto secundario>Este lugar costuma estar fechado neste dia.</Texto>
          ) : previsao.melhorHorario !== controle.hora ? (
            // Tocar no melhor horário leva o seletor até ele: a previsão muda na hora.
            <Pressable
              onPress={() => controle.setHora(previsao.melhorHorario as number)}
              accessibilityRole="button"
              accessibilityLabel={`Melhor horário neste dia: ${previsao.melhorHorario} horas. Toque para ver a previsão desse horário.`}
              style={[
                estilos.melhor,
                {
                  backgroundColor: cores.sucessoSuave,
                  borderRadius: tema.raios.medio,
                  padding: espacamento.md,
                  gap: espacamento.sm,
                },
              ]}
            >
              <MaterialCommunityIcons name="clock-check-outline" size={22} color={cores.sucesso} />
              <Texto negrito cor={cores.sucesso} style={estilos.flex}>
                Melhor horário neste dia: {formatarHora(previsao.melhorHorario)}
              </Texto>
              <MaterialCommunityIcons name="chevron-right" size={22} color={cores.sucesso} />
            </Pressable>
          ) : (
            <Selo texto="Este é o horário mais calmo do dia" icone="check" tom="sucesso" />
          )}

          {previsao.geradoPor === 'regra' && (
            <Texto variante="legenda" secundario>
              Estimativa automática pelos padrões de lugares parecidos.
            </Texto>
          )}
        </View>
      )}
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
  melhor: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
});

export default CartaoPrevisao;
