/**
 * ============================================
 * ARQUIVO: tests/setup.js
 * DESCRICAO: Configuracao inicial dos testes
 * ============================================
 *
 * Este arquivo e executado ANTES de todos os testes.
 * Usa um banco de dados SEPARADO (test.db) para nao
 * afetar o banco de desenvolvimento.
 */

// Carrega variaveis de ambiente do arquivo .env.test
require('dotenv').config({ path: '.env.test' });

const prisma = require('../src/config/database');

/**
 * Executa ANTES de todos os testes
 * - Limpa o banco de dados para garantir testes isolados
 */
beforeAll(async () => {
  // Limpa todas as tabelas na ordem correta (respeitando foreign keys)
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.counter.deleteMany();

  // Recria o contador de pedidos (usa upsert para evitar erro se ja existir)
  await prisma.counter.upsert({
    where: { id: 'order_counter' },
    update: { value: 0 },
    create: { id: 'order_counter', value: 0 },
  });
});

/**
 * Executa DEPOIS de todos os testes
 * - Fecha a conexao com o banco
 */
afterAll(async () => {
  await prisma.$disconnect();
});
