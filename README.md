# Sereno

**Saia de casa sabendo o que te espera.**

O Sereno é um app de acessibilidade urbana que avisa, antes de a pessoa sair, se o destino e o caminho são acessíveis para ela, **física e sensorialmente**. Ele une duas frentes:

- **Calmaria (mapa sensorial):** cidadãos avaliam lugares por ruído, luz e lotação. O app mostra o índice de calma de cada lugar, a previsão de calma por dia e horário (IA) e o resumo do que as pessoas relataram. Público: pessoas autistas, com TDAH, ansiedade ou sensibilidade sensorial.
- **Elevador Funciona? (estações):** cidadãos reportam se elevadores, escadas rolantes, rampas e plataformas estão funcionando, parados ou em manutenção. Quando algo está parado, a IA explica os direitos da pessoa com base na lei. Público: cadeirantes, idosos, pessoas com mobilidade reduzida e quem usa carrinho de bebê.

Global Solution FIAP 2026/2 · tema **CitizenTech** · área **Cidades** · ODS 3, 10 e 11 · base legal: Lei Brasileira de Inclusão (Lei 13.146/2015) e Lei Berenice Piana (Lei 12.764/2012).

## Vídeo de demonstração

▶️ [Assistir à demonstração no YouTube](https://youtu.be/Nl5kd0eG4fc)

O APK publicado no Firebase App Distribution foi gerado do commit `b646566` (o mesmo hash aparece em **Perfil → Sobre o app**). O commit seguinte só adiciona este link do vídeo ao README.

## Integrantes (2TDSPI)

| Nome                              | RM       | Responsabilidade                 |
| --------------------------------- | -------- | -------------------------------- |
| Felype Ferreira Maschio           | RM563009 | Mobile e Banco de Dados          |
| Fellipe Costa de Oliveira         | RM564673 | API Java                         |
| Eduardo Augusto de Oliveira Souza | RM565269 | API .NET e QA                    |
| Pedro Henrique dos Santos Costa   | RM562156 | DevOps, serviço de IA e QA       |
| Gustavo Vieira de Matos           | RM563304 | Pitch, dados de exemplo e testes |

## Funcionalidades

| #   | Tela                 | O que faz                                                                                                                                                                   | API                              |
| --- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1   | Login                | Entrar com e-mail e senha, com validação e mensagens de erro                                                                                                                | Java `POST /api/auth/login`      |
| 2   | Cadastro             | Criar conta (já entra no app)                                                                                                                                               | Java `POST /api/auth/register`   |
| 3   | Início               | Destino do Sereno ou do mapa → calma + previsão; estação de embarque (perto de você) e de desembarque (perto do destino) com cada elevador/escada; "Preciso de calma agora" | Java + .NET + IA + mapa          |
| 4   | Lugares              | Lista paginada com busca, filtro por categoria e índice de calma                                                                                                            | Java `GET /api/locais`           |
| 5   | Detalhe do lugar     | Índice, previsão por horário (IA), "o que as pessoas contam" (IA) e avaliações                                                                                              | Java + IA                        |
| 6   | Avaliação            | **CRUD**: criar, editar e excluir avaliação sensorial                                                                                                                       | Java `/api/avaliacoes`           |
| 7   | Estações             | Lista paginada com busca e filtro "só com equipamento parado"                                                                                                               | .NET `GET /api/estacoes`         |
| 8   | Detalhe da estação   | Equipamentos, status, "frescor" do status e "Quais são meus direitos?" (IA)                                                                                                 | .NET + IA                        |
| 9   | Reporte              | **CRUD**: criar (com `Idempotency-Key`), editar e excluir reporte                                                                                                           | .NET `/api/reportes`             |
| 10  | Minhas contribuições | Avaliações e reportes da pessoa, com editar e excluir                                                                                                                       | Java + .NET                      |
| 12  | Adicionar lugar      | Busca no mapa aberto (OpenStreetMap/Photon) e cadastra só lugares reais, sem duplicar                                                                                       | Photon + Java `POST /api/locais` |
| 11  | Perfil (aba)         | Foto de perfil (só no aparelho), edição do nome, modo baixo estímulo e logout                                                                                               | Java `/api/usuarios/me`          |
| —   | Sobre o app          | Versão e **hash do commit** da build                                                                                                                                        | —                                |

### Diferenciais

- **Modo baixo estímulo:** paleta dessaturada, sem sombras, sem animações e sem vibração. Liga sozinho se o celular estiver com "reduzir movimento" ativado.
- **Acessibilidade:** fonte Atkinson Hyperlegible (criada para baixa visão), contraste mínimo de 4,5:1 (WCAG AA), área de toque de 48 dp, status sempre com ícone + texto, rótulos para TalkBack/VoiceOver e fonte que acompanha o tamanho do sistema.
- **Uma escala só:** o índice de calma e a previsão da IA usam a mesma escala de 0 a 10 (maior = mais calmo).
- **Adicionar lugar sem "várzea":** a pessoa não digita nome nem endereço; ela escolhe um lugar real no mapa aberto (OpenStreetMap, pelo serviço gratuito Photon, sem chave de API). Antes de salvar, o app procura no Sereno o mesmo nome a menos de 150 m e, se existir, abre o lugar em vez de duplicar. O gestor continua podendo editar e excluir (moderação). O token do Sereno nunca é enviado ao serviço de mapa.
- **Frescor do status:** "confirmado há 12 min" é diferente de "sem confirmação recente", porque informação colaborativa envelhece.
- **Privacidade (LGPD):** só localização aproximada, só quando a pessoa pede, e a distância é calculada no aparelho (fórmula de Haversine). O app funciona normalmente se a permissão for negada.
- **Linguagem acolhedora** em erros e estados vazios.

## Como rodar

Pré-requisitos: Node.js 20 ou superior e o app **Expo Go** (SDK 57) no celular, ou um emulador Android.

```bash
git clone https://github.com/FelypeMaschio/sereno-app.git
cd sereno-app
npm install
cp .env.example .env      # no cmd do Windows: copy .env.example .env
npx expo start
```

Escaneie o QR code com o Expo Go. Se a rede bloquear a conexão, use `npx expo start --tunnel`.

As URLs das APIs ficam no `.env` (veja o `.env.example`). As APIs estão hospedadas no Render (plano gratuito): a primeira chamada depois de um tempo parado pode levar até um minuto, e o app avisa "Acordando o servidor…".

### Scripts

| Comando             | O que faz                           |
| ------------------- | ----------------------------------- |
| `npm start`         | Servidor de desenvolvimento do Expo |
| `npm run lint`      | ESLint + Prettier                   |
| `npm run format`    | Formata todo o código               |
| `npm run typecheck` | Checagem de tipos do TypeScript     |

## Arquitetura

O app segue a **arquitetura em camadas**: a tela só desenha, o _control_ guarda o estado e as regras, e o _repository_ conversa com as APIs.

```
screen  →  control  →  repository  →  API
(tela)     (hook)      (Axios)
```

```
src/
  model/         tipos de dados e schemas de validação (Yup)
  control/       hooks useXxxControl: estado, regras e chamadas (React Query)
  repository/
    remote/      http.ts (3 clientes Axios + interceptors) e um repository por API
    local/       SecureStore: sessão e preferências do aparelho
  screen/        as telas
  components/    componentes reutilizáveis (Botao, CampoTexto, IndiceCalma…)
  context/       AuthContext (sessão) e TemaContext (tema e baixo estímulo)
  navigation/    RootNavigator, AuthStack, AppStack, MainTabs e tipos das rotas
  theme/         cores, tipografia e espaçamentos
  utils/         validação, datas, distância, JWT e feedback
assets/          ícone, splash e fonte Atkinson Hyperlegible
```

### Navegação e proteção de rotas

`RootNavigator` decide o que existe na árvore de navegação: **sem token**, só o `AuthStack` (Login e Cadastro); **com token**, o `AppStack` (abas + detalhes e formulários). As telas restritas não existem sem login, e o logout descarta todo o histórico. Qualquer resposta **401** de qualquer API encerra a sessão automaticamente.

### Autenticação entre as três APIs

O login é feito **uma vez** na API Java, que devolve um JWT (HS256, `iss=sereno-auth`, `aud=sereno-app`, validade de 2 horas). O app guarda o token no **SecureStore** (criptografado pelo sistema) e o envia como `Authorization: Bearer` para as APIs Java, .NET e de IA, que validam o mesmo token com o mesmo segredo. O app nunca conhece o segredo.

### Idempotência nos reportes

Ao abrir o formulário de reporte, o app gera um UUID (`expo-crypto`) e o envia no header `Idempotency-Key`. Toques repetidos ou novas tentativas depois de uma falha de rede reusam a mesma chave, e a API .NET devolve o reporte original em vez de duplicar. Se a pessoa mudar os dados depois de uma falha, uma nova chave é gerada. O erro **429** mostra uma contagem regressiva a partir do header `Retry-After`.

## Bibliotecas e por que cada uma

| Biblioteca                                                                                                             | Para quê                                                                          |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `@react-navigation/native`, `native-stack`, `bottom-tabs` (+ `react-native-screens`, `react-native-safe-area-context`) | Navegação com telas nativas, abas e área segura                                   |
| `axios`                                                                                                                | HTTP com instâncias por API, interceptors (token, 401, erro padrão) e timeout     |
| `@tanstack/react-query`                                                                                                | Cache, carregamento/erro, paginação infinita e atualização das listas após o CRUD |
| `yup`                                                                                                                  | Validação dos formulários com as mesmas regras das APIs                           |
| `expo-secure-store`                                                                                                    | Guardar o token criptografado (o AsyncStorage guardaria em texto puro)            |
| `expo-crypto`                                                                                                          | UUID da `Idempotency-Key`                                                         |
| `expo-location`                                                                                                        | Localização aproximada para "Preciso de calma agora"                              |
| `expo-font` + `expo-splash-screen`                                                                                     | Fonte Atkinson Hyperlegible e splash até a fonte carregar                         |
| `expo-image-picker` + `expo-file-system`                                                                               | Foto de perfil pela galeria ou câmera, guardada só no aparelho (LGPD)             |
| `expo-constants`                                                                                                       | Ler o hash do commit na tela Sobre                                                |
| `@expo/vector-icons`                                                                                                   | Ícones consistentes em todos os aparelhos (emojis mudam de um celular para outro) |
| ESLint + Prettier                                                                                                      | Padronização e qualidade do código                                                |

## Build e publicação

O APK é gerado pelo EAS Build e publicado no **Firebase App Distribution**, com o professor como tester.

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

As URLs das APIs do build ficam no `eas.json` (o `.env` não vai para o build). A tela **Sobre o app** mostra o hash do commit compilado (`EAS_BUILD_GIT_COMMIT_HASH`), que corresponde ao código deste repositório.

## Declaração de uso de IA

Usamos um assistente de IA generativa como apoio no desenvolvimento do app mobile: para tirar dúvidas, revisar e sugerir código, verificar acessibilidade e preparar a documentação. Todas as decisões de arquitetura, as escolhas de bibliotecas e o código foram revisados, testados e entendidos pelo grupo, que é responsável pelo resultado.

Dentro do produto, a IA aparece em três funções: o resumo das avaliações (Spring AI, na API Java), a previsão de calma por horário e a orientação sobre direitos com base na lei (serviço de IA em Python).
