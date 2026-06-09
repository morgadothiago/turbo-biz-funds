# Spec: Ajustes Backend — Doutor Cash

**Para:** Backend  
**Data:** 2026-06-08  
**Prioridade:** Alta  
**Contexto:** Frontend em produção com workarounds de localStorage porque os endpoints abaixo não existem ou retornam shape incorreto. Cada item tem impacto direto na experiência do usuário final.

---

## Sumário de Problemas

| # | Problema | Impacto | Tipo |
|---|----------|---------|------|
| 1 | Nome exibe prefixo do email (`lary_mello1`) | Alto | `name` ausente no JWT e no login response |
| 2 | Perfil some ao trocar de dispositivo | Alto | `GET /v1/users/me` não existe |
| 3 | Salvar perfil falha silenciosamente | Alto | `PATCH /v1/users/me` não existe |
| 4 | `phone` e `cpf` somem após o cadastro | Médio | Campos ausentes no register response |
| 5 | CPF não retorna na listagem de usuários admin | Médio | Campo ausente na API |
| 6 | Admin Relatórios: 6 erros JS em runtime | Alto | Shape inesperado nos responses |

---

## 1. JWT — Incluir `name`, `phone` e `cpf` nos claims

### Problema
JWT retornado no login contém apenas `sub, id, email, role, plan, iat, exp`. Sem `name`, `phone` nem `cpf`. Frontend cai no fallback `email.split("@")[0]`, exibindo `lary_mello1` em vez do nome real.

### Solução

**Opção A (recomendada) — alterar payload do JWT:**

```json
{
  "sub": "uuid",
  "id": "uuid",
  "email": "usuario@email.com",
  "name": "Larissa Mello",
  "phone": "(35) 99953-7223",
  "cpf": "12345678909",
  "role": "user",
  "plan": "pro",
  "iat": 1234567890,
  "exp": 1234567890
}
```

> `phone` e `cpf` podem ser `null` se o usuário não cadastrou.

**Opção B (alternativa) — incluir `user` no response do `POST /v1/auth/login`:**

```json
{
  "data": {
    "token": "jwt...",
    "user": {
      "id": "uuid",
      "name": "Larissa Mello",
      "email": "usuario@email.com",
      "phone": "(35) 99953-7223",
      "cpf": "12345678909",
      "role": "user",
      "plan": "pro"
    }
  }
}
```

> O `POST /v1/auth/register` já retorna `data.user` com `name` — seria consistente no login também.

---

## 2. Endpoint: `GET /v1/users/me`

### Problema
Endpoint não existe (retorna 404). Frontend não consegue buscar o perfil real após login. Se usuário troca de dispositivo ou limpa localStorage, perde nome, telefone e CPF.

### Spec

**Auth:** Bearer JWT (obrigatório)  
**Method:** GET  
**Path:** `/v1/users/me`

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Larissa Mello",
    "email": "lary_mello1@hotmail.com",
    "phone": "(35) 99953-7223",
    "cpf": "12345678909",
    "role": "user",
    "plan": "pro",
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

> `phone` e `cpf` podem ser `null`.

**Erros:**
- `401` — token inválido ou expirado

---

## 3. Endpoint: `PATCH /v1/users/me`

### Problema
Endpoint não existe (retorna 404). Botão "Salvar" na tela de Configurações falha silenciosamente — frontend salva só em localStorage como workaround temporário.

### Spec

**Auth:** Bearer JWT (obrigatório)  
**Method:** PATCH  
**Path:** `/v1/users/me`

**Request body** (todos os campos opcionais — enviar apenas o que mudar):
```json
{
  "name": "Larissa Mello",
  "phone": "(35) 99953-7223"
}
```

- `name`: string, mínimo 2 chars, máximo 100
- `phone`: string formato `(DD) 9XXXX-XXXX` ou `(DD) XXXX-XXXX`, ou `null` para remover

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Larissa Mello",
    "email": "lary_mello1@hotmail.com",
    "phone": "(35) 99953-7223",
    "cpf": "12345678909",
    "role": "user",
    "plan": "pro"
  }
}
```

**Erros:**
- `400` — campo inválido
- `401` — token inválido ou expirado

---

## 4. Endpoint `POST /v1/auth/register` — Incluir `phone` e `cpf` no request e response

### Problema
O body aceita `phone` mas o response de `data.user` não retorna o campo. Frontend agora também envia `cpf` no cadastro, mas o campo não é retornado.

### Request body atual → esperado

**O frontend agora envia:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "Senha123",
  "plan": "pro",
  "phone": "(11) 99999-9999",
  "cpf": "12345678909"
}
```

> `cpf`: string com 11 dígitos, sem máscara (ex: `"12345678909"`). Campo opcional.

### Response atual → esperado

**Response atual:**
```json
{
  "data": {
    "token": "...",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "user"
    }
  }
}
```

**Response esperado:**
```json
{
  "data": {
    "token": "...",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "(11) 99999-9999",
      "cpf": "12345678909",
      "role": "user"
    }
  }
}
```

---

## 5. CPF no endpoint `GET /v1/admin/users`

### Problema
A listagem de usuários no painel admin não retorna o campo `cpf`. A tela Admin > Clientes precisa exibir CPF na tabela.

### Ajuste

Incluir `cpf` em cada item do array `data` retornado por `GET /v1/admin/users`:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Larissa Mello",
      "email": "lary@email.com",
      "phone": "(35) 99953-7223",
      "cpf": "12345678909",
      "plan": "pro",
      "status": "active",
      "role": "user",
      "lastLogin": "2026-06-01T10:00:00Z",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "stats": {
    "total": 120,
    "active": 98,
    "pending": 15,
    "blocked": 7
  }
}
```

> `cpf` pode ser `null` se o usuário não cadastrou.

---

## 6. Admin Relatórios — Shapes dos Endpoints

### Problema
Os endpoints existem (confirmado no Swagger) mas retornam shapes que causam 2 tipos de erro JS em runtime:

1. `t.replace is not a function` — campos de variação percentual chegam como `number` em vez de `string`
2. `((intermediate value) ?? s ?? []).map is not a function` — endpoints retornam objeto em vez de array

**Endpoints afetados:**
- `GET /v1/admin/stats`
- `GET /v1/admin/revenue`
- `GET /v1/admin/revenue/chart`
- `GET /v1/admin/users/growth`
- `GET /v1/admin/plans/distribution`
- `GET /v1/admin/churn`
- `GET /v1/admin/cashflow`

---

### 6.1 `GET /v1/admin/stats`

**Query params:** `?period=monthly|weekly|quarterly|yearly`

**Response esperado:**
```json
{
  "totalRevenue": 12450.00,
  "revenueGrowth": 12.5,
  "newUsers": 1234,
  "usersGrowth": 8.3,
  "conversionRate": 23.4,
  "conversionGrowth": 2.1
}
```

> `revenueGrowth`, `usersGrowth`, `conversionGrowth` devem ser **números** (`number`), não strings formatadas. Positivo = crescimento, negativo = queda. Ex: `12.5` significa `+12,5%`, `-3.2` significa `-3,2%`.

---

### 6.2 `GET /v1/admin/revenue`

**Query params:** `?period=monthly&year=2026`

**Response esperado:**
```json
{
  "data": [
    {
      "month": "2026-01",
      "revenue": 10000.00,
      "expenses": 2000.00,
      "netRevenue": 8000.00,
      "mrr": 10000.00,
      "newSubscriptions": 50,
      "cancellations": 10,
      "churnRate": 2.5
    }
  ]
}
```

> `data` deve ser **array**. Não retornar objeto com propriedades indexadas (`{ "0": {...}, "1": {...} }`).

---

### 6.3 `GET /v1/admin/revenue/chart`

**Query params:** `?period=monthly&year=2026`

**Response esperado:**
```json
{
  "labels": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  "datasets": {
    "revenue": [10000, 11000, 11500, 12000, 12450, 13000],
    "expenses": [2000, 2200, 2400, 2500, 2600, 2700],
    "netRevenue": [8000, 8800, 9100, 9500, 9850, 10300]
  }
}
```

---

### 6.4 `GET /v1/admin/users/growth`

**Query params:** `?period=monthly&year=2026`

**Response esperado:**
```json
{
  "data": [
    {
      "period": "2026-01",
      "totalUsers": 500,
      "newUsers": 80,
      "activeUsers": 420,
      "inactiveUsers": 50,
      "blockedUsers": 30
    }
  ]
}
```

> `data` deve ser **array**.

---

### 6.5 `GET /v1/admin/plans/distribution`

**Query params:** `?period=monthly`

**Response esperado:**
```json
{
  "plans": [
    {
      "planId": "pro",
      "planName": "Doutor Cash Anual",
      "subscribers": 270,
      "revenue": 26973.00,
      "percentage": 35.5
    }
  ]
}
```

> Aceita `plans` ou `data` como chave do array.  
> `percentage` deve ser número `0–100`, não string `"35.5%"`.

---

### 6.6 `GET /v1/admin/churn`

**Query params:** `?period=monthly&year=2026`

**Response esperado:**
```json
{
  "churnByPeriod": [
    {
      "period": "2026-01",
      "cancelledCount": 10,
      "cancelledRevenue": 299.00,
      "churnRate": 2.5,
      "reason": "cancelado pelo usuário"
    }
  ]
}
```

> Aceita `churnByPeriod` ou `data` como chave do array.  
> `churnRate` deve ser número (`2.5` = 2,5%), não string.

---

### 6.7 `GET /v1/admin/cashflow`

**Query params:** `?year=2026`

**Response esperado:**
```json
{
  "entries": [
    {
      "id": "uuid",
      "date": "2026-05-01",
      "type": "revenue",
      "category": "assinatura",
      "description": "Nova assinatura Doutor Cash Anual",
      "amount": 99.90,
      "balance": 12450.00,
      "subscriptionId": "sub-uuid",
      "userId": "user-uuid"
    }
  ]
}
```

> Aceita `entries` ou `data` como chave do array.  
> `type` deve ser `"revenue"` ou `"expense"`.  
> `amount` negativo para despesas (ex: `-250.00`).

---

## Resumo das Mudanças

| # | Mudança | Tipo | Impacto |
|---|---------|------|---------|
| 1 | `name` + `phone` + `cpf` no JWT / login response | Alteração | **Alto** |
| 2 | `GET /v1/users/me` (retorna `cpf`) | Novo endpoint | **Alto** |
| 3 | `PATCH /v1/users/me` | Novo endpoint | **Alto** |
| 4 | `phone` + `cpf` aceitos e retornados no register | Alteração | Médio |
| 5 | `cpf` em `GET /v1/admin/users` | Alteração | Médio |
| 6 | Shapes corretos nos 7 endpoints de relatórios | Alteração | **Alto** |

---

## O que o frontend fará após implementação

1. **Login** → `GET /v1/users/me` → exibe nome/telefone/CPF reais em todo o app
2. **Configurações** → `PATCH /v1/users/me` → persiste no servidor → remove workaround localStorage
3. **Admin Clientes** → CPF exibido na tabela diretamente da API
4. **Admin Relatórios** → gráficos e métricas carregam sem erros JS, sem dados mock

---

## Contato

Em caso de dúvidas sobre o contrato de dados esperado pelo frontend, verificar o arquivo `src/features/admin/hooks/use-admin-reports.ts` no repositório do frontend — os mapeamentos de campo estão comentados em cada fetcher.
