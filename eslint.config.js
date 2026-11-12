// Configuração do ESLint no formato "flat config" (ESLint 9+).
const { defineConfig, globalIgnores } = require('eslint/config');
// Regras recomendadas pela Expo para React Native + TypeScript.
const expoConfig = require('eslint-config-expo/flat');
// Liga o Prettier como regra do ESLint e desliga as regras de estilo que conflitam com ele.
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  globalIgnores(['dist/*', '.expo/*', 'node_modules/*']),
  expoConfig,
  prettierRecommended,
]);
