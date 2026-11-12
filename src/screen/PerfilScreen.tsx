import { StyleSheet, Switch, View } from 'react-native';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Carregando from '../components/Carregando';
import Cartao from '../components/Cartao';
import MensagemErro from '../components/MensagemErro';
import Selo from '../components/Selo';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { usePerfilControl } from '../control/usePerfilControl';
import { AppScreenProps } from '../navigation/types';

/** Iniciais para o "avatar" (ex.: "Felype Maschio" → "FM"). */
const iniciais = (nome?: string) =>
  (nome ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('');

const PerfilScreen = ({ navigation }: AppScreenProps<'Perfil'>) => {
  const { tema, modoBaixoEstimulo, setModoBaixoEstimulo } = useTema();
  const { cores, espacamento } = tema;
  const controle = usePerfilControl();
  const { usuario } = controle;

  if (controle.carregando) return <Carregando mensagem="Carregando seu perfil…" />;

  return (
    <Tela>
      <View style={[estilos.topo, { gap: espacamento.sm }]}>
        <View
          style={[estilos.avatar, { backgroundColor: cores.primaria }]}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          <Texto variante="titulo" cor={cores.textoSobrePrimaria}>
            {iniciais(usuario?.nome)}
          </Texto>
        </View>
        <Texto variante="subtitulo">{usuario?.nome}</Texto>
        <Texto secundario>{usuario?.email}</Texto>
        {usuario?.role && (
          <Selo
            texto={usuario.role === 'GESTOR' ? 'Gestor(a)' : 'Cidadã(o)'}
            icone={usuario.role === 'GESTOR' ? 'shield-account-outline' : 'account-outline'}
            tom="primaria"
          />
        )}
      </View>

      <Cartao style={{ gap: espacamento.md }}>
        <Texto variante="subtitulo">Seus dados</Texto>
        <CampoTexto
          rotulo="Nome"
          value={controle.nome}
          onChangeText={controle.setNome}
          erro={controle.erros.nome}
          autoComplete="name"
        />
        {controle.erroGeral && <MensagemErro mensagem={controle.erroGeral} />}
        <Botao
          titulo="Salvar nome"
          icone="content-save-outline"
          carregando={controle.salvando}
          desabilitado={!controle.nomeAlterado}
          onPress={controle.enviar}
        />
      </Cartao>

      <Cartao>
        <Texto variante="subtitulo">Preferências</Texto>
        <View style={estilos.linha}>
          <View style={estilos.flex}>
            <Texto negrito>Modo baixo estímulo</Texto>
            <Texto variante="legenda" secundario>
              Cores mais suaves, sem sombras, sem animações e sem vibração.
            </Texto>
          </View>
          <Switch
            value={modoBaixoEstimulo}
            onValueChange={setModoBaixoEstimulo}
            accessibilityLabel="Modo baixo estímulo"
            trackColor={{ true: cores.primaria, false: cores.borda }}
            thumbColor={cores.superficie}
          />
        </View>
      </Cartao>

      <Botao
        titulo="Sobre o app"
        icone="information-outline"
        variante="secundario"
        onPress={() => navigation.navigate('Sobre')}
      />
      <Botao titulo="Sair da conta" icone="logout" variante="perigo" onPress={controle.sair} />
    </Tela>
  );
};

const estilos = StyleSheet.create({
  topo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
});

export default PerfilScreen;
