import { DefaultTheme, Theme } from '@react-navigation/native';
import { Tema } from '../theme';

/**
 * Converte o nosso tema no formato que o React Navigation espera, para que
 * cabeçalhos, abas e fundos das telas usem as mesmas cores e fontes do app.
 */
export const criarTemaNavegacao = (tema: Tema): Theme => ({
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: tema.cores.primaria,
    background: tema.cores.fundo,
    card: tema.cores.superficie,
    text: tema.cores.texto,
    border: tema.cores.borda,
    notification: tema.cores.perigo,
  },
  fonts: {
    // Fonte personalizada no Android: o peso vem da família, não do fontWeight.
    regular: { fontFamily: tema.familias.regular, fontWeight: 'normal' },
    medium: { fontFamily: tema.familias.regular, fontWeight: 'normal' },
    bold: { fontFamily: tema.familias.negrito, fontWeight: 'normal' },
    heavy: { fontFamily: tema.familias.negrito, fontWeight: 'normal' },
  },
});
