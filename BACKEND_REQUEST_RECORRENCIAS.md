# Documentação de Endpoints — Recorrências

**Data:** 2026-06-14  
**Solicitante:** Frontend (turbo-biz-funds)

---

## Visão Geral

Recorrências representam receitas e despesas fixas periódicas (aluguel, salário, assinaturas etc.).  
O frontend gerencia criação, edição, exclusão e geração de lançamentos futuros.

---

## Endpoints Necessários

### 1. `GET /v1/recurrences/active`

Lista todas as recorrências ativas do usuário autenticado.

**Autenticação:** Bearer token (JWT)

#### Resposta 200

```json
{
  "data": [
    {
      "id": "uuid",
      "categoryId": "uuid",
      "type": "EXPENSE",
      "amount": 1500.00,
      "description": "Aluguel",
      "frequency": "MONTHLY",
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": null,
      "active": true
    }
  ]
}
```

| Campo         | Tipo              | Descrição                                      |
|---------------|-------------------|------------------------------------------------|
| `id`          | string (uuid)     | Identificador único                            |
| `categoryId`  | string (uuid)     | Categoria vinculada                            |
| `type`        | `"INCOME"` \| `"EXPENSE"` | Tipo da recorrência                  |
| `amount`      | number            | Valor por ocorrência                           |
| `description` | string \| null    | Descrição opcional                             |
| `frequency`   | `"DAILY"` \| `"WEEKLY"` \| `"MONTHLY"` \| `"YEARLY"` | Frequência |
| `startDate`   | ISO 8601          | Data de início                                 |
| `endDate`     | ISO 8601 \| null  | Data de término (null = recorrência contínua)  |
| `active`      | boolean           | Se a recorrência está ativa                    |

---

### 2. `POST /v1/recurrences`

Cria uma nova recorrência.

**Autenticação:** Bearer token (JWT)

#### Request Body

```json
{
  "categoryId": "uuid",
  "type": "EXPENSE",
  "amount": 1500.00,
  "description": "Aluguel",
  "frequency": "MONTHLY",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-12-01T00:00:00Z"
}
```

| Campo         | Tipo     | Obrigatório | Descrição                                |
|---------------|----------|-------------|------------------------------------------|
| `categoryId`  | string   | sim         | UUID de categoria existente              |
| `type`        | string   | sim         | `"INCOME"` ou `"EXPENSE"`               |
| `amount`      | number   | sim         | Valor positivo por ocorrência            |
| `description` | string   | não         | Texto livre                              |
| `frequency`   | string   | sim         | `"DAILY"`, `"WEEKLY"`, `"MONTHLY"`, `"YEARLY"` |
| `startDate`   | ISO 8601 | sim         | Data de início                           |
| `endDate`     | ISO 8601 | não         | Omitir ou `null` para recorrência sem fim |

#### Resposta 201

```json
{
  "data": {
    "id": "uuid",
    "categoryId": "uuid",
    "type": "EXPENSE",
    "amount": 1500.00,
    "description": "Aluguel",
    "frequency": "MONTHLY",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-01T00:00:00Z",
    "active": true
  }
}
```

#### Respostas de Erro

| Status | Descrição                              |
|--------|----------------------------------------|
| `400`  | Campos obrigatórios ausentes ou inválidos |
| `401`  | Token inválido ou expirado             |
| `404`  | `categoryId` não encontrada           |

---

### 3. `PATCH /v1/recurrences/:id`

Atualiza uma recorrência existente. Suporta atualização parcial (campos opcionais).

**Autenticação:** Bearer token (JWT)

#### Request Body

```json
{
  "amount": 1600.00,
  "description": "Aluguel reajustado",
  "categoryId": "uuid",
  "frequency": "MONTHLY",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-12-01T00:00:00Z"
}
```

> **Importante:** O frontend **não envia** o campo `active` neste endpoint.  
> Para excluir, use `DELETE /v1/recurrences/:id` (ver abaixo).

#### Resposta 200

```json
{
  "data": { /* objeto Recurrence atualizado */ }
}
```

#### Respostas de Erro

| Status | Descrição                              |
|--------|----------------------------------------|
| `400` / `422` | Payload inválido                |
| `401`  | Token inválido ou expirado             |
| `404`  | Recorrência não encontrada             |

---

### 4. `DELETE /v1/recurrences/:id`

Remove permanentemente uma recorrência.

**Autenticação:** Bearer token (JWT)

**Parâmetros de path:** `id` — UUID da recorrência

#### Resposta 200 ou 204

```json
{}
```

ou corpo vazio (204 No Content).

#### Respostas de Erro

| Status | Descrição                              |
|--------|----------------------------------------|
| `401`  | Token inválido ou expirado             |
| `404`  | Recorrência não encontrada             |

> **Contexto:** O frontend usava `PATCH /v1/recurrences/:id` com `{ active: false }` para desativar,  
> mas o backend retornava 422. A solução adotada foi migrar para `DELETE`.  
> Se o backend preferir manter o registro (soft delete com `active: false`), basta confirmar que  
> `PATCH /v1/recurrences/:id` aceita o campo `active: boolean`.

---

### 5. `POST /v1/recurrences/generate`

Gera os lançamentos futuros de todas as recorrências ativas do usuário.  
Cria transações nas datas de vencimento previstas.

**Autenticação:** Bearer token (JWT)

**Body:** vazio

#### Resposta 200

```json
{
  "generated": 12
}
```

| Campo       | Tipo   | Descrição                          |
|-------------|--------|------------------------------------|
| `generated` | number | Quantidade de transações geradas   |

---

## Mapeamento de Campos (Frontend → Backend)

O frontend envia `frequency` em **lowercase** (`monthly`, `weekly`...) no form,  
mas o hook converte para **UPPERCASE** antes de enviar:

```ts
backendPayload.frequency = frequency.toUpperCase(); // "monthly" → "MONTHLY"
```

Datas são sempre enviadas em **ISO 8601** com timezone:

```ts
new Date("2025-01-01").toISOString() // "2025-01-01T00:00:00.000Z"
```

---

## Sumário dos Endpoints

| Método   | Path                          | Função                              |
|----------|-------------------------------|-------------------------------------|
| `GET`    | `/v1/recurrences/active`      | Lista recorrências ativas           |
| `POST`   | `/v1/recurrences`             | Cria recorrência                    |
| `PATCH`  | `/v1/recurrences/:id`         | Atualiza recorrência                |
| `DELETE` | `/v1/recurrences/:id`         | Remove recorrência                  |
| `POST`   | `/v1/recurrences/generate`    | Gera lançamentos futuros            |
