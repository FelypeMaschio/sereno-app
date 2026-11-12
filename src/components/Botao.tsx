import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { AREA_MINIMA_DE_TOQUE } from '../theme';
import Texto from './Texto';

type Variante = 'primario' | 'secundario' | 'perigo';

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  icone?: keyof typeof MaterialCommunityIcons.glyphMap;
  carregando?: boolean;
  desabilitado?: boolean;
  /** Explica o que acontece ao tocar, lido pelo leitor de tela depois do título. */
  dica?: string;
}

const Botao = ({
  titulo,
  onPress,
  variante = 'primario',
  icone,
  carregando = false,
  desabilitado = false,
  dica,
}: BotaoProps) => {
  const { tema } = useTema();
  const { cores } = tema;
  const inativo = desabilitado || carregando;

  const corFundo = {
    primario: cores.primaria,
    secundario: cores.superficie,
    perigo: cores.perigo,
  }[variante];
  const corTexto = variante === 'secundario' ? cores.primaria : cores.textoSobrePrimaria;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={dica}
      // "busy" avisa o leitor de tela que a ação está em andamento.
      accessibilityState={{ disabled: inativo, busy: carregando }}
      style={({ pressed }) => [
        estilos.botao,
        {
          backgroundColor: corFundo,
          borderColor: variante === 'secundario' ? cores.primaria : corFundo,
          borderRadius: tema.raios.medio,
          paddingHorizontal: tema.espacamento.lg,
          // Retorno visual ao tocar sem animação: só muda a opacidade.
          // Carregando mantém a cor cheia para o indicador continuar bem visível.
          opacity: desabilitado ? 0.55 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <View style={estilos.conteudo}>
          {icone && <MaterialCommunityIcons name={icone} size={22} color={corTexto} />}
          <Texto negrito cor={corTexto}>
            {titulo}
          </Texto>
        </View>
      )}
    </Pressable>
  );
};

const estilos = StyleSheet.create({
  botao: {
    minHeight: AREA_MINIMA_DE_TOQUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default Botao;
