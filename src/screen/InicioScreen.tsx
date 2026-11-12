import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import CampoBusca from '../components/CampoBusca';
import Cartao from '../components/Cartao';
import CartaoPrevisao from '../components/CartaoPrevisao';
import IndiceCalma from '../components/IndiceCalma';
import ItemEstacao from '../components/ItemEstacao';
import ItemLugar from '../components/ItemLugar';
import MensagemErro from '../components/MensagemErro';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useInicioControl } from '../control/useInicioControl';
import { rotuloCategoria } from '../model/local';
import { TabScreenProps } from '../navigation/types';
import { AREA_MINIMA_DE_TOQUE } from '../theme';
import { formatarDistancia } from '../utils/distancia';

const InicioScreen = ({ navigation }: TabScreenProps<'Inicio'>) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const controle = useInicioControl();
  const { estadoLocalizacao: estado, escolhido } = controle;

  const avisoLocalizacao =
    estado.tipo === 'negada'
      ? 'Sem acesso à sua localização. Mostrando os lugares mais calmos no geral.'
      : estado.tipo === 'gpsDesligado'
        ? 'A localização do celular está desligada. Mostrando os lugares mais calmos no geral.'
        : estado.tipo === 'erro'
          ? 'Não consegui descobrir onde você está. Mostrando os lugares mais calmos no geral.'
          : null;

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

      {/* Atalho para um momento difícil: um lugar calmo perto, com um toque. */}
      <Pressable
        onPress={controle.pedirCalma}
        accessibilityRole="button"
        accessibilityLabel="Preciso de calma agora"
        accessibilityHint="Mostra lugares calmos perto de você"
        style={({ pressed }) => [
          estilos.calma,
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
              <Texto secundario>Procurando um lugar calmo…</Texto>
            </View>
          ) : controle.erroSugestoes ? (
            <MensagemErro mensagem={controle.erroSugestoes} onTentarDeNovo={controle.pedirCalma} />
          ) : (
            <>
              {avisoLocalizacao && (
                <Cartao>
                  <Texto variante="legenda">{avisoLocalizacao}</Texto>
                  {estado.tipo === 'negada' && !estado.podePerguntarDeNovo ? (
                    <Botao
                      titulo="Abrir configurações"
                      icone="cog-outline"
                      variante="secundario"
                      dica="Abre as configurações do app para liberar a localização"
                      onPress={controle.abrirConfiguracoes}
                    />
                  ) : (
                    <Botao
                      titulo="Tentar de novo"
                      icone="crosshairs-gps"
                      variante="secundario"
                      onPress={controle.pedirCalma}
                    />
                  )}
                </Cartao>
              )}
              {controle.sugestoes.length === 0 ? (
                <Texto secundario>Ainda não há lugares calmos avaliados perto de você.</Texto>
              ) : (
                <>
                  <Texto negrito>
                    {estado.tipo === 'ok' ? 'Calmos por perto' : 'Os mais calmos'}
                  </Texto>
                  {controle.sugestoes.map(({ local, distanciaKm }) => (
                    <ItemLugar
                      key={local.id}
                      local={local}
                      detalhe={distanciaKm != null ? formatarDistancia(distanciaKm) : undefined}
                      onPress={() => navigation.navigate('DetalheLugar', { localId: local.id })}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </View>
      )}

      <Texto variante="subtitulo">Para onde você vai?</Texto>

      {!escolhido ? (
        <View style={{ gap: espacamento.sm }}>
          <CampoBusca
            valor={controle.busca}
            onChange={controle.setBusca}
            placeholder="Digite o nome do lugar"
            rotuloAcessivel="Buscar o lugar para onde você vai"
          />
          {controle.buscando && <ActivityIndicator color={cores.primaria} />}
          {controle.erroBusca && <MensagemErro mensagem={controle.erroBusca} />}
          {controle.resultados.map((local) => (
            <Pressable
              key={local.id}
              onPress={() => controle.escolher(local)}
              accessibilityRole="button"
              accessibilityLabel={`Escolher ${local.nome}`}
              style={({ pressed }) => [
                estilos.resultado,
                {
                  backgroundColor: cores.superficie,
                  borderColor: cores.borda,
                  borderRadius: tema.raios.medio,
                  paddingHorizontal: espacamento.md,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <MaterialCommunityIcons name="map-marker-outline" size={20} color={cores.primaria} />
              <View style={estilos.flex}>
                <Texto negrito numberOfLines={1}>
                  {local.nome}
                </Texto>
                <Texto variante="legenda" secundario numberOfLines={1}>
                  {rotuloCategoria(local.categoria)} · {local.endereco}
                </Texto>
              </View>
            </Pressable>
          ))}
          {controle.busca.trim().length >= 2 &&
            !controle.buscando &&
            !controle.erroBusca &&
            controle.resultados.length === 0 && (
              <Texto secundario>Nenhum lugar com esse nome. Tente parte do nome.</Texto>
            )}
        </View>
      ) : (
        <View style={{ gap: espacamento.md }}>
          {/* 1. O destino: índice de calma */}
          <Cartao>
            <View style={[estilos.linha, { gap: espacamento.md }]}>
              <View style={estilos.flex}>
                <Texto variante="legenda" secundario>
                  Destino
                </Texto>
                <Texto variante="subtitulo">{escolhido.nome}</Texto>
                <Texto variante="legenda" secundario numberOfLines={2}>
                  {escolhido.endereco}
                </Texto>
              </View>
              <IndiceCalma
                indice={escolhido.indiceCalma}
                tamanho="grande"
                totalAvaliacoes={escolhido.totalAvaliacoes}
              />
            </View>
            <View style={[estilos.linha, { gap: espacamento.sm }]}>
              <View style={estilos.flex}>
                <Botao
                  titulo="Ver detalhes"
                  variante="secundario"
                  onPress={() => navigation.navigate('DetalheLugar', { localId: escolhido.id })}
                />
              </View>
              <View style={estilos.flex}>
                <Botao
                  titulo="Trocar"
                  icone="swap-horizontal"
                  variante="secundario"
                  onPress={controle.trocarLugar}
                />
              </View>
            </View>
          </Cartao>

          {/* 2. Quando ir: previsão da IA para o dia/hora escolhidos */}
          <CartaoPrevisao localId={escolhido.id} />

          {/* 3. O caminho: estação mais próxima e seus equipamentos */}
          <Texto variante="subtitulo">Estação mais próxima</Texto>
          {controle.carregandoEstacao ? (
            <ActivityIndicator color={cores.primaria} />
          ) : controle.erroEstacao ? (
            <MensagemErro mensagem={controle.erroEstacao} />
          ) : controle.estacaoProxima ? (
            <ItemEstacao
              estacao={controle.estacaoProxima.estacao}
              detalhe={`${formatarDistancia(controle.estacaoProxima.distanciaKm)} do destino`}
              onPress={() =>
                navigation.navigate('DetalheEstacao', {
                  estacaoId: controle.estacaoProxima!.estacao.id,
                })
              }
            />
          ) : (
            <Texto secundario>Não encontramos estações com localização cadastrada.</Texto>
          )}
        </View>
      )}
    </Tela>
  );
};

const estilos = StyleSheet.create({
  destaque: {
    alignItems: 'flex-start',
  },
  calma: {
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
  resultado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    minHeight: AREA_MINIMA_DE_TOQUE + 8,
    paddingVertical: 8,
  },
});

export default InicioScreen;
