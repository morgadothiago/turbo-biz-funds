# Especificação de API - Metas (Goals)

Este documento lista os endpoints e formatos necessários para a tela de Metas funcionar corretamente no frontend.

---

## Endpoints Necessários

### 1. Listar Metas (GET)
**Endpoint:** `/v1/goals`  
**Método:** `GET`  
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid-da-meta",
      "title": "Viagem para Europa",
      "target_value": 5000.00,
      "current_value": 1500.00,
      "target_date": "2026-12-31",
      "goal_category": "Viagem",
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-02-20T14:20:00Z"
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

### 2. Criar Meta (POST)
**Endpoint:** `/v1/goals`  
**Método:** `POST`  
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Viagem para Europa",
  "target_value": 5000.00,
  "current_value": 1500.00,
  "target_date": "2026-12-31",
  "goal_category": "Viagem"
}
```

**Campos:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|--------------|-----------|
| `title` | string | Sim | Nome da meta |
| `target_value` | number | Sim | Valor alvo em centavos (ex: 5000.00 = R$ 5.000,00) |
| `current_value` | number | Não | Valor atual já economizado (padrão: 0) |
| `target_date` | string | Sim | Data limite (formato: YYYY-MM-DD) |
| `goal_category` | string | Não | Categoria da meta (padrão: "Geral") |

**Response (201):**
```json
{
  "data": {
    "id": "uuid-da-meta",
    "title": "Viagem para Europa",
    "target_value": 5000.00,
    "current_value": 1500.00,
    "target_date": "2026-12-31",
    "goal_category": "Viagem",
    "created_at": "2026-02-01T10:30:00Z",
    "updated_at": "2026-02-01T10:30:00Z"
  }
}
```

**Possíveis erros:**
- `400` - Payload inválido
- `401` - Não autenticado
- `422` - Dados inválidos (retorna detalhes dos campos com erro)

---

### 3. Atualizar Meta (PATCH)
**Endpoint:** `/v1/goals/{id}`  
**Método:** `PATCH`  
**Headers:** `Authorization: Bearer {token}`

**Request (campos opcionais):**
```json
{
  "title": "Viagem para Europa - Atualizado",
  "target_value": 8000.00,
  "current_value": 2500.00,
  "target_date": "2027-06-30",
  "goal_category": "Viagem"
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid-da-meta",
    "title": "Viagem para Europa - Atualizado",
    "target_value": 8000.00,
    "current_value": 2500.00,
    "target_date": "2027-06-30",
    "goal_category": "Viagem",
    "updated_at": "2026-02-15T10:30:00Z"
  }
}
```

**Possíveis erros:**
- `401` - Não autenticado
- `404` - Meta não encontrada
- `422` - Dados inválidos

---

### 4. Deletar Meta (DELETE)
**Endpoint:** `/v1/goals/{id}`  
**Método:** `DELETE`  
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "data": {
    "removed": true
  }
}
```

**Possíveis erros:**
- `401` - Não autenticado
- `404` - Meta não encontrada

---

## Formato de Valores Monetários

O frontend envia valores em **centavos** (ex: R$ 5.000,00 = 500000 ou 5000.00).

Recomendação: usar sempre valores decimais com 2 casas:
- `target_value`: 5000.00
- `current_value`: 1500.00

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

### Listar metas:
```bash
curl -X GET "https://api.doutorcashapp.com.br/v1/goals" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

### Criar meta:
```bash
curl -X POST "https://api.doutorcashapp.com.br/v1/goals" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Viagem para Europa",
    "target_value": 5000.00,
    "current_value": 1500.00,
    "target_date": "2026-12-31",
    "goal_category": "Viagem"
  }'
```

---

## Validações Recomendadas no Backend

1. `title` - Obrigatório, min 3 caracteres, max 100
2. `target_value` - Obrigatório, maior que 0
3. `current_value` - Opcional, maior ou igual a 0, menor ou igual a target_value
4. `target_date` - Obrigatório, data futura (opcional: pode aceitar datas passadas)

---

## Frontend Atual

O frontend está configurado para enviar neste formato:
```json
{
  "title": "Viagem para Europa",
  "target_value": 5000.00,
  "current_value": 1500.00,
  "target_date": "2026-12-31",
  "goal_category": "Viagem"
}
```

Se o backend esperar outro formato, favor informar qual endpoint e formato esperado.