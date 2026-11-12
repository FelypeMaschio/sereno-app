Este é o app mobile do **Sereno** (Expo + React Native + TypeScript), projeto da Global Solution FIAP 2026/2 da turma 2TDSPI.

## Versões

- Expo SDK 57 (React Native 0.86, React 19.2). Consulte sempre a documentação da versão certa: https://docs.expo.dev/versions/v57.0.0/
- Instale pacotes com `npx expo install <pacote>`, que escolhe a versão compatível com o SDK.

## Navegação

- **React Navigation** (`@react-navigation/native`, `native-stack` e `bottom-tabs`).
- **Não usar Expo Router.**
- A proteção de rotas é feita no `RootNavigator`: sem token, só existe o `AuthStack`.

## Arquitetura (camadas)

```
src/
  model/        → tipos e schemas de validação
  control/      → hooks useXxxControl (estado e regras de cada tela)
  repository/   → acesso a dados: remote/ (Axios) e local/ (SecureStore)
  screen/       → telas
  components/   → componentes reutilizáveis
  context/      → Contexts (autenticação e tema)
  navigation/   → navigators e tipos das rotas
  theme/        → cores, fontes e espaçamentos
  utils/        → funções auxiliares
```

Fluxo: `screen` → `control` → `repository` → API.

## Comandos

```bash
npx expo start       # servidor de desenvolvimento
npm run lint         # ESLint + Prettier
npm run format       # formata o código
npm run typecheck    # checagem de tipos
```

Rode `npm run lint` e `npm run typecheck` antes de cada commit.

## Commits

Padrão `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`, com mensagens em português e um assunto por commit.
