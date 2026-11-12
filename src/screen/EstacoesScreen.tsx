import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import CampoBusca from '../components/CampoBusca';
import Carregando from '../components/Carregando';
import Chip from '../components/Chip';
import EstadoVazio from '../components/EstadoVazio';
import ItemEstacao from '../components/ItemEstacao';
import MensagemErro from '../components/MensagemErro';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useEstacoesControl } from '../control/useEstacoesControl';
import { TabScreenProps } from '../navigation/types';

const EstacoesScreen = ({ navigation }: TabScreenProps<'Estacoes'>) => {
  const { tema } = useTema();
  const { espacamento } = tema;
  const controle = useEstacoesControl();

  const cabecalho = (
    <View style={{ gap: espacamento.md, paddingBottom: espacamento.sm }}>
      <CampoBusca
        valor={controle.busca}
        onChange={controle.setBusca}
        placeholder="Buscar estação (ex.: Sé)"
        rotuloAcessivel="Buscar estação pelo nome ou endereço"
      />
      <View style={estilos.linha}>
        <Chip
          rotulo="Só com equipamento parado"
          icone="alert-outline"
          selecionado={controle.soComProblema}
          onPress={controle.alternarSoComProblema}
        />
      </View>
      {!controle.carregando && !controle.erro && (
        <Texto variante="legenda" secundario accessibilityLiveRegion="polite">
          {controle.soComProblema
            ? `${controle.estacoes.length} com problema entre as carregadas`
            : controle.total === 1
              ? '1 estação'
              : `${controle.total} estações`}
        </Texto>
      )}
    </View>
  );

  const conteudoVazio = controle.carregando ? (
    <Carregando mensagem="Buscando estações…" />
  ) : controle.erro ? (
    <MensagemErro mensagem={controle.erro} onTentarDeNovo={controle.recarregar} />
  ) : controle.soComProblema ? (
    <EstadoVazio
      icone="check-decagram-outline"
      titulo="Nenhum equipamento parado"
      descricao="Nas estações carregadas, tudo está funcionando."
    />
  ) : controle.filtrando ? (
    <EstadoVazio
      icone="map-search-outline"
      titulo="Nenhuma estação encontrada"
      descricao="Confira o nome digitado ou tente parte dele."
    />
  ) : (
    <EstadoVazio icone="subway-variant" titulo="Ainda não há estações cadastradas" />
  );

  return (
    <Tela rolavel={false}>
      <FlatList
        data={controle.estacoes}
        keyExtractor={(estacao) => String(estacao.id)}
        renderItem={({ item }) => (
          <ItemEstacao
            estacao={item}
            onPress={() => navigation.navigate('DetalheEstacao', { estacaoId: item.id })}
          />
        )}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={conteudoVazio}
        ListFooterComponent={
          controle.carregandoMais ? (
            <ActivityIndicator color={tema.cores.primaria} style={estilos.rodape} />
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: espacamento.md }} />}
        onEndReached={controle.carregarMais}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={controle.recarregando}
            onRefresh={controle.recarregar}
            colors={[tema.cores.primaria]}
            tintColor={tema.cores.primaria}
          />
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={estilos.lista}
      />
    </Tela>
  );
};

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
  },
  lista: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  rodape: {
    padding: 16,
  },
});

export default EstacoesScreen;
