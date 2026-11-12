import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { Avaliacao, escalas } from '../model/avaliacao';
import { periodos, rotuloPeriodo } from '../model/local';
import { formatarData } from '../utils/formatacao';
import Botao from './Botao';
import Cartao from './Cartao';
import Selo from './Selo';
import Texto from './Texto';

type NomeIcone = keyof typeof MaterialCommunityIcons.glyphMap;

const iconesNota: Record<keyof typeof escalas, NomeIcone> = {
  nivelRuido: 'volume-medium',
  nivelIluminacao: 'white-balance-sunny',
  nivelLotacao: 'account-group-outline',
};

interface ItemAvaliacaoProps {
  avaliacao: Avaliacao;
  /** Mostra o nome do lugar (em "Minhas contribuições") em vez do autor. */
  mostrarLugar?: boolean;
  podeEditar?: boolean;
  onEditar?: () => void;
  onExcluir?: () => void;
  excluindo?: boolean;
}

/** Uma barrinha de 5 segmentos: mostra a nota sem depender de ler números. */
const Medidor = ({ nota }: { nota: number }) => {
  const { tema } = useTema();
  return (
    <View style={estilos.medidor}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View
          key={n}
          style={[
            estilos.segmento,
            {
              backgroundColor: n <= nota ? tema.cores.primaria : tema.cores.superficieAlternativa,
            },
          ]}
        />
      ))}
    </View>
  );
};

const ItemAvaliacao = ({
  avaliacao,
  mostrarLugar = false,
  podeEditar = false,
  onEditar,
  onExcluir,
  excluindo = false,
}: ItemAvaliacaoProps) => {
  const { tema } = useTema();
  const notas = (Object.keys(escalas) as (keyof typeof escalas)[]).map((campo) => ({
    campo,
    nota: avaliacao[campo],
    escala: escalas[campo],
  }));

  return (
    <Cartao>
      <View style={estilos.topo}>
        <View style={estilos.flex}>
          <Texto negrito numberOfLines={1}>
            {mostrarLugar ? avaliacao.nomeLocal : avaliacao.nomeUsuario}
          </Texto>
          <Texto variante="legenda" secundario>
            {formatarData(avaliacao.criadoEm)}
          </Texto>
        </View>
        <Selo
          texto={rotuloPeriodo(avaliacao.periodoVisita)}
          icone={periodos[avaliacao.periodoVisita]?.icone}
          tom="primaria"
        />
      </View>

      <View
        accessible
        accessibilityLabel={notas
          .map(({ escala, nota }) => `${escala.rotulo}: ${escala.niveis[nota - 1]}`)
          .join(', ')}
        style={{ gap: tema.espacamento.xs }}
      >
        {notas.map(({ campo, nota, escala }) => (
          <View key={campo} style={[estilos.linhaNota, { gap: tema.espacamento.sm }]}>
            <MaterialCommunityIcons
              name={iconesNota[campo]}
              size={18}
              color={tema.cores.textoSecundario}
            />
            <Texto variante="legenda" style={estilos.rotuloNota}>
              {escala.rotulo}
            </Texto>
            <Medidor nota={nota} />
            <Texto variante="legenda" secundario style={estilos.textoNota}>
              {escala.niveis[nota - 1]}
            </Texto>
          </View>
        ))}
      </View>

      {avaliacao.comentario ? <Texto>“{avaliacao.comentario}”</Texto> : null}

      {podeEditar && (
        <View style={[estilos.acoes, { gap: tema.espacamento.sm }]}>
          <View style={estilos.flex}>
            <Botao
              titulo="Editar"
              icone="pencil-outline"
              variante="secundario"
              onPress={onEditar!}
            />
          </View>
          <View style={estilos.flex}>
            <Botao
              titulo="Excluir"
              icone="trash-can-outline"
              variante="perigo"
              carregando={excluindo}
              onPress={onExcluir!}
            />
          </View>
        </View>
      )}
    </Cartao>
  );
};

const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flex: {
    flex: 1,
  },
  linhaNota: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rotuloNota: {
    width: 64,
  },
  textoNota: {
    flex: 1,
  },
  medidor: {
    flexDirection: 'row',
    gap: 3,
  },
  segmento: {
    width: 14,
    height: 8,
    borderRadius: 4,
  },
  acoes: {
    flexDirection: 'row',
  },
});

export default ItemAvaliacao;
