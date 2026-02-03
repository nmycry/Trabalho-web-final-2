const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../validations/authValidation');

// ============================================
// ROTAS PÚBLICAS
// ============================================
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Cadastrar usuário
 *     description: Cria um novo usuário com senha armazenada de forma segura
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: SenhaForte123!
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "+55 38 99999-0000"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     description: Realiza autenticação do usuário e retorna um token JWT
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: SenhaForte123!
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Credenciais inválidas
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     description: Envia um e-mail com instruções para redefinição de senha, se o usuário existir
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *     responses:
 *       200:
 *         description: E-mail de recuperação enviado (se o usuário existir)
 */
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefinir senha com token
 *     description: Redefine a senha usando um token de recuperação válido
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token recebido por e-mail
 *               password:
 *                 type: string
 *                 example: NovaSenhaForte123!
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// ============================================
// ROTAS PROTEGIDAS (USER AUTENTICADO)
// ============================================
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Perfil do usuário autenticado
 *     description: Retorna os dados do usuário associados ao token JWT enviado no header Authorization
 *     tags:
 *       - Autenticação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 */
router.get('/me', authMiddleware, authController.getProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Alterar senha do usuário autenticado
 *     description: Altera a senha do usuário logado após validação da senha atual
 *     tags:
 *       - Autenticação
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: SenhaAntiga123!
 *               newPassword:
 *                 type: string
 *                 example: NovaSenhaForte123!
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.put('/change-password', authMiddleware, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
