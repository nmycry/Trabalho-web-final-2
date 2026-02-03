/**
 * ============================================
 * ARQUIVO: productController.js
 * DESCRICAO: Controlador de produtos
 * ============================================
 *
 * Responsavel por receber requisicoes HTTP relacionadas
 * a produtos e delegar para o ProductService.
 *
 * Endpoints tratados:
 * - GET /api/products - Listar produtos
 * - GET /api/products/:id - Buscar por ID
 * - GET /api/products/category/:categoryId - Por categoria
 * - POST /api/products - Criar produto (admin)
 * - PUT /api/products/:id - Atualizar produto (admin)
 * - DELETE /api/products/:id - Desativar produto (admin)
 * - PATCH /api/products/:id/availability - Mudar disponibilidade
 * - POST /api/products/:id/image - Upload de imagem (admin)
 */

const productService = require('../services/productService');
const { successResponse } = require('../utils/responseHandler');

class ProductController {
  /**
   * Lista todos os produtos com filtros opcionais
   *
   * Query params aceitos:
   * - categoryId: Filtrar por categoria
   * - search: Busca por nome/descricao
   * - available: true/false - Filtrar por disponibilidade
   * - page: Numero da pagina (paginacao)
   * - limit: Itens por pagina
   *
   * @param {Object} req - Request do Express
   * @param {Object} res - Response do Express
   * @param {Function} next - Middleware de erro
   */
  async getAll(req, res, next) {
    try {
      // Usa validatedQuery se disponivel (Express 5), senao usa query
      const query = req.validatedQuery || req.query;
      const result = await productService.getAll(query);
      return successResponse(res, 200, 'Produtos encontrados', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca um produto pelo ID
   *
   * @param {Object} req - Request com params.id
   * @param {Object} res - Response do Express
   * @param {Function} next - Middleware de erro
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getById(id);
      return successResponse(res, 200, 'Produto encontrado', { product });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista produtos de uma categoria especifica
   *
   * @param {Object} req - Request com params.categoryId
   * @param {Object} res - Response do Express
   * @param {Function} next - Middleware de erro
   */
  async getByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const products = await productService.getByCategory(categoryId);
      return successResponse(res, 200, 'Produtos encontrados', { products });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria um novo produto
   * Requer autenticacao como ADMIN
   *
   * Body esperado:
   * - name: Nome do produto (obrigatorio)
   * - description: Descricao (opcional)
   * - price: Preco em reais (obrigatorio)
   * - categoryId: ID da categoria (obrigatorio)
   * - isAvailable: Disponibilidade (default: true)
   *
   * @param {Object} req - Request com body contendo dados do produto
   * @param {Object} res - Response do Express
   * @param {Function} next - Middleware de erro
   */
  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      return successResponse(res, 201, 'Produto criado com sucesso', { product });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza dados de um produto existente
   * Requer autenticacao como ADMIN
   *
   * @param {Object} req - Request com params.id e body com dados
   * @param {Object} res - Response do Express
   * @param {Function} next - Middleware de erro
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.update(id, req.body);
      return successResponse(res, 200, 'Produto atualizado com sucesso', { product });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Desativa um produto (soft delete)
   * Requer autenticacao como ADMIN
   *
   * Nota: Nao exclui fisicamente do banco, apenas marca como inativo
   * para manter historico de pedidos intacto
   *
   * @param {Object} req - Request com params.id
   * @param {Object} res - Response do Express
   * @param {Function} next - Middleware de erro
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await productService.delete(id);
      return successResponse(res, 200, 'Produto desativado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza apenas a disponibilidade do produto
   * Requer autenticacao como ADMIN
   *
   * Util para rapidamente marcar produto como
   * disponivel/indisponivel sem editar outros campos
   *
   * @param {Object} req - Request com params.id e body.isAvailable
   * @param {Object} res - Response do Express
   * @param {Function} next - Middleware de erro
   */
  async updateAvailability(req, res, next) {
    try {
      const { id } = req.params;
      const { isAvailable } = req.body;
      const product = await productService.updateAvailability(id, isAvailable);
      return successResponse(res, 200, 'Disponibilidade atualizada', { product });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Faz upload de imagem para um produto
   * Requer autenticacao como ADMIN
   *
   * O arquivo e processado pelo middleware Multer
   * e disponibilizado em req.file
   *
   * Formatos aceitos: JPEG, PNG, GIF, WebP
   * Tamanho maximo: Definido no middleware
   *
   * @param {Object} req - Request com params.id e req.file (Multer)
   * @param {Object} res - Response do Express
   * @param {Function} next - Middleware de erro
   */
  async uploadImage(req, res, next) {
    try {
      const { id } = req.params;

      // Verifica se arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Nenhuma imagem enviada',
        });
      }

      // Service processa e salva a imagem
      const product = await productService.uploadImage(id, req.file);
      return successResponse(res, 200, 'Imagem enviada com sucesso', { product });
    } catch (error) {
      next(error);
    }
  }
}

// Exporta instancia unica (Singleton)
module.exports = new ProductController();
