import { useEffect } from 'react';
import { Animated, Easing, Image, StyleSheet, useAnimatedValue, View } from 'react-native';
import { useTema } from '../context/TemaContext';
import Texto from './Texto';

const CORES_SPLASH = {
  fundo: '#1F6F6B', // mesma cor da splash nativa (app.json): a transição fica imperceptível
  texto: '#F6F3EC',
  textoSuave: '#CFE3DF',
};

interface SplashAnimadaProps {
  /** Chamado quando a animação termina e a splash pode sair da tela. */
  onFim: () => void;
}

/**
 * Splash animada exibida logo depois da splash nativa.
 *
 * A splash nativa (configurada no app.json) é só uma imagem estática, mostrada pelo
 * sistema enquanto o JavaScript carrega. Esta aqui continua de onde ela parou:
 * o símbolo "respira" uma vez, o nome aparece e tudo some suavemente.
 *
 * Usa a API Animated do React Native com useNativeDriver: a animação roda na thread
 * nativa, sem travar mesmo se o JavaScript estiver ocupado.
 * No modo baixo estímulo não há movimento: a splash aparece parada e sai rápido.
 */
const SplashAnimada = ({ onFim }: SplashAnimadaProps) => {
  const { tema } = useTema();
  // useAnimatedValue cria o valor animado uma única vez e o mantém entre renders.
  const escalaLogo = useAnimatedValue(tema.animacoes ? 0.9 : 1);
  const opacidadeTexto = useAnimatedValue(tema.animacoes ? 0 : 1);
  const opacidadeTela = useAnimatedValue(1);

  useEffect(() => {
    if (!tema.animacoes) {
      const temporizador = setTimeout(onFim, 500);
      return () => clearTimeout(temporizador);
    }

    const animacao = Animated.sequence([
      Animated.parallel([
        // "Respiração": o símbolo cresce devagar, como uma inspiração.
        Animated.timing(escalaLogo, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacidadeTexto, {
          toValue: 1,
          duration: 700,
          delay: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(400),
      Animated.timing(opacidadeTela, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]);
    animacao.start(() => onFim());
    return () => animacao.stop();
  }, [tema.animacoes, escalaLogo, opacidadeTexto, opacidadeTela, onFim]);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, estilos.container, { opacity: opacidadeTela }]}
      accessibilityLabel="Sereno, carregando"
    >
      <Animated.View style={{ transform: [{ scale: escalaLogo }] }}>
        <Image
          source={require('../../assets/splash-icon.png')}
          style={estilos.logo}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
      <Animated.View style={[estilos.textos, { opacity: opacidadeTexto }]}>
        <Texto variante="titulo" cor={CORES_SPLASH.texto} style={estilos.nome}>
          Sereno
        </Texto>
        <Texto cor={CORES_SPLASH.textoSuave}>Saia de casa sabendo o que te espera.</Texto>
      </Animated.View>
      <View />
    </Animated.View>
  );
};

const estilos = StyleSheet.create({
  container: {
    backgroundColor: CORES_SPLASH.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logo: {
    width: 160,
    height: 160,
  },
  textos: {
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  nome: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 1,
  },
});

export default SplashAnimada;
