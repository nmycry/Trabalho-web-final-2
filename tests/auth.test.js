/**
 * ============================================
 * ARQUIVO: tests/auth.test.js
 * DESCRICAO: Testes de autenticacao
 * ============================================
 *
 * Testa os endpoints de autenticacao:
 * - POST /api/auth/register - Cadastro de usuario
 * - POST /api/auth/login - Login
 * - GET /api/auth/me - Perfil do usuario logado
 */

const request = require('supertest');
const app = require('../src/app');
const { createTestUser, getAuthToken } = require('./helpers');

/**
 * ============================================
 * TESTES DE REGISTRO
 * ============================================
 */
describe('POST /api/auth/register', () => {
  /**
   * Teste: Registro com dados validos
   *
   * Deve criar usuario e retornar token
   */
  it('deve registrar um novo usuario com sucesso', async () => {
    const novoUsuario = {
      email: 'novousuario@teste.com',
      password: 'senha123',
      name: 'Novo Usuario',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(novoUsuario);

    // Verifica status HTTP
    expect(response.status).toBe(201);

    // Verifica estrutura da resposta
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');

    // Verifica dados do usuario
    expect(response.body.data.user.email).toBe(novoUsuario.email);
    expect(response.body.data.user.name).toBe(novoUsuario.name);
    expect(response.body.data.user.role).toBe('CLIENTE');

    // Senha NAO deve ser retornada
    expect(response.body.data.user.password).toBeUndefined();
  });

  /**
   * Teste: Registro com email duplicado
   *
   * Deve retornar erro 400
   */
  it('deve retornar erro ao registrar email duplicado', async () => {
    // Cria usuario primeiro
    await createTestUser({ email: 'duplicado@teste.com' });

    // Tenta registrar com mesmo email
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'duplicado@teste.com',
        password: 'senha123',
        name: 'Outro Usuario',
      });

    // API retorna 409 (Conflict) para email duplicado
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  /**
   * Teste: Registro sem campos obrigatorios
   *
   * Deve retornar erro de validacao
   */
  it('deve retornar erro ao registrar sem email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        password: 'senha123',
        name: 'Usuario Sem Email',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('deve retornar erro ao registrar sem senha', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'sememail@teste.com',
        name: 'Usuario Sem Senha',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

/**
 * ============================================
 * TESTES DE LOGIN
 * ============================================
 */
describe('POST /api/auth/login', () => {
  /**
   * Teste: Login com credenciais validas
   *
   * Deve retornar token JWT
   */
  it('deve fazer login com sucesso', async () => {
    // Cria usuario de teste
    const user = await createTestUser({
      email: 'login@teste.com',
      password: 'senha123',
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@teste.com',
        password: 'senha123',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
  });

  /**
   * Teste: Login com senha incorreta
   *
   * Deve retornar erro 401
   */
  it('deve retornar erro com senha incorreta', async () => {
    await createTestUser({
      email: 'senhaerrada@teste.com',
      password: 'senhaCorreta',
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'senhaerrada@teste.com',
        password: 'senhaErrada',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  /**
   * Teste: Login com email inexistente
   *
   * Deve retornar erro 401
   */
  it('deve retornar erro com email inexistente', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'naoexiste@teste.com',
        password: 'senha123',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

/**
 * ============================================
 * TESTES DE PERFIL (ROTA PROTEGIDA)
 * ============================================
 */
describe('GET /api/auth/me', () => {
  /**
   * Teste: Acessar perfil com token valido
   *
   * Deve retornar dados do usuario
   */
  it('deve retornar perfil do usuario autenticado', async () => {
    // Cria usuario e obtem token
    const user = await createTestUser({
      email: 'perfil@teste.com',
      password: 'senha123',
      name: 'Usuario Perfil',
    });

    const token = await getAuthToken('perfil@teste.com', 'senha123');

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('perfil@teste.com');
    expect(response.body.data.user.name).toBe('Usuario Perfil');
  });

  /**
   * Teste: Acessar perfil sem token
   *
   * Deve retornar erro 401
   */
  it('deve retornar erro sem token', async () => {
    const response = await request(app)
      .get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  /**
   * Teste: Acessar perfil com token invalido
   *
   * Deve retornar erro 401
   */
  it('deve retornar erro com token invalido', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token_invalido_123');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
