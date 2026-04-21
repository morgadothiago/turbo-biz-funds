# Endpoints Faltantes — Spec para Implementação Backend

> Gerado em: 2026-04-21  
> Baseado nos endpoints que o frontend já consome e que retornam 404/500.

---

## Status Atual

| Módulo | Status |
|---|---|
| Auth (login, register, forgot/reset password) | ✅ Implementado |
| Transactions (CRUD) | ✅ Implementado |
| Categories (CRUD) | ✅ Implementado |
| **Goals (Metas)** | ❌ Faltando |
| **Cards (Cartões)** | ❌ Faltando |
| **Recurrences (Recorrências)** | ❌ Faltando |
| Summary (balance, categories) | ⚠️ Verificar |
| Plans | ⚠️ Verificar |
| Payments | ⚠️ Verificar |
| LGPD | ⚠️ Verificar |
| Admin | ⚠️ Verificar |

---

## 🎯 Módulo: Goals (Metas Financeiras)

### `GET /v1/goals`
**Auth:** JWT obrigatório  

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Viagem para Europa",
      "target": 15000.00,
      "current": 3500.00,
      "deadline": "2026-12-31T00:00:00.000Z",
      "color": "bg-blue-500",
      "icon": "✈️",
      "category": "Viagem",
      "createdAt": "2026-04-21T00:00:00.000Z"
    }
  ]
}
```

---

### `POST /v1/goals`
**Auth:** JWT obrigatório  
**Plan Guard:** Free = máx 1 meta → retornar 402 se atingido  

**Body:**
```json
{
  "name": "Viagem para Europa",
  "target": 15000.00,
  "current": 0,
  "deadline": "2026-12-31T00:00:00.000Z",
  "color": "bg-blue-500",
  "icon": "✈️",
  "category": "Viagem"
}
```

**Validações:**
| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `name` | string | ✅ | min 1 char, max 100 |
| `target` | number | ✅ | > 0 |
| `current` | number | ❌ | >= 0, default 0 |
| `deadline` | string | ✅ | ISO8601, deve ser data futura |
| `color` | string | ❌ | qualquer string, default "bg-blue-500" |
| `icon` | string | ❌ | qualquer string/emoji, default "🎯" |
| `category` | string | ❌ | max 50 chars, default "Geral" |

**Response 201:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Viagem para Europa",
    "target": 15000.00,
    "current": 0,
    "deadline": "2026-12-31T00:00:00.000Z",
    "color": "bg-blue-500",
    "icon": "✈️",
    "category": "Viagem",
    "createdAt": "2026-04-21T00:00:00.000Z"
  }
}
```

---

### `PATCH /v1/goals/:id`
**Auth:** JWT obrigatório | owner check  

**Body** (todos opcionais):
```json
{
  "name": "string",
  "target": 20000.00,
  "current": 5000.00,
  "deadline": "2027-06-30T00:00:00.000Z",
  "color": "string",
  "icon": "string",
  "category": "string"
}
```

**Response 200:**
```json
{
  "data": { "...goal atualizada..." }
}
```

**Erros:**
- `404` — Goal não encontrada
- `403` — Goal pertence a outro usuário

---

### `DELETE /v1/goals/:id`
**Auth:** JWT obrigatório | owner check  

**Response 200:**
```json
{
  "data": { "removed": true }
}
```

---

## 💳 Módulo: Cards (Cartões de Crédito)

### `GET /v1/cards`
**Auth:** JWT obrigatório  

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Nubank",
      "number": "************1234",
      "limit": 5000.00,
      "used": 1200.00,
      "dueDate": "15",
      "color": "from-purple-500 to-purple-700",
      "flag": "Visa",
      "createdAt": "2026-04-21T00:00:00.000Z"
    }
  ]
}
```

---

### `POST /v1/cards`
**Auth:** JWT obrigatório  
**Plan Guard:** Free = máx 1 cartão → retornar 402 se atingido  

**Body:**
```json
{
  "name": "Nubank",
  "number": "************1234",
  "limit": 5000.00,
  "dueDate": "15",
  "color": "from-purple-500 to-purple-700",
  "flag": "Visa"
}
```

**Validações:**
| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `name` | string | ✅ | min 1 char, max 50 |
| `number` | string | ✅ | string com últimos 4 dígitos (ex: `"************1234"`) |
| `limit` | number | ✅ | > 0 |
| `dueDate` | string | ✅ | dia do mês como string (ex: `"15"`) |
| `color` | string | ❌ | qualquer string, default "from-blue-500 to-blue-700" |
| `flag` | string | ❌ | ex: `"Visa"`, `"Mastercard"`, `"Elo"`, `"Amex"` |

> **Nota:** O campo `used` começa em `0` ao criar — o backend controla isso.

**Response 201:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Nubank",
    "number": "************1234",
    "limit": 5000.00,
    "used": 0,
    "dueDate": "15",
    "color": "from-purple-500 to-purple-700",
    "flag": "Visa",
    "createdAt": "2026-04-21T00:00:00.000Z"
  }
}
```

---

### `PATCH /v1/cards/:id`
**Auth:** JWT obrigatório | owner check  

**Body** (todos opcionais):
```json
{
  "name": "string",
  "limit": 8000.00,
  "used": 1500.00,
  "dueDate": "20",
  "color": "string",
  "flag": "string"
}
```

**Response 200:**
```json
{
  "data": { "...cartão atualizado..." }
}
```

---

### `DELETE /v1/cards/:id`
**Auth:** JWT obrigatório | owner check  

**Response 200:**
```json
{
  "data": { "removed": true }
}
```

---

## 🔄 Módulo: Recurrences (Recorrências)

### `GET /v1/recurrences/active`
**Auth:** JWT obrigatório  
Retorna apenas recorrências com `active = true` do usuário.

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "categoryId": "uuid",
      "type": "EXPENSE",
      "amount": 1500.00,
      "description": "Aluguel",
      "frequency": "monthly",
      "startDate": "2026-01-01T00:00:00.000Z",
      "endDate": null,
      "active": true,
      "nextOccurrence": "2026-05-01T00:00:00.000Z"
    }
  ]
}
```

---

### `POST /v1/recurrences`
**Auth:** JWT obrigatório  
**Plan Guard:** Free = máx 1 recorrência ativa → retornar 402 se atingido  

**Body:**
```json
{
  "categoryId": "uuid",
  "type": "EXPENSE",
  "amount": 1500.00,
  "description": "Aluguel",
  "frequency": "monthly",
  "startDate": "2026-05-01T00:00:00.000Z",
  "endDate": null
}
```

**Validações:**
| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `categoryId` | string (uuid) | ✅ | deve existir e pertencer ao usuário |
| `type` | string | ✅ | `"INCOME"` ou `"EXPENSE"` |
| `amount` | number | ✅ | > 0 |
| `description` | string | ❌ | max 200 chars |
| `frequency` | string | ✅ | `"daily"`, `"weekly"`, `"monthly"`, `"yearly"` |
| `startDate` | string | ✅ | ISO8601 |
| `endDate` | string | ❌ | ISO8601, deve ser após startDate |

**Response 201:**
```json
{
  "data": {
    "id": "uuid",
    "categoryId": "uuid",
    "type": "EXPENSE",
    "amount": 1500.00,
    "description": "Aluguel",
    "frequency": "monthly",
    "startDate": "2026-05-01T00:00:00.000Z",
    "endDate": null,
    "active": true,
    "nextOccurrence": "2026-05-01T00:00:00.000Z"
  }
}
```

---

### `PUT /v1/recurrences/:id`
**Auth:** JWT obrigatório | owner check  

**Body** (todos opcionais):
```json
{
  "categoryId": "uuid",
  "type": "INCOME",
  "amount": 2000.00,
  "description": "string",
  "frequency": "monthly",
  "startDate": "ISO8601",
  "endDate": "ISO8601",
  "active": false
}
```

> **Nota:** Enviar `active: false` desativa a recorrência sem deletar.

**Response 200:**
```json
{
  "data": { "...recorrência atualizada..." }
}
```

---

### `POST /v1/recurrences/generate`
**Auth:** JWT obrigatório  
Gera transações para todas as recorrências ativas do usuário até o fim do mês corrente.  
**Idempotente** — não duplica se já gerou para o período.

**Body:** nenhum

**Response 200:**
```json
{
  "data": { "generated": 3 }
}
```

---

## ⚠️ Endpoints a Verificar

Os endpoints abaixo são usados pelo frontend mas não foi possível confirmar se estão implementados. Testar e implementar se necessário.

### Summary

```
GET /v1/summary/balance?startDate=ISO&endDate=ISO
→ { "data": { "income": 5200.00, "expense": 3800.00, "balance": 1400.00 } }

GET /v1/summary/categories?startDate=ISO&endDate=ISO
→ { "data": [{ "categoryId": "uuid", "categoryName": "string", "income": 0, "expense": 850.00, "percentage": 22.4 }] }
```

### Plans

```
GET /v1/plans
→ { "data": [{ "id": "uuid", "slug": "free|pro|business", "name": "string", "price": 97.00, ... }] }

GET /v1/plans/:id
→ { "data": { ...plano } }
```

### Payments

```
POST /v1/payments/intent
Body: { "plan": "pro|business", "method": "cartao|pix" }
→ { "data": { "paymentId": "uuid", "status": "pending", "pix": { "qrCodeBase64": "...", "qrCodeText": "...", "expiresInSeconds": 3600 } } }

POST /v1/payments/:id/confirm
Body: { "card": { "number": "string", "holderName": "string", "expiryMonth": "string", "expiryYear": "string", "cvv": "string" } }
→ { "data": { "paymentId": "uuid", "status": "confirmed", "subscription": {...} } }

GET /v1/payments/:id/status
→ { "data": { "paymentId": "uuid", "status": "pending|confirmed|failed|expired", "method": "cartao|pix" } }
```

### Users (perfil e senha)

```
GET /v1/users/me
→ { "data": { "id": "uuid", "name": "string", "email": "string", "phone": "string|null", "plan": "free|pro|business", "planExpiresAt": "ISO|null", "createdAt": "ISO" } }

PATCH /v1/users/me
Body: { "name": "string", "phone": "string" }
→ { "data": { ...usuário atualizado } }

PATCH /v1/users/me/password
Body: { "currentPassword": "string", "newPassword": "string" }
→ { "message": "Senha alterada" }
```

### LGPD

```
GET /v1/lgpd/export
→ application/json com todos os dados do usuário (download)

DELETE /v1/lgpd
Body: { "password": "string" }
→ { "data": { "scheduledDeletion": "ISO (+30 dias)" } }
```

---

## Padrão de Resposta (Obrigatório em TODOS os endpoints)

### Sucesso
```json
{ "data": { } }
```
ou lista:
```json
{ "data": [ ] }
```

### Erro de validação (400/422)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      { "field": "name", "message": "Nome é obrigatório" }
    ]
  }
}
```

### Limite de plano (402)
```json
{
  "error": {
    "code": "PLAN_LIMIT_EXCEEDED",
    "message": "Você atingiu o limite de 1 meta no plano gratuito",
    "resource": "goals",
    "limit": 1,
    "currentCount": 1,
    "upgrade": {
      "url": "/pagamento",
      "plans": ["pro", "business"]
    }
  }
}
```

### Não encontrado (404)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado"
  }
}
```

---

## JWT — Campo `plan` obrigatório

O frontend extrai o plano do usuário diretamente do JWT. O campo `plan` **deve estar presente** no payload do token em todos os endpoints de auth (login e register):

```json
{
  "sub": "user-uuid",
  "email": "user@email.com",
  "name": "João Silva",
  "role": "user",
  "plan": "free",
  "iat": 1700000000,
  "exp": 1700003600
}
```

> Sem este campo o frontend assume `"free"` por segurança, mas isso pode causar bugs para usuários Pro/Business.

---

## Prioridade de Implementação

| Prioridade | Módulo | Motivo |
|---|---|---|
| 🔴 P0 | Goals CRUD | Bloqueando funcionalidade core |
| 🔴 P0 | Cards CRUD | Bloqueando funcionalidade core |
| 🔴 P0 | Recurrences CRUD | Bloqueando funcionalidade core |
| 🔴 P0 | JWT com campo `plan` | Limitação de planos não funciona sem isso |
| 🟡 P1 | Summary endpoints | Dashboard mostra dados incorretos sem eles |
| 🟡 P1 | Users/me (GET e PATCH) | Página de configurações não salva |
| 🟠 P2 | Payments | Fluxo de upgrade de plano |
| 🟠 P2 | Plans (GET) | Página de pagamento lista planos |
| 🟢 P3 | LGPD | Compliance, não urgente |
