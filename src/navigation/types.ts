import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Rotas e parâmetros de cada navigator. `undefined` = a tela não recebe parâmetros.
 * Tipar as rotas faz o TypeScript acusar erro se navegarmos para uma tela que não
 * existe ou esquecermos um parâmetro obrigatório (ex.: o id do lugar).
 */

/** Telas públicas: só existem na árvore quando NÃO há login. */
export type AuthStackParamList = {
  Login: undefined;
  Cadastro: undefined;
};

/** Abas inferiores do app logado. */
export type MainTabsParamList = {
  Inicio: undefined;
  Lugares: undefined;
  Estacoes: undefined;
  Contribuicoes: undefined;
  Perfil: undefined;
};

/** Pilha do app logado: as abas + telas de detalhe e formulários por cima delas. */
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  DetalheLugar: { localId: number };
  /** Sem avaliacaoId = nova avaliação; com avaliacaoId = edição. */
  FormAvaliacao: { localId: number; avaliacaoId?: number };
  DetalheEstacao: { estacaoId: number };
  /** Sem reporteId = novo reporte; com reporteId = edição. */
  FormReporte: { equipamentoId: number; reporteId?: number };
  Sobre: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>;

/**
 * Uma aba também precisa navegar para telas da pilha de fora (ex.: Lugares → DetalheLugar).
 * CompositeScreenProps junta os dois tipos de navegação.
 */
export type TabScreenProps<T extends keyof MainTabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, T>,
  NativeStackScreenProps<AppStackParamList>
>;

// Faz o useNavigation() conhecer todas as rotas sem precisar tipar a cada uso.
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList, AuthStackParamList {}
  }
}
