import { Image, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Cartao from '../components/Cartao';
import Tela from '../components/Tela';
import Texto from '../components/Texto';
import { useTema } from '../context/TemaContext';
import { AppScreenProps } from '../navigation/types';
import { formatarData } from '../utils/formatacao';

const integrantes = [
  { nome: 'Felype Ferreira Maschio', rm: 'RM563009', papel: 'Mobile e Banco de Dados' },
  { nome: 'Fellipe Costa de Oliveira', rm: 'RM564673', papel: 'API Java' },
  { nome: 'Eduardo Augusto de Oliveira Souza', rm: 'RM565269', papel: 'API .NET e QA' },
  { nome: 'Pedro Henrique dos Santos Costa', rm: 'RM562156', papel: 'DevOps, IA e QA' },
  { nome: 'Gustavo Vieira de Matos', rm: 'RM563304', papel: 'Pitch, dados e testes' },
];

/** Linha "rótulo: valor" com ícone. */
const Info = ({
  icone,
  rotulo,
  valor,
}: {
  icone: keyof typeof MaterialCommunityIcons.glyphMap;
  rotulo: string;
  valor: string;
}) => {
  const { tema } = useTema();
  return (
    <View style={[estilos.linha, { gap: tema.espacamento.sm }]} accessible>
      <MaterialCommunityIcons name={icone} size={20} color={tema.cores.primaria} />
      <Texto secundario style={estilos.rotulo}>
        {rotulo}
      </Texto>
      <Texto negrito selectable style={estilos.flex}>
        {valor}
      </Texto>
    </View>
  );
};

/**
 * Sobre o app. O hash do commit vem do app.config.js (extra.commitHash) e prova que
 * a versão publicada no Firebase App Distribution corresponde ao código do repositório.
 */
const SobreScreen = (_props: AppScreenProps<'Sobre'>) => {
  const { tema } = useTema();
  const { espacamento } = tema;
  const config = Constants.expoConfig;
  const commit = (config?.extra?.commitHash as string | undefined) ?? 'desconhecido';
  const buildEm = config?.extra?.buildEm as string | undefined;

  return (
    <Tela>
      <View style={[estilos.topo, { gap: espacamento.sm }]}>
        <Image
          source={require('../../assets/icon.png')}
          style={[estilos.icone, { borderRadius: tema.raios.grande }]}
          accessible={false}
        />
        <Texto variante="titulo">Sereno</Texto>
        <Texto secundario style={estilos.centro}>
          Saia de casa sabendo o que te espera: acessibilidade urbana, física e sensorial.
        </Texto>
      </View>

      <Cartao>
        <Texto variante="subtitulo">Versão</Texto>
        <Info icone="tag-outline" rotulo="Versão" valor={config?.version ?? '1.0.0'} />
        <Info icone="source-commit" rotulo="Commit" valor={commit} />
        {buildEm ? (
          <Info icone="calendar-check-outline" rotulo="Gerado em" valor={formatarData(buildEm)} />
        ) : null}
      </Cartao>

      <Cartao>
        <Texto variante="subtitulo">Equipe 2TDSPI</Texto>
        {integrantes.map(({ nome, rm, papel }) => (
          <View key={rm} accessible>
            <Texto negrito>{nome}</Texto>
            <Texto variante="legenda" secundario>
              {rm} · {papel}
            </Texto>
          </View>
        ))}
      </Cartao>

      <Cartao>
        <Texto variante="subtitulo">Sobre o projeto</Texto>
        <Texto>
          Global Solution FIAP 2026/2 · CitizenTech. ODS 3 (saúde e bem-estar), 10 (redução das
          desigualdades) e 11 (cidades sustentáveis).
        </Texto>
        <Texto variante="legenda" secundario>
          Base legal: Lei Brasileira de Inclusão (Lei 13.146/2015) e Lei Berenice Piana (Lei
          12.764/2012).
        </Texto>
        <Texto variante="legenda" secundario>
          Sua localização só é usada no aparelho, quando você pede um lugar calmo por perto, e nunca
          é enviada para o servidor.
        </Texto>
      </Cartao>
    </Tela>
  );
};

const estilos = StyleSheet.create({
  topo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  icone: {
    width: 96,
    height: 96,
  },
  centro: {
    textAlign: 'center',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rotulo: {
    width: 84,
  },
  flex: {
    flex: 1,
  },
});

export default SobreScreen;
