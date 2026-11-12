const { execSync } = require('child_process');

/**
 * Configuração dinâmica do Expo: parte do app.json e acrescenta o hash do commit.
 *
 * A tela "Sobre o app" mostra esse hash para provar que o APK publicado no Firebase
 * App Distribution corresponde exatamente a um commit do repositório.
 * - No build do EAS, a variável EAS_BUILD_GIT_COMMIT_HASH já traz o commit compilado.
 * - Localmente (Expo Go), lemos o HEAD do git.
 */
const lerCommit = () => {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) {
    return process.env.EAS_BUILD_GIT_COMMIT_HASH.slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'desconhecido';
  }
};

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash: lerCommit(),
    buildEm: new Date().toISOString(),
  },
});
