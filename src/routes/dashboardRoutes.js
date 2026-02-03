const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// ============================================
// ROTAS PROTEGIDAS DO DASHBOARD (APENAS ADMIN)
// ============================================

router.use(authMiddleware, adminMiddleware);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Estatísticas gerais
 *     description: Retorna estatísticas gerais do sistema, se for user admin
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 */
router.get('/stats', dashboardController.getStats);

/**
 * @swagger
 * /api/dashboard/sales:
 *   get:
 *     summary: Vendas por período
 *     description: Retorna dados de vendas agrupados por período, se for user admin
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados de vendas retornados com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 */
router.get('/sales', dashboardController.getSales);

/**
 * @swagger
 * /api/dashboard/top-products:
 *   get:
 *     summary: Produtos mais vendidos
 *     description: Retorna a lista de produtos mais vendidos em determinado período, se for user admin
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos mais vendidos retornada com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 */
router.get('/top-products', dashboardController.getTopProducts);

/**
 * @swagger
 * /api/dashboard/peak-hours:
 *   get:
 *     summary: Horários de pico
 *     description: Retorna os horários com maior volume de pedidos, se user admin
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horários de pico retornados com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 */
router.get('/peak-hours', dashboardController.getPeakHours);

/**
 * @swagger
 * /api/dashboard/orders-by-status:
 *   get:
 *     summary: Pedidos por status
 *     description: Retorna o total de pedidos agrupados por status (ex.: PENDENTE, EM_PREPARO, CONCLUIDO, CANCELADO), se user admin
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados de pedidos por status retornados com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 */
router.get('/orders-by-status', dashboardController.getOrdersByStatus);

/**
 * @swagger
 * /api/dashboard/recent-orders:
 *   get:
 *     summary: Pedidos recentes
 *     description: Retorna a lista de pedidos recentes para exibição no dashboard, se for user admin
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pedidos recentes retornados com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 */
router.get('/recent-orders', dashboardController.getRecentOrders);

module.exports = router;
