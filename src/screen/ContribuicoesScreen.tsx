import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import CabecalhoSecao from '../components/CabecalhoSecao';
import Carregando from '../components/Carregando';
import Chip from '../components/Chip';
import EstadoVazio from '../components/EstadoVazio';
import ItemAvaliacao from '../components/ItemAvaliacao';
import ItemReporte from '../components/ItemReporte';
import MensagemErro from '../components/MensagemErro';
import Tela from '../components/Tela';
import { useTema } from '../context/TemaContext';
import { useContribuicoesControl } from '../control/useContribuicoesControl';
import { Avaliacao } from '../model/avaliacao';
import { Reporte } from '../model/estacao';
import { TabScreenProps } from '../navigation/types';

const ContribuicoesScreen = ({ navigation }: TabScreenProps<'Contribuicoes'>) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const controle = useContribuicoesControl();
  const ehAvaliacoes = controle.aba === 'avaliacoes';

  const cabecalho = (
    <View style={{ gap: espacamento.md, paddingBottom: espacamento.sm }}>
      <CabecalhoSecao
        icone="hand-heart-outline"
        titulo="Suas contribuições"
        descricao="Cada avaliação e cada reporte ajudam alguém a sair de casa com mais segurança."
        cor={cores.destaque}
        corFundoIcone={cores.alertaSuave}
      />
      <View style={[estilos.abas, { gap: espacamento.sm }]} accessibilityRole="tablist">
        <Chip
          rotulo="Avaliações"
          icone="star-outline"
          selecionado={ehAvaliacoes}
          onPress={() => controle.setAba('avaliacoes')}
        />
        <Chip
          rotulo="Reportes"
          icone="bullhorn-outline"
          selecionado={!ehAvaliacoes}
          onPress={() => controle.setAba('reportes')}
        />
      </View>
    </View>
  );

  const vazio = controle.carregando ? (
    <Carregando mensagem="Buscando suas contribuições…" />
  ) : controle.erro ? (
    <MensagemErro mensagem={controle.erro} onTentarDeNovo={controle.recarregar} />
  ) : ehAvaliacoes ? (
    <EstadoVazio
      icone="star-plus-outline"
      titulo="Você ainda não avaliou nenhum lugar"
      descricao="Conte como estavam o ruído, a luz e a lotação de um lugar que você visitou."
      textoAcao="Ver lugares"
      onAcao={() => navigation.navigate('Lugares')}
    />
  ) : (
    <EstadoVazio
      icone="bullhorn-outline"
      titulo="Você ainda não fez nenhum reporte"
      descricao="Viu um elevador parado? Avise as outras pessoas pela tela da estação."
      textoAcao="Ver estações"
      onAcao={() => navigation.navigate('Estacoes')}
    />
  );

  const separador = () => <View style={{ height: espacamento.md }} />;
  const rodape = controle.carregandoMais ? (
    <ActivityIndicator color={cores.primaria} style={estilos.rodape} />
  ) : null;
  const atualizar = (
    <RefreshControl
      refreshing={controle.recarregando}
      onRefresh={controle.recarregar}
      colors={[cores.primaria]}
      tintColor={cores.primaria}
    />
  );

  return (
    <Tela rolavel={false}>
      {ehAvaliacoes ? (
        <FlatList<Avaliacao>
          data={controle.avaliacoes}
          keyExtractor={(item) => `a${item.id}`}
          renderItem={({ item }) => (
            <ItemAvaliacao
              avaliacao={item}
              mostrarLugar
              podeEditar
              onEditar={() =>
                navigation.navigate('FormAvaliacao', {
                  localId: item.localId,
                  avaliacaoId: item.id,
                })
              }
              onExcluir={() => controle.excluirAvaliacao(item)}
              excluindo={controle.excluindoAvaliacaoId === item.id}
            />
          )}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={vazio}
          ListFooterComponent={rodape}
          ItemSeparatorComponent={separador}
          onEndReached={controle.carregarMais}
          onEndReachedThreshold={0.5}
          refreshControl={atualizar}
          contentContainerStyle={estilos.lista}
        />
      ) : (
        <FlatList<Reporte>
          data={controle.reportes}
          keyExtractor={(item) => `r${item.id}`}
          renderItem={({ item }) => (
            <ItemReporte
              reporte={item}
              equipamento={controle.equipamentoDe(item)}
              onEditar={() =>
                navigation.navigate('FormReporte', {
                  equipamentoId: item.equipamentoId,
                  reporteId: item.id,
                })
              }
              onExcluir={() => controle.excluirReporte(item)}
              excluindo={controle.excluindoReporteId === item.id}
            />
          )}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={vazio}
          ListFooterComponent={rodape}
          ItemSeparatorComponent={separador}
          onEndReached={controle.carregarMais}
          onEndReachedThreshold={0.5}
          refreshControl={atualizar}
          contentContainerStyle={estilos.lista}
        />
      )}
    </Tela>
  );
};

const estilos = StyleSheet.create({
  abas: {
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

export default ContribuicoesScreen;
