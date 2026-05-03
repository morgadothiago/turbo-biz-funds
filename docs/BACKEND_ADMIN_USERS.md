# Endpoints Necessários — Painel Admin (Gestão de Usuários)

## Contexto

O painel admin do frontend já está integrado com todos os endpoints `GET` disponíveis (`/v1/admin/stats`, `/v1/admin/users`, etc.). As ações de gestão de usuários abaixo estão implementadas no frontend mas **desabilitadas** enquanto os endpoints não existem no backend.

A detecção é automática: o frontend faz uma requisição `PATCH` de verificação na inicialização. Se o backend retornar `"Cannot PATCH ..."`, os botões ficam desabilitados. Quando os endpoints forem implementados, os botões se habilitam automaticamente, sem nenhuma alteração no frontend.

---

## Endpoints a Implementar

### 1. Atualizar dados do usuário

```
PATCH /v1/admin/users/:id
```

**Autenticação:** Bearer Token (role: `admin`)

**Request body** (todos os campos opcionais):
```json
{
  "plan": "free | pro | business | enterprise",
  "status": "active | inactive | blocked",
  "role": "user | admin"
}
```

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "plan": "string",
    "status": "string",
    "role": "string",
    "createdAt": "ISO8601"
  }
}
```

**Casos de uso no frontend:**
- Alterar plano do usuário
- Bloquear / desbloquear usuário (`status: "blocked"` / `status: "active"`)
- Promover a admin / remover admin (`role: "admin"` / `role: "user"`)

**Erros esperados:**
- `404` — usuário não encontrado
- `422` — valor inválido para plan, status ou role
- `403` — tentativa de alterar o próprio usuário admin

---

### 2. Excluir usuário

```
DELETE /v1/admin/users/:id
```

**Autenticação:** Bearer Token (role: `admin`)

**Response 200:**
```json
{
  "data": {
    "removed": true
  }
}
```

**Erros esperados:**
- `404` — usuário não encontrado
- `403` — tentativa de excluir o próprio usuário admin

---

### 3. Buscar usuário por ID (opcional — melhora o painel de detalhes)

```
GET /v1/admin/users/:id
```

**Autenticação:** Bearer Token (role: `admin`)

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string | null",
    "plan": "string",
    "status": "string",
    "role": "string",
    "createdAt": "ISO8601",
    "lastLogin": "ISO8601 | null",
    "totalTransactions": 0,
    "planExpiresAt": "ISO8601 | null"
  }
}
```

> **Nota:** `lastLogin` e `totalTransactions` são os campos que mais faltam hoje.
> O frontend já tem espaço reservado para eles no painel de detalhes.

---

## Campos que faltam no GET /v1/admin/users

O endpoint atual retorna apenas `{ id, name, email, plan, status, createdAt }`.

Se possível, adicionar ao retorno:

| Campo | Tipo | Descrição |
|---|---|---|
| `role` | `"user" \| "admin"` | Perfil do usuário |
| `lastLogin` | `ISO8601 \| null` | Data do último acesso |
| `phone` | `string \| null` | Telefone / WhatsApp |
| `totalTransactions` | `number` | Total de transações do usuário |
| `planExpiresAt` | `ISO8601 \| null` | Data de expiração do plano |

---

## Endpoints que retornam vazio (precisam de dados reais)

### GET /v1/admin/plans

Retorna `{ "data": [] }`. Usado para exibir distribuição de planos no dashboard e listagem de planos.

**Response esperada:**
```json
{
  "data": [
    {
      "id": "free",
      "name": "Free",
      "description": "string",
      "price": 0,
      "billingPeriod": "mensal",
      "subscribers": 15,
      "mrr": 0,
      "popular": false,
      "features": [
        { "name": "Transações ilimitadas", "included": true },
        { "name": "Relatórios avançados", "included": false }
      ]
    }
  ]
}
```

### GET /v1/admin/subscriptions

Retorna `{ "data": [] }`. Usado para listar assinaturas ativas.

**Response esperada:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user": { "name": "string", "email": "string", "avatar": "string | null" },
      "plan": "pro",
      "amount": 97.00,
      "interval": "mensal",
      "status": "active | trial | overdue | cancelled",
      "startDate": "ISO8601",
      "nextBilling": "ISO8601",
      "paymentMethod": "cartão | pix | boleto",
      "autoRenew": true
    }
  ],
  "stats": {
    "totalRevenue": 0,
    "active": 0,
    "trial": 0,
    "overdue": 0
  }
}
```

---

## Prioridade sugerida

| # | Endpoint | Impacto |
|---|---|---|
| 1 | `PATCH /v1/admin/users/:id` | Alto — bloquear, trocar plano, promover admin |
| 2 | `DELETE /v1/admin/users/:id` | Médio — excluir contas inativas/teste |
| 3 | Adicionar `role`, `lastLogin`, `phone` no `GET /v1/admin/users` | Médio — painel de detalhes |
| 4 | `GET /v1/admin/plans` com dados reais | Médio — gráfico do dashboard |
| 5 | `GET /v1/admin/subscriptions` com dados reais | Baixo — página de assinaturas |
| 6 | `GET /v1/admin/users/:id` | Baixo — pode ser derivado do list |
