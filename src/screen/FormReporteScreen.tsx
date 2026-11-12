import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import CabecalhoSecao from '../components/CabecalhoSecao';
import CampoTexto from '../components/CampoTexto';
import Carregando from '../components/Carregando';
import MensagemErro from '../components/MensagemErro';
import StatusEquipamentoSelo from '../components/StatusEquipamentoSelo';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useReporteFormControl } from '../control/useReporteFormControl';
import { StatusEquipamento, statusEquipamento, tiposEquipamento } from '../model/estacao';
import { AppScreenProps } from '../navigation/types';
import { AREA_MINIMA_DE_TOQUE } from '../theme';

const opcoes: StatusEquipamento[] = ['FUNCIONANDO', 'PARADO', 'EM_MANUTENCAO'];

const FormReporteScreen = ({ navigation, route }: AppScreenProps<'FormReporte'>) => {
  const { equipamentoId, reporteId } = route.params;
  const { tema } = useTema();
  const { cores, espacamento } = tema;
  const controle = useReporteFormControl(equipamentoId, reporteId, () => navigation.goBack());
  const { equipamento, form, erros } = controle;

  if (controle.carregando) {
    return <Carregando mensagem="Carregando o equipamento…" />;
  }

  if (controle.erroCarregar || !equipamento) {
    return (
      <Tela>
        <MensagemErro
          mensagem={controle.erroCarregar ?? 'Não encontramos este equipamento.'}
          onTentarDeNovo={controle.recarregar}
        />
      </Tela>
    );
  }

  const tipo = tiposEquipamento[equipamento.tipo];
  const corDoTom = { sucesso: cores.sucesso, perigo: cores.perigo, alerta: cores.alerta };

  return (
    <Tela>
      <CabecalhoSecao
        icone={tipo.icone}
        titulo={controle.editando ? 'Editar reporte' : `Como está o ${tipo.rotulo.toLowerCase()}?`}
        descricao={[
          controle.nomeEstacao && `Estação ${controle.nomeEstacao}`,
          equipamento.localizacao,
        ]
          .filter(Boolean)
          .join(' · ')}
        cor={cores.info}
        corFundoIcone={cores.infoSuave}
      />

      <View style={[estilos.linha, { gap: espacamento.sm }]}>
        <Texto secundario>Status atual:</Texto>
        <StatusEquipamentoSelo status={equipamento.statusAtual} />
      </View>

      {/* Três opções grandes, fáceis de tocar e de ler. */}
      <View style={{ gap: espacamento.sm }} accessibilityRole="radiogroup">
        {opcoes.map((status) => {
          const info = statusEquipamento[status];
          const selecionado = form.status === status;
          const cor = corDoTom[info.tom];
          return (
            <Pressable
              key={status}
              onPress={() => controle.alterar('status', status)}
              accessibilityRole="radio"
              accessibilityLabel={info.rotulo}
              accessibilityState={{ checked: selecionado }}
              style={({ pressed }) => [
                estilos.opcao,
                {
                  borderColor: selecionado ? cor : erros.status ? cores.perigo : cores.borda,
                  borderWidth: selecionado ? 2 : 1,
                  backgroundColor: selecionado ? cores.superficieAlternativa : cores.superficie,
                  borderRadius: tema.raios.medio,
                  padding: espacamento.md,
                  gap: espacamento.md,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <MaterialCommunityIcons name={info.icone} size={28} color={cor} />
              <Texto negrito style={estilos.flex}>
                {info.rotulo}
              </Texto>
              <MaterialCommunityIcons
                name={selecionado ? 'radiobox-marked' : 'radiobox-blank'}
                size={24}
                color={selecionado ? cor : cores.textoSecundario}
              />
            </Pressable>
          );
        })}
        {erros.status && (
          <Texto variante="legenda" cor={cores.perigo}>
            {erros.status}
          </Texto>
        )}
      </View>

      <CampoTexto
        rotulo="Observação (opcional)"
        placeholder="Ex.: parado desde cedo, com aviso na porta"
        value={form.observacao}
        onChangeText={(valor) => controle.alterar('observacao', valor)}
        erro={erros.observacao}
        multiline
        maxLength={300}
        textAlignVertical="top"
        style={estilos.observacao}
      />
      <Texto variante="legenda" secundario style={estilos.contador}>
        {form.observacao.length}/300
      </Texto>

      {controle.erroGeral && <MensagemErro mensagem={controle.erroGeral} />}

      <Botao
        titulo={controle.editando ? 'Salvar alterações' : 'Enviar reporte'}
        icone="send-outline"
        carregando={controle.salvando}
        desabilitado={controle.segundosParaTentar > 0}
        onPress={controle.enviar}
      />
      {controle.editando && (
        <Botao
          titulo="Excluir reporte"
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
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: AREA_MINIMA_DE_TOQUE + 8,
  },
  flex: {
    flex: 1,
  },
  observacao: {
    minHeight: 96,
    paddingTop: 12,
  },
  contador: {
    textAlign: 'right',
    marginTop: -8,
  },
});

export default FormReporteScreen;
