/**
 * ============================================
 * ARQUIVO: tests/products.test.js
 * DESCRICAO: Testes de produtos
 * ============================================
 *
 * Testa os endpoints de produtos:
 * - GET /api/products - Listar produtos (publico)
 * - GET /api/products/:id - Buscar produto (publico)
 * - POST /api/products - Criar produto (admin)
 * - PUT /api/products/:id - Atualizar produto (admin)
 * - DELETE /api/products/:id - Deletar produto (admin)
 */

const request = require('supertest');
const app = require('../src/app');
const {
  createAdminAndGetToken,
  createClientAndGetToken,
  createTestCategory,
  createTestProduct,
} = require('./helpers');

/**
 * ============================================
 * TESTES DE LISTAGEM (PUBLICO)
 * ============================================
 */
describe('GET /api/products', () => {
  /**
   * Teste: Listar produtos sem autenticacao
   *
   * Rota publica - deve funcionar sem token
   */
  it('deve listar produtos sem autenticacao', async () => {
    // Cria categoria e produto para teste
    const category = await createTestCategory();
    await createTestProduct(category.id, { name: 'Produto Listagem' });

    const response = await request(app)
      .get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('products');
    expect(Array.isArray(response.body.data.products)).toBe(true);
  });

  /**
   * Teste: Listar com paginacao
   */
  it('deve retornar dados de paginacao', async () => {
    const response = await request(app)
      .get('/api/products?page=1&limit=10');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('pagination');
    expect(response.body.data.pagination).toHaveProperty('page');
    expect(response.body.data.pagination).toHaveProperty('limit');
    expect(response.body.data.pagination).toHaveProperty('total');
  });

  /**
   * Teste: Filtrar por categoria
   */
  it('deve filtrar produtos por categoria', async () => {
    const category = await createTestCategory({ name: 'Bebidas Teste' });
    await createTestProduct(category.id, { name: 'Refrigerante' });

    const response = await request(app)
      .get(`/api/products?categoryId=${category.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.products.length).toBeGreaterThanOrEqual(1);
  });
});

/**
 * ============================================
 * TESTES DE BUSCA POR ID (PUBLICO)
 * ============================================
 */
describe('GET /api/products/:id', () => {
  /**
   * Teste: Buscar produto existente
   */
  it('deve retornar produto por ID', async () => {
    const category = await createTestCategory();
    const product = await createTestProduct(category.id, {
      name: 'Produto Busca',
      price: 15.50,
    });

    const response = await request(app)
      .get(`/api/products/${product.id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.product.id).toBe(product.id);
    expect(response.body.data.product.name).toBe('Produto Busca');
    expect(response.body.data.product.price).toBe(15.50);
  });

  /**
   * Teste: Buscar produto inexistente
   */
  it('deve retornar 404 para produto inexistente', async () => {
    const response = await request(app)
      .get('/api/products/id-inexistente-123');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});

/**
 * ============================================
 * TESTES DE CRIACAO (ADMIN)
 * ============================================
 */
describe('POST /api/products', () => {
  /**
   * Teste: Admin pode criar produto
   */
  it('admin deve criar produto com sucesso', async () => {
    const { token } = await createAdminAndGetToken();
    const category = await createTestCategory();

    const novoProduto = {
      name: 'Novo Produto',
      description: 'Descricao do produto',
      price: 25.00,
      categoryId: category.id,
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(novoProduto);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.product.name).toBe('Novo Produto');
    expect(response.body.data.product.price).toBe(25.00);
  });

  /**
   * Teste: Cliente NAO pode criar produto
   */
  it('cliente nao deve criar produto', async () => {
    const { token } = await createClientAndGetToken();
    const category = await createTestCategory();

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Cliente',
        price: 10.00,
        categoryId: category.id,
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  /**
   * Teste: Criar produto sem autenticacao
   */
  it('deve retornar 401 sem autenticacao', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        name: 'Produto Sem Auth',
        price: 10.00,
        categoryId: 'qualquer-id',
      });

    expect(response.status).toBe(401);
  });

  /**
   * Teste: Criar produto sem campos obrigatorios
   */
  it('deve retornar erro sem nome do produto', async () => {
    const { token } = await createAdminAndGetToken();
    const category = await createTestCategory();

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        price: 10.00,
        categoryId: category.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

/**
 * ============================================
 * TESTES DE ATUALIZACAO (ADMIN)
 * ============================================
 */
describe('PUT /api/products/:id', () => {
  /**
   * Teste: Admin pode atualizar produto
   */
  it('admin deve atualizar produto com sucesso', async () => {
    const { token } = await createAdminAndGetToken();
    const category = await createTestCategory();
    const product = await createTestProduct(category.id);

    const response = await request(app)
      .put(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Atualizado',
        price: 30.00,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.product.name).toBe('Produto Atualizado');
    expect(response.body.data.product.price).toBe(30.00);
  });

  /**
   * Teste: Cliente NAO pode atualizar
   */
  it('cliente nao deve atualizar produto', async () => {
    const { token } = await createClientAndGetToken();
    const category = await createTestCategory();
    const product = await createTestProduct(category.id);

    const response = await request(app)
      .put(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Tentativa Cliente' });

    expect(response.status).toBe(403);
  });
});

/**
 * ============================================
 * TESTES DE DELECAO (ADMIN)
 * ============================================
 */
describe('DELETE /api/products/:id', () => {
  /**
   * Teste: Admin pode deletar (desativar) produto
   */
  it('admin deve deletar produto com sucesso', async () => {
    const { token } = await createAdminAndGetToken();
    const category = await createTestCategory();
    const product = await createTestProduct(category.id);

    const response = await request(app)
      .delete(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  /**
   * Teste: Cliente NAO pode deletar
   */
  it('cliente nao deve deletar produto', async () => {
    const { token } = await createClientAndGetToken();
    const category = await createTestCategory();
    const product = await createTestProduct(category.id);

    const response = await request(app)
      .delete(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});
