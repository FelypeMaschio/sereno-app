import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import Texto from './Texto';

interface CabecalhoSecaoProps {
  icone: keyof typeof MaterialCommunityIcons.glyphMap;
  titulo: string;
  descricao?: string;
  /** Cor de destaque do ícone; por padrão, a primária do tema. */
  cor?: string;
  corFundoIcone?: string;
}

/** Abertura padrão de cada seção: ícone em círculo + título + descrição curta. */
const CabecalhoSecao = ({ icone, titulo, descricao, cor, corFundoIcone }: CabecalhoSecaoProps) => {
  const { tema } = useTema();

  return (
    <View style={[estilos.linha, { gap: tema.espacamento.md }]}>
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={[estilos.circulo, { backgroundColor: corFundoIcone ?? tema.cores.primariaSuave }]}
      >
        <MaterialCommunityIcons name={icone} size={28} color={cor ?? tema.cores.primaria} />
      </View>
      <View style={estilos.textos}>
        <Texto variante="subtitulo">{titulo}</Texto>
        {descricao && <Texto secundario>{descricao}</Texto>}
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circulo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textos: {
    flex: 1,
    gap: 2,
  },
});

export default CabecalhoSecao;
