/**
 * Configuracao do Babel
 *
 * Necessario para o Jest transformar codigo ESM para CommonJS.
 * Alguns pacotes (como uuid) usam ESM e precisam ser transformados.
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
