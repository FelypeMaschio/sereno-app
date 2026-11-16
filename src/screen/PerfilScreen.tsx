import { StyleSheet, Switch, View } from 'react-native';
import Avatar from '../components/Avatar';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Carregando from '../components/Carregando';
import Cartao from '../components/Cartao';
import MensagemErro from '../components/MensagemErro';
import Selo from '../components/Selo';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { useFotoPerfilControl } from '../control/useFotoPerfilControl';
import { usePerfilControl } from '../control/usePerfilControl';
import { TabScreenProps } from '../navigation/types';

const PerfilScreen = ({ navigation }: TabScreenProps<'Perfil'>) => {
  const { tema, modoBaixoEstimulo, setModoBaixoEstimulo } = useTema();
  const { cores, espacamento } = tema;
  const controle = usePerfilControl();
  const foto = useFotoPerfilControl();
  const { usuario } = controle;

  if (controle.carregando) return <Carregando mensagem="Carregando seu perfil…" />;

  return (
    <Tela>
      <View style={[estilos.topo, { gap: espacamento.sm }]}>
        <Avatar nome={usuario?.nome} uri={foto.uri} />
        <Texto variante="subtitulo">{usuario?.nome}</Texto>
        <Texto secundario>{usuario?.email}</Texto>
        {usuario?.role && (
          <View style={estilos.centro}>
            <Selo
              texto={usuario.role === 'GESTOR' ? 'Gestor(a)' : 'Cidadã(o)'}
              icone={usuario.role === 'GESTOR' ? 'shield-account-outline' : 'account-outline'}
              tom="primaria"
            />
          </View>
        )}
      </View>

      <Cartao style={{ gap: espacamento.md }}>
        <Texto variante="subtitulo">Foto de perfil</Texto>
        <Texto variante="legenda" secundario>
          A foto fica guardada só neste celular. Ela não é enviada para nenhum servidor.
        </Texto>
        <View style={[estilos.botoesFoto, { gap: espacamento.sm }]}>
          <View style={estilos.flex}>
            <Botao
              titulo="Galeria"
              icone="image-outline"
              variante="secundario"
              carregando={foto.trocando}
              onPress={foto.escolherDaGaleria}
              dica="Escolher uma foto da galeria"
            />
          </View>
          <View style={estilos.flex}>
            <Botao
              titulo="Câmera"
              icone="camera-outline"
              variante="secundario"
              desabilitado={foto.trocando}
              onPress={foto.tirarFoto}
              dica="Tirar uma foto agora"
            />
          </View>
        </View>
        {foto.uri && (
          <Botao
            titulo="Remover foto"
            icone="trash-can-outline"
            variante="secundario"
            onPress={foto.remover}
          />
        )}
      </Cartao>

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
  botoesFoto: {
    flexDirection: 'row',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  centro: {
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});

export default PerfilScreen;
