const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { validate, validateQuery } = require('../middlewares/validationMiddleware');
const {
  createOrderSchema,
  updateStatusSchema,
  orderQuerySchema,
} = require('../validations/orderValidation');

// Todas as rotas de pedidos sao protegidas
router.use(authMiddleware);

// ============================================
// ROTAS DO CLIENTE
// ============================================
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Listar pedidos do usuário autenticado
 *     description: Retorna o histórico dos pedidos do próprio usuário
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por status do pedido (ex.: PENDENTE, EM_PREPARO, CONCLUIDO, CANCELADO)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrar pedidos a partir desta data
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrar pedidos até esta data
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Não autenticado
 */
router.get('/', validateQuery(orderQuerySchema), orderController.getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     description: Retorna os detalhes de um pedido do usuário autenticado
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', orderController.getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Criar pedido
 *     description: Cria um novo pedido com base nos itens do carrinho ou nos dados enviados, se for user atutenticado
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Estrutura do pedido (itens, observações, etc.)
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post('/', validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar pedido do usuário
 *     description: Cancela um pedido do próprio usuário, se ainda estiver em um status que permita cancelamento
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Não é possível cancelar este pedido
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Pedido não encontrado
 */
router.patch('/:id/cancel', orderController.cancelOrder);

// ============================================
// ROTAS DO ADMIN
// ============================================
/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Listar todos os pedidos (admin)
 *     description: Retorna todos os pedidos do sistema com filtros opcionais, se for user admin
 *     tags:
 *       - Pedidos (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por status do pedido
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar pedidos por ID de usuário
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrar pedidos a partir desta data
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrar pedidos até esta data
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 */
router.get('/admin/all', adminMiddleware, validateQuery(orderQuerySchema), orderController.getAllOrders);

/**
 * @swagger
 * /api/orders/admin/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido (admin)
 *     description: Atualiza o status de um pedido (ex.: PENDENTE, EM_PREPARO, CONCLUIDO, CANCELADO), se for user admin
 *     tags:
 *       - Pedidos (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: EM_PREPARO
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 *       404:
 *         description: Pedido não encontrado
 */
router.patch('/admin/:id/status', adminMiddleware, validate(updateStatusSchema), orderController.updateStatus);

module.exports = router;
