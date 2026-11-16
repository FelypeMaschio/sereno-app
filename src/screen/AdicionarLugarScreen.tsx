import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import CabecalhoSecao from '../components/CabecalhoSecao';
import CampoBusca from '../components/CampoBusca';
import CampoTexto from '../components/CampoTexto';
import Cartao from '../components/Cartao';
import Chip from '../components/Chip';
import EstadoVazio from '../components/EstadoVazio';
import MensagemErro from '../components/MensagemErro';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useAdicionarLugarControl } from '../control/useAdicionarLugarControl';
import { Categoria, categorias } from '../model/local';
import { AppScreenProps } from '../navigation/types';
import { avisar } from '../utils/feedback';

const AdicionarLugarScreen = ({ navigation, route }: AppScreenProps<'AdicionarLugar'>) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const controle = useAdicionarLugarControl(route.params?.nome ?? '', ({ local, jaExistia }) => {
    avisar(
      jaExistia
        ? 'Esse lugar já está no Sereno. Abrimos ele para você.'
        : 'Lugar adicionado! Que tal deixar a primeira avaliação?',
    );
    // replace: o botão voltar do lugar leva à lista, não de novo a este formulário.
    navigation.replace('DetalheLugar', { localId: local.id });
  });
  const { escolhido } = controle;

  // Crédito exigido pela licença dos dados do OpenStreetMap (ODbL).
  const credito = (
    <Texto variante="legenda" secundario style={estilos.centro}>
      Dados do mapa © colaboradores do OpenStreetMap
    </Texto>
  );

  // Passo 2: lugar escolhido. Só falta confirmar a categoria e, se quiser, descrever.
  if (escolhido) {
    return (
      <Tela>
        <CabecalhoSecao
          icone="map-marker-check-outline"
          titulo="Confirme o lugar"
          descricao="Nome, endereço e localização vieram do mapa e não podem ser alterados."
        />
        <Cartao style={{ gap: espacamento.sm }}>
          <View style={[estilos.linha, { gap: espacamento.md }]}>
            <MaterialCommunityIcons
              name={categorias[controle.categoria].icone}
              size={28}
              color={cores.primaria}
            />
            <View style={estilos.flex}>
              <Texto negrito>{escolhido.nome}</Texto>
              <Texto variante="legenda" secundario>
                {escolhido.endereco}
              </Texto>
            </View>
          </View>
          <Botao
            titulo="Escolher outro lugar"
            icone="swap-horizontal"
            variante="secundario"
            onPress={controle.trocarLugar}
          />
        </Cartao>

        <Cartao style={{ gap: espacamento.md }}>
          <Texto negrito>Categoria</Texto>
          <Texto variante="legenda" secundario>
            Sugerimos pelo tipo do lugar no mapa. Troque se não combinar.
          </Texto>
          <View style={[estilos.chips, { gap: espacamento.sm }]}>
            {(Object.keys(categorias) as Categoria[]).map((categoria) => (
              <Chip
                key={categoria}
                rotulo={categorias[categoria].rotulo}
                icone={categorias[categoria].icone}
                selecionado={controle.categoria === categoria}
                onPress={() => controle.setCategoria(categoria)}
                rotuloAcessivel={`Categoria ${categorias[categoria].rotulo}`}
              />
            ))}
          </View>

          <CampoTexto
            rotulo="Descrição (opcional)"
            placeholder="Ex.: hamburgueria pequena, música baixa"
            value={controle.form.descricao}
            onChangeText={(valor) => controle.alterar('descricao', valor)}
            erro={controle.erros.descricao}
            multiline
            maxLength={1000}
            textAlignVertical="top"
            style={estilos.multilinha}
          />
          <CampoTexto
            rotulo="Recursos de acessibilidade (opcional)"
            placeholder="Ex.: rampa na entrada, mesas afastadas, banheiro adaptado"
            value={controle.form.recursosAcessibilidade}
            onChangeText={(valor) => controle.alterar('recursosAcessibilidade', valor)}
            erro={controle.erros.recursosAcessibilidade}
            multiline
            maxLength={500}
            textAlignVertical="top"
            style={estilos.multilinha}
          />
          {controle.erroGeral && <MensagemErro mensagem={controle.erroGeral} />}
          <Botao
            titulo="Adicionar ao Sereno"
            icone="map-marker-plus-outline"
            carregando={controle.salvando}
            onPress={controle.salvar}
          />
        </Cartao>
        {credito}
      </Tela>
    );
  }

  // Passo 1: buscar e escolher um lugar real no mapa.
  return (
    <Tela>
      <CabecalhoSecao
        icone="map-search-outline"
        titulo="Buscar no mapa"
        descricao="Escolha um lugar que existe de verdade. Para achar mais rápido, escreva também o bairro."
      />
      <CampoBusca
        valor={controle.busca}
        onChange={controle.setBusca}
        placeholder="Ex.: McDonald's São Mateus"
        rotuloAcessivel="Buscar lugar no mapa"
      />

      {controle.poucasLetras ? (
        <Texto secundario>Digite pelo menos 3 letras para buscar.</Texto>
      ) : controle.erroBusca ? (
        <MensagemErro mensagem={controle.erroBusca} onTentarDeNovo={controle.tentarBuscarDeNovo} />
      ) : controle.buscando && controle.resultados.length === 0 ? (
        <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
      ) : controle.resultados.length === 0 ? (
        <EstadoVazio
          icone="map-marker-question-outline"
          titulo="Não achamos no mapa"
          descricao="Confira a escrita ou acrescente o bairro e a cidade (ex.: Hamburgueria X Tatuapé)."
        />
      ) : (
        <View style={{ gap: espacamento.sm }} accessibilityLiveRegion="polite">
          <Texto variante="legenda" secundario>
            Toque no lugar certo:
          </Texto>
          {controle.resultados.map((lugar) => (
            <Cartao
              key={lugar.idMapa}
              onPress={() => controle.escolher(lugar)}
              rotuloAcessivel={`${lugar.nome}, ${lugar.endereco}. ${categorias[lugar.categoria].rotulo}. Toque para escolher.`}
            >
              <View style={[estilos.linha, { gap: espacamento.md }]}>
                <MaterialCommunityIcons
                  name={categorias[lugar.categoria].icone}
                  size={24}
                  color={cores.primaria}
                />
                <View style={estilos.flex}>
                  <Texto negrito numberOfLines={1}>
                    {lugar.nome}
                  </Texto>
                  <Texto variante="legenda" secundario numberOfLines={2}>
                    {lugar.endereco}
                  </Texto>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={cores.textoSecundario}
                />
              </View>
            </Cartao>
          ))}
        </View>
      )}
      {credito}
    </Tela>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  multilinha: {
    minHeight: 88,
    paddingTop: 12,
  },
  centro: {
    textAlign: 'center',
  },
  carregando: {
    padding: 24,
  },
});

export default AdicionarLugarScreen;
