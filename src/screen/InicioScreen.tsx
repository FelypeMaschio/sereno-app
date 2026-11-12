import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Cartao from '../components/Cartao';
import EmConstrucao from '../components/EmConstrucao';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { TabScreenProps } from '../navigation/types';

type NomeIcone = keyof typeof MaterialCommunityIcons.glyphMap;

interface FrenteProps {
  icone: NomeIcone;
  titulo: string;
  descricao: string;
  corIcone: string;
  corFundoIcone: string;
  onPress: () => void;
}

/** Cartão de cada frente do Sereno; o cartão inteiro é tocável. */
const Frente = ({ icone, titulo, descricao, corIcone, corFundoIcone, onPress }: FrenteProps) => {
  const { tema } = useTema();

  return (
    <Cartao onPress={onPress} rotuloAcessivel={`${titulo}. ${descricao}`}>
      <View style={[estilos.linha, { gap: tema.espacamento.md }]}>
        <View style={[estilos.circulo, { backgroundColor: corFundoIcone }]}>
          <MaterialCommunityIcons name={icone} size={26} color={corIcone} />
        </View>
        <View style={estilos.flex}>
          <Texto negrito>{titulo}</Texto>
          <Texto variante="legenda" secundario>
            {descricao}
          </Texto>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={tema.cores.textoSecundario} />
      </View>
    </Cartao>
  );
};

// Parcial: o "Pronto para ir?" completo (lugar + previsão + estação próxima) chega na Etapa 10.
const InicioScreen = ({ navigation }: TabScreenProps<'Inicio'>) => {
  const { tema } = useTema();
  const { cores } = tema;

  return (
    <Tela>
      <View
        style={[
          estilos.destaque,
          {
            backgroundColor: cores.primaria,
            borderRadius: tema.raios.grande,
            padding: tema.espacamento.lg,
            gap: tema.espacamento.sm,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="weather-sunset"
          size={32}
          color={cores.textoSobrePrimaria}
          accessible={false}
        />
        <Texto variante="titulo" cor={cores.textoSobrePrimaria}>
          Pronto para ir?
        </Texto>
        <Texto cor={cores.textoSobrePrimaria}>
          Veja se o destino está tranquilo e se os elevadores do caminho estão funcionando.
        </Texto>
      </View>

      <Texto variante="subtitulo">O que você quer saber?</Texto>
      <Frente
        icone="ear-hearing"
        titulo="Calmaria"
        descricao="Ruído, luz e lotação dos lugares, avaliados por quem foi."
        corIcone={cores.primaria}
        corFundoIcone={cores.primariaSuave}
        onPress={() => navigation.navigate('Lugares')}
      />
      <Frente
        icone="elevator-passenger-outline"
        titulo="Elevador Funciona?"
        descricao="Elevadores, escadas rolantes e rampas nas estações."
        corIcone={cores.info}
        corFundoIcone={cores.infoSuave}
        onPress={() => navigation.navigate('Estacoes')}
      />

      <EmConstrucao texto="Em breve: escolha um lugar e veja tudo numa resposta só." />
    </Tela>
  );
};

const estilos = StyleSheet.create({
  destaque: {
    alignItems: 'flex-start',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circulo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});

export default InicioScreen;
