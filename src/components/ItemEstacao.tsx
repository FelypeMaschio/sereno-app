import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { Estacao } from '../model/estacao';
import Cartao from './Cartao';
import Selo from './Selo';
import Texto from './Texto';

interface ItemEstacaoProps {
  estacao: Estacao;
  onPress: () => void;
  detalhe?: string;
}

export const resumoEstacao = (parados: number) =>
  parados === 0
    ? { texto: 'Tudo funcionando', icone: 'check-circle-outline' as const, tom: 'sucesso' as const }
    : {
        texto: parados === 1 ? '1 com problema' : `${parados} com problema`,
        icone: 'alert-outline' as const,
        tom: 'alerta' as const,
      };

const ItemEstacao = ({ estacao, onPress, detalhe }: ItemEstacaoProps) => {
  const { tema } = useTema();
  const resumo = resumoEstacao(estacao.equipamentosParados);

  return (
    <Cartao
      onPress={onPress}
      rotuloAcessivel={`Estação ${estacao.nome}${estacao.linha ? `, linha ${estacao.linha}` : ''}. ${resumo.texto}${detalhe ? `, ${detalhe}` : ''}. Toque para ver os equipamentos.`}
    >
      <View style={[estilos.linha, { gap: tema.espacamento.md }]}>
        <View style={[estilos.icone, { backgroundColor: tema.cores.infoSuave }]}>
          <MaterialCommunityIcons name="subway-variant" size={24} color={tema.cores.info} />
        </View>
        <View style={estilos.textos}>
          <Texto negrito numberOfLines={1}>
            {estacao.nome}
          </Texto>
          {estacao.linha ? (
            <Texto variante="legenda" secundario numberOfLines={1}>
              Linha {estacao.linha}
              {detalhe ? ` · ${detalhe}` : ''}
            </Texto>
          ) : null}
          <Selo texto={resumo.texto} icone={resumo.icone} tom={resumo.tom} />
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={tema.cores.textoSecundario} />
      </View>
    </Cartao>
  );
};

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    gap: 4,
  },
});

export default ItemEstacao;
