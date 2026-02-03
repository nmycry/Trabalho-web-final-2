const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { validate, validateQuery } = require('../middlewares/validationMiddleware');
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');
const {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} = require('../validations/productValidation');

// ============================================
// ROTAS PÚBLICAS
// ============================================

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar produtos
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto para busca por nome/descrição
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID da categoria
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Preço mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Preço máximo
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.get('/', validateQuery(productQuerySchema), productController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Busca produto pelo ID
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */

router.get('/:id', productController.getById);

/**
 * @swagger
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: Listar produtos por categoria
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Lista de produtos da categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Categoria não encontrada
 */

router.get('/category/:categoryId', productController.getByCategory);


// ============================================
// ROTAS PROTEGIDAS (admin)
// ============================================

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Criar produto
 *     tags:
 *       - Produtos
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
 *               description:
 *                 type: string
 *                 nullable: true
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 */

router.post('/', authMiddleware, adminMiddleware, validate(createProductSchema), productController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *               price:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 *       404:
 *         description: Produto não encontrado
 */

router.put('/:id', authMiddleware, adminMiddleware, validate(updateProductSchema), productController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Excluir produto
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto removido com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 *       404:
 *         description: Produto não encontrado
 */

router.delete('/:id', authMiddleware, adminMiddleware, productController.delete);

/**
 * @swagger
 * /api/products/{id}/availability:
 *   patch:
 *     summary: Atualiza a disponibilidade de um produto
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 *       404:
 *         description: Produto não encontrado
 */

router.patch('/:id/availability', authMiddleware, adminMiddleware, productController.updateAvailability);

/**
 * @swagger
 * /api/products/{id}/image:
 *   post:
 *     summary: Upload de imagem
 *     description: Faz upload de uma imagem para o produto especificado, se for user admin
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem do produto
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 *       400:
 *         description: Erro no upload da imagem
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (apenas admin)
 *       404:
 *         description: Produto não encontrado
 */
router.post('/:id/image', authMiddleware, adminMiddleware, upload.single('image'), handleUploadError, productController.uploadImage);

module.exports = router;
