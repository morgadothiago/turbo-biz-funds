# Especificação Backend — Endpoints Pendentes

> **Para:** Dev Backend
> **Projeto:** DoutorCash
> **Data:** 2026-04-17
> **Base URL:** `https://api.doutorcashapp.com.br`
> **Autenticação:** `Authorization: Bearer <jwt>` em todos os endpoints marcados com 🔒

---

## Prioridade 1 — Corrigir endpoints existentes com erro 500

Os endpoints abaixo já estão no Swagger mas retornam `500 Internal Server Error` em todas as chamadas. Sem isso, nenhum usuário consegue se registrar ou fazer login.

### `POST /v1/auth/register`

**Problema:** retorna 500 para qualquer payload válido.

**Payload esperado pelo frontend:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "Senha123",
  "plan": "free"
}
```

**Response esperado — 201:**
```json
{
  "message": "Conta criada com sucesso"
}
```

**Responses de erro:**
| Status | Situação |
|--------|----------|
| 409 | E-mail já cadastrado |
| 422 | Payload inválido |

---

### `POST /v1/auth/login`

**Problema:** retorna 500 para qualquer payload válido.

**Payload esperado:**
```json
{
  "email": "joao@email.com",
  "password": "Senha123"
}
```

**Response esperado — 200:**
```json
{
  "data": {
    "token": "<jwt>"
  }
}
```

> **Atenção:** o JWT deve conter os claims `sub` (ou `id`), `email`, `name` e `role` (`"user"` ou `"admin"`). O frontend usa esses campos para montar o perfil do usuário e controlar rotas.

---

## Prioridade 2 — Planos e Pagamentos

### `GET /v1/plans` 🔒

Lista os planos disponíveis para exibir na tela de pagamento.

**Response — 200:**
```json
{
  "data": [
    {
      "id": "free",
      "name": "Gratuito",
      "price": "R$ 0",
      "period": "para sempre",
      "description": "1 empresa, recursos básicos",
      "features": ["Categorização básica", "Relatórios simples", "Suporte por email"]
    },
    {
      "id": "pro",
      "name": "Pro",
      "price": "R$ 97",
      "period": "/mês",
      "description": "3 empresas, IA + WhatsApp",
      "features": ["Tudo do Gratuito", "Categorização por IA", "Registro por WhatsApp", "Relatórios avançados", "Suporte prioritário"]
    },
    {
      "id": "business",
      "name": "Business",
      "price": "R$ 297",
      "period": "/mês",
      "description": "Ilimitado, API + Suporte VIP",
      "features": ["Tudo do Pro", "Empresas ilimitadas", "API de integração", "Suporte VIP", "Treinamento dedicado"]
    }
  ]
}
```

---

### `GET /v1/plans/{id}` 🔒

**Response — 200:** mesmo objeto individual `{ "data": { ...plan } }`

---

### `POST /v1/payments/intent` 🔒

Chamado assim que o usuário chega na tela de pagamento. Cria a intenção de pagamento e retorna os dados necessários para renderizar o QR Code (Pix) ou o formulário de cartão.

**Payload:**
```json
{
  "plan": "pro",
  "method": "pix"
}
```

| Campo | Tipo | Valores aceitos |
|-------|------|-----------------|
| `plan` | string | `"pro"`, `"business"` |
| `method` | string | `"cartao"`, `"pix"` |

**Response — 201 (method: "pix"):**
```json
{
  "data": {
    "paymentId": "pay_abc123",
    "method": "pix",
    "status": "pending",
    "expiresAt": "2026-04-17T22:00:00Z",
    "pix": {
      "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "qrCodeText": "00020126580014BR.GOV.BCB.PIX...",
      "expiresInSeconds": 900
    },
    "amount": 9700,
    "currency": "BRL"
  }
}
```

**Response — 201 (method: "cartao"):**
```json
{
  "data": {
    "paymentId": "pay_abc123",
    "method": "cartao",
    "status": "pending",
    "amount": 9700,
    "currency": "BRL"
  }
}
```

> `amount` em centavos: R$ 97,00 = `9700`, R$ 297,00 = `29700`
> `qrCodeBase64` é PNG em base64 renderizado como `<img src="data:image/png;base64,...">`

---

### `POST /v1/payments/{paymentId}/confirm` 🔒

Confirma o pagamento com cartão de crédito.

**Payload:**
```json
{
  "card": {
    "number": "4111111111111111",
    "holderName": "JOAO SILVA",
    "expiryMonth": "12",
    "expiryYear": "27",
    "cvv": "123"
  }
}
```

**Response — 200:**
```json
{
  "data": {
    "paymentId": "pay_abc123",
    "status": "approved",
    "subscription": {
      "id": "sub_xyz789",
      "plan": "pro",
      "status": "active",
      "currentPeriodEnd": "2026-05-17T00:00:00Z"
    }
  }
}
```

**Responses de erro:**
| Status | `code` | Situação |
|--------|--------|----------|
| 402 | `CARD_DECLINED` | Cartão recusado |
| 402 | `INSUFFICIENT_FUNDS` | Saldo insuficiente |
| 402 | `INVALID_CARD` | Dados inválidos |
| 402 | `EXPIRED_CARD` | Cartão vencido |
| 408 | `PAYMENT_TIMEOUT` | Timeout no gateway |

```json
{ "message": "Cartão recusado pela operadora.", "code": "CARD_DECLINED" }
```

---

### `GET /v1/payments/{paymentId}/status` 🔒

Chamado quando o usuário clica em "Já fiz o pagamento" no fluxo Pix.

**Response — 200:**
```json
{
  "data": {
    "paymentId": "pay_abc123",
    "status": "approved",
    "method": "pix",
    "subscription": {
      "id": "sub_xyz789",
      "plan": "pro",
      "status": "active",
      "currentPeriodEnd": "2026-05-17T00:00:00Z"
    }
  }
}
```

| `status` | Comportamento no frontend |
|----------|--------------------------|
| `approved` | Navega para `/pagamento-sucesso` |
| `pending` | Toast: "Pagamento ainda não identificado" |
| `expired` | Toast: "QR Code expirado" |

---

## Prioridade 3 — Metas

### `GET /v1/goals` 🔒

**Response — 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Reserva de emergência",
      "target": 10000,
      "current": 4500,
      "deadline": "2026-12-31",
      "color": "#10b981",
      "icon": "🏦",
      "category": "Economia"
    }
  ]
}
```

---

### `POST /v1/goals` 🔒

**Payload:**
```json
{
  "name": "Reserva de emergência",
  "target": 10000,
  "current": 0,
  "deadline": "2026-12-31",
  "color": "#10b981",
  "icon": "🏦",
  "category": "Economia"
}
```

| Campo | Obrigatório |
|-------|------------|
| `name` | sim |
| `target` | sim |
| `deadline` | sim |
| `current` | não (default 0) |
| `color`, `icon`, `category` | não |

**Response — 201:** `{ "data": { ...goal } }`

---

### `PATCH /v1/goals/{id}` 🔒

Payload com campos parciais. **Response — 200:** `{ "data": { ...goal } }`

---

### `DELETE /v1/goals/{id}` 🔒

**Response — 200:** `{ "data": { "removed": true } }`

---

## Prioridade 4 — Cartões de Crédito

### `GET /v1/cards` 🔒

**Response — 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Nubank",
      "number": "4111",
      "limit": 5000,
      "used": 1200,
      "dueDate": "2026-05-10",
      "color": "#820AD1",
      "flag": "visa"
    }
  ]
}
```

---

### `POST /v1/cards` 🔒

**Payload:**
```json
{
  "name": "Nubank",
  "number": "4111111111111111",
  "limit": 5000,
  "dueDate": "2026-05-10",
  "color": "#820AD1",
  "flag": "visa"
}
```

**Response — 201:** `{ "data": { ...card } }`

---

### `PATCH /v1/cards/{id}` 🔒

Payload com campos parciais. **Response — 200:** `{ "data": { ...card } }`

---

### `DELETE /v1/cards/{id}` 🔒

**Response — 200:** `{ "data": { "removed": true } }`

---

## Prioridade 5 — Área Admin

Todos os endpoints abaixo requerem `role === "admin"` no JWT.

### `GET /v1/admin/stats` 🔒

**Response — 200:**
```json
{
  "data": {
    "mrr": 15400,
    "mrrChange": "+12%",
    "mrrTrend": "up",
    "totalClients": 243,
    "clientsChange": "+8",
    "activeClients": 201,
    "activeChange": "+5",
    "conversionRate": "34%",
    "conversionChange": "+2%",
    "conversionTrend": "up"
  }
}
```

---

### `GET /v1/admin/revenue` 🔒

**Response — 200:**
```json
{
  "data": [
    { "month": "Nov", "receita": 9800, "clientes": 180 },
    { "month": "Dez", "receita": 11200, "clientes": 195 },
    { "month": "Jan", "receita": 12500, "clientes": 210 },
    { "month": "Fev", "receita": 13800, "clientes": 225 },
    { "month": "Mar", "receita": 14600, "clientes": 235 },
    { "month": "Abr", "receita": 15400, "clientes": 243 }
  ]
}
```

---

### `GET /v1/admin/clients?limit=5` 🔒

**Response — 200:**
```json
{
  "data": [
    {
      "name": "Tech Solutions LTDA",
      "email": "contato@tech.com",
      "plan": "Pro",
      "status": "Ativo",
      "date": "17/04/2026"
    }
  ]
}
```

---

### `GET /v1/admin/activity?limit=5` 🔒

**Response — 200:**
```json
{
  "data": [
    {
      "type": "signup",
      "message": "Tech Solutions LTDA se cadastrou no plano Pro",
      "time": "5 minutos"
    }
  ]
}
```

| `type` | Ícone exibido |
|--------|--------------|
| `signup` | UserPlus |
| `payment` | CreditCard |
| `upgrade` | TrendingUp |
| `support` | AlertCircle |

---

### `GET /v1/admin/users` 🔒

**Response — 200:**
```json
{
  "data": [...],
  "stats": {
    "total": 243,
    "active": 201,
    "pending": 28,
    "blocked": 14
  }
}
```

---

### `GET /v1/admin/companies` 🔒

**Response — 200:**
```json
{
  "data": [...],
  "stats": {
    "total": 98,
    "active": 81,
    "defaulting": 17
  }
}
```

---

### `GET /v1/admin/subscriptions` 🔒

**Response — 200:** `{ "data": [...] }`

---

### `GET /v1/admin/plans` 🔒

**Response — 200:** `{ "data": [...] }`

---

## Padrão de resposta

Todos os endpoints seguem o mesmo envelope:

```json
// Sucesso com item único
{ "data": { ...objeto } }

// Sucesso com lista
{ "data": [ ...itens ] }

// Sucesso com mensagem
{ "message": "..." }

// Erro
{ "message": "Descrição do erro", "code": "CODIGO_DO_ERRO" }
```

---

## CORS

O backend deve aceitar requisições de:

- `http://localhost:5173` (dev Vite)
- Domínio de produção (a definir)

```
Access-Control-Allow-Origin: <origem>
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Resumo dos endpoints pendentes

| Prioridade | Método | Endpoint | Status |
|-----------|--------|----------|--------|
| 🔴 1 | POST | `/v1/auth/register` | Retornando 500 |
| 🔴 1 | POST | `/v1/auth/login` | Retornando 500 |
| 🟠 2 | GET | `/v1/plans` | Não implementado |
| 🟠 2 | GET | `/v1/plans/{id}` | Não implementado |
| 🟠 2 | POST | `/v1/payments/intent` | Não implementado |
| 🟠 2 | POST | `/v1/payments/{id}/confirm` | Não implementado |
| 🟠 2 | GET | `/v1/payments/{id}/status` | Não implementado |
| 🟡 3 | GET | `/v1/goals` | Não implementado |
| 🟡 3 | POST | `/v1/goals` | Não implementado |
| 🟡 3 | PATCH | `/v1/goals/{id}` | Não implementado |
| 🟡 3 | DELETE | `/v1/goals/{id}` | Não implementado |
| 🟡 4 | GET | `/v1/cards` | Não implementado |
| 🟡 4 | POST | `/v1/cards` | Não implementado |
| 🟡 4 | PATCH | `/v1/cards/{id}` | Não implementado |
| 🟡 4 | DELETE | `/v1/cards/{id}` | Não implementado |
| 🔵 5 | GET | `/v1/admin/stats` | Não implementado |
| 🔵 5 | GET | `/v1/admin/revenue` | Não implementado |
| 🔵 5 | GET | `/v1/admin/clients` | Não implementado |
| 🔵 5 | GET | `/v1/admin/activity` | Não implementado |
| 🔵 5 | GET | `/v1/admin/users` | Não implementado |
| 🔵 5 | GET | `/v1/admin/companies` | Não implementado |
| 🔵 5 | GET | `/v1/admin/subscriptions` | Não implementado |
| 🔵 5 | GET | `/v1/admin/plans` | Não implementado |
