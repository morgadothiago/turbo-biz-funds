# Documentação de Endpoints — Cartões de Crédito (Cards)

**Data:** 2026-06-17  
**Solicitante:** Frontend (turbo-biz-funds)

---

## Visão Geral

Cartões de crédito permitem ao usuário gerenciar seus limites, registrar gastos e pagamentos, e visualizar histórico de movimentações.

O frontend implementa:
- CRUD de cartões
- Atualização de limite utilizado (gastos e pagamentos)
- Histórico de movimentações (**atualmente em localStorage — precisa migrar para backend**)
- **Notificações automáticas** em 4 eventos de cartão (ver seção abaixo)

---

## Endpoints Existentes (já funcionando)

### `GET /v1/cards`

Lista todos os cartões do usuário autenticado.

**Auth:** Bearer JWT

#### Resposta 200

```json
{
  "data": [
    {
      "id": "6778a78f-24ad-42f6-8412-315114f3b7ca",
      "userId": "uuid",
      "name": "Nubank",
      "number": "************1111",
      "limit": 5000,
      "used": 1200,
      "dueDate": "2026-05-02T00:00:00.000Z",
      "color": "from-purple-500 to-purple-700",
      "flag": "Mastercard",
      "createdAt": "2026-06-17T00:49:30.427Z",
      "updatedAt": "2026-06-17T16:12:23.992Z"
    }
  ]
}
```

> ⚠️ **`dueDate` retorna ISO 8601** — o frontend normaliza via `.slice(0, 10)` para `YYYY-MM-DD`.  
> Recomendação: backend retornar apenas `YYYY-MM-DD` para simplificar.

| Campo      | Tipo          | Descrição                                              |
|------------|---------------|--------------------------------------------------------|
| `id`       | string (uuid) | Identificador único                                    |
| `name`     | string        | Nome do cartão                                         |
| `number`   | string        | Número mascarado (`************1111`)                  |
| `limit`    | number        | Limite total (R$)                                      |
| `used`     | number        | Limite utilizado (R$)                                  |
| `dueDate`  | string        | Data de vencimento (ISO 8601 ou `YYYY-MM-DD`)          |
| `flag`     | string        | Bandeira: `"Visa"`, `"Mastercard"`, `"Elo"`, `"Amex"` |
| `color`    | string        | Classe Tailwind CSS de cor do cartão                   |

---

### `POST /v1/cards`

Cria um novo cartão.

**Auth:** Bearer JWT

#### Request Body (`CreateCardDto`)

```json
{
  "name": "Nubank Platinum",
  "number": "5502097111104467",
  "limit": 5000,
  "dueDate": "2026-07-15",
  "flag": "Mastercard",
  "color": "from-purple-500 to-purple-700"
}
```

| Campo     | Tipo   | Obrigatório | Regras                          |
|-----------|--------|-------------|---------------------------------|
| `name`    | string | **sim**     | Nome do cartão                  |
| `number`  | string | **sim**     | 16 dígitos, sem espaços         |
| `limit`   | number | **sim**     | Positivo > 0                    |
| `dueDate` | string | **sim**     | `YYYY-MM-DD`                    |
| `flag`    | string | não         | Default `"Visa"`                |
| `color`   | string | não         | Classe Tailwind                 |

#### Resposta 201

```json
{
  "data": {
    "id": "uuid",
    "name": "Nubank Platinum",
    "number": "************4467",
    "limit": 5000,
    "used": 0,
    "dueDate": "2026-07-15T00:00:00.000Z",
    "flag": "Mastercard",
    "color": "from-purple-500 to-purple-700",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### `PATCH /v1/cards/:id`

Atualiza parcialmente um cartão. **Usado para duas finalidades:**

1. Editar dados do cartão (nome, limite, vencimento, bandeira, cor)
2. **Atualizar limite utilizado** — envia apenas `{ "used": novoValor }`

**Auth:** Bearer JWT

#### Request Body (`UpdateCardDto`)

```json
{
  "name": "Nubank Gold",
  "number": "5502097111104467",
  "limit": 8000,
  "used": 1500,
  "dueDate": "2026-08-10",
  "flag": "Mastercard",
  "color": "from-slate-700 to-slate-900"
}
```

| Campo     | Tipo   | Obrigatório | Descrição                                              |
|-----------|--------|-------------|--------------------------------------------------------|
| `name`    | string | não         | Novo nome                                              |
| `number`  | string | não         | Novo número (16 dígitos)                               |
| `limit`   | number | não         | Novo limite total                                      |
| `used`    | number | não         | **Novo valor utilizado** (calculado pelo frontend)     |
| `dueDate` | string | não         | Nova data de vencimento                                |
| `flag`    | string | não         | Nova bandeira                                          |
| `color`   | string | não         | Nova cor                                               |

> ⚠️ **Importante:** O frontend calcula o novo `used` antes de enviar:
> - **Gasto:** `used = Math.min(used_atual + valor, limite_total)`
> - **Pagamento:** `used = Math.max(0, used_atual - valor)`

> 🔔 **Quando `used` é atualizado, o backend deve disparar notificações automáticas** (ver seção Notificações abaixo).

#### Resposta 200

```json
{
  "data": { /* objeto Card atualizado */ }
}
```

---

### `DELETE /v1/cards/:id`

Remove um cartão permanentemente.

**Auth:** Bearer JWT

#### Resposta 200 ou 204

```json
{ "removed": true }
```

---

## ❗ Endpoints NOVOS Necessários

### `POST /v1/cards/:id/history`

Registra uma movimentação no histórico do cartão.

**Motivação:** Atualmente o histórico é salvo em `localStorage` no browser. Precisa ser persistido no backend para:
- Histórico acessível em múltiplos dispositivos
- Dados não se perderem ao limpar o browser
- Relatórios futuros de uso por cartão

**Auth:** Bearer JWT

#### Request Body

```json
{
  "type": "expense",
  "amount": 150.00,
  "description": "Supermercado",
  "usedBefore": 1200.00,
  "usedAfter": 1350.00
}
```

| Campo         | Tipo                       | Obrigatório | Descrição                       |
|---------------|----------------------------|-------------|---------------------------------|
| `type`        | `"expense"` \| `"payment"` | **sim**     | Tipo da movimentação            |
| `amount`      | number                     | **sim**     | Valor da movimentação           |
| `description` | string                     | não         | Descrição livre                 |
| `usedBefore`  | number                     | **sim**     | Limite utilizado antes          |
| `usedAfter`   | number                     | **sim**     | Limite utilizado depois         |

#### Resposta 201

```json
{
  "data": {
    "id": "uuid",
    "cardId": "uuid",
    "type": "expense",
    "amount": 150.00,
    "description": "Supermercado",
    "usedBefore": 1200.00,
    "usedAfter": 1350.00,
    "createdAt": "2026-06-17T15:30:00.000Z"
  }
}
```

---

### `GET /v1/cards/:id/history`

Lista o histórico de movimentações de um cartão.

**Auth:** Bearer JWT

**Query params opcionais:**
- `limit` — número de registros (default: `50`)
- `offset` — paginação (default: `0`)

#### Resposta 200

```json
{
  "data": [
    {
      "id": "uuid",
      "cardId": "uuid",
      "type": "expense",
      "amount": 150.00,
      "description": "Supermercado",
      "usedBefore": 1200.00,
      "usedAfter": 1350.00,
      "createdAt": "2026-06-17T15:30:00.000Z"
    },
    {
      "id": "uuid",
      "cardId": "uuid",
      "type": "payment",
      "amount": 500.00,
      "description": "Pagamento fatura",
      "usedBefore": 1350.00,
      "usedAfter": 850.00,
      "createdAt": "2026-06-17T10:00:00.000Z"
    }
  ]
}
```

---

## 🔔 Notificações Automáticas de Cartão

O sistema de notificações já existe (`GET /v1/notifications`). O backend deve **disparar notificações automaticamente** nos 4 eventos abaixo, reutilizando o mesmo schema já em produção.

### Schema de Notificação (já existente)

```json
{
  "id": "uuid",
  "type": "activity",
  "severity": "info",
  "title": "Título da notificação",
  "body": "Texto descritivo",
  "action": {
    "label": "Ver cartões",
    "href": "/dashboard/cartoes"
  },
  "readAt": null,
  "createdAt": "2026-06-17T15:30:00.000Z"
}
```

| Campo      | Tipo                                               | Descrição                      |
|------------|----------------------------------------------------|--------------------------------|
| `type`     | `"activity"` \| `"alert"` \| `"system"`           | Categoria da notificação       |
| `severity` | `"info"` \| `"warning"` \| `"success"` \| `"error"` | Nível de urgência            |
| `title`    | string                                             | Título curto                   |
| `body`     | string                                             | Texto descritivo               |
| `action`   | `{ label, href }` \| null                         | Link de ação opcional          |

---

### Evento 1 — Gasto registrado no cartão

**Trigger:** `PATCH /v1/cards/:id` com `used` aumentando (type = `"expense"` no histórico)

**Quando disparar:** Sempre que o valor de `used` aumentar.

```json
{
  "type": "activity",
  "severity": "info",
  "title": "Gasto registrado — Nubank",
  "body": "R$ 150,00 em Supermercado. Limite utilizado: R$ 1.350,00 de R$ 5.000,00 (27%)",
  "action": {
    "label": "Ver histórico",
    "href": "/dashboard/cartoes"
  }
}
```

---

### Evento 2 — Limite próximo de 80%

**Trigger:** `PATCH /v1/cards/:id` com `used` cruzando o threshold de **80%** do `limit`

**Quando disparar:** Primeira vez que `used / limit >= 0.80` após estar abaixo de 80%.  
*(Não repetir a cada gasto — apenas na primeira vez que cruzar o threshold)*

```json
{
  "type": "alert",
  "severity": "warning",
  "title": "Limite próximo — Nubank",
  "body": "Você já utilizou 80% do limite do cartão Nubank. Disponível: R$ 1.000,00 de R$ 5.000,00.",
  "action": {
    "label": "Ver cartões",
    "href": "/dashboard/cartoes"
  }
}
```

---

### Evento 3 — Limite esgotado (100%)

**Trigger:** `PATCH /v1/cards/:id` com `used >= limit`

**Quando disparar:** Quando `used` atingir ou superar `limit`.

```json
{
  "type": "alert",
  "severity": "error",
  "title": "Limite esgotado — Nubank",
  "body": "O limite do cartão Nubank foi totalmente utilizado (R$ 5.000,00). Realize um pagamento para liberar crédito.",
  "action": {
    "label": "Registrar pagamento",
    "href": "/dashboard/cartoes"
  }
}
```

---

### Evento 4 — Fatura próxima do vencimento

**Trigger:** Job agendado (cron) que roda **diariamente às 08:00**

**Quando disparar:**
- **7 dias antes** do `dueDate` — aviso antecipado
- **3 dias antes** do `dueDate` — aviso urgente
- **No dia** do `dueDate` — aviso crítico

Disparar apenas se `used > 0` (não notificar cartões sem fatura).

#### 7 dias antes (`severity: "info"`)

```json
{
  "type": "alert",
  "severity": "info",
  "title": "Fatura vence em 7 dias — Nubank",
  "body": "A fatura do cartão Nubank vence em 22/07/2026. Valor utilizado: R$ 1.350,00.",
  "action": {
    "label": "Ver cartão",
    "href": "/dashboard/cartoes"
  }
}
```

#### 3 dias antes (`severity: "warning"`)

```json
{
  "type": "alert",
  "severity": "warning",
  "title": "Fatura vence em 3 dias — Nubank",
  "body": "A fatura do cartão Nubank vence em 18/07/2026. Valor utilizado: R$ 1.350,00. Pague para evitar juros.",
  "action": {
    "label": "Ver cartão",
    "href": "/dashboard/cartoes"
  }
}
```

#### No dia do vencimento (`severity: "error"`)

```json
{
  "type": "alert",
  "severity": "error",
  "title": "Fatura vence HOJE — Nubank",
  "body": "A fatura do cartão Nubank vence hoje (15/07/2026). Valor: R$ 1.350,00. Pague agora para evitar juros.",
  "action": {
    "label": "Ver cartão",
    "href": "/dashboard/cartoes"
  }
}
```

---

### Resumo dos Triggers de Notificação

| Evento                    | Trigger                          | `type`     | `severity` | Repete?                     |
|---------------------------|----------------------------------|------------|------------|-----------------------------|
| Gasto registrado          | `PATCH used` aumenta             | `activity` | `info`     | Sempre                      |
| Limite ≥ 80%              | `PATCH used` cruza 80%           | `alert`    | `warning`  | Uma vez por ciclo           |
| Limite esgotado (100%)    | `PATCH used >= limit`            | `alert`    | `error`    | Uma vez por ciclo           |
| Fatura — 7 dias           | Cron diário 08:00                | `alert`    | `info`     | Uma vez por ciclo de fatura |
| Fatura — 3 dias           | Cron diário 08:00                | `alert`    | `warning`  | Uma vez por ciclo de fatura |
| Fatura — no vencimento    | Cron diário 08:00                | `alert`    | `error`    | Uma vez por vencimento      |

> **"Por ciclo"** = entre um pagamento (reset de `used`) e o próximo esgotamento.  
> Sugestão: usar coluna `last_notified_at` ou flags booleanas na tabela `cards` para evitar spam.

---

## Fluxo Completo com Notificações

```
Usuário registra gasto
  → Frontend calcula novo used
  → PATCH /v1/cards/:id { used }                     ← já funciona
  → Backend salva novo used
  → Backend verifica thresholds:
      used aumentou?           → notifica "Gasto registrado"
      used / limit >= 0.80?    → notifica "Limite próximo 80%"
      used >= limit?           → notifica "Limite esgotado"
  → POST /v1/cards/:id/history { ... }               ← a implementar
  → Frontend busca novo GET /v1/notifications        ← já funciona

Cron diário 08:00
  → Backend varre todos os cartões com used > 0
  → Verifica dueDate de cada cartão
      7 dias antes?   → notifica "Fatura vence em 7 dias"
      3 dias antes?   → notifica "Fatura vence em 3 dias"
      Hoje?           → notifica "Fatura vence HOJE"
```

---

## Modelo de Dados Sugerido

```sql
-- Histórico de movimentações
CREATE TABLE card_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id      UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  type         VARCHAR(10) NOT NULL CHECK (type IN ('expense', 'payment')),
  amount       DECIMAL(10, 2) NOT NULL,
  description  VARCHAR(255),
  used_before  DECIMAL(10, 2) NOT NULL,
  used_after   DECIMAL(10, 2) NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_card_history_card_id ON card_history(card_id);
CREATE INDEX idx_card_history_created_at ON card_history(created_at DESC);

-- Colunas adicionais na tabela cards para controle de notificações
ALTER TABLE cards ADD COLUMN notified_80_pct    BOOLEAN DEFAULT FALSE;
ALTER TABLE cards ADD COLUMN notified_100_pct   BOOLEAN DEFAULT FALSE;
ALTER TABLE cards ADD COLUMN notified_due_7d    DATE;   -- data do ciclo notificado
ALTER TABLE cards ADD COLUMN notified_due_3d    DATE;
ALTER TABLE cards ADD COLUMN notified_due_today DATE;
```

> **Reset das flags:** Quando `used` cair abaixo de 80% (via pagamento), resetar `notified_80_pct = false` e `notified_100_pct = false` para que a notificação possa ser disparada novamente no próximo ciclo.

---

## Comportamento do Frontend em caso de erro

| Erro                   | Comportamento                              |
|------------------------|--------------------------------------------|
| `404` ou `500` (cards) | Lista vazia exibida (sem crash)            |
| `404` (history)        | Fallback para localStorage automaticamente |
| `401`                  | Redirect para login (interceptor global)   |
| Erro ao criar          | Toast "Erro ao adicionar cartão"           |
| Erro ao editar         | Toast "Erro ao atualizar cartão"           |
| Erro ao remover        | Toast "Erro ao remover cartão"             |
| Erro ao atualizar uso  | Toast "Erro ao atualizar limite"           |

---

## Sumário dos Endpoints

| Método   | Path                        | Status        | Função                             |
|----------|-----------------------------|---------------|------------------------------------|
| `GET`    | `/v1/cards`                 | ✅ Existe     | Lista cartões do usuário           |
| `POST`   | `/v1/cards`                 | ✅ Existe     | Cria novo cartão                   |
| `PATCH`  | `/v1/cards/:id`             | ✅ Existe     | Atualiza cartão / limite utilizado |
| `DELETE` | `/v1/cards/:id`             | ✅ Existe     | Remove cartão                      |
| `POST`   | `/v1/cards/:id/history`     | ❌ Falta      | Registra movimentação              |
| `GET`    | `/v1/cards/:id/history`     | ❌ Falta      | Lista histórico de movimentações   |
| —        | Cron diário 08:00           | ❌ Falta      | Notificações de vencimento de fatura |
| —        | Trigger em `PATCH used`     | ❌ Falta      | Notificações de limite (80% / 100%) |
| —        | Trigger em `PATCH used`     | ❌ Falta      | Notificação de gasto registrado    |
