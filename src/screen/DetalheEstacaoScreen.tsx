import { useLayoutEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Carregando from '../components/Carregando';
import CartaoDireitos from '../components/CartaoDireitos';
import Cartao from '../components/Cartao';
import EstadoVazio from '../components/EstadoVazio';
import ItemEquipamento from '../components/ItemEquipamento';
import { resumoEstacao } from '../components/ItemEstacao';
import MensagemErro from '../components/MensagemErro';
import Selo from '../components/Selo';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useDetalheEstacaoControl } from '../control/useDetalheEstacaoControl';
import { AppScreenProps } from '../navigation/types';

const DetalheEstacaoScreen = ({ navigation, route }: AppScreenProps<'DetalheEstacao'>) => {
  const { estacaoId } = route.params;
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const controle = useDetalheEstacaoControl(estacaoId);
  const { estacao } = controle;

  useLayoutEffect(() => {
    if (estacao) navigation.setOptions({ title: estacao.nome });
  }, [estacao, navigation]);

  if (controle.carregando) {
    return <Carregando mensagem="Carregando a estação…" />;
  }

  if (controle.erro || !estacao) {
    return (
      <Tela>
        <MensagemErro
          mensagem={controle.erro ?? 'Não encontramos esta estação.'}
          onTentarDeNovo={controle.recarregar}
        />
      </Tela>
    );
  }

  const resumo = resumoEstacao(controle.comProblema.length);

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
        <Texto variante="subtitulo">Estação {estacao.nome}</Texto>
        {estacao.linha ? (
          <View style={[estilos.linhas, { gap: espacamento.xs }]}>
            {estacao.linha.split(',').map((linha) => (
              <Selo key={linha} texto={linha.trim()} icone="train" tom="info" />
            ))}
          </View>
        ) : null}
        {estacao.endereco ? (
          <View style={[estilos.linha, { gap: espacamento.sm }]}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color={cores.textoSecundario}
            />
            <Texto secundario style={estilos.flex}>
              {estacao.endereco}
            </Texto>
          </View>
        ) : null}
        <Selo texto={resumo.texto} icone={resumo.icone} tom={resumo.tom} />
      </Cartao>

      {controle.comProblema.length > 0 && (
        <CartaoDireitos estacao={estacao} comProblema={controle.comProblema} />
      )}

      <Texto variante="subtitulo">Equipamentos</Texto>
      {controle.equipamentos.length === 0 ? (
        <Cartao>
          <EstadoVazio
            icone="elevator-passenger-outline"
            titulo="Nenhum equipamento cadastrado"
            descricao="Esta estação ainda não tem elevadores, escadas ou rampas registrados."
          />
        </Cartao>
      ) : (
        controle.equipamentos.map((equipamento) => (
          <ItemEquipamento
            key={equipamento.id}
            equipamento={equipamento}
            onReportar={() => navigation.navigate('FormReporte', { equipamentoId: equipamento.id })}
          />
        ))
      )}
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linhas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flex: {
    flex: 1,
  },
});

export default DetalheEstacaoScreen;
