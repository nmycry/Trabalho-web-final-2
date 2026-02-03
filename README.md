# Cantina IFNMG - Sistema de Pedidos

Sistema completo de pedidos para cantina universitaria desenvolvido com Node.js, Express, Prisma e React.

## Indice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalacao](#instalacao)
- [Como Executar](#como-executar)
- [Rotas da API](#rotas-da-api)
- [Credenciais de Teste](#credenciais-de-teste)
- [Arquitetura](#arquitetura)

---

## Sobre o Projeto

O **Cantina IFNMG** e um sistema web completo para gerenciamento de pedidos em cantinas universitarias. Permite que clientes visualizem o cardapio, adicionem produtos ao carrinho, realizem pedidos e acompanhem o status em tempo real. Administradores podem gerenciar produtos, categorias e atualizar o status dos pedidos.

### Principais caracteristicas:

- Interface moderna e responsiva
- Sistema de autenticacao JWT
- Carrinho de compras persistente
- Acompanhamento de status dos pedidos
- Painel administrativo completo
- Dashboard com estatisticas

---

## Tecnologias Utilizadas

### Backend
| Tecnologia | Versao | Descricao |
|------------|--------|-----------|
| Node.js | >= 18.0 | Runtime JavaScript |
| Express | 5.x | Framework web |
| Prisma | 5.22 | ORM para banco de dados |
| SQLite | - | Banco de dados |
| JWT | 9.x | Autenticacao |
| Bcrypt | 6.x | Hash de senhas |
| Multer | 2.x | Upload de arquivos |
| Joi | 18.x | Validacao de dados |

### Frontend
| Tecnologia | Versao | Descricao |
|------------|--------|-----------|
| React | 19.x | Biblioteca UI |
| Vite | 7.x | Build tool |
| React Router | 7.x | Roteamento |
| Axios | 1.x | Cliente HTTP |
| Lucide React | - | Icones |
| React Hot Toast | 2.x | Notificacoes |

---

## Funcionalidades

### Cliente
- [x] Cadastro e login de usuarios
- [x] Visualizar cardapio por categorias
- [x] Buscar produtos
- [x] Adicionar/remover produtos do carrinho
- [x] Alterar quantidade de itens
- [x] Finalizar pedido com observacoes
- [x] Acompanhar status do pedido
- [x] Cancelar pedido (se pendente)
- [x] Historico de pedidos

### Administrador
- [x] Dashboard com estatisticas
- [x] Vendas do dia
- [x] Pedidos pendentes
- [x] Produtos mais vendidos
- [x] Gerenciar produtos (CRUD)
- [x] Ativar/desativar produtos
- [x] Gerenciar pedidos
- [x] Atualizar status dos pedidos

### Status dos Pedidos
1. **PENDENTE** - Pedido recebido, aguardando preparo
2. **EM_PREPARO** - Pedido sendo preparado
3. **PRONTO** - Pedido pronto para retirada
4. **ENTREGUE** - Pedido entregue ao cliente
5. **CANCELADO** - Pedido cancelado

---

## Estrutura do Projeto

```
cantina-ifnmg/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   ├── seed.js                # Dados iniciais
│   └── dev.db                 # Banco SQLite (gerado)
│
├── src/
│   ├── config/
│   │   └── database.js        # Configuracao do Prisma Client
│   │
│   ├── controllers/
│   │   ├── authController.js      # Autenticacao
│   │   ├── categoryController.js  # Categorias
│   │   ├── productController.js   # Produtos
│   │   ├── cartController.js      # Carrinho
│   │   ├── orderController.js     # Pedidos
│   │   └── dashboardController.js # Dashboard
│   │
│   ├── services/
│   │   ├── authService.js         # Logica de autenticacao
│   │   ├── categoryService.js     # Logica de categorias
│   │   ├── productService.js      # Logica de produtos
│   │   ├── cartService.js         # Logica do carrinho
│   │   ├── orderService.js        # Logica de pedidos
│   │   └── dashboardService.js    # Logica do dashboard
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js      # Verificacao JWT
│   │   ├── adminMiddleware.js     # Verificacao de admin
│   │   ├── validationMiddleware.js# Validacao com Joi
│   │   ├── uploadMiddleware.js    # Upload de imagens
│   │   └── errorMiddleware.js     # Tratamento de erros
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # Rotas de autenticacao
│   │   ├── categoryRoutes.js      # Rotas de categorias
│   │   ├── productRoutes.js       # Rotas de produtos
│   │   ├── cartRoutes.js          # Rotas do carrinho
│   │   ├── orderRoutes.js         # Rotas de pedidos
│   │   └── dashboardRoutes.js     # Rotas do dashboard
│   │
│   ├── validations/
│   │   ├── authValidation.js      # Schemas de autenticacao
│   │   ├── categoryValidation.js  # Schemas de categorias
│   │   ├── productValidation.js   # Schemas de produtos
│   │   ├── cartValidation.js      # Schemas do carrinho
│   │   └── orderValidation.js     # Schemas de pedidos
│   │
│   ├── utils/
│   │   ├── constants.js           # Constantes do sistema
│   │   └── responseHandler.js     # Padronizacao de respostas
│   │
│   ├── app.js                 # Configuracao do Express
│   └── server.js              # Inicializacao do servidor
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # Cabecalho
│   │   │   ├── Header.css
│   │   │   ├── ProductCard.jsx    # Card de produto
│   │   │   ├── ProductCard.css
│   │   │   ├── AdminLayout.jsx    # Layout admin
│   │   │   └── AdminLayout.css
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx    # Estado de autenticacao
│   │   │   └── CartContext.jsx    # Estado do carrinho
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Pagina de login
│   │   │   ├── Register.jsx       # Pagina de cadastro
│   │   │   ├── Auth.css           # Estilos de autenticacao
│   │   │   ├── Home.jsx           # Cardapio
│   │   │   ├── Home.css
│   │   │   ├── Cart.jsx           # Carrinho
│   │   │   ├── Cart.css
│   │   │   ├── Orders.jsx         # Meus pedidos
│   │   │   ├── Orders.css
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx  # Painel admin
│   │   │       ├── Products.jsx   # Gerenciar produtos
│   │   │       ├── Orders.jsx     # Gerenciar pedidos
│   │   │       └── Admin.css      # Estilos admin
│   │   │
│   │   ├── services/
│   │   │   └── api.js             # Cliente HTTP e servicos
│   │   │
│   │   ├── styles/
│   │   │   ├── variables.css      # Variaveis CSS
│   │   │   └── global.css         # Estilos globais
│   │   │
│   │   ├── App.jsx                # Componente principal
│   │   └── main.jsx               # Ponto de entrada
│   │
│   ├── package.json
│   └── vite.config.js
│
├── uploads/                   # Imagens de produtos (gerado)
├── package.json
├── .env                       # Variaveis de ambiente
└── README.md
```

---

## Instalacao

### Pre-requisitos

- Node.js >= 18.0
- npm ou yarn

### Passo a passo

1. **Clone o repositorio**
```bash
git clone <url-do-repositorio>
cd cantina-ifnmg
```

2. **Instale as dependencias do backend**
```bash
npm install
```

3. **Instale as dependencias do frontend**
```bash
cd frontend
npm install
cd ..
```

4. **Configure as variaveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui_muito_segura_123
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

5. **Configure o banco de dados**
```bash
# Gerar o cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular banco com dados iniciais
npm run prisma:seed
```

---

## Como Executar

### Desenvolvimento

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

**Ou execute ambos (Windows):**
```bash
npm run dev:all
```

### URLs de Acesso

| Servico | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Prisma Studio | http://localhost:5555 |
| Swagger UI | http://localhost:3000/api-docs |

### Scripts Disponiveis

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Inicia backend em modo desenvolvimento |
| `npm run dev:frontend` | Inicia frontend em modo desenvolvimento |
| `npm run dev:all` | Inicia backend e frontend juntos |
| `npm run start` | Inicia backend em producao |
| `npm run prisma:generate` | Gera cliente Prisma |
| `npm run prisma:migrate` | Executa migrations |
| `npm run prisma:seed` | Popula banco com dados iniciais |
| `npm run prisma:studio` | Abre interface visual do banco |

---

## Rotas da API

### Autenticacao

| Metodo | Rota | Descricao | Autenticacao |
|--------|------|-----------|--------------|
| POST | `/api/auth/register` | Cadastrar usuario | Nao |
| POST | `/api/auth/login` | Login | Nao |
| GET | `/api/auth/me` | Perfil do usuario | Sim |

### Categorias

| Metodo | Rota | Descricao | Autenticacao |
|--------|------|-----------|--------------|
| GET | `/api/categories` | Listar categorias | Nao |
| GET | `/api/categories/:id` | Buscar categoria | Nao |
| POST | `/api/categories` | Criar categoria | Admin |
| PUT | `/api/categories/:id` | Atualizar categoria | Admin |
| DELETE | `/api/categories/:id` | Excluir categoria | Admin |

### Produtos

| Metodo | Rota | Descricao | Autenticacao |
|--------|------|-----------|--------------|
| GET | `/api/products` | Listar produtos | Nao |
| GET | `/api/products/:id` | Buscar produto | Nao |
| GET | `/api/products/category/:id` | Produtos por categoria | Nao |
| POST | `/api/products` | Criar produto | Admin |
| PUT | `/api/products/:id` | Atualizar produto | Admin |
| DELETE | `/api/products/:id` | Excluir produto | Admin |
| POST | `/api/products/:id/image` | Upload de imagem | Admin |

### Carrinho

| Metodo | Rota | Descricao | Autenticacao |
|--------|------|-----------|--------------|
| GET | `/api/cart` | Ver carrinho | Sim |
| POST | `/api/cart/items` | Adicionar item | Sim |
| PUT | `/api/cart/items/:id` | Atualizar item | Sim |
| DELETE | `/api/cart/items/:id` | Remover item | Sim |
| DELETE | `/api/cart` | Limpar carrinho | Sim |

### Pedidos

| Metodo | Rota | Descricao | Autenticacao |
|--------|------|-----------|--------------|
| GET | `/api/orders` | Meus pedidos | Sim |
| GET | `/api/orders/:id` | Detalhes do pedido | Sim |
| POST | `/api/orders` | Criar pedido | Sim |
| PATCH | `/api/orders/:id/cancel` | Cancelar pedido | Sim |
| GET | `/api/orders/admin/all` | Todos os pedidos | Admin |
| PATCH | `/api/orders/admin/:id/status` | Atualizar status | Admin |

### Dashboard (Admin)

| Metodo | Rota | Descricao | Autenticacao |
|--------|------|-----------|--------------|
| GET | `/api/dashboard/stats` | Estatisticas gerais | Admin |
| GET | `/api/dashboard/recent-orders` | Pedidos recentes | Admin |
| GET | `/api/dashboard/top-products` | Produtos mais vendidos | Admin |
| GET | `/api/dashboard/sales` | Vendas por periodo | Admin |

---

## Credenciais de Teste

Apos executar o seed, use estas credenciais:

### Administrador
```
Email: admin@cantina.com
Senha: admin123
```

### Usuario Cliente
```
Email: usuario@teste.com
Senha: user123
```

---

## Arquitetura

### Backend - Padrao de Camadas

```
Request -> Routes -> Middleware -> Controller -> Service -> Prisma -> Database
```

1. **Routes**: Define endpoints e middlewares
2. **Middlewares**: Autenticacao, validacao, tratamento de erros
3. **Controllers**: Recebe requisicoes, chama services, retorna respostas
4. **Services**: Contem logica de negocio
5. **Prisma**: ORM para acesso ao banco de dados

### Frontend - Componentizacao React

```
App -> Pages -> Components -> Contexts -> Services -> API
```

1. **App**: Roteamento principal
2. **Pages**: Paginas da aplicacao
3. **Components**: Componentes reutilizaveis
4. **Contexts**: Estado global (Auth, Cart)
5. **Services**: Comunicacao com API

### Fluxo de Autenticacao

```
1. Usuario faz login com email/senha
2. Backend valida credenciais
3. Backend gera token JWT
4. Frontend armazena token no localStorage
5. Frontend envia token no header Authorization
6. Backend valida token em rotas protegidas
```

### Fluxo de Pedido

```
1. Usuario adiciona produtos ao carrinho
2. Carrinho e persistido no banco (usuario logado)
3. Usuario finaliza pedido
4. Sistema cria pedido com itens do carrinho
5. Carrinho e limpo
6. Admin atualiza status do pedido
7. Usuario acompanha status em "Meus Pedidos"
```

---

## Modelos do Banco de Dados

### User (Usuario)
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  phone     String?
  role      String   @default("CLIENTE")  // CLIENTE ou ADMIN
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Category (Categoria)
```prisma
model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)
  products    Product[]
}
```

### Product (Produto)
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  imageUrl    String?
  isAvailable Boolean  @default(true)
  categoryId  String
  category    Category @relation(fields: [categoryId])
}
```

### Order (Pedido)
```prisma
model Order {
  id          String      @id @default(uuid())
  orderNumber Int         @unique
  userId      String
  status      String      @default("PENDENTE")
  total       Float
  notes       String?
  items       OrderItem[]
  createdAt   DateTime    @default(now())
}
```

---

## Consideracoes de Seguranca

- Senhas hasheadas com bcrypt (10 rounds)
- Autenticacao via JWT com expiracao
- Validacao de entrada com Joi
- Protecao de rotas administrativas
- CORS configurado
- Helmet para headers de seguranca
- Rate limiting para prevenir abusos

---

## Licenca

Este projeto foi desenvolvido para fins educacionais.

MIT License - Sinta-se livre para usar e modificar.
