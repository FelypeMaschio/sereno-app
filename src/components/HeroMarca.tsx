import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Texto from './Texto';

const COR_HERO = '#1F6F6B';
const COR_TEXTO_HERO = '#F6F3EC';
const COR_TEXTO_HERO_SUAVE = '#CFE3DF';

interface HeroMarcaProps {
  titulo?: string;
  subtitulo?: string;
  compacto?: boolean;
}

/**
 * Faixa com a marca do Sereno, usada nas telas públicas (Login e Cadastro).
 * Usa as mesmas cores da splash, então a passagem splash → login fica contínua.
 */
const HeroMarca = ({
  titulo = 'Sereno',
  subtitulo = 'Saia de casa sabendo o que te espera.',
  compacto = false,
}: HeroMarcaProps) => {
  const insets = useSafeAreaInsets();
  const tamanhoLogo = compacto ? 56 : 88;

  return (
    <View style={[estilos.hero, { paddingTop: insets.top + (compacto ? 16 : 40) }]}>
      <Image
        source={require('../../assets/splash-icon.png')}
        style={{ width: tamanhoLogo, height: tamanhoLogo }}
        resizeMode="contain"
        accessible={false}
      />
      <Texto variante="titulo" cor={COR_TEXTO_HERO} style={!compacto && estilos.tituloGrande}>
        {titulo}
      </Texto>
      <Texto cor={COR_TEXTO_HERO_SUAVE} style={estilos.centro}>
        {subtitulo}
      </Texto>
    </View>
  );
};

const estilos = StyleSheet.create({
  hero: {
    backgroundColor: COR_HERO,
    alignItems: 'center',
    paddingHorizontal: 24,
    // Espaço extra embaixo: o cartão do formulário "sobe" por cima da faixa.
    paddingBottom: 56,
    gap: 8,
  },
  tituloGrande: {
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: 1,
  },
  centro: {
    textAlign: 'center',
  },
});

export { COR_HERO };
export default HeroMarca;
