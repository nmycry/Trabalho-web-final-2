/**
 * Configuracao do Jest
 *
 * Este arquivo define como o Jest deve executar os testes.
 */

module.exports = {
  // Ambiente de execucao (Node.js para backend)
  testEnvironment: 'node',

  // Pasta onde estao os testes
  roots: ['<rootDir>/tests'],

  // Padrao de arquivos de teste
  // Aceita: *.test.js ou *.spec.js
  testMatch: ['**/*.test.js', '**/*.spec.js'],

  // Arquivos a ignorar
  testPathIgnorePatterns: ['/node_modules/', '/frontend/'],

  // Transforma pacotes ESM para CommonJS
  // uuid usa ESM, entao precisa ser transformado
  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)',
  ],

  // Cobertura de codigo
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js', // Ignora arquivo de inicializacao
  ],

  // Timeout para cada teste (10 segundos)
  testTimeout: 10000,

  // Exibe informacoes detalhadas
  verbose: true,

  // Limpa mocks automaticamente entre testes
  clearMocks: true,

  // Arquivo de setup executado antes dos testes
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
