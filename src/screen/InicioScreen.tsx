import { StyleSheet, View } from 'react-native';
import BuscaDestino from '../components/inicio/BuscaDestino';
import CaminhoDestino from '../components/inicio/CaminhoDestino';
import SecaoCalma from '../components/inicio/SecaoCalma';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useInicioControl } from '../control/useInicioControl';
import { TabScreenProps } from '../navigation/types';

/**
 * Tela "Pronto para ir?". A lógica fica toda no useInicioControl; a tela só monta
 * as três seções: calma agora, para onde você vai e o caminho até lá.
 */
const InicioScreen = ({ navigation }: TabScreenProps<'Inicio'>) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const controle = useInicioControl();

  const abrirLugar = (localId: number) => navigation.navigate('DetalheLugar', { localId });

  return (
    <Tela>
      <View
        style={[
          estilos.destaque,
          {
            backgroundColor: cores.primaria,
            borderRadius: tema.raios.grande,
            padding: espacamento.lg,
            gap: espacamento.sm,
          },
        ]}
      >
        <Texto variante="titulo" cor={cores.textoSobrePrimaria}>
          Pronto para ir?
        </Texto>
        <Texto cor={cores.textoSobrePrimaria}>
          Veja se o destino está tranquilo e se os elevadores do caminho estão funcionando.
        </Texto>
      </View>

      <SecaoCalma
        controle={controle}
        abrirLugar={abrirLugar}
        adicionarLugar={() => navigation.navigate('AdicionarLugar', {})}
      />

      <Texto variante="subtitulo">Para onde você vai?</Texto>
      {controle.destino ? (
        <CaminhoDestino
          controle={controle}
          destino={controle.destino}
          abrirLugar={abrirLugar}
          adicionarLugar={(nome) => navigation.navigate('AdicionarLugar', { nome })}
          abrirEstacao={(estacaoId) => navigation.navigate('DetalheEstacao', { estacaoId })}
        />
      ) : (
        <BuscaDestino controle={controle} />
      )}
    </Tela>
  );
};

const estilos = StyleSheet.create({
  destaque: {
    alignItems: 'flex-start',
  },
});

export default InicioScreen;
