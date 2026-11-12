import { StyleSheet, View } from 'react-native';
import Botao from '../components/Botao';
import CabecalhoSecao from '../components/CabecalhoSecao';
import CampoTexto from '../components/CampoTexto';
import Carregando from '../components/Carregando';
import Cartao from '../components/Cartao';
import Chip from '../components/Chip';
import EscalaSensorial from '../components/EscalaSensorial';
import MensagemErro from '../components/MensagemErro';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useAvaliacaoFormControl } from '../control/useAvaliacaoFormControl';
import { escalas } from '../model/avaliacao';
import { Periodo, periodos } from '../model/local';
import { AppScreenProps } from '../navigation/types';

const FormAvaliacaoScreen = ({ navigation, route }: AppScreenProps<'FormAvaliacao'>) => {
  const { localId, avaliacaoId } = route.params;
  const { tema } = useTema();
  const { espacamento } = tema;
  const controle = useAvaliacaoFormControl(localId, avaliacaoId, () => navigation.goBack());
  const { form, erros, alterar } = controle;

  if (controle.carregando) {
    return <Carregando mensagem="Carregando sua avaliação…" />;
  }

  if (controle.erroCarregar) {
    return (
      <Tela>
        <MensagemErro mensagem={controle.erroCarregar} onTentarDeNovo={controle.recarregar} />
      </Tela>
    );
  }

  return (
    <Tela>
      <CabecalhoSecao
        icone="star-outline"
        titulo={controle.editando ? 'Editar avaliação' : 'Como foi lá?'}
        descricao={
          controle.nomeLocal
            ? `${controle.nomeLocal}: conte como estavam o ruído, a luz e a lotação.`
            : 'Conte como estavam o ruído, a luz e a lotação.'
        }
      />

      <Cartao style={{ gap: espacamento.lg }}>
        <EscalaSensorial
          rotulo={escalas.nivelRuido.rotulo}
          niveis={escalas.nivelRuido.niveis}
          icones={['volume-off', 'volume-low', 'volume-medium', 'volume-high', 'volume-vibrate']}
          valor={form.nivelRuido}
          onChange={(valor) => alterar('nivelRuido', valor)}
          erro={erros.nivelRuido}
        />
        <EscalaSensorial
          rotulo={escalas.nivelIluminacao.rotulo}
          niveis={escalas.nivelIluminacao.niveis}
          icones={[
            'weather-night',
            'weather-partly-cloudy',
            'white-balance-sunny',
            'weather-sunny',
            'flash',
          ]}
          valor={form.nivelIluminacao}
          onChange={(valor) => alterar('nivelIluminacao', valor)}
          erro={erros.nivelIluminacao}
        />
        <EscalaSensorial
          rotulo={escalas.nivelLotacao.rotulo}
          niveis={escalas.nivelLotacao.niveis}
          icones={[
            'account-outline',
            'account',
            'account-multiple-outline',
            'account-multiple',
            'account-group',
          ]}
          valor={form.nivelLotacao}
          onChange={(valor) => alterar('nivelLotacao', valor)}
          erro={erros.nivelLotacao}
        />
      </Cartao>

      <View style={{ gap: espacamento.sm }}>
        <Texto negrito>Quando você foi?</Texto>
        <View style={[estilos.chips, { gap: espacamento.sm }]}>
          {(Object.keys(periodos) as Periodo[]).map((periodo) => (
            <Chip
              key={periodo}
              rotulo={periodos[periodo].rotulo}
              icone={periodos[periodo].icone}
              selecionado={form.periodoVisita === periodo}
              onPress={() => alterar('periodoVisita', periodo)}
            />
          ))}
        </View>
        {erros.periodoVisita && (
          <Texto variante="legenda" cor={tema.cores.perigo}>
            {erros.periodoVisita}
          </Texto>
        )}
      </View>

      <CampoTexto
        rotulo="Comentário (opcional)"
        placeholder="Ex.: tranquilo de manhã, mas a música alta começa às 11h"
        value={form.comentario}
        onChangeText={(valor) => alterar('comentario', valor)}
        erro={erros.comentario}
        multiline
        maxLength={500}
        textAlignVertical="top"
        style={estilos.comentario}
      />
      <Texto variante="legenda" secundario style={estilos.contador}>
        {form.comentario.length}/500
      </Texto>

      {controle.erroGeral && <MensagemErro mensagem={controle.erroGeral} />}

      <Botao
        titulo={controle.editando ? 'Salvar alterações' : 'Publicar avaliação'}
        icone="check"
        carregando={controle.salvando}
        onPress={controle.enviar}
      />
      {controle.editando && (
        <Botao
          titulo="Excluir avaliação"
          icone="trash-can-outline"
          variante="perigo"
          carregando={controle.excluindo}
          onPress={controle.excluir}
        />
      )}
    </Tela>
  );
};

const estilos = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  comentario: {
    minHeight: 110,
    paddingTop: 12,
  },
  contador: {
    textAlign: 'right',
    marginTop: -8,
  },
});

export default FormAvaliacaoScreen;
