const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// ============================================
// ROTAS PUBLICAS
// ============================================
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Listar categorias
 *     description: Retorna a lista de categorias disponíveis
 *     tags:
 *       - Categorias
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', categoryController.getAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     description: Retorna os detalhes de uma categoria específica
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', categoryController.getById);

// ============================================
// ROTAS PROTEGIDAS
// ============================================
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Criar categoria
 *     description: Cria uma nova categoria, se for user admin
 *     tags:
 *       - Categorias
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Lanches
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Lanches rápidos, hambúrgueres e porções
 *               sortOrder:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 */
router.post('/', authMiddleware, adminMiddleware, categoryController.create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     description: Atualiza os dados de uma categoria existente, se for user admin
 *     tags:
 *       - Categorias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bebidas
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Refrigerantes, sucos e águas
 *               sortOrder:
 *                 type: integer
 *                 example: 2
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 *       404:
 *         description: Categoria não encontrada
 */
router.put('/:id', authMiddleware, adminMiddleware, categoryController.update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Excluir categoria
 *     description: Remove uma categoria, se for user admin
 *     tags:
 *       - Categorias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da categoria
 *     responses:
 *       204:
 *         description: Categoria removida com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.delete);

/**
 * @swagger
 * /api/categories/reorder/all:
 *   put:
 *     summary: Reordenar categorias
 *     description: Atualiza a ordem de exibição de todas as categorias, se for user admin
 *     tags:
 *       - Categorias
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: array
 *                 description: Lista de IDs de categorias na nova ordem
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: Ordem das categorias atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 */
router.put('/reorder/all', authMiddleware, adminMiddleware, categoryController.reorder);

module.exports = router;
