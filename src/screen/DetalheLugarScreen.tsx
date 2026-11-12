import { useLayoutEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import Carregando from '../components/Carregando';
import CartaoInsight from '../components/CartaoInsight';
import CartaoPrevisao from '../components/CartaoPrevisao';
import Cartao from '../components/Cartao';
import EstadoVazio from '../components/EstadoVazio';
import IndiceCalma from '../components/IndiceCalma';
import ItemAvaliacao from '../components/ItemAvaliacao';
import MensagemErro from '../components/MensagemErro';
import Selo from '../components/Selo';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useDetalheLugarControl } from '../control/useDetalheLugarControl';
import { iconeCategoria, rotuloCategoria } from '../model/local';
import { AppScreenProps } from '../navigation/types';

const DetalheLugarScreen = ({ navigation, route }: AppScreenProps<'DetalheLugar'>) => {
  const { localId } = route.params;
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const controle = useDetalheLugarControl(localId);
  const { local } = controle;

  // O título do cabeçalho vira o nome do lugar assim que ele carrega.
  useLayoutEffect(() => {
    if (local) navigation.setOptions({ title: local.nome });
  }, [local, navigation]);

  if (controle.carregando) {
    return <Carregando mensagem="Carregando o lugar…" />;
  }

  if (controle.erro || !local) {
    return (
      <Tela>
        <MensagemErro
          mensagem={controle.erro ?? 'Não encontramos este lugar.'}
          onTentarDeNovo={controle.recarregar}
        />
      </Tela>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: cores.fundo }}
      contentContainerStyle={{ padding: espacamento.lg, gap: espacamento.md }}
      refreshControl={
        <RefreshControl
          refreshing={controle.recarregando}
          onRefresh={controle.recarregar}
          colors={[cores.primaria]}
          tintColor={cores.primaria}
        />
      }
    >
      <Cartao>
        <View style={[estilos.topo, { gap: espacamento.md }]}>
          <View style={[estilos.flex, { gap: espacamento.xs }]}>
            <Selo
              texto={rotuloCategoria(local.categoria)}
              icone={iconeCategoria(local.categoria)}
              tom="primaria"
            />
            <Texto variante="subtitulo">{local.nome}</Texto>
          </View>
          <IndiceCalma
            indice={local.indiceCalma}
            tamanho="grande"
            totalAvaliacoes={local.totalAvaliacoes}
          />
        </View>
        <View style={[estilos.linha, { gap: espacamento.sm }]}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={20}
            color={cores.textoSecundario}
          />
          <Texto secundario style={estilos.flex}>
            {local.endereco}
          </Texto>
        </View>
        {local.descricao ? <Texto>{local.descricao}</Texto> : null}
      </Cartao>

      {local.recursosAcessibilidade ? (
        <Cartao>
          <View style={[estilos.linha, { gap: espacamento.sm }]}>
            <MaterialCommunityIcons name="wheelchair-accessibility" size={22} color={cores.info} />
            <Texto negrito>Acessibilidade do local</Texto>
          </View>
          <Texto>{local.recursosAcessibilidade}</Texto>
        </Cartao>
      ) : null}

      {/* Dois cartões de IA com perguntas diferentes: "quando ir" (previsão para o
          horário escolhido) e "como é" (resumo do que as pessoas relataram). */}
      <CartaoPrevisao localId={localId} />
      <CartaoInsight localId={localId} />

      <Botao
        titulo="Avaliar este lugar"
        icone="star-outline"
        dica="Abre o formulário de avaliação sensorial"
        onPress={() => navigation.navigate('FormAvaliacao', { localId })}
      />

      <Texto variante="subtitulo">
        Avaliações{controle.totalAvaliacoes > 0 ? ` (${controle.totalAvaliacoes})` : ''}
      </Texto>

      {controle.carregandoAvaliacoes ? (
        <Carregando mensagem="Carregando avaliações…" />
      ) : controle.erroAvaliacoes ? (
        <MensagemErro mensagem={controle.erroAvaliacoes} onTentarDeNovo={controle.recarregar} />
      ) : controle.avaliacoes.length === 0 ? (
        <Cartao>
          <EstadoVazio
            icone="star-plus-outline"
            titulo="Ainda ninguém avaliou este lugar"
            descricao="Que tal ser a primeira pessoa? Sua avaliação ajuda quem tem sensibilidade sensorial."
          />
        </Cartao>
      ) : (
        <View style={{ gap: espacamento.md }}>
          {controle.avaliacoes.map((avaliacao) => (
            <ItemAvaliacao
              key={avaliacao.id}
              avaliacao={avaliacao}
              podeEditar={controle.ehMinha(avaliacao)}
              onEditar={() =>
                navigation.navigate('FormAvaliacao', { localId, avaliacaoId: avaliacao.id })
              }
              onExcluir={() => controle.excluir(avaliacao)}
              excluindo={controle.excluindoId === avaliacao.id}
            />
          ))}
          {controle.temMaisAvaliacoes && (
            <Botao
              titulo="Ver mais avaliações"
              variante="secundario"
              carregando={controle.carregandoMaisAvaliacoes}
              onPress={controle.carregarMaisAvaliacoes}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});

export default DetalheLugarScreen;
