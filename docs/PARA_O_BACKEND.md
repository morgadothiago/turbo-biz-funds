# Backend — Requisitos: Admin + Dashboard do Cliente

> Documento gerado a partir da análise do frontend (React + TypeScript).
> Foco exclusivo nas páginas `/dashboard` (cliente) e `/admin/*`.

---

## Dashboard do Cliente

O frontend carrega as 5 chamadas abaixo em paralelo. As 4 primeiras sem fallback — se qualquer uma falhar, o dashboard exibe tela de erro.

---

### `GET /v1/summary/balance`

Query: `?period=30d`

```json
// Response
{
  "data": {
    "income": 5000.00,
    "expense": 3200.00,
    "balance": 1800.00
  }
}
```

---

### `GET /v1/transactions`

Query: `?period=30d`

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "categoryId": "uuid",
      "type": "INCOME",        // "INCOME" ou "EXPENSE" — maiúsculas obrigatório
      "amount": 1500.00,
      "description": "Salário", // pode ser null
      "occurredAt": "2026-04-01T10:00:00Z"
    }
  ]
}
```

---

### `GET /v1/categories`

```json
// Response
{
  "data": [
    { "id": "uuid", "name": "Alimentação" }
  ]
}
```

---

### `GET /v1/summary/categories`

Query: `?period=30d`

Agrega receita e despesa por categoria no período.

```json
// Response
{
  "data": [
    {
      "categoryId": "uuid",
      "income": 0.00,
      "expense": 850.00
    }
  ]
}
```

---

### `GET /v1/goals`

Tem fallback — falha silenciosa, exibe lista vazia.

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "name": "Viagem Europa",
      "current": 3000.00,
      "target": 10000.00,
      "deadline": "2026-12-31",
      "color": "#10b981",  // opcional, default aplicado no frontend
      "icon": "✈️",        // opcional
      "category": "Viagem" // opcional
    }
  ]
}
```

---

## Admin — Dashboard

Mesma situação: 5 chamadas em paralelo, 4 sem fallback.

---

### `GET /v1/admin/stats`

```json
// Response
{
  "data": {
    "mrr": 15800,
    "mrrChange": "+12%",         // string formatada, exibida diretamente
    "mrrTrend": "up",            // "up" ou "down"
    "totalClients": 342,
    "clientsChange": "+8%",
    "activeClients": 298,
    "activeChange": "+5%",
    "conversionRate": "4.2%",    // string formatada
    "conversionChange": "-0.3%",
    "conversionTrend": "down"
  }
}
```

---

### `GET /v1/admin/revenue`

> ⚠️ **CRÍTICO:** Os campos do array devem se chamar `receita` e `clientes` (em português). O Recharts usa `dataKey="receita"` hardcoded — nome diferente = gráfico em branco sem erro.

```json
// Response
{
  "data": [
    { "month": "Nov", "receita": 12000, "clientes": 280 },
    { "month": "Dez", "receita": 13500, "clientes": 298 },
    { "month": "Jan", "receita": 14200, "clientes": 310 },
    { "month": "Fev", "receita": 14800, "clientes": 325 },
    { "month": "Mar", "receita": 15200, "clientes": 338 },
    { "month": "Abr", "receita": 15800, "clientes": 342 }
  ]
}
```

Retornar os últimos 6 meses.

---

### `GET /v1/admin/clients`

Query: `?limit=5`

```json
// Response
{
  "data": [
    {
      "name": "João Silva",
      "email": "joao@email.com",
      "plan": "Pro",       // "Free", "Pro" ou "Business" — inicial maiúscula
      "status": "Ativo",   // "Ativo", "Pendente" ou "Bloqueado"
      "date": "24/04/2026" // string já formatada
    }
  ]
}
```

---

### `GET /v1/admin/activity`

Query: `?limit=5`

```json
// Response
{
  "data": [
    {
      "type": "signup",              // "signup" | "payment" | "upgrade" | "support"
      "message": "Novo cadastro: Maria Souza",
      "time": "5 minutos"           // string já formatada, exibida como "Há 5 minutos"
    }
  ]
}
```

---

### `GET /v1/admin/plans` _(usado também na página de Planos)_

Tem fallback no dashboard — falha silenciosa no gráfico de distribuição.

```json
// Response
{
  "data": [
    {
      "id": "pro",
      "name": "Pro",
      "description": "Para quem quer mais",
      "price": 97,
      "billingPeriod": "mês",
      "subscribers": 180,
      "mrr": 17460,
      "popular": true,
      "features": [
        { "name": "Transações ilimitadas", "included": true },
        { "name": "Suporte prioritário", "included": false }
      ]
    }
  ],
  "subscriptions": [
    {
      "id": "uuid",
      "client": "João Silva",
      "plan": "Pro",
      "status": "Ativo",
      "startDate": "01/01/2026",
      "nextBilling": "01/05/2026",
      "amount": 97
    }
  ]
}
```

---

## Admin — Usuários

### `GET /v1/admin/users`

Retorna todos os usuários de uma vez (paginação é feita no frontend).

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "11999999999",       // opcional
      "plan": "pro",                // "free", "pro" ou "business"
      "status": "Ativo",            // "Ativo", "Pendente" ou "Bloqueado"
      "role": "user",               // "user" ou "admin"
      "lastLogin": "23/04/2026",    // string formatada
      "createdAt": "01/01/2026",    // string formatada
      "totalTransactions": 47,      // opcional
      "planExpiresAt": "30/04/2026" // opcional
    }
  ],
  "stats": {
    "total": 342,
    "active": 298,
    "pending": 30,
    "blocked": 14
  }
}
```

---

### `PATCH /v1/admin/users/:id`

Envia apenas os campos que mudam.

```json
// Request body (campos opcionais)
{
  "plan": "pro",       // "free" | "pro" | "business"
  "status": "Bloqueado", // "Ativo" | "Bloqueado"
  "role": "admin"      // "user" | "admin"
}

// Response
{
  "data": { /* objeto AdminUser atualizado */ }
}
```

> ⚠️ O frontend envia `status` em português (`"Ativo"`, `"Bloqueado"`). Padronize o backend para aceitar e retornar esses mesmos valores para evitar inconsistência no display.

---

### `DELETE /v1/admin/users/:id`

```json
// Response
{
  "data": { "removed": true }
}
```

---

## Admin — Assinaturas

### `GET /v1/admin/subscriptions`

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "user": {
        "name": "João Silva",
        "email": "joao@email.com",
        "avatar": "JO"  // 2 letras de iniciais — renderizado no AvatarFallback
      },
      "plan": "Pro",
      "amount": 97.00,
      "interval": "monthly",
      "status": "ativa",       // "ativa" | "cancelada" | "trial" | "inativa" | "atrasada"
      "startDate": "01/01/2026",
      "nextBilling": "01/05/2026",
      "paymentMethod": "Cartão de crédito",
      "autoRenew": true
    }
  ],
  "stats": {
    "totalRevenue": 15800.00,
    "active": 180,
    "trial": 42,
    "overdue": 12
  }
}
```

> ⚠️ `user.avatar` deve ser uma string de 2 letras (iniciais), não uma URL.

---

### Ações de assinatura _(UI pronta, ainda não conectada ao backend)_

Quando implementar, os endpoints serão:

| Ação | Endpoint |
|------|----------|
| Pausar | `PATCH /v1/admin/subscriptions/:id` → `{ "status": "inativa" }` |
| Reativar | `PATCH /v1/admin/subscriptions/:id` → `{ "status": "ativa" }` |
| Cancelar | `DELETE /v1/admin/subscriptions/:id` |
| Renovar manualmente | `POST /v1/admin/subscriptions/:id/renew` |

---

## Admin — Empresas

### `GET /v1/admin/companies`

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "name": "Empresa XYZ",
      "cnpj": "00.000.000/0001-00",
      "email": "contato@empresa.com",
      "plan": "Business",
      "status": "Ativo",
      "users": 12,
      "mrr": 297.00,
      "usage": 78,              // percentual 0-100
      "createdAt": "01/01/2026",
      "owner": "Maria Souza"
    }
  ],
  "stats": {
    "total": 25,
    "active": 22,
    "defaulting": 3
  }
}
```

---

## Checklist de Prioridade

### 🔴 Alta — bloqueiam o dashboard (sem estes, tela de erro)

- [ ] `GET /v1/summary/balance?period=30d`
- [ ] `GET /v1/transactions?period=30d`
- [ ] `GET /v1/categories`
- [ ] `GET /v1/summary/categories?period=30d`
- [ ] `GET /v1/admin/stats`
- [ ] `GET /v1/admin/revenue` ← campos `receita` e `clientes`
- [ ] `GET /v1/admin/clients?limit=5`
- [ ] `GET /v1/admin/activity?limit=5`

### 🟡 Média — páginas admin funcionais

- [ ] `GET /v1/admin/users`
- [ ] `PATCH /v1/admin/users/:id`
- [ ] `DELETE /v1/admin/users/:id`
- [ ] `GET /v1/admin/plans`
- [ ] `GET /v1/admin/subscriptions`
- [ ] `GET /v1/admin/companies`
- [ ] `GET /v1/goals`

### 🟢 Baixa — UI pronta, ações ainda não conectadas

- [ ] `POST /v1/admin/plans`
- [ ] `PUT /v1/admin/plans/:id`
- [ ] `PATCH /v1/admin/subscriptions/:id`
- [ ] `DELETE /v1/admin/subscriptions/:id`
- [ ] `POST /v1/admin/subscriptions/:id/renew`
