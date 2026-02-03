/**
 * ============================================
 * ARQUIVO: validationMiddleware.js
 * DESCRICAO: Middleware de validacao com Joi
 * ============================================
 *
 * Valida dados de entrada (body e query params)
 * usando schemas Joi definidos em /validations.
 *
 * Funcionalidades:
 * - Valida todos os campos antes de passar para controller
 * - Remove campos nao definidos no schema (stripUnknown)
 * - Converte tipos quando possivel (ex: string para number)
 * - Retorna todos os erros de uma vez (abortEarly: false)
 *
 * Uso nas rotas:
 * router.post('/users', validate(userSchema), controller.create)
 * router.get('/products', validateQuery(querySchema), controller.list)
 */

/**
 * Middleware de validacao do body da requisicao
 *
 * Valida req.body contra um schema Joi.
 * Se valido, substitui req.body pelos dados validados/convertidos.
 * Se invalido, retorna 400 com lista de erros.
 *
 * @param {Object} schema - Schema Joi para validacao
 * @returns {Function} Middleware do Express
 */
const validate = (schema) => {
  return (req, res, next) => {
    // Valida body contra o schema
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,   // Nao para no primeiro erro - retorna todos
      stripUnknown: true,  // Remove campos nao definidos no schema
      convert: true,       // Converte tipos (ex: "123" -> 123)
    });

    // Se houver erros de validacao
    if (error) {
      // Mapeia erros para formato padronizado
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'), // Ex: "address.city"
        message: detail.message,       // Mensagem de erro
      }));

      return res.status(400).json({
        success: false,
        message: 'Dados invalidos',
        errors, // Array com todos os erros encontrados
      });
    }

    // Substitui body pelo valor validado e possivelmente convertido
    // Isso garante que campos extras sejam removidos
    req.body = value;
    next();
  };
};

/**
 * Middleware de validacao dos query params
 *
 * Valida req.query contra um schema Joi.
 * Util para validar filtros e parametros de paginacao.
 *
 * @param {Object} schema - Schema Joi para validacao
 * @returns {Function} Middleware do Express
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    // Valida query params contra o schema
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,   // Retorna todos os erros
      stripUnknown: true,  // Remove parametros desconhecidos
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Parametros invalidos',
        errors,
      });
    }

    // No Express 5, req.query e read-only
    // Armazena os valores validados em req.validatedQuery
    req.validatedQuery = value;
    next();
  };
};

module.exports = { validate, validateQuery };
