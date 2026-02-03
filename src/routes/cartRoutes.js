const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas do carrinho sao protegidas
router.use(authMiddleware);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Ver carrinho
 *     description: Retorna os itens do carrinho do usuário 
 *     tags:
 *       - Carrinho
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   description: Lista de itens no carrinho
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         format: uuid
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         format: float
 *                 total:
 *                   type: number
 *                   format: float
 *                   description: Valor total do carrinho
 *       401:
 *         description: Não autenticado
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Adicionar item ao carrinho
 *     description: Adiciona um produto ao carrinho do usuário
 *     tags:
 *       - Carrinho
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 example: "b4c2d7f8-9e10-4a3b-8c2d-5e6f7a8b9c01"
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Item adicionado ao carrinho com sucesso
 *       400:
 *         description: Dados inválidos (por exemplo, produto inexistente)
 *       401:
 *         description: Não autenticado
 */
router.post('/items', cartController.addItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     summary: Atualizar item do carrinho
 *     description: Atualiza um item específico do carrinho
 *     tags:
 *       - Carrinho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do item no carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Item não encontrado no carrinho
 */
router.put('/items/:itemId', cartController.updateItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Remover item do carrinho
 *     description: Remove um item específico do carrinho do usuário
 *     tags:
 *       - Carrinho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do item no carrinho
 *     responses:
 *       204:
 *         description: Item removido com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Item não encontrado no carrinho
 */
router.delete('/items/:itemId', cartController.removeItem);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Limpar carrinho
 *     description: Remove todos os itens do carrinho do usuário'
 *     tags:
 *       - Carrinho
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Carrinho limpo com sucesso
 *       401:
 *         description: Não autenticado
 */
router.delete('/', cartController.clearCart);

module.exports = router;
