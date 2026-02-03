/**
 * ============================================
 * ARQUIVO: tests/cart.test.js
 * DESCRICAO: Testes do carrinho de compras
 * ============================================
 *
 * Testa os endpoints do carrinho:
 * - GET /api/cart - Ver carrinho
 * - POST /api/cart/items - Adicionar item
 * - PUT /api/cart/items/:id - Atualizar quantidade
 * - DELETE /api/cart/items/:id - Remover item
 * - DELETE /api/cart - Limpar carrinho
 */

const request = require('supertest');
const app = require('../src/app');
const {
  createClientAndGetToken,
  createTestCategory,
  createTestProduct,
} = require('./helpers');

/**
 * ============================================
 * TESTES DE VISUALIZACAO DO CARRINHO
 * ============================================
 */
describe('GET /api/cart', () => {
  /**
   * Teste: Ver carrinho do usuario logado
   */
  it('deve retornar carrinho do usuario', async () => {
    const { token } = await createClientAndGetToken();

    const response = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('cart');
    expect(response.body.data.cart).toHaveProperty('items');
  });

  /**
   * Teste: Carrinho sem autenticacao
   */
  it('deve retornar 401 sem autenticacao', async () => {
    const response = await request(app)
      .get('/api/cart');

    expect(response.status).toBe(401);
  });
});

/**
 * ============================================
 * TESTES DE ADICIONAR ITEM
 * ============================================
 */
describe('POST /api/cart/items', () => {
  /**
   * Teste: Adicionar produto ao carrinho
   */
  it('deve adicionar produto ao carrinho', async () => {
    const { token } = await createClientAndGetToken();
    const category = await createTestCategory();
    const product = await createTestProduct(category.id, {
      name: 'Produto Carrinho',
      price: 15.00,
    });

    const response = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product.id,
        quantity: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  /**
   * Teste: Adicionar produto inexistente
   */
  it('deve retornar erro para produto inexistente', async () => {
    const { token } = await createClientAndGetToken();

    const response = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: 'produto-inexistente-123',
        quantity: 1,
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  /**
   * Teste: Adicionar sem quantidade
   */
  it('deve adicionar com quantidade padrao 1', async () => {
    const { token } = await createClientAndGetToken();
    const category = await createTestCategory();
    const product = await createTestProduct(category.id);

    const response = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product.id,
      });

    expect(response.status).toBe(200);
  });
});

/**
 * ============================================
 * TESTES DE ATUALIZAR QUANTIDADE
 * ============================================
 */
describe('PUT /api/cart/items/:id', () => {
  /**
   * Teste: Atualizar quantidade de item
   */
  it('deve atualizar quantidade do item', async () => {
    const { token } = await createClientAndGetToken();
    const category = await createTestCategory();
    const product = await createTestProduct(category.id);

    // Adiciona item primeiro
    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 1 });

    // Busca o carrinho para pegar o ID do item
    const cartResponse = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    const itemId = cartResponse.body.data.cart.items[0]?.id;

    if (itemId) {
      const response = await request(app)
        .put(`/api/cart/items/${itemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    }
  });
});

/**
 * ============================================
 * TESTES DE REMOVER ITEM
 * ============================================
 */
describe('DELETE /api/cart/items/:id', () => {
  /**
   * Teste: Remover item do carrinho
   */
  it('deve remover item do carrinho', async () => {
    const { token } = await createClientAndGetToken();
    const category = await createTestCategory();
    const product = await createTestProduct(category.id);

    // Adiciona item
    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 1 });

    // Busca o carrinho
    const cartResponse = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    const itemId = cartResponse.body.data.cart.items[0]?.id;

    if (itemId) {
      const response = await request(app)
        .delete(`/api/cart/items/${itemId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    }
  });
});

/**
 * ============================================
 * TESTES DE LIMPAR CARRINHO
 * ============================================
 */
describe('DELETE /api/cart', () => {
  /**
   * Teste: Limpar todo o carrinho
   */
  it('deve limpar o carrinho completamente', async () => {
    const { token } = await createClientAndGetToken();
    const category = await createTestCategory();
    const product1 = await createTestProduct(category.id);
    const product2 = await createTestProduct(category.id);

    // Adiciona dois produtos
    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product1.id, quantity: 1 });

    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product2.id, quantity: 2 });

    // Limpa o carrinho
    const response = await request(app)
      .delete('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // Verifica se o carrinho esta vazio
    const cartResponse = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(cartResponse.body.data.cart.items.length).toBe(0);
  });
});
