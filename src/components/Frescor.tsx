import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { horasDesde, tempoRelativo } from '../utils/formatacao';
import Texto from './Texto';

/**
 * "Frescor" da informação colaborativa. Um status confirmado há 10 minutos merece
 * mais confiança do que um de 3 dias atrás, e a pessoa precisa saber a diferença
 * antes de sair de casa contando com o elevador.
 *
 * - até 2 h: "confirmado há X" (destaque)
 * - até 24 h: "atualizado há X"
 * - mais de 24 h: "sem confirmação recente" (aviso de que pode estar desatualizado)
 */
const Frescor = ({ atualizadoEm }: { atualizadoEm?: string | null }) => {
  const { tema } = useTema();
  const { cores } = tema;
  if (!atualizadoEm) return null;

  const horas = horasDesde(atualizadoEm);
  const relativo = tempoRelativo(atualizadoEm);
  const recente = horas <= 2;
  const antigo = horas > 24;

  const texto = recente
    ? `Confirmado ${relativo}`
    : antigo
      ? `Sem confirmação recente (${relativo}). Pode estar desatualizado.`
      : `Atualizado ${relativo}`;

  return (
    <View style={[estilos.linha, { gap: tema.espacamento.xs }]}>
      <MaterialCommunityIcons
        name={recente ? 'clock-check-outline' : antigo ? 'clock-alert-outline' : 'clock-outline'}
        size={16}
        color={recente ? cores.sucesso : cores.textoSecundario}
      />
      <Texto
        variante="legenda"
        negrito={recente}
        cor={recente ? cores.sucesso : cores.textoSecundario}
        style={estilos.texto}
      >
        {texto}
      </Texto>
    </View>
  );
};

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texto: {
    flex: 1,
  },
});

export default Frescor;
