# doutorcash — Especificação Backend

> Este documento descreve todos os endpoints necessários, contratos de dados, regras de negócio, planos e integração com IA.

---

## Stack Recomendada

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js (NestJS ou Fastify) ou Python (FastAPI) |
| Banco principal | PostgreSQL |
| Cache | Redis |
| ORM | Prisma (Node) / SQLAlchemy (Python) |
| Auth | JWT (access token 1h + refresh token 7d) |
| Filas | Bull/BullMQ ou AWS SQS |
| IA | Claude API (Anthropic) — Haiku para categorização, Sonnet para insights/chat |
| WhatsApp | Twilio / Z-API / Evolution API |
| Pagamentos | Stripe ou Asaas (para Pix nacional) |
| Storage | S3 ou Cloudflare R2 (para exports LGPD) |
| Emails | Resend ou SES |

---

## Autenticação e Autorização

### JWT Payload
```json
{
  "sub": "user-uuid",
  "email": "user@email.com",
  "role": "user | admin",
  "plan": "free | pro | business",
  "iat": 1700000000,
  "exp": 1700003600
}
```

### Guards necessários
- `AuthGuard` — verifica JWT válido
- `RoleGuard(admin)` — verifica role
- `PlanGuard(pro | business)` — verifica plano do usuário e retorna 402 se não tiver acesso
- `LimitGuard` — verifica limites do plano (ex: máx 50 transações/mês para Free)

---

## Módulo: Auth

### `POST /v1/auth/login`
**Body:**
```json
{ "email": "string", "password": "string" }
```
**Response 200:**
```json
{
  "data": {
    "accessToken": "jwt...",
    "refreshToken": "jwt...",
    "user": {
      "id": "uuid",
      "email": "string",
      "name": "string",
      "role": "user | admin",
      "plan": "free | pro | business",
      "phone": "string | null",
      "planExpiresAt": "ISO8601 | null"
    }
  }
}
```

### `POST /v1/auth/register`
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string (E.164, opcional)",
  "plan": "free | pro | business"
}
```
**Regras:**
- Hash bcrypt na senha (rounds: 12)
- Email único
- Se plan != free, redirecionar para checkout após registro
- Enviar email de boas-vindas
- Plan free: ativar imediatamente
**Response 201:**
```json
{ "data": { "accessToken": "jwt...", "refreshToken": "jwt...", "user": { ... } } }
```

### `POST /v1/auth/refresh`
**Body:** `{ "refreshToken": "string" }`
**Response 200:** `{ "data": { "accessToken": "jwt..." } }`

### `POST /v1/users/forgot-password`
**Body:** `{ "email": "string" }`
- Gera código de 6 dígitos, salva com TTL 15min
- Envia email com o código
**Response 200:** `{ "message": "Código enviado" }`

### `POST /v1/users/reset-password`
**Body:** `{ "email": "string", "code": "string", "newPassword": "string" }`
- Valida código (TTL e match)
- Hash nova senha, invalida código
**Response 200:** `{ "message": "Senha alterada" }`

---

## Módulo: Usuários

### `GET /v1/users/me`
Auth: JWT
**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string | null",
    "plan": "free | pro | business",
    "planExpiresAt": "ISO8601 | null",
    "createdAt": "ISO8601"
  }
}
```

### `PATCH /v1/users/me`
Auth: JWT
**Body:** `{ "name": "string (opcional)", "phone": "string (opcional)" }`
**Response 200:** `{ "data": { user atualizado } }`

### `PATCH /v1/users/me/password`
Auth: JWT
**Body:** `{ "currentPassword": "string", "newPassword": "string" }`
**Response 200:** `{ "message": "Senha alterada" }`

---

## Módulo: Categorias

> Limite: Free=5, Pro=Ilimitado, Business=Ilimitado

### `GET /v1/categories`
Auth: JWT
**Response 200:** `{ "data": [{ "id": "uuid", "name": "string", "userId": "uuid" }] }`

### `POST /v1/categories`
Auth: JWT | LimitGuard(categories)
**Body:** `{ "name": "string" }`
**Response 201:** `{ "data": { "id": "uuid", "name": "string" } }`

### `PATCH /v1/categories/:id`
Auth: JWT | owner check
**Body:** `{ "name": "string" }`
**Response 200:** `{ "data": { categoria atualizada } }`

### `DELETE /v1/categories/:id`
Auth: JWT | owner check
- Se categoria tiver transações vinculadas, retornar 409 ou mover para "Sem categoria"
**Response 200:** `{ "data": { "removed": true } }`

---

## Módulo: Transações

> Limite: Free=50/mês, Pro=Ilimitado, Business=Ilimitado

### `GET /v1/transactions`
Auth: JWT
**Query params:**
```
type?:     INCOME | EXPENSE
startDate?: ISO8601
endDate?:   ISO8601
categoryId?: uuid
search?:    string (busca em description)
page?:      number (default: 1)
limit?:     number (default: 50, max: 200)
```
**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "INCOME | EXPENSE",
      "amount": 150.00,
      "description": "string | null",
      "categoryId": "uuid",
      "categoryName": "string",
      "occurredAt": "ISO8601",
      "createdAt": "ISO8601"
    }
  ],
  "meta": { "total": 120, "page": 1, "limit": 50 }
}
```

### `POST /v1/transactions`
Auth: JWT | LimitGuard(transactions)
**Body:**
```json
{
  "type": "INCOME | EXPENSE",
  "amount": 150.00,
  "description": "string (opcional)",
  "categoryId": "uuid (opcional — se omitido, aciona IA para Pro+)",
  "occurredAt": "ISO8601 (default: now)"
}
```
**Regras:**
- Se `categoryId` for omitido e usuário for Pro+: chamar `POST /v1/ai/categorize` internamente e preencher automaticamente
- Se Free: `categoryId` obrigatório
**Response 201:** `{ "data": { transação criada + aiCategorysuggested?: true } }`

### `PATCH /v1/transactions/:id`
Auth: JWT | owner check
**Body:** campos opcionais de transação
**Response 200:** `{ "data": { transação atualizada } }`

### `DELETE /v1/transactions/:id`
Auth: JWT | owner check
**Response 200:** `{ "data": { "removed": true } }`

---

## Módulo: Summary

### `GET /v1/summary/balance`
Auth: JWT
**Query params:** `startDate?`, `endDate?` (default: mês atual)
**Response 200:**
```json
{
  "data": {
    "income": 5200.00,
    "expense": 3800.00,
    "balance": 1400.00
  }
}
```

### `GET /v1/summary/categories`
Auth: JWT
**Query params:** `startDate?`, `endDate?`
**Response 200:**
```json
{
  "data": [
    {
      "categoryId": "uuid",
      "categoryName": "string",
      "income": 0,
      "expense": 850.00,
      "percentage": 22.4
    }
  ]
}
```

### `GET /v1/summary/expenses-by-day`
Auth: JWT
**Query params:** `startDate?`, `endDate?`
**Response 200:**
```json
{
  "data": [
    { "date": "2024-03-01", "amount": 450.00 }
  ]
}
```

---

## Módulo: Metas

> Limite: Free=2, Pro=Ilimitado, Business=Ilimitado

### `GET /v1/goals`
Auth: JWT
**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "target": 10000.00,
      "current": 3500.00,
      "deadline": "ISO8601",
      "color": "string",
      "icon": "string",
      "category": "string"
    }
  ]
}
```

### `POST /v1/goals`
Auth: JWT | LimitGuard(goals)
**Body:** `{ name, target, current?, deadline, color?, icon?, category? }`
**Response 201:** `{ "data": { meta criada } }`

### `PATCH /v1/goals/:id`
Auth: JWT | owner check
**Body:** campos opcionais
**Response 200:** `{ "data": { meta atualizada } }`

### `DELETE /v1/goals/:id`
Auth: JWT | owner check
**Response 200:** `{ "data": { "removed": true } }`

---

## Módulo: Recorrências

> Limite: Free=3, Pro=Ilimitado, Business=Ilimitado

### `GET /v1/recurrences/active`
Auth: JWT
**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "categoryId": "uuid",
      "type": "INCOME | EXPENSE",
      "amount": 1500.00,
      "description": "string | null",
      "frequency": "daily | weekly | monthly | yearly",
      "startDate": "ISO8601",
      "endDate": "ISO8601 | null",
      "active": true,
      "nextOccurrence": "ISO8601"
    }
  ]
}
```

### `POST /v1/recurrences`
Auth: JWT | LimitGuard(recurrences)
**Body:**
```json
{
  "categoryId": "uuid",
  "type": "INCOME | EXPENSE",
  "amount": 1500.00,
  "description": "string (opcional)",
  "frequency": "daily | weekly | monthly | yearly",
  "startDate": "ISO8601",
  "endDate": "ISO8601 (opcional)"
}
```
**Response 201:** `{ "data": { recorrência criada } }`

### `PUT /v1/recurrences/:id`
Auth: JWT | owner check
**Body:** campos opcionais + `active?: boolean`
**Response 200:** `{ "data": { recorrência atualizada } }`

### `POST /v1/recurrences/generate`
Auth: JWT
- Gera transações para todas recorrências ativas do usuário até o fim do mês (ou 30 dias à frente)
- Idempotente: não duplica se já gerou para o período
**Response 200:** `{ "data": { "generated": 5 } }`

---

## Módulo: Cartões

> Limite: Free=2, Pro=Ilimitado, Business=Ilimitado

### `GET /v1/cards`
Auth: JWT
**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "lastFour": "string (4 dígitos)",
      "limit": 5000.00,
      "used": 1200.00,
      "dueDate": "number (dia do mês, 1-31)",
      "color": "string",
      "flag": "string (visa|mastercard|elo|amex)"
    }
  ]
}
```

### `POST /v1/cards`
Auth: JWT | LimitGuard(cards)
**Body:** `{ name, lastFour, limit, dueDate, color?, flag? }`
**Response 201:** `{ "data": { cartão criado } }`

### `PATCH /v1/cards/:id` / `DELETE /v1/cards/:id`
Auth: JWT | owner check

---

## Módulo: Planos

### `GET /v1/plans`
**Público**
**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "free | pro | business",
      "name": "string",
      "price": 97.00,
      "period": "monthly | yearly",
      "description": "string",
      "features": ["string"],
      "limits": {
        "transactions": 50,
        "categories": 5,
        "goals": 2,
        "recurrences": 3,
        "cards": 2
      },
      "aiEnabled": false,
      "whatsappEnabled": false,
      "apiEnabled": false,
      "active": true
    }
  ]
}
```

### `GET /v1/plans/:id`
**Público**

---

## Módulo: Pagamentos

### `POST /v1/payments/intent`
Auth: JWT
**Body:**
```json
{
  "planId": "uuid",
  "method": "card | pix",
  "card": {
    "number": "string",
    "holderName": "string",
    "expMonth": "string",
    "expYear": "string",
    "cvv": "string"
  }
}
```
**Regras:**
- Tokenizar cartão (nunca armazenar número completo)
- Para Pix: gerar QR Code
**Response 201:**
```json
{
  "data": {
    "paymentId": "uuid",
    "status": "pending | processing",
    "pix": {
      "code": "string (copia-e-cola)",
      "qrCodeUrl": "string",
      "expiresAt": "ISO8601"
    }
  }
}
```

### `POST /v1/payments/:id/confirm`
Auth: JWT
**Response 200:** `{ "data": { "status": "confirmed", "planActivatedAt": "ISO8601" } }`

### `GET /v1/payments/:id/status`
Auth: JWT
**Response 200:** `{ "data": { "status": "pending | confirmed | failed | expired" } }`

### `POST /v1/payments/webhook`
**Público (HMAC assinado pelo gateway)**
- Receber eventos do gateway de pagamento
- Ativar/cancelar plano do usuário automaticamente

---

## Módulo: IA (Novo)

> Todos os endpoints de IA verificam plano via `PlanGuard`.

### `POST /v1/ai/categorize` — Pro+
Auth: JWT | PlanGuard(pro)
**Body:** `{ "description": "string", "amount": number, "type": "INCOME | EXPENSE" }`
**Lógica:**
1. Buscar categorias do usuário
2. Chamar Claude Haiku com prompt contextualizado
3. Retornar categoryId com maior confiança
**Response 200:**
```json
{
  "data": {
    "categoryId": "uuid",
    "categoryName": "string",
    "confidence": 0.92
  }
}
```
**Custo estimado:** ~$0.0001 por chamada (Haiku)

---

### `GET /v1/ai/insights` — Pro+
Auth: JWT | PlanGuard(pro)
**Query:** `month?: "YYYY-MM"` (default: mês atual)
**Lógica:**
1. Buscar dados do mês atual vs mês anterior (summary/categories)
2. Chamar Claude Haiku para gerar bullet points de insights
3. Cachear resultado por 24h (Redis, chave: `insights:{userId}:{month}`)
**Response 200:**
```json
{
  "data": {
    "month": "2024-03",
    "generatedAt": "ISO8601",
    "insights": [
      {
        "type": "increase | decrease | alert | tip",
        "category": "Alimentação",
        "text": "Você gastou 23% a mais com Alimentação este mês (R$ 980 vs R$ 797)",
        "delta": 23.4,
        "deltaAmount": 183.00
      }
    ],
    "summary": "Em março você teve um mês equilibrado..."
  }
}
```

---

### `GET /v1/ai/monthly-summary` — Pro+
Auth: JWT | PlanGuard(pro)
**Query:** `month?: "YYYY-MM"`
**Lógica:**
1. Buscar balance + categories do mês
2. Chamar Claude Sonnet com dados financeiros completos
3. Gerar narrative summary em português (300-500 palavras)
4. Cachear por 24h
**Response 200:**
```json
{
  "data": {
    "month": "2024-03",
    "narrative": "string (texto em markdown)",
    "highlights": {
      "topExpenseCategory": "string",
      "biggestTransaction": { "description": "string", "amount": number },
      "savingsRate": 26.9
    }
  }
}
```

---

### `GET /v1/ai/forecast` — Business
Auth: JWT | PlanGuard(business)
**Query:** `months?: number (default: 3, max: 6)`
**Lógica:**
1. Buscar histórico dos últimos 6 meses por categoria
2. Calcular tendência (média móvel)
3. Chamar Claude Sonnet para ajustar previsão com contexto (recorrências ativas)
4. Cachear por 6h
**Response 200:**
```json
{
  "data": {
    "forecast": [
      {
        "month": "2024-04",
        "projectedIncome": 5200.00,
        "projectedExpense": 4100.00,
        "projectedBalance": 1100.00,
        "byCategory": [
          { "categoryId": "uuid", "categoryName": "string", "projected": 850.00 }
        ]
      }
    ]
  }
}
```

---

### `POST /v1/ai/chat` — Business (streaming)
Auth: JWT | PlanGuard(business)
**Body:**
```json
{
  "message": "string",
  "conversationId": "uuid (opcional, para histórico)"
}
```
**Lógica:**
1. Buscar contexto financeiro do usuário (últimos 3 meses: balance, categories, goals, recurrences)
2. Montar system prompt com os dados
3. Chamar Claude Sonnet com streaming (SSE)
4. Salvar mensagens no histórico (Redis TTL 24h ou Postgres)
**Response:** `text/event-stream`
```
data: {"token": "Com", "conversationId": "uuid"}
data: {"token": " base", "conversationId": "uuid"}
...
data: {"done": true, "fullResponse": "string"}
```

**Perguntas que deve responder:**
- "Quanto gastei com restaurante nos últimos 3 meses?"
- "Quando vou atingir minha meta de viagem se poupar R$ 500/mês?"
- "Quais são meus 3 maiores gastos?"
- "Estou gastando mais ou menos do que o mês passado?"

---

### `GET /v1/ai/anomalies` — Business
Auth: JWT | PlanGuard(business)
**Lógica:**
1. Comparar gastos dos últimos 7 dias com média histórica por categoria
2. Flagear categorias com desvio > 2 sigma
**Response 200:**
```json
{
  "data": {
    "anomalies": [
      {
        "categoryId": "uuid",
        "categoryName": "Viagens",
        "currentAmount": 800.00,
        "averageAmount": 120.00,
        "deviation": 566.7,
        "alert": "Detectamos um gasto incomum de R$ 800 em Viagens — 6,6x acima da sua média"
      }
    ]
  }
}
```

---

## Módulo: WhatsApp

### `POST /v1/whatsapp/connect`
Auth: JWT | PlanGuard(pro)
**Body:** `{ "phone": "string (E.164)" }`
- Envia mensagem de verificação para o número
- Salva `phone` no perfil do usuário
**Response 200:** `{ "data": { "verificationSent": true } }`

### `POST /v1/whatsapp/webhook` — Receber mensagens
**Público (autenticado por token secreto)**
**Body:** payload do provedor (Twilio/Z-API)
**Lógica:**
1. Identificar usuário pelo número de telefone
2. Extrair texto da mensagem
3. Chamar Claude Haiku para parsing:
   ```
   Extraia: tipo (receita/despesa), valor (número), descrição (string) 
   de: "gastei 45 reais no mercado"
   ```
4. Sugerir categoria automática (chamar `/v1/ai/categorize`)
5. Criar transação automaticamente
6. Responder no WhatsApp: "✅ Despesa de R$ 45,00 em Alimentação registrada!"
**Response 200:** `{ "message": "ok" }` (resposta rápida para o webhook)

---

## Módulo: LGPD

### `GET /v1/lgpd/export`
Auth: JWT
**Lógica:**
1. Buscar todos os dados do usuário (transações, categorias, metas, cartões, recorrências)
2. Serializar em JSON
3. Opcional: comprimir em ZIP com senha
4. Retornar como download (`Content-Disposition: attachment`)
**Response:** `application/json` (ou `application/zip`)

### `DELETE /v1/lgpd`
Auth: JWT
**Body:** `{ "password": "string" }` (confirmação extra)
**Lógica:**
1. Verificar senha
2. Anonimizar dados (soft delete ou hard delete conforme política)
3. Invalidar todos os tokens
4. Enviar email de confirmação de exclusão
5. Agendar purge dos dados em 30 dias (requisito LGPD: direito ao esquecimento)
**Response 200:** `{ "data": { "scheduledDeletion": "ISO8601 (+30 dias)" } }`

---

## Módulo: Admin

Todos os endpoints requerem `AuthGuard + RoleGuard(admin)`.

### `GET /v1/admin/stats`
```json
{
  "data": {
    "totalUsers": 1240,
    "activeSubscriptions": 380,
    "mrr": 36860.00,
    "churnRate": 2.3,
    "newUsersThisMonth": 87
  }
}
```

### `GET /v1/admin/revenue`
**Query:** `period?: "7d | 30d | 90d | 1y"`
```json
{
  "data": [{ "date": "string", "revenue": number, "newSubscriptions": number }]
}
```

### `GET /v1/admin/users`
**Query:** `search?`, `plan?`, `status?`, `page?`, `limit?`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "plan": "free | pro | business",
      "status": "active | suspended",
      "role": "user | admin",
      "createdAt": "ISO8601",
      "lastLoginAt": "ISO8601 | null",
      "totalTransactions": 120
    }
  ],
  "meta": { "total": number, "page": number, "limit": number }
}
```

### `PATCH /v1/admin/users/:id`
**Body:** `{ "plan"?, "role"?, "status"? }`

### `DELETE /v1/admin/users/:id`
Hard delete com LGPD compliance.

### `GET /v1/admin/companies`
### `POST /v1/admin/companies`
### `PATCH /v1/admin/companies/:id`
### `DELETE /v1/admin/companies/:id`

### `GET /v1/admin/subscriptions`
### `GET /v1/admin/activity`

### `GET|POST|PATCH|DELETE /v1/admin/plans`
CRUD de planos com `limits`, `aiEnabled`, `whatsappEnabled`, `price`.

---

## Limites por Plano (LimitGuard)

```typescript
const PLAN_LIMITS = {
  free: {
    transactions_per_month: 50,
    categories: 5,
    goals: 2,
    recurrences: 3,
    cards: 2,
    ai: false,
    whatsapp: false,
    api: false,
  },
  pro: {
    transactions_per_month: Infinity,
    categories: Infinity,
    goals: Infinity,
    recurrences: Infinity,
    cards: Infinity,
    ai: true,           // categorize, insights, summary
    ai_chat: false,     // chat e forecast só Business
    whatsapp: true,
    api: false,
  },
  business: {
    transactions_per_month: Infinity,
    categories: Infinity,
    goals: Infinity,
    recurrences: Infinity,
    cards: Infinity,
    ai: true,
    ai_chat: true,      // chat, forecast, anomalies
    whatsapp: true,
    api: true,
    max_users: 5,       // multi-usuário
  },
};
```

**Resposta quando limite atingido:**
```json
HTTP 402 Payment Required
{
  "error": {
    "code": "PLAN_LIMIT_EXCEEDED",
    "message": "Você atingiu o limite de 50 transações no plano gratuito",
    "upgrade": { "url": "/pagamento", "plan": "pro" }
  }
}
```

---

## Padrão de Resposta

### Sucesso
```json
{
  "data": { ... } | [ ... ],
  "meta": { "total": number, "page": number, "limit": number }
}
```

### Erro
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem legível",
    "details": [ ... ] (opcional, para erros de validação)
  }
}
```

### Códigos de Erro Customizados
| Code | HTTP | Descrição |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | Email/senha incorretos |
| `TOKEN_EXPIRED` | 401 | JWT expirado |
| `FORBIDDEN` | 403 | Sem permissão para o recurso |
| `NOT_FOUND` | 404 | Recurso não encontrado |
| `PLAN_LIMIT_EXCEEDED` | 402 | Limite do plano atingido |
| `PLAN_REQUIRED` | 402 | Feature requer upgrade de plano |
| `CATEGORY_HAS_TRANSACTIONS` | 409 | Categoria em uso |
| `DUPLICATE_EMAIL` | 409 | Email já cadastrado |
| `INVALID_RESET_CODE` | 400 | Código de reset inválido ou expirado |
| `WHATSAPP_NOT_CONNECTED` | 400 | Número WhatsApp não vinculado |

---

## Sistema de Notificações

### Gatilhos
| Evento | Canal | Plano |
|---|---|---|
| Transação via WhatsApp criada | WhatsApp (confirmação) | Pro+ |
| Insights mensais prontos | WhatsApp + Email | Pro+ |
| Anomalia detectada | WhatsApp + Push | Business |
| Meta atingida | WhatsApp + App | Todos |
| Recorrência gerada | App (silent) | Todos |
| Assinatura expirando (3 dias) | Email + WhatsApp | Todos pagos |
| Cobrança confirmada | Email | Todos pagos |

### `POST /v1/notifications/preferences`
Auth: JWT
**Body:**
```json
{
  "whatsapp": { "monthlyInsights": true, "anomalies": true, "goalAchieved": true },
  "email": { "monthlyInsights": false, "billing": true },
  "push": { "anomalies": true }
}
```

---

## Jobs / Cron

| Job | Schedule | Descrição |
|---|---|---|
| `generate-monthly-insights` | `0 8 1 * *` (dia 1, 8h) | Gera insights de IA para todos usuários Pro+ |
| `check-recurrences` | `0 6 * * *` (diário, 6h) | Gera transações de recorrências do dia |
| `detect-anomalies` | `0 20 * * *` (diário, 20h) | Roda detecção de anomalias Business |
| `payment-webhook-retry` | `*/5 * * * *` (5min) | Reprocessa webhooks de pagamento falhos |
| `expire-reset-codes` | `*/15 * * * *` (15min) | Limpa códigos de reset expirados |
| `lgpd-purge` | `0 3 * * *` (diário, 3h) | Hard delete de contas agendadas para exclusão |
| `subscription-expiry-alert` | `0 9 * * *` (diário, 9h) | Alerta sobre assinaturas expirando em 3 dias |

---

## Schema de Banco (Referência)

```sql
-- Usuários
users (id, name, email, password_hash, phone, role, plan, plan_expires_at, whatsapp_connected, created_at, deleted_at)

-- Categorias
categories (id, user_id, name, created_at)

-- Transações
transactions (id, user_id, category_id, type, amount, description, occurred_at, source, ai_categorized, created_at)

-- Metas
goals (id, user_id, name, target, current, deadline, color, icon, category, created_at)

-- Recorrências
recurrences (id, user_id, category_id, type, amount, description, frequency, start_date, end_date, active, last_generated_at, created_at)

-- Cartões
cards (id, user_id, name, last_four, limit_amount, used_amount, due_date_day, color, flag, created_at)

-- Pagamentos
payments (id, user_id, plan_id, method, status, amount, gateway_payment_id, created_at, confirmed_at)

-- Planos
plans (id, slug, name, price, period, description, features_json, limits_json, ai_enabled, whatsapp_enabled, api_enabled, active)

-- Insights IA (cache persistente)
ai_insights (id, user_id, month, insights_json, narrative, generated_at)

-- Conversas IA (Business)
ai_conversations (id, user_id, messages_json, created_at, updated_at)

-- Códigos de reset
password_reset_codes (id, user_id, code, expires_at, used_at)

-- Tokens de refresh
refresh_tokens (id, user_id, token_hash, expires_at, revoked_at)

-- Preferências de notificação
notification_preferences (id, user_id, whatsapp_json, email_json, push_json)

-- Webhook log
webhook_logs (id, provider, event_type, payload_json, processed_at, error)
```

---

## Integração com Claude API

### System Prompt Base (categorização)
```
Você é um assistente de categorização financeira. 
O usuário tem as seguintes categorias: {categories}.
Dada a transação: tipo={type}, valor={amount}, descrição="{description}",
responda APENAS com um JSON: {"categoryId": "uuid", "confidence": 0.0-1.0}
```

### System Prompt Base (insights)
```
Você é um consultor financeiro pessoal. 
Analise os dados financeiros do mês {month} vs {previousMonth} e gere insights úteis em português.
Dados: {balanceData} | Por categoria: {categoryData}
Formato de resposta: JSON com array "insights" (type, category, text, delta, deltaAmount) e "summary" (string).
Seja direto, empático e use valores em R$.
```

### System Prompt Base (chat)
```
Você é um assistente financeiro pessoal do doutorcash.
Contexto do usuário (últimos 3 meses):
- Saldo: {balance}
- Receitas: {income} | Despesas: {expense}
- Categorias de maior gasto: {topCategories}
- Metas ativas: {goals}
- Recorrências: {recurrences}

Responda perguntas sobre as finanças do usuário de forma clara e em português.
Quando calcular projeções, mostre o raciocínio passo a passo.
Data atual: {currentDate}
```

---

## Segurança

- [ ] Rate limiting por IP e por usuário (ex: 100 req/min/user, 10 req/min para endpoints de IA)
- [ ] CORS configurado para domínios autorizados
- [ ] Helmet.js (headers de segurança)
- [ ] Validação de input em todos os endpoints (zod/class-validator)
- [ ] SQL injection prevention (ORM com queries parametrizadas)
- [ ] Logs de auditoria para ações sensíveis (delete, mudança de role, exportar dados)
- [ ] HMAC validation nos webhooks de pagamento e WhatsApp
- [ ] Criptografia de dados sensíveis (número de cartão: apenas últimos 4 dígitos)
- [ ] Tokens de refresh com rotação
- [ ] Verificação de propriedade (user só acessa seus próprios recursos)
