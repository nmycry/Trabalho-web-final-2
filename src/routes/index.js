const express = require('express');
const router = express.Router();

// Importar rotas dos modulos (serao adicionadas conforme implementacao)
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Montar rotas
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/dashboard', dashboardRoutes);

// Rota raiz da API
/**
 * @swagger
 * /api:
 *   get:
 *     summary: Informações da API
 *     tags:
 *       - Geral
 *     responses:
 *       200:
 *         description: Informações básicas da API e endpoints principais
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Cantina Universitaria',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      dashboard: '/api/dashboard',
    },
  });
});

module.exports = router;
