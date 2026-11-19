import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Botao from '../Botao';
import Cartao from '../Cartao';
import CartaoEstacaoCaminho from '../CartaoEstacaoCaminho';
import CartaoPrevisao from '../CartaoPrevisao';
import IndiceCalma from '../IndiceCalma';
import MensagemErro from '../MensagemErro';
import Texto from '../Texto';
import AvisoLocalizacao from './AvisoLocalizacao';
import { useTema } from '../../context/TemaContext';
import { Destino, useInicioControl } from '../../control/useInicioControl';

interface CaminhoDestinoProps {
  controle: ReturnType<typeof useInicioControl>;
  destino: Destino;
  abrirLugar: (localId: number) => void;
  adicionarLugar: (nome: string) => void;
  abrirEstacao: (estacaoId: number) => void;
}

/**
 * Destino escolhido, em 3 partes:
 * 1. o destino (com índice de calma, se já está no Sereno);
 * 2. quando ir (previsão da IA, só para lugares do Sereno, que têm histórico);
 * 3. o caminho: estação de embarque e de desembarque, com cada equipamento.
 */
const CaminhoDestino = ({
  controle,
  destino,
  abrirLugar,
  adicionarLugar,
  abrirEstacao,
}: CaminhoDestinoProps) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const { caminho, estadoLocalizacao: estado } = controle;
  const { local } = destino;

  return (
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
          {local && (
            <IndiceCalma
              indice={local.indiceCalma}
              tamanho="grande"
              totalAvaliacoes={local.totalAvaliacoes}
            />
          )}
        </View>
        {!local && (
          <Texto variante="legenda" secundario>
            Este lugar ainda não está no Sereno, então não tem índice de calma. Adicione para
            avaliar e ajudar outras pessoas.
          </Texto>
        )}
        <View style={[estilos.linha, { gap: espacamento.sm }]}>
          <View style={estilos.flex}>
            {local ? (
              <Botao titulo="Detalhes" variante="secundario" onPress={() => abrirLugar(local.id)} />
            ) : (
              <Botao
                titulo="Adicionar"
                icone="map-marker-plus-outline"
                variante="secundario"
                onPress={() => adicionarLugar(destino.nome)}
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

      {/* 2. Quando ir */}
      {local && <CartaoPrevisao localId={local.id} />}

      {/* 3. O caminho */}
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
                onPress={() => abrirEstacao(caminho.embarque!.estacao.id)}
              />
            )
          ) : estado.tipo === 'carregando' ? (
            <ActivityIndicator color={cores.primaria} />
          ) : (
            <AvisoLocalizacao
              estado={estado}
              complemento="Libere a localização para ver também a estação de embarque perto de você."
              usarLocalizacao={controle.usarLocalizacao}
              abrirConfiguracoes={controle.abrirConfiguracoes}
            />
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
            onPress={() => abrirEstacao(caminho.desembarque!.estacao.id)}
          />
        </>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});

export default CaminhoDestino;
