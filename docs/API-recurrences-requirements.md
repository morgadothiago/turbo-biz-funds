# Especificação de API - Recorrências

Este documento lista os endpoints e formatos necessários para a tela de Recorrências funcionar corretamente no frontend.

---

## Endpoints Necessários

### 1. Listar Recorrências Ativas (GET)
**Endpoint:** `/v1/recurrences/active`  
**Método:** `GET`  
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid-da-recorrencia",
      "category_id": "uuid-da-categoria",
      "category_name": "Assinaturas",
      "type": "EXPENSE",
      "amount": 55.90,
      "description": "Netflix",
      "frequency": "monthly",
      "start_date": "2026-01-01",
      "end_date": null,
      "active": true,
      "created_at": "2026-01-01T10:30:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}
```

**Possíveis erros:**
- `401` - Não autenticado
- `500` - Erro interno do servidor

---

### 2. Criar Recorrência (POST)
**Endpoint:** `/v1/recurrences`  
**Método:** `POST`  
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "category_id": "uuid-da-categoria",
  "type": "EXPENSE",
  "amount": 55.90,
  "description": "Netflix",
  "frequency": "monthly",
  "start_date": "2026-01-01",
  "end_date": null
}
```

**Campos:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|--------------|-----------|
| `category_id` | string | Sim | ID da categoria |
| `type` | string | Sim | "INCOME" (receita) ou "EXPENSE" (despesa) |
| `amount` | number | Sim | Valor em centavos (ex: 55.90 = R$ 55,90) |
| `description` | string | Não | Descrição da recorrência |
| `frequency` | string | Sim | "daily", "weekly", "monthly" ou "yearly" |
| `start_date` | string | Sim | Data de início (formato: YYYY-MM-DD) |
| `end_date` | string | Não | Data de fim (opcional, formato: YYYY-MM-DD) |

**Response (201):**
```json
{
  "data": {
    "id": "uuid-da-recorrencia",
    "category_id": "uuid-da-categoria",
    "type": "EXPENSE",
    "amount": 55.90,
    "description": "Netflix",
    "frequency": "monthly",
    "start_date": "2026-01-01",
    "end_date": null,
    "active": true,
    "created_at": "2026-02-01T10:30:00Z"
  }
}
```

**Possíveis erros:**
- `400` - Payload inválido
- `401` - Não autenticado
- `422` - Dados inválidos (retorna detalhes dos campos com erro)

---

### 3. Atualizar Recorrência (PUT/PATCH)
**Endpoint:** `/v1/recurrences/{id}`  
**Método:** `PUT` ou `PATCH`  
**Headers:** `Authorization: Bearer {token}`

**Request (campos opcionais):**
```json
{
  "category_id": "uuid-da-categoria",
  "type": "EXPENSE",
  "amount": 65.90,
  "description": "Netflix atualizado",
  "frequency": "monthly",
  "start_date": "2026-01-01",
  "end_date": "2027-01-01",
  "active": true
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid-da-recorrencia",
    "category_id": "uuid-da-categoria",
    "type": "EXPENSE",
    "amount": 65.90,
    "description": "Netflix atualizado",
    "frequency": "monthly",
    "start_date": "2026-01-01",
    "end_date": "2027-01-01",
    "active": true,
    "updated_at": "2026-02-15T10:30:00Z"
  }
}
```

**Possíveis erros:**
- `401` - Não autenticado
- `404` - Recorrência não encontrada
- `422` - Dados inválidos

---

### 4. Gerar Lançamentos Futuros (POST)
**Endpoint:** `/v1/recurrences/generate`  
**Método:** `POST`  
**Headers:** `Authorization: Bearer {token}`

**Request:** (corpo vazio)

**Response (200):**
```json
{
  "data": {
    "generated": 15
  }
}
```

---

## Formato de Valores

O frontend envia valores decimais com 2 casas (ex: 55.90 = R$ 55,90).

---

## Frequencies Válidas

| Valor | Descrição |
|-------|-----------|
| `daily` | Diário |
| `weekly` | Semanal |
| `monthly` | Mensal |
| `yearly` | Anual |

---

## Tipos Válidos

| Valor | Descrição |
|-------|-----------|
| `INCOME` | Receita (entrada) |
| `EXPENSE` | Despesa (saída) |

---

## Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Requisição inválida |
| `401` | Não autenticado |
| `404` | Recurso não encontrado |
| `422` | Dados passaram na validação mas falharam nas regras de negócio |
| `500` | Erro interno do servidor |

---

## Exemplos de Requisições cURL

### Listar recorrências ativas:
```bash
curl -X GET "https://api.doutorcashapp.com.br/v1/recurrences/active" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

### Criar recorrência:
```bash
curl -X POST "https://api.doutorcashapp.com.br/v1/recurrences" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": "uuid-da-categoria",
    "type": "EXPENSE",
    "amount": 55.90,
    "description": "Netflix",
    "frequency": "monthly",
    "start_date": "2026-01-01",
    "end_date": null
  }'
```

---

## Frontend Atual

O frontend está configurado para enviar neste formato:
```json
{
  "category_id": "uuid-da-categoria",
  "type": "EXPENSE",
  "amount": 55.90,
  "description": "Netflix",
  "frequency": "monthly",
  "start_date": "2026-01-01",
  "end_date": null
}
```

Se o backend esperar outro formato, favor informar qual endpoint e formato esperado.

---

## Validações Recomendadas no Backend

1. `category_id` - Obrigatório, deve existir na tabela de categorias
2. `type` - Obrigatório, deve ser "INCOME" ou "EXPENSE"
3. `amount` - Obrigatório, maior que 0
4. `frequency` - Obrigatório, deve ser um dos valores válidos
5. `start_date` - Obrigatório, data válida no formato YYYY-MM-DD
6. `end_date` - Opcional, se informado deve ser maior que start_date