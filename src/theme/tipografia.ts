/**
 * Tipografia do Sereno: Atkinson Hyperlegible, criada pelo Braille Institute para
 * pessoas com baixa visão. As letras parecidas (I, l, 1 / O, 0) têm formas bem
 * distintas, o que também ajuda pessoas com dislexia.
 *
 * Os arquivos .ttf ficam em assets/fonts e são carregados no App.tsx com useFonts.
 * No Android, uma fonte personalizada não aceita fontWeight: por isso cada peso é
 * uma família separada.
 */
export const familias = {
  regular: 'AtkinsonHyperlegible-Regular',
  negrito: 'AtkinsonHyperlegible-Bold',
} as const;

export const arquivosDeFonte = {
  [familias.regular]: require('../../assets/fonts/AtkinsonHyperlegible_400Regular.ttf'),
  [familias.negrito]: require('../../assets/fonts/AtkinsonHyperlegible_700Bold.ttf'),
};

/** Tamanhos-base em pontos. O sistema ainda pode aumentá-los (fonte grande do celular). */
export const tamanhos = {
  legenda: 14,
  corpo: 17,
  subtitulo: 20,
  titulo: 26,
} as const;

/** Altura de linha generosa (1,4x a 1,5x) facilita a leitura. */
export const alturasDeLinha = {
  legenda: 20,
  corpo: 25,
  subtitulo: 28,
  titulo: 34,
} as const;

/**
 * Limite de ampliação pela configuração do sistema. Respeitamos a fonte grande do
 * usuário, mas até 2x, para o layout não quebrar.
 */
export const multiplicadorMaximoDeFonte = 2;
