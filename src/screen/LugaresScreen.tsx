import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import CampoBusca from '../components/CampoBusca';
import Carregando from '../components/Carregando';
import Chip from '../components/Chip';
import EstadoVazio from '../components/EstadoVazio';
import ItemLugar from '../components/ItemLugar';
import MensagemErro from '../components/MensagemErro';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useLugaresControl } from '../control/useLugaresControl';
import { Categoria, categorias } from '../model/local';
import { TabScreenProps } from '../navigation/types';

const LugaresScreen = ({ navigation }: TabScreenProps<'Lugares'>) => {
  const { tema } = useTema();
  const controle = useLugaresControl();
  const { espacamento } = tema;

  const cabecalho = (
    <View style={{ gap: espacamento.md, paddingBottom: espacamento.sm }}>
      <CampoBusca
        valor={controle.busca}
        onChange={controle.setBusca}
        placeholder="Buscar pelo nome do lugar"
        rotuloAcessivel="Buscar lugar pelo nome"
      />
      {/* Filtros por categoria em rolagem horizontal. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: espacamento.sm }}
      >
        {(Object.keys(categorias) as Categoria[]).map((categoria) => (
          <Chip
            key={categoria}
            rotulo={categorias[categoria].rotulo}
            icone={categorias[categoria].icone}
            selecionado={controle.categoria === categoria}
            onPress={() => controle.alternarCategoria(categoria)}
            rotuloAcessivel={`Filtrar por ${categorias[categoria].rotulo}`}
          />
        ))}
      </ScrollView>
      {!controle.carregando && !controle.erro && (
        <Texto variante="legenda" secundario accessibilityLiveRegion="polite">
          {controle.total === 1 ? '1 lugar encontrado' : `${controle.total} lugares encontrados`}
        </Texto>
      )}
    </View>
  );

  const conteudoVazio = controle.carregando ? (
    <Carregando mensagem="Buscando lugares…" />
  ) : controle.erro ? (
    <MensagemErro mensagem={controle.erro} onTentarDeNovo={controle.recarregar} />
  ) : controle.filtrando ? (
    <EstadoVazio
      icone="map-search-outline"
      titulo="Nenhum lugar encontrado"
      descricao="Tente outro nome ou tire o filtro de categoria."
    />
  ) : (
    <EstadoVazio
      icone="map-marker-plus-outline"
      titulo="Ainda não há lugares cadastrados"
      descricao="Assim que houver lugares, eles aparecem aqui com o índice de calma."
    />
  );

  return (
    <Tela rolavel={false}>
      <FlatList
        data={controle.lugares}
        keyExtractor={(local) => String(local.id)}
        renderItem={({ item }) => (
          <ItemLugar
            local={item}
            onPress={() => navigation.navigate('DetalheLugar', { localId: item.id })}
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
        // Pede a próxima página quando faltar meia tela para o fim.
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
  lista: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  rodape: {
    padding: 16,
  },
});

export default LugaresScreen;
