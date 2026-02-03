/**
 * ============================================
 * ARQUIVO: api.js
 * DESCRICAO: Cliente HTTP e servicos da API
 * ============================================
 *
 * Este arquivo configura o cliente Axios para comunicacao
 * com o backend e exporta servicos organizados por dominio.
 *
 * Funcionalidades:
 * - Configuracao base do Axios
 * - Interceptor para adicionar token JWT automaticamente
 * - Interceptor para tratar erros de autenticacao
 * - Servicos para cada modulo da API
 */

import axios from 'axios';

// ============================================
// CONFIGURACAO DO AXIOS
// ============================================

/**
 * URL base do backend
 * - Em desenvolvimento: http://localhost:3000
 * - Em producao: usa VITE_API_URL ou assume mesmo dominio (string vazia)
 */
const API_BASE_URL = import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? '' : 'http://localhost:3000');

/**
 * Cria instancia do Axios com configuracoes padrao
 *
 * baseURL: '/api' - Todas as requisicoes serao prefixadas com /api
 *          O proxy do Vite redireciona para http://localhost:3000
 *
 * headers: Define Content-Type padrao como JSON
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// HELPER PARA URLs DE IMAGEM
// ============================================

/**
 * Resolve URL de imagem corretamente
 *
 * Detecta se a URL e externa (http/https) ou local (/uploads/...)
 * e retorna a URL completa apropriada.
 *
 * @param {string} imageUrl - URL da imagem (pode ser externa ou local)
 * @returns {string|null} URL completa da imagem ou null se nao houver
 *
 * Exemplos:
 * - "https://example.com/img.jpg" -> "https://example.com/img.jpg"
 * - "/uploads/products/img.jpg" -> "http://localhost:3000/uploads/products/img.jpg"
 * - null -> null
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // Se ja e uma URL completa (http ou https), retorna como esta
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Se e uma URL local (comeca com /), adiciona o base URL do backend
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  // Caso contrario, assume que e relativo e adiciona o base URL
  return `${API_BASE_URL}/${imageUrl}`;
};

// ============================================
// INTERCEPTORS
// ============================================

/**
 * Interceptor de REQUEST
 * Executa ANTES de cada requisicao
 *
 * Adiciona o token JWT no header Authorization
 * se existir no localStorage
 */
api.interceptors.request.use((config) => {
  // Busca token do localStorage
  const token = localStorage.getItem('token');

  // Se token existe, adiciona no header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Interceptor de RESPONSE
 * Executa APOS cada resposta
 *
 * Se receber erro 401 (nao autorizado):
 * - Remove dados de autenticacao
 * - Redireciona para login
 */
api.interceptors.response.use(
  // Sucesso: retorna resposta normalmente
  (response) => response,

  // Erro: trata erros de autenticacao
  (error) => {
    // Se erro 401 (token invalido ou expirado)
    if (error.response?.status === 401) {
      // Remove dados de autenticacao
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redireciona para pagina de login
      window.location.href = '/login';
    }
    // Propaga o erro para ser tratado pelo chamador
    return Promise.reject(error);
  }
);

// Exporta instancia configurada (pode ser usada diretamente)
export default api;

// ============================================
// SERVICOS DA API
// ============================================

/**
 * Servico de Autenticacao
 *
 * Endpoints:
 * - POST /api/auth/login - Login
 * - POST /api/auth/register - Cadastro
 * - GET /api/auth/me - Perfil do usuario
 */
export const authService = {
  // Faz login e retorna usuario + token
  login: (email, password) => api.post('/auth/login', { email, password }),

  // Cadastra novo usuario e retorna usuario + token
  register: (data) => api.post('/auth/register', data),

  // Retorna dados do usuario logado
  getProfile: () => api.get('/auth/me'),
};

/**
 * Servico de Categorias
 *
 * Endpoints:
 * - GET /api/categories - Lista todas categorias
 * - GET /api/categories/:id - Busca categoria por ID
 * - POST /api/categories - Cria categoria (admin)
 * - PUT /api/categories/:id - Atualiza categoria (admin)
 * - DELETE /api/categories/:id - Exclui categoria (admin)
 */
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

/**
 * Servico de Produtos
 *
 * Endpoints:
 * - GET /api/products - Lista produtos (com filtros opcionais)
 * - GET /api/products/:id - Busca produto por ID
 * - GET /api/products/category/:id - Produtos por categoria
 * - POST /api/products - Cria produto (admin)
 * - PUT /api/products/:id - Atualiza produto (admin)
 * - DELETE /api/products/:id - Exclui produto (admin)
 * - POST /api/products/:id/image - Upload de imagem (admin)
 */
export const productService = {
  // Lista produtos com filtros opcionais (categoryId, search, available, page, limit)
  getAll: (params) => api.get('/products', { params }),

  getById: (id) => api.get(`/products/${id}`),

  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),

  create: (data) => api.post('/products', data),

  update: (id, data) => api.put(`/products/${id}`, data),

  delete: (id) => api.delete(`/products/${id}`),

  // Upload de imagem - usa Content-Type multipart/form-data
  uploadImage: (id, formData) => api.post(`/products/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

/**
 * Servico do Carrinho
 *
 * Endpoints:
 * - GET /api/cart - Busca carrinho do usuario
 * - POST /api/cart/items - Adiciona item
 * - PUT /api/cart/items/:id - Atualiza item
 * - DELETE /api/cart/items/:id - Remove item
 * - DELETE /api/cart - Limpa carrinho
 */
export const cartService = {
  // Retorna carrinho com items, total e itemCount
  get: () => api.get('/cart'),

  // Adiciona produto ao carrinho
  addItem: (productId, quantity = 1, notes = '') =>
    api.post('/cart/items', { productId, quantity, notes }),

  // Atualiza quantidade/observacoes de um item
  updateItem: (itemId, quantity, notes) =>
    api.put(`/cart/items/${itemId}`, { quantity, notes }),

  // Remove item do carrinho
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),

  // Limpa todos os itens do carrinho
  clear: () => api.delete('/cart'),
};

/**
 * Servico de Pedidos
 *
 * Endpoints Cliente:
 * - GET /api/orders - Meus pedidos
 * - GET /api/orders/:id - Detalhes do pedido
 * - POST /api/orders - Criar pedido
 * - PATCH /api/orders/:id/cancel - Cancelar pedido
 *
 * Endpoints Admin:
 * - GET /api/orders/admin/all - Todos os pedidos
 * - PATCH /api/orders/admin/:id/status - Atualizar status
 */
export const orderService = {
  // Lista pedidos do usuario logado
  getMine: (params) => api.get('/orders', { params }),

  // Detalhes de um pedido
  getById: (id) => api.get(`/orders/${id}`),

  // Cria pedido a partir do carrinho
  create: (notes) => api.post('/orders', { notes }),

  // Cancela pedido (apenas se PENDENTE)
  cancel: (id) => api.patch(`/orders/${id}/cancel`),

  // Admin: lista todos os pedidos
  getAll: (params) => api.get('/orders/admin/all', { params }),

  // Admin: atualiza status do pedido
  updateStatus: (id, status) =>
    api.patch(`/orders/admin/${id}/status`, { status }),
};

/**
 * Servico do Dashboard (Admin)
 *
 * Endpoints:
 * - GET /api/dashboard/stats - Estatisticas gerais
 * - GET /api/dashboard/sales - Vendas por periodo
 * - GET /api/dashboard/top-products - Produtos mais vendidos
 * - GET /api/dashboard/peak-hours - Horarios de pico
 * - GET /api/dashboard/orders-by-status - Pedidos por status
 * - GET /api/dashboard/recent-orders - Pedidos recentes
 */
export const dashboardService = {
  // Estatisticas: vendas hoje, pedidos hoje, pendentes, total usuarios
  getStats: () => api.get('/dashboard/stats'),

  // Vendas por periodo (startDate, endDate)
  getSales: (params) => api.get('/dashboard/sales', { params }),

  // Produtos mais vendidos
  getTopProducts: (limit = 10) => api.get('/dashboard/top-products', { params: { limit } }),

  // Horarios de maior movimento
  getPeakHours: () => api.get('/dashboard/peak-hours'),

  // Quantidade de pedidos por status
  getOrdersByStatus: () => api.get('/dashboard/orders-by-status'),

  // Pedidos mais recentes
  getRecentOrders: (limit = 10) => api.get('/dashboard/recent-orders', { params: { limit } }),
};
