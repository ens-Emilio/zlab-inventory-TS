# 🏠 Z-Lab Inventory

> Sistema moderno de gerenciamento de inventário para Home Lab, combinando densidade de informação (admin) com fluidez e foco (app moderno).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

## 📋 Sobre o Projeto

Z-Lab Inventory é uma aplicação full-stack TypeScript para gerenciamento de inventário de laboratórios domésticos (Home Labs). O projeto segue uma arquitetura monorepo com backend robusto e frontend moderno inspirado no estilo GitHub/Linear.

### ✨ Características Principais

- **🎨 UI Moderna**: Design system completo com estilo GitHub/Linear (clean, denso, hierarquia forte)
- **📱 Responsivo**: Layout Shell adaptativo (desktop: sidebar fixa, mobile: drawer modal)
- **⚡ Power User**: Tabela com seleção em massa, ordenação, linhas expansíveis
- **🔍 Busca Inteligente**: Debounce, histórico persistente, filtros em tempo real
- **⌨️ Atalhos de Teclado**: Produtividade para power users (`/`, `n`, `Esc`)
- **🔔 Toasts**: Sistema de notificações elegante
- **📦 Monorepo**: Arquitetura organizada (apps/api, apps/web, packages/shared)
- **🏗️ Arquitetura em Camadas**: Controller → Service → Repository
- **🔐 Type-Safe**: TypeScript end-to-end com DTOs compartilhados
- **📊 Stock Management**: Sistema completo de movimentação de estoque

---

## 🏗️ Arquitetura

### Estrutura do Monorepo

```
zlab-inventory/
├── apps/
│   ├── api/                    # Backend (Express + MySQL)
│   │   ├── src/
│   │   │   ├── controllers/    # Camada de controle (HTTP)
│   │   │   ├── services/       # Lógica de negócio
│   │   │   ├── repositories/   # Acesso a dados
│   │   │   ├── routes/         # Definição de rotas
│   │   │   ├── middlewares/    # Error handling, upload
│   │   │   ├── domain/         # Entidades de domínio
│   │   │   ├── db/             # Pool de conexão MySQL
│   │   │   └── utils/          # Utilitários (AppError)
│   │   └── package.json
│   │
│   └── web/                    # Frontend (TypeScript + Vanilla)
│       ├── css/
│       │   ├── design-tokens.css   # Sistema de design
│       │   ├── reset.css           # CSS reset
│       │   ├── components.css      # Componentes base
│       │   ├── shell.css           # Layout Shell
│       │   └── table.css           # Tabela power user
│       ├── src/
│       │   ├── app.ts              # Aplicação principal
│       │   ├── navigation.ts       # Routing e navegação
│       │   ├── search.ts           # Busca com debounce
│       │   ├── keyboard.ts         # Atalhos de teclado
│       │   ├── toast.ts            # Sistema de toasts
│       │   └── table.ts            # Tabela de inventory
│       ├── index.html
│       └── package.json
│
├── packages/
│   └── shared/                 # Código compartilhado
│       ├── src/
│       │   └── dtos/           # DTOs (Item, StockMovement)
│       └── package.json
│
├── storage/                    # Uploads e QR codes
├── package.json                # Root package
└── README.md
```

### Stack Tecnológico

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4.x
- **Database**: MySQL 8.0
- **ORM**: Raw SQL com Prepared Statements
- **Language**: TypeScript 5.0
- **Upload**: Multer
- **QR Codes**: qrcode library

#### Frontend
- **Language**: TypeScript 5.0
- **Bundler**: TypeScript Compiler (tsc)
- **Styling**: Vanilla CSS com Design Tokens
- **Fonts**: Google Fonts (Inter)
- **Icons**: SVG inline

#### Shared
- **DTOs**: TypeScript interfaces compartilhadas
- **Validation**: Type-safe end-to-end

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/))
- npm ou yarn

### 1. Clone o Repositório

```bash
git clone https://github.com/ens-Emilio/zlab-inventory-TS.git
cd zlab-inventory-TS
```

### 2. Instale as Dependências

```bash
npm install
```

Isso instalará as dependências de todos os workspaces (api, web, shared).

### 3. Configure o Banco de Dados

#### 3.1. Crie o banco de dados MySQL

```sql
CREATE DATABASE zlab_inventory;
```

#### 3.2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto `apps/api/`:

```bash
# apps/api/.env
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=zlab_inventory
```

#### 3.3. Execute o script de inicialização

```bash
cd apps/api
npx ts-node src/scripts/init_db.ts
```

Isso criará as tabelas necessárias:
- `items` - Itens do inventário
- `categories` - Categorias de itens
- `locations` - Locais de armazenamento
- `stock_movements` - Movimentações de estoque

### 4. Build do Projeto

```bash
npm run build
```

### 5. Execute em Desenvolvimento

```bash
npm run dev
```

Isso iniciará:
- **API**: http://localhost:4000
- **Frontend**: Servido pela API em http://localhost:4000

---

## 📖 Uso

### Acessar a Aplicação

Abra o navegador em: **http://localhost:4000**

### Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `/` | Focar busca |
| `n` | Novo item |
| `Esc` | Fechar modais/drawer |
| `?` | Mostrar ajuda (em desenvolvimento) |

### Funcionalidades Principais

#### 1. Inventory (Tabela Power User)
- **Visualização**: Tabela densa com colunas configuráveis
- **Seleção em Massa**: Checkboxes para selecionar múltiplos itens
- **Bulk Actions**: Print labels, Export, Delete
- **Ordenação**: Clique em cabeçalhos de coluna para ordenar
- **Linhas Expansíveis**: Clique em linha para ver detalhes (descrição, tags, fotos)
- **Quick Actions**: Ícones inline (edit, stock, delete)

#### 2. Busca Global
- **Debounce**: 300ms para evitar requisições excessivas
- **Filtro em Tempo Real**: Busca por nome, descrição, categoria, local
- **Histórico**: Últimas 5 buscas salvas no localStorage

#### 3. Navegação
- **Desktop**: Sidebar fixa (240px) com ícones + labels
- **Mobile**: Drawer modal (slide-in) com hamburger menu
- **Routing**: Hash-based (`#inventory`, `#locations`, etc.)
- **Breadcrumbs**: Navegação contextual

#### 4. Toasts
- **Tipos**: Success, Error, Warning, Info
- **Auto-dismiss**: 3 segundos
- **Manual Close**: Botão X
- **Fila**: Máximo 3 toasts simultâneos

---

## 🎨 Design System

### Cores

```css
/* Primary */
--color-primary-600: #2563eb;

/* Success */
--color-success-600: #16a34a;

/* Warning */
--color-warning-600: #d97706;

/* Danger */
--color-danger-600: #dc2626;

/* Neutral */
--color-neutral-0: #ffffff;
--color-neutral-900: #171717;
```

### Spacing (Base: 4px)

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

### Tipografia

```css
--font-sans: 'Inter', sans-serif;
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
```

### Componentes

- **Buttons**: primary, secondary, danger, ghost
- **Badges**: primary, success, warning, danger, neutral
- **Cards**: com hover elevation
- **Inputs**: com estados (hover, focus, error)
- **Skeleton**: animação shimmer
- **Empty States**: ícone + título + descrição + CTA

---

## 🔌 API Endpoints

### Items

```http
GET    /api/items           # Listar todos os itens
GET    /api/items/:id       # Buscar item por ID
POST   /api/items           # Criar novo item
PUT    /api/items/:id       # Atualizar item
DELETE /api/items/:id       # Deletar item
GET    /api/items/:id/qr    # Gerar QR code do item
```

### Stock Movements

```http
POST   /api/stock/move              # Registrar movimentação
GET    /api/stock/history/:itemId   # Histórico de movimentações
```

### Request/Response Examples

#### Criar Item

```bash
POST /api/items
Content-Type: application/json

{
  "name": "Raspberry Pi 4",
  "description": "8GB RAM",
  "quantity": 2,
  "category_id": 1,
  "location_id": 1
}
```

#### Movimentar Estoque

```bash
POST /api/stock/move
Content-Type: application/json

{
  "item_id": 1,
  "type": "IN",
  "quantity": 5,
  "reason": "Compra nova"
}
```

---

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
# Root
npm run dev          # Inicia todos os workspaces em dev mode
npm run build        # Build de todos os workspaces

# API (apps/api)
cd apps/api
npm run dev          # ts-node-dev com hot reload
npm run build        # Compila TypeScript

# Web (apps/web)
cd apps/web
npm run build        # Compila TypeScript
```

### Estrutura de Camadas (Backend)

```
Controller (HTTP) → Service (Business Logic) → Repository (Data Access)
```

**Exemplo de fluxo**:
1. `ItemController.create()` recebe requisição HTTP
2. `ItemService.createItem()` valida e processa lógica de negócio
3. `ItemRepository.create()` persiste no banco de dados
4. Resposta retorna pela cadeia

### Error Handling

```typescript
// Custom AppError
throw new AppError('Item not found', 404);

// Global error middleware
app.use(errorMiddleware);
```

---

## 📦 Próximas Features

- [ ] Filtros facetados (Categoria, Local, Tags, Status)
- [ ] Chips de filtros ativos (removíveis)
- [ ] Tela de detalhe do item com tabs (Overview, Stock, Photos, History)
- [ ] Telas de Locations e Categories (CRUD completo)
- [ ] Print Labels (grid de seleção + preview)
- [ ] Import/Export CSV
- [ ] Settings (configurações gerais)
- [ ] Autenticação e autorização
- [ ] Dark mode
- [ ] Testes unitários e E2E
- [ ] Docker e Docker Compose
- [ ] CI/CD pipeline

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👤 Autor

**Emilio**
- GitHub: [@ens-Emilio](https://github.com/ens-Emilio)

---

## 🙏 Agradecimentos

- Design inspirado em [GitHub](https://github.com) e [Linear](https://linear.app)
- Ícones SVG inline (Heroicons style)
- Google Fonts (Inter)

---

## 📸 Screenshots

### Desktop - Inventory Table
![Inventory Table](docs/screenshots/inventory-desktop.png)

### Mobile - Drawer Navigation
![Mobile Drawer](docs/screenshots/mobile-drawer.png)

### Bulk Actions
![Bulk Actions](docs/screenshots/bulk-actions.png)

---

**Feito com ❤️ para Home Labs**
