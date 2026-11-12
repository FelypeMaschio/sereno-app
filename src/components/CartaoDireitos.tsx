import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useDireitosControl } from '../control/useDireitosControl';
import { Equipamento, Estacao } from '../model/estacao';
import Botao from './Botao';
import CampoTexto from './CampoTexto';
import Cartao from './Cartao';
import MensagemErro from './MensagemErro';
import Texto from './Texto';

interface CartaoDireitosProps {
  estacao: Estacao;
  comProblema: Equipamento[];
}

/**
 * "Quais são meus direitos?": aparece quando algum equipamento da estação não está
 * funcionando. A IA responde com base na Lei Brasileira de Inclusão (13.146/2015) e
 * na Lei Berenice Piana (12.764/2012), citando os artigos.
 */
const CartaoDireitos = ({ estacao, comProblema }: CartaoDireitosProps) => {
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const controle = useDireitosControl(estacao, comProblema);
  const { resposta } = controle;

  return (
    <Cartao style={{ gap: espacamento.md, borderColor: cores.info, borderWidth: 1 }}>
      <View style={[estilos.linha, { gap: espacamento.sm }]}>
        <MaterialCommunityIcons name="scale-balance" size={24} color={cores.info} />
        <Texto variante="subtitulo" style={estilos.flex}>
          Quais são meus direitos?
        </Texto>
      </View>

      {!controle.aberto ? (
        <>
          <Texto secundario>
            Equipamento de acessibilidade parado? Veja o que a lei garante a você.
          </Texto>
          <Botao titulo="Consultar meus direitos" icone="creation" onPress={controle.abrir} />
        </>
      ) : (
        <>
          <CampoTexto
            rotulo="Conte sua situação"
            value={controle.situacao}
            onChangeText={controle.setSituacao}
            erro={controle.erroSituacao}
            multiline
            maxLength={500}
            textAlignVertical="top"
            style={estilos.situacao}
          />
          <Botao
            titulo={resposta ? 'Perguntar de novo' : 'Consultar'}
            icone="send-outline"
            carregando={controle.consultando}
            onPress={controle.enviar}
          />
          {controle.erroGeral && (
            <MensagemErro
              mensagem="Não consegui consultar seus direitos agora. Tente de novo em instantes."
              onTentarDeNovo={controle.enviar}
            />
          )}

          {resposta && (
            <View style={{ gap: espacamento.md }} accessibilityLiveRegion="polite">
              <Texto>{resposta.resposta}</Texto>

              {/* Sem base legal encontrada, a lista vem vazia: a seção não aparece. */}
              {resposta.encontrouBase && resposta.fontes.length > 0 && (
                <View style={{ gap: espacamento.sm }}>
                  <Texto negrito>Base legal</Texto>
                  {resposta.fontes.map((fonte) => (
                    <View
                      key={`${fonte.lei}-${fonte.artigo}`}
                      style={[
                        estilos.fonte,
                        {
                          backgroundColor: cores.infoSuave,
                          borderRadius: tema.raios.medio,
                          padding: espacamento.md,
                          gap: espacamento.sm,
                        },
                      ]}
                    >
                      <Texto negrito>
                        {fonte.lei}, {fonte.artigo}
                      </Texto>
                      <Texto variante="legenda" numberOfLines={4}>
                        {fonte.trecho}
                      </Texto>
                      {fonte.url.startsWith('https://') && (
                        <Botao
                          titulo="Ler na lei"
                          icone="open-in-new"
                          variante="secundario"
                          dica="Abre o texto da lei no navegador"
                          onPress={() => controle.abrirLei(fonte.url)}
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* O aviso aparece sempre: a resposta é informativa, não é parecer jurídico. */}
              <View style={[estilos.linha, { gap: espacamento.sm }]}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={16}
                  color={cores.textoSecundario}
                />
                <Texto variante="legenda" secundario style={estilos.flex}>
                  {resposta.aviso}
                </Texto>
              </View>
            </View>
          )}
        </>
      )}
    </Cartao>
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
  situacao: {
    minHeight: 96,
    paddingTop: 12,
  },
  fonte: {
    alignItems: 'stretch',
  },
});

export default CartaoDireitos;
