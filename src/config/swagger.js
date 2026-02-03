/**
 * ============================================
 * ARQUIVO: swagger.js
 * DESCRICAO: Configuração do Swagger/OpenAPI
 * ============================================
 *
 * - Define versão e metadados da API
 * - Configura servidor (URL base)
 * - Define esquemas de segurança (JWT Bearer)
 * - Registra schemas reutilizáveis (User, AuthResponse, Product, Category, Order)
 * - Informa em quais arquivos buscar as anotações @swagger
 */

const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Opções do swagger-jsdoc:
 * - definition: objeto OpenAPI principal (info, servers, components)
 * - apis: arquivos onde o swagger-jsdoc vai procurar comentários @swagger
 */
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Cantina IFNMG',
            version: '1.0.0',
            description:
                'API de sistema web de gerenciamento de pedidos para cantinas universitárias',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Ambiente local',
            },
        ],
        components: {
            // Esquemas de segurança (JWT Bearer)
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            // Schemas reutilizáveis da aplicação
            schemas: {
                // ===== User =====
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            example: 'a3f1e9d2-4b6c-4a8f-9c1b-7f2e6b9c1234',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'joao@example.com',
                        },
                        name: {
                            type: 'string',
                            example: 'João da Silva',
                        },
                        phone: {
                            type: 'string',
                            nullable: true,
                            example: '+55 38 99999-0000',
                        },
                        role: {
                            type: 'string',
                            example: 'CLIENTE', // CLIENTE ou ADMIN
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-01T12:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-10T15:30:00.000Z',
                        },
                    },
                    required: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
                },

                // ===== AuthResponse =====
                AuthResponse: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            description: 'JWT com expiração',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                    required: ['token', 'user'],
                },

                // ===== Product =====
                Product: {
                    type: 'object',
                    required: ['name', 'price', 'categoryId'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            example: 'a3f1e9d2-4b6c-4a8f-9c1b-7f2e6b9c1234',
                        },
                        name: {
                            type: 'string',
                            example: 'X-Burger',
                        },
                        description: {
                            type: 'string',
                            nullable: true,
                            example: 'Hambúrguer com queijo, alface e tomate',
                        },
                        price: {
                            type: 'number',
                            format: 'float',
                            example: 15.5,
                        },
                        imageUrl: {
                            type: 'string',
                            nullable: true,
                            example: '/uploads/products/x-burger.jpg',
                        },
                        isAvailable: {
                            type: 'boolean',
                            example: true,
                        },
                        categoryId: {
                            type: 'string',
                            format: 'uuid',
                            example: 'b4c2d7f8-9e10-4a3b-8c2d-5e6f7a8b9c01',
                        },
                    },
                },

                // ===== Category =====
                Category: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            example: 'b4c2d7f8-9e10-4a3b-8c2d-5e6f7a8b9c01',
                        },
                        name: {
                            type: 'string',
                            example: 'Lanches',
                        },
                        description: {
                            type: 'string',
                            nullable: true,
                            example: 'Lanches rápidos, hambúrgueres e porções',
                        },
                        sortOrder: {
                            type: 'integer',
                            example: 1,
                        },
                        isActive: {
                            type: 'boolean',
                            example: true,
                        },
                    },
                    required: ['id', 'name', 'sortOrder', 'isActive'],
                },

                // ===== Order =====
                Order: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            example: 'f3a1c9d2-4b6c-4a8f-9c1b-7f2e6b9c5678',
                        },
                        orderNumber: {
                            type: 'integer',
                            example: 1234,
                        },
                        userId: {
                            type: 'string',
                            format: 'uuid',
                            example: 'a3f1e9d2-4b6c-4a8f-9c1b-7f2e6b9c1234',
                        },
                        status: {
                            type: 'string',
                            example: 'PENDENTE',
                        },
                        total: {
                            type: 'number',
                            format: 'float',
                            example: 49.9,
                        },
                        notes: {
                            type: 'string',
                            nullable: true,
                            example: 'Sem cebola no X-Burger',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-01T12:00:00.000Z',
                        },
                    },
                    required: ['id', 'orderNumber', 'userId', 'status', 'total', 'createdAt'],
                },
            },
        },
    },

    // Arquivos onde estão as anotações @swagger
    apis: [
        './src/app.js',
        './src/routes/*.js',
    ],
};

/**
 * Gera o objeto OpenAPI (JSON) a partir das opções acima
 */
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
