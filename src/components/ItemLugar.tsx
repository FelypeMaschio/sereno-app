import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { iconeCategoria, Local, rotuloCategoria } from '../model/local';
import Cartao from './Cartao';
import IndiceCalma, { nivelDaCalma } from './IndiceCalma';
import Texto from './Texto';

interface ItemLugarProps {
  local: Local;
  onPress: () => void;
  /** Texto extra opcional (ex.: "a 350 m"). */
  detalhe?: string;
}

/** Item da lista de lugares; o cartão inteiro é um botão. */
const ItemLugar = ({ local, onPress, detalhe }: ItemLugarProps) => {
  const { tema } = useTema();
  const nivel = nivelDaCalma(local.indiceCalma).rotulo.toLowerCase();

  return (
    <Cartao
      onPress={onPress}
      rotuloAcessivel={`${local.nome}, ${rotuloCategoria(local.categoria)}. ${
        local.indiceCalma != null ? `Calma ${nivel}` : 'Ainda sem avaliações'
      }${detalhe ? `, ${detalhe}` : ''}. Toque para ver detalhes.`}
    >
      <View style={[estilos.linha, { gap: tema.espacamento.md }]}>
        <View style={[estilos.icone, { backgroundColor: tema.cores.primariaSuave }]}>
          <MaterialCommunityIcons
            name={iconeCategoria(local.categoria)}
            size={24}
            color={tema.cores.primaria}
          />
        </View>
        <View style={estilos.textos}>
          <Texto negrito numberOfLines={2}>
            {local.nome}
          </Texto>
          <Texto variante="legenda" secundario numberOfLines={1}>
            {rotuloCategoria(local.categoria)}
            {detalhe ? ` · ${detalhe}` : ''}
          </Texto>
          <Texto variante="legenda" secundario numberOfLines={1}>
            {local.endereco}
          </Texto>
        </View>
        <IndiceCalma indice={local.indiceCalma} />
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
    gap: 2,
  },
});

export default ItemLugar;
