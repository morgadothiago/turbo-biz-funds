# Documentação da API

> **Nota:** Esta é uma aplicação frontend com mock API. Em produção, os endpoints abaixo seriam implementados no backend.

## Autenticação

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@financeai.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "1",
    "name": "Administrador",
    "email": "admin@financeai.com",
    "role": "admin"
  },
  "token": "token_1_1234567890_abc123..."
}
```

**Response (401):**
```json
{
  "error": "Email ou senha inválidos"
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true
}
```

### Verificar Sessão

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "1",
    "name": "Administrador",
    "email": "admin@financeai.com",
    "role": "admin"
  }
}
```

**Response (401):**
```json
{
  "error": "Sessão expirada"
}
```

## Dashboard

### Obter Dados do Dashboard

```http
GET /api/dashboard
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "stats": [
    {
      "id": "monthly-balance",
      "title": "Saldo do Mês",
      "value": "R$ 3.450,00",
      "change": "+12%",
      "trend": "up",
      "icon": "Wallet",
      "color": "text-success",
      "bgColor": "bg-success/10"
    }
  ],
  "expensesByDay": [
    { "day": "01", "value": 120 },
    { "day": "05", "value": 350 }
  ],
  "categoryExpenses": [
    { "name": "Alimentação", "value": 450, "color": "#10b981" },
    { "name": "Transporte", "value": 280, "color": "#3b82f6" }
  ],
  "recentTransactions": [
    {
      "id": 1,
      "description": "Supermercado Extra",
      "category": "Alimentação",
      "amount": -245.50,
      "type": "expense",
      "date": "Hoje",
      "icon": "🛒"
    }
  ],
  "goals": [
    {
      "id": "1",
      "name": "Viagem para Disney",
      "current": 3500,
      "target": 10000,
      "deadline": "2025-12-31",
      "color": "#3b82f6"
    }
  ]
}
```

## Transações

### Listar Transações

```http
GET /api/transactions?page=1&limit=10&category=Alimentação&type=expense
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "description": "Supermercado Extra",
      "category": "Alimentação",
      "amount": -245.50,
      "type": "expense",
      "date": "2024-01-15",
      "icon": "🛒"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Criar Transação

```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Uber",
  "category": "Transporte",
  "amount": -28.90,
  "type": "expense",
  "date": "2024-01-20"
}
```

**Response (201):**
```json
{
  "id": 51,
  "description": "Uber",
  "category": "Transporte",
  "amount": -28.90,
  "type": "expense",
  "date": "2024-01-20"
}
```

### Atualizar Transação

```http
PUT /api/transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Uber Preto",
  "amount": -32.50
}
```

### Deletar Transação

```http
DELETE /api/transactions/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true
}
```

## Metas

### Listar Metas

```http
GET /api/goals
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "1",
    "name": "Viagem para Disney",
    "current": 3500,
    "target": 10000,
    "deadline": "2025-12-31",
    "color": "#3b82f6"
  }
]
```

### Criar Meta

```http
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Novo Carro",
  "target": 50000,
  "deadline": "2026-12-31",
  "color": "#10b981"
}
```

### Atualizar Progresso

```http
PUT /api/goals/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "current": 4000
}
```

## Categorias

### Listar Categorias

```http
GET /api/categories
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "1",
    "name": "Alimentação",
    "icon": "🍔",
    "color": "#10b981",
    "type": "expense",
    "budget": 1000
  }
]
```

### Criar Categoria

```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Entretenimento",
  "icon": "🎬",
  "color": "#f59e0b",
  "type": "expense",
  "budget": 500
}
```

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Erro de validação |
| 401 | Não autorizado |
| 403 | Proibido |
| 404 | Não encontrado |
| 500 | Erro interno |

## Autenticação Bearer

Todas as rotas protegidas requerem:

```http
Authorization: Bearer <token_obtido_no_login>
```

## Rate Limiting

Em produção, implementar:
- 100 requests/minuto por IP
- 10 requests/minuto por usuário autenticado
