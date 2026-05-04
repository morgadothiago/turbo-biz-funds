# API Contracts

## Base URL
- Produção: https://api.doutorcashapp.com.br
- Staging: (não definido)
- Local: http://localhost:3000

## Autenticação
- Tipo: Bearer JWT
- Header: `Authorization: Bearer {token}`

## Endpoints

### [Admin - Planos]
#### POST /v1/admin/plans
**Descrição:** Cria um novo plano de assinatura  
**Swagger:** https://api.doutorcashapp.com.br/docs  
**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "billingPeriod": "MONTHLY" | "YEARLY",
  "features": ["string"],
  "popular": false
}
```
**Response 200 (Success):**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 0,
  "billingPeriod": "MONTHLY",
  "features": ["string"],
  "popular": false,
  "createdAt": "2026-05-03T00:00:00.000Z"
}
```
**Erros Comuns:**
- 401: Não autenticado
- 422: Payload inválido (formato incorreto de `features`, campos faltando)
- 500: Erro interno do servidor

#### GET /v1/admin/plans
**Descrição:** Lista todos os planos cadastrados  
**Response 200:**
```json
[
  {
    "id": "string",
    "name": "string",
    "price": 0,
    "billingPeriod": "MONTHLY",
    "features": ["string"],
    "popular": false
  }
]
```

### [Admin - Usuários]
#### GET /v1/admin/users
**Descrição:** Lista usuários cadastrados  
**Query Params:** `limit` (number, opcional, padrão 10)  
**Response 200:**
```json
[
  {
    "id": "string",
    "email": "string",
    "name": "string",
    "createdAt": "2026-05-03T00:00:00.000Z"
  }
]
```

### [Admin - Assinaturas]
#### GET /v1/admin/subscriptions
**Descrição:** Lista assinaturas ativas de usuários  
**Response 200:**
```json
[
  {
    "id": "string",
    "userId": "string",
    "planId": "string",
    "status": "ACTIVE" | "CANCELLED" | "PAST_DUE",
    "createdAt": "2026-05-03T00:00:00.000Z"
  }
]
```

### [Admin - Estatísticas]
#### GET /v1/admin/stats
**Descrição:** Retorna métricas gerais do dashboard  
**Response 200:**
```json
{
  "totalUsers": 0,
  "activeSubscriptions": 0,
  "mrr": 0
}
```

## Notas
- Todos os endpoints requerem autenticação via Bearer Token
- Dados mockados estão proibidos em ambiente de produção
- O endpoint `/v1/admin/revenue` **não existe** - dados de receita são derivados do MRR retornado por `/v1/admin/stats` e `/v1/admin/plans`
- O endpoint `/v1/admin/activity` **não existe** - atividades recentes são derivadas de `/v1/admin/users` e `/v1/admin/subscriptions`
