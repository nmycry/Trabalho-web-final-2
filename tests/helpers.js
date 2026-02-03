/**
 * ============================================
 * ARQUIVO: tests/helpers.js
 * DESCRICAO: Funcoes auxiliares para testes
 * ============================================
 *
 * Contem funcoes reutilizaveis nos testes:
 * - Criar usuarios de teste
 * - Obter tokens de autenticacao
 * - Criar dados de teste (categorias, produtos, etc)
 */

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/database');
const bcrypt = require('bcrypt');

/**
 * Cria um usuario de teste no banco
 *
 * @param {Object} data - Dados do usuario
 * @param {string} data.email - Email do usuario
 * @param {string} data.password - Senha (sera hasheada)
 * @param {string} data.name - Nome do usuario
 * @param {string} data.role - Role: CLIENTE ou ADMIN
 * @returns {Object} Usuario criado
 */
async function createTestUser(data = {}) {
  const defaultData = {
    email: `teste${Date.now()}@teste.com`,
    password: 'senha123',
    name: 'Usuario Teste',
    role: 'CLIENTE',
  };

  const userData = { ...defaultData, ...data };
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role,
      cart: { create: {} }, // Cria carrinho automaticamente
    },
  });

  // Retorna usuario com senha original (para login)
  return { ...user, plainPassword: userData.password };
}

/**
 * Faz login e retorna o token JWT
 *
 * @param {string} email - Email do usuario
 * @param {string} password - Senha do usuario
 * @returns {string} Token JWT
 */
async function getAuthToken(email, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return response.body.data?.token;
}

/**
 * Cria um usuario admin e retorna o token
 *
 * @returns {Object} { user, token }
 */
async function createAdminAndGetToken() {
  const user = await createTestUser({
    email: `admin${Date.now()}@teste.com`,
    password: 'admin123',
    name: 'Admin Teste',
    role: 'ADMIN',
  });

  const token = await getAuthToken(user.email, user.plainPassword);
  return { user, token };
}

/**
 * Cria um cliente e retorna o token
 *
 * @returns {Object} { user, token }
 */
async function createClientAndGetToken() {
  const user = await createTestUser({
    email: `cliente${Date.now()}@teste.com`,
    password: 'cliente123',
    name: 'Cliente Teste',
    role: 'CLIENTE',
  });

  const token = await getAuthToken(user.email, user.plainPassword);
  return { user, token };
}

/**
 * Cria uma categoria de teste
 *
 * @param {Object} data - Dados da categoria
 * @returns {Object} Categoria criada
 */
async function createTestCategory(data = {}) {
  const defaultData = {
    name: `Categoria ${Date.now()}`,
    description: 'Categoria de teste',
    isActive: true,
  };

  return prisma.category.create({
    data: { ...defaultData, ...data },
  });
}

/**
 * Cria um produto de teste
 *
 * @param {string} categoryId - ID da categoria
 * @param {Object} data - Dados do produto
 * @returns {Object} Produto criado
 */
async function createTestProduct(categoryId, data = {}) {
  const defaultData = {
    name: `Produto ${Date.now()}`,
    description: 'Produto de teste',
    price: 10.0,
    isAvailable: true,
  };

  return prisma.product.create({
    data: { ...defaultData, ...data, categoryId },
  });
}

module.exports = {
  createTestUser,
  getAuthToken,
  createAdminAndGetToken,
  createClientAndGetToken,
  createTestCategory,
  createTestProduct,
};
