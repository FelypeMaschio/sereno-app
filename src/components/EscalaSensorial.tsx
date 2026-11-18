import { Pressable, StyleSheet, Vibration, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { AREA_MINIMA_DE_TOQUE } from '../theme';
import Texto from './Texto';

type NomeIcone = keyof typeof MaterialCommunityIcons.glyphMap;

interface EscalaSensorialProps {
  rotulo: string;
  /** Um ícone por nível (1 a 5), do mais tranquilo ao mais intenso. */
  icones: [NomeIcone, NomeIcone, NomeIcone, NomeIcone, NomeIcone];
  niveis: string[];
  valor: number | null;
  onChange: (valor: number) => void;
  erro?: string;
}

/**
 * Escala de 1 a 5 com ícones que "crescem" em intensidade, em vez de só números.
 * O nível escolhido aparece por extenso ("Pouco barulho") e é lido pelo leitor de tela.
 * Um toque curto de vibração confirma a escolha (desligado no modo baixo estímulo).
 */
const EscalaSensorial = ({
  rotulo,
  icones,
  niveis,
  valor,
  onChange,
  erro,
}: EscalaSensorialProps) => {
  const { tema } = useTema();
  const { cores } = tema;

  const escolher = (nivel: number) => {
    // 40 ms: curto o bastante para não incomodar, longo o bastante para ser sentido
    // (toques de 15 ms quase não são percebidos em muitos celulares Android).
    if (tema.animacoes) Vibration.vibrate(40);
    onChange(nivel);
  };

  return (
    <View style={{ gap: tema.espacamento.sm }} accessibilityRole="radiogroup">
      <View style={estilos.cabecalho}>
        <Texto negrito>{rotulo}</Texto>
        <Texto variante="legenda" secundario>
          {valor ? niveis[valor - 1] : 'Escolha um nível'}
        </Texto>
      </View>
      <View style={[estilos.opcoes, { gap: tema.espacamento.sm }]}>
        {icones.map((icone, indice) => {
          const nivel = indice + 1;
          const selecionado = valor === nivel;
          return (
            <Pressable
              key={nivel}
              onPress={() => escolher(nivel)}
              accessibilityRole="radio"
              accessibilityLabel={`${rotulo}: ${nivel} de 5, ${niveis[indice]}`}
              accessibilityState={{ checked: selecionado }}
              style={({ pressed }) => [
                estilos.opcao,
                {
                  backgroundColor: selecionado ? cores.primaria : cores.superficie,
                  borderColor: selecionado ? cores.primaria : erro ? cores.perigo : cores.borda,
                  borderRadius: tema.raios.medio,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={icone}
                size={24}
                color={selecionado ? cores.textoSobrePrimaria : cores.primaria}
              />
              <Texto
                variante="legenda"
                negrito
                cor={selecionado ? cores.textoSobrePrimaria : cores.textoSecundario}
              >
                {nivel}
              </Texto>
            </Pressable>
          );
        })}
      </View>
      <View style={estilos.cabecalho}>
        <Texto variante="legenda" secundario>
          {niveis[0]}
        </Texto>
        <Texto variante="legenda" secundario>
          {niveis[niveis.length - 1]}
        </Texto>
      </View>
      {erro && (
        <Texto variante="legenda" cor={cores.perigo}>
          {erro}
        </Texto>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  opcoes: {
    flexDirection: 'row',
  },
  opcao: {
    flex: 1,
    minHeight: AREA_MINIMA_DE_TOQUE + 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 6,
  },
});

export default EscalaSensorial;
