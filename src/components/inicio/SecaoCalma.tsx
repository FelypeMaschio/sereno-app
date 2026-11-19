import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Botao from '../Botao';
import Cartao from '../Cartao';
import ItemLugar from '../ItemLugar';
import MensagemErro from '../MensagemErro';
import Texto from '../Texto';
import AvisoLocalizacao from './AvisoLocalizacao';
import { useTema } from '../../context/TemaContext';
import { useInicioControl } from '../../control/useInicioControl';
import { AREA_MINIMA_DE_TOQUE } from '../../theme';
import { formatarDistancia } from '../../utils/distancia';

interface SecaoCalmaProps {
  controle: ReturnType<typeof useInicioControl>;
  abrirLugar: (localId: number) => void;
  adicionarLugar: () => void;
}

/**
 * "Preciso de calma agora": atalho para um momento difícil. Um toque mostra os lugares
 * mais tranquilos perto da pessoa (ou os mais calmos no geral, sem localização).
 */
const SecaoCalma = ({ controle, abrirLugar, adicionarLugar }: SecaoCalmaProps) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const estado = controle.estadoLocalizacao;

  return (
    <>
      <Pressable
        onPress={controle.pedirCalma}
        accessibilityRole="button"
        accessibilityLabel="Preciso de calma agora"
        accessibilityHint="Mostra os lugares mais tranquilos perto de você"
        style={({ pressed }) => [
          estilos.botao,
          {
            backgroundColor: cores.sucessoSuave,
            borderColor: cores.sucesso,
            borderRadius: tema.raios.grande,
            padding: espacamento.md,
            gap: espacamento.md,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <MaterialCommunityIcons name="leaf" size={32} color={cores.sucesso} />
        <View style={estilos.flex}>
          <Texto negrito cor={cores.sucesso}>
            Preciso de calma agora
          </Texto>
          <Texto variante="legenda" cor={cores.sucesso}>
            Lugares tranquilos perto de você
          </Texto>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={cores.sucesso} />
      </Pressable>

      {controle.pediuCalma && (
        <View style={{ gap: espacamento.sm }} accessibilityLiveRegion="polite">
          {controle.carregandoSugestoes ? (
            <View style={[estilos.linha, { gap: espacamento.sm }]}>
              <ActivityIndicator color={cores.primaria} />
              <Texto secundario>Procurando um lugar tranquilo…</Texto>
            </View>
          ) : controle.erroSugestoes ? (
            <MensagemErro mensagem={controle.erroSugestoes} onTentarDeNovo={controle.pedirCalma} />
          ) : (
            <>
              {controle.procurandoLocalizacao && (
                <View style={[estilos.linha, { gap: espacamento.sm }]}>
                  <ActivityIndicator color={cores.primaria} size="small" />
                  <Texto variante="legenda" secundario>
                    Procurando sua localização para ordenar pelos mais perto…
                  </Texto>
                </View>
              )}
              <AvisoLocalizacao
                estado={estado}
                complemento="Mostrando os lugares mais tranquilos no geral."
                usarLocalizacao={controle.usarLocalizacao}
                abrirConfiguracoes={controle.abrirConfiguracoes}
              />
              {controle.sugestoes.length > 0 && (
                <>
                  <Texto negrito>
                    {controle.soModerados
                      ? 'Ainda não há lugares avaliados como calmos. Estes são os mais tranquilos:'
                      : estado.tipo === 'ok'
                        ? 'Calmos mais perto de você'
                        : 'Os mais calmos'}
                  </Texto>
                  {controle.sugestoes.map(({ local, distanciaKm }) => (
                    <ItemLugar
                      key={local.id}
                      local={local}
                      detalhe={distanciaKm != null ? formatarDistancia(distanciaKm) : undefined}
                      onPress={() => abrirLugar(local.id)}
                    />
                  ))}
                </>
              )}
              <Cartao style={{ gap: espacamento.sm }}>
                <Texto variante="legenda">
                  {controle.sugestoes.length === 0
                    ? 'Ainda não há lugares tranquilos avaliados. '
                    : ''}
                  Conhece um lugar calmo que não está aqui? Adicione e ajude outras pessoas.
                </Texto>
                <Botao
                  titulo="Adicionar lugar calmo"
                  icone="map-marker-plus-outline"
                  variante="secundario"
                  onPress={adicionarLugar}
                />
              </Cartao>
            </>
          )}
        </View>
      )}
    </>
  );
};

const estilos = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: AREA_MINIMA_DE_TOQUE + 16,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});

export default SecaoCalma;
