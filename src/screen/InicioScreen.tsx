import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import CampoBusca from '../components/CampoBusca';
import Cartao from '../components/Cartao';
import CartaoEstacaoCaminho from '../components/CartaoEstacaoCaminho';
import CartaoPrevisao from '../components/CartaoPrevisao';
import IndiceCalma from '../components/IndiceCalma';
import ItemLugar from '../components/ItemLugar';
import MensagemErro from '../components/MensagemErro';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useInicioControl } from '../control/useInicioControl';
import { categorias, rotuloCategoria } from '../model/local';
import { TabScreenProps } from '../navigation/types';
import { AREA_MINIMA_DE_TOQUE } from '../theme';
import { formatarDistancia } from '../utils/distancia';

const InicioScreen = ({ navigation }: TabScreenProps<'Inicio'>) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const controle = useInicioControl();
  const { estadoLocalizacao: estado, destino, caminho } = controle;

  /** Por que não temos a localização, em linguagem simples (null = temos). */
  const semLocalizacao =
    estado.tipo === 'negada'
      ? 'Sem acesso à sua localização.'
      : estado.tipo === 'gpsDesligado'
        ? 'A localização do celular está desligada.'
        : estado.tipo === 'erro'
          ? 'Não consegui descobrir onde você está.'
          : estado.tipo === 'ocioso'
            ? 'Você ainda não liberou a localização.'
            : null;

  /** Botão para liberar a localização (ou abrir as configurações, se foi bloqueada). */
  const botaoLocalizacao =
    estado.tipo === 'negada' && !estado.podePerguntarDeNovo ? (
      <Botao
        titulo="Abrir configurações"
        icone="cog-outline"
        variante="secundario"
        dica="Abre as configurações do app para liberar a localização"
        onPress={controle.abrirConfiguracoes}
      />
    ) : (
      <Botao
        titulo="Usar minha localização"
        icone="crosshairs-gps"
        variante="secundario"
        dica="A localização fica só no celular e não é enviada para nenhum servidor"
        onPress={controle.usarLocalizacao}
      />
    );

  /** Linha de resultado da busca de destino (do Sereno ou do mapa). */
  const resultado = (
    chave: string,
    titulo: string,
    subtitulo: string,
    icone: keyof typeof MaterialCommunityIcons.glyphMap,
    onPress: () => void,
  ) => (
    <Pressable
      key={chave}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ir para ${titulo}, ${subtitulo}`}
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
      <MaterialCommunityIcons name={icone} size={20} color={cores.primaria} />
      <View style={estilos.flex}>
        <Texto negrito numberOfLines={1}>
          {titulo}
        </Texto>
        <Texto variante="legenda" secundario numberOfLines={1}>
          {subtitulo}
        </Texto>
      </View>
    </Pressable>
  );

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

      {/* Atalho para um momento difícil: um lugar tranquilo perto, com um toque. */}
      <Pressable
        onPress={controle.pedirCalma}
        accessibilityRole="button"
        accessibilityLabel="Preciso de calma agora"
        accessibilityHint="Mostra os lugares mais tranquilos perto de você"
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
              {semLocalizacao && (
                <Cartao style={{ gap: espacamento.sm }}>
                  <Texto variante="legenda">
                    {semLocalizacao} Mostrando os lugares mais tranquilos no geral.
                  </Texto>
                  {botaoLocalizacao}
                </Cartao>
              )}
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
                      onPress={() => navigation.navigate('DetalheLugar', { localId: local.id })}
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
                  onPress={() => navigation.navigate('AdicionarLugar', {})}
                />
              </Cartao>
            </>
          )}
        </View>
      )}

      <Texto variante="subtitulo">Para onde você vai?</Texto>

      {!destino ? (
        <View style={{ gap: espacamento.sm }}>
          <CampoBusca
            valor={controle.busca}
            onChange={controle.setBusca}
            placeholder="Ex.: Parque Ibirapuera, Shopping Aricanduva"
            rotuloAcessivel="Buscar o lugar para onde você vai"
          />
          {controle.poucasLetras ? (
            <Texto variante="legenda" secundario>
              Busque um lugar do Sereno ou qualquer endereço do mapa.
            </Texto>
          ) : (
            <>
              {controle.erroBusca && <MensagemErro mensagem={controle.erroBusca} />}

              {controle.resultadosSereno.length > 0 && (
                <Texto variante="legenda" negrito secundario>
                  No Sereno (com avaliações)
                </Texto>
              )}
              {controle.resultadosSereno.map((local) =>
                resultado(
                  `s${local.id}`,
                  local.nome,
                  `${rotuloCategoria(local.categoria)} · ${local.endereco}`,
                  categorias[local.categoria]?.icone ?? 'map-marker-outline',
                  () => controle.escolherLocal(local),
                ),
              )}

              {controle.resultadosMapa.length > 0 && (
                <Texto variante="legenda" negrito secundario>
                  No mapa
                </Texto>
              )}
              {controle.resultadosMapa.map((lugar) =>
                resultado(
                  `m${lugar.idMapa}`,
                  lugar.nome,
                  lugar.endereco,
                  categorias[lugar.categoria].icone,
                  () => controle.escolherDoMapa(lugar),
                ),
              )}

              {controle.buscando && <ActivityIndicator color={cores.primaria} />}
              {!controle.buscando &&
                !controle.erroBusca &&
                controle.resultadosSereno.length === 0 &&
                controle.resultadosMapa.length === 0 && (
                  <Texto secundario>
                    {controle.erroMapa ??
                      'Nenhum lugar encontrado. Tente acrescentar o bairro ou a cidade.'}
                  </Texto>
                )}
              {controle.resultadosMapa.length > 0 && (
                <Texto variante="legenda" secundario>
                  Dados do mapa © colaboradores do OpenStreetMap
                </Texto>
              )}
            </>
          )}
        </View>
      ) : (
        <View style={{ gap: espacamento.md }}>
          {/* 1. O destino */}
          <Cartao style={{ gap: espacamento.sm }}>
            <View style={[estilos.linha, { gap: espacamento.md }]}>
              <View style={estilos.flex}>
                <Texto variante="legenda" secundario>
                  Destino
                </Texto>
                <Texto variante="subtitulo">{destino.nome}</Texto>
                <Texto variante="legenda" secundario numberOfLines={2}>
                  {destino.endereco}
                </Texto>
              </View>
              {destino.local && (
                <IndiceCalma
                  indice={destino.local.indiceCalma}
                  tamanho="grande"
                  totalAvaliacoes={destino.local.totalAvaliacoes}
                />
              )}
            </View>
            {!destino.local && (
              <Texto variante="legenda" secundario>
                Este lugar ainda não está no Sereno, então não tem índice de calma. Adicione para
                avaliar e ajudar outras pessoas.
              </Texto>
            )}
            <View style={[estilos.linha, { gap: espacamento.sm }]}>
              <View style={estilos.flex}>
                {destino.local ? (
                  <Botao
                    titulo="Detalhes"
                    variante="secundario"
                    onPress={() =>
                      navigation.navigate('DetalheLugar', { localId: destino.local!.id })
                    }
                  />
                ) : (
                  <Botao
                    titulo="Adicionar"
                    icone="map-marker-plus-outline"
                    variante="secundario"
                    onPress={() => navigation.navigate('AdicionarLugar', { nome: destino.nome })}
                  />
                )}
              </View>
              <View style={estilos.flex}>
                <Botao
                  titulo="Trocar"
                  icone="swap-horizontal"
                  variante="secundario"
                  onPress={controle.trocarDestino}
                />
              </View>
            </View>
          </Cartao>

          {/* 2. Quando ir: previsão da IA (só para lugares do Sereno, que têm histórico) */}
          {destino.local && <CartaoPrevisao localId={destino.local.id} />}

          {/* 3. O caminho: estação de embarque e de desembarque, com cada equipamento */}
          <Texto variante="subtitulo">Seu caminho de metrô e trem</Texto>
          {controle.carregandoEstacoes ? (
            <ActivityIndicator color={cores.primaria} />
          ) : controle.erroEstacoes ? (
            <MensagemErro mensagem={controle.erroEstacoes} />
          ) : !caminho?.desembarque ? (
            <Texto secundario>Não encontramos estações com localização cadastrada.</Texto>
          ) : (
            <>
              {caminho.embarque ? (
                caminho.mesmaEstacao ? (
                  <Cartao>
                    <Texto variante="legenda">
                      A estação mais perto de você é a mesma do destino. Talvez dê para ir a pé.
                    </Texto>
                  </Cartao>
                ) : (
                  <CartaoEstacaoCaminho
                    papel="Embarque"
                    referencia="de você"
                    noCaminho={caminho.embarque}
                    equipamentos={controle.equipamentosDa(caminho.embarque.estacao.id)}
                    onPress={() =>
                      navigation.navigate('DetalheEstacao', {
                        estacaoId: caminho.embarque!.estacao.id,
                      })
                    }
                  />
                )
              ) : estado.tipo === 'carregando' ? (
                <ActivityIndicator color={cores.primaria} />
              ) : (
                <Cartao style={{ gap: espacamento.sm }}>
                  <Texto variante="legenda">
                    {semLocalizacao} Libere a localização para ver também a estação de embarque
                    perto de você.
                  </Texto>
                  {botaoLocalizacao}
                </Cartao>
              )}

              {caminho.embarque && !caminho.mesmaEstacao && (
                <View style={[estilos.linha, { gap: espacamento.sm }]}>
                  <MaterialCommunityIcons
                    name={caminho.linhasEmComum.length > 0 ? 'arrow-down' : 'swap-vertical'}
                    size={20}
                    color={cores.textoSecundario}
                  />
                  <Texto variante="legenda" secundario style={estilos.flex}>
                    {caminho.linhasEmComum.length > 0
                      ? `Mesma linha (${caminho.linhasEmComum.join(', ')}): dá para ir sem baldeação.`
                      : 'Sem linha em comum: provavelmente vai ter baldeação. Confira o trajeto no app do Metrô ou da CPTM.'}
                  </Texto>
                </View>
              )}

              <CartaoEstacaoCaminho
                papel="Desembarque"
                referencia="do destino"
                noCaminho={caminho.desembarque}
                equipamentos={controle.equipamentosDa(caminho.desembarque.estacao.id)}
                onPress={() =>
                  navigation.navigate('DetalheEstacao', {
                    estacaoId: caminho.desembarque!.estacao.id,
                  })
                }
              />
            </>
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
