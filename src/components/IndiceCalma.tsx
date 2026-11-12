import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { formatarNota } from '../utils/formatacao';
import Texto from './Texto';

type NivelCalma = { rotulo: string; icone: keyof typeof MaterialCommunityIcons.glyphMap };

/** Faixas do índice (0 a 10, maior = mais calmo). */
export const nivelDaCalma = (indice: number | null | undefined): NivelCalma & { tom: string } => {
  if (indice == null)
    return { rotulo: 'Sem avaliações', icone: 'help-circle-outline', tom: 'neutro' };
  if (indice >= 7) return { rotulo: 'Calmo', icone: 'leaf', tom: 'sucesso' };
  if (indice >= 4) return { rotulo: 'Moderado', icone: 'waves', tom: 'alerta' };
  return { rotulo: 'Agitado', icone: 'volume-high', tom: 'perigo' };
};

interface IndiceCalmaProps {
  indice: number | null | undefined;
  /** "grande" para o detalhe; "compacto" para itens de lista. */
  tamanho?: 'compacto' | 'grande';
  totalAvaliacoes?: number;
}

/**
 * Índice de calma com número + rótulo + ícone + cor.
 * O leitor de tela ouve a frase inteira: "Índice de calma 7,8 de 10, calmo".
 */
const IndiceCalma = ({ indice, tamanho = 'compacto', totalAvaliacoes }: IndiceCalmaProps) => {
  const { tema } = useTema();
  const { cores } = tema;
  const nivel = nivelDaCalma(indice);
  const corPorTom: Record<string, [string, string]> = {
    sucesso: [cores.sucesso, cores.sucessoSuave],
    alerta: [cores.alerta, cores.alertaSuave],
    perigo: [cores.perigo, cores.perigoSuave],
    neutro: [cores.textoSecundario, cores.superficieAlternativa],
  };
  const [frente, fundo] = corPorTom[nivel.tom];
  const grande = tamanho === 'grande';
  const textoAcessivel =
    indice == null
      ? 'Ainda sem avaliações'
      : `Índice de calma ${formatarNota(indice)} de 10, ${nivel.rotulo.toLowerCase()}`;

  return (
    <View
      accessible
      accessibilityLabel={textoAcessivel}
      style={[
        grande ? estilos.grande : estilos.compacto,
        { backgroundColor: fundo, borderRadius: tema.raios.medio },
      ]}
    >
      <View style={estilos.linha}>
        <MaterialCommunityIcons name={nivel.icone} size={grande ? 28 : 18} color={frente} />
        {indice != null && (
          <Texto variante={grande ? 'titulo' : 'corpo'} negrito cor={frente}>
            {formatarNota(indice)}
            <Texto variante="legenda" cor={frente}>
              /10
            </Texto>
          </Texto>
        )}
      </View>
      <Texto variante="legenda" negrito cor={frente}>
        {nivel.rotulo}
      </Texto>
      {grande && totalAvaliacoes != null && (
        <Texto variante="legenda" cor={frente}>
          {totalAvaliacoes === 1 ? '1 avaliação' : `${totalAvaliacoes} avaliações`}
        </Texto>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  compacto: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 76,
  },
  grande: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 112,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default IndiceCalma;
