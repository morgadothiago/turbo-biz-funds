# Integração de Planos - Frontend ↔ Backend

## Problema Atual

O frontend está recebendo erros 400 (Bad Request) ao tentar deletar/atualizar planos:

```
DELETE https://api.doutorcashapp.com.br/v1/admin/plans/pro 400 (Bad Request)
DELETE https://api.doutorcashapp.com.br/v1/admin/plans/free 400 (Bad Request)
DELETE https://api.doutorcashapp.com.br/v1/admin/plans/enterprise 400 (Bad Request)
```

**Causa:** O frontend está enviando identificadores de planos (`pro`, `free`, `enterprise`) em vez dos UUIDs reais do banco de dados.

---

## Endpoints da API (Extraído do Swagger)

### 1. Listar Planos (Admin)
```
GET /v1/admin/plans
Headers: Authorization: Bearer {token_admin}
Response: 200 - Planos retornados com sucesso
```

**Resposta esperada:**
```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",  // ← UUID real do banco
      "name": "Pro",
      "description": "Plano profissional",
      "price": 29.90,
      "billingPeriod": "monthly",
      "popular": true,
      "features": [
        {"name": "Transações ilimitadas", "included": true}
      ],
      "subscribers": 150,
      "mrr": 4485.00
    }
  ],
  "subscriptions": [...]
}
```

### 2. Criar Plano (Admin)
```
POST /v1/admin/plans
Headers: Authorization: Bearer {token_admin}
Content-Type: application/json
```

**Payload (CreateAdminPlanDto):**
```json
{
  "name": "Plano Mensal",
  "description": "Acesso completo por 1 mês",
  "price": 29.90,
  "billingPeriod": "monthly",  // monthly | quarterly | yearly
  "features": [
    {"name": "Transações ilimitadas", "included": true},
    {"name": "Suporte prioritário", "included": true}
  ],
  "popular": false
}
```

**Resposta:** 201 (Created)

### 3. Atualizar Plano (Admin)
```
PATCH /v1/admin/plans/{id}
Headers: Authorization: Bearer {token_admin}
Content-Type: application/json
```

**Importante:** `{id}` deve ser o **UUID real** do banco (ex: `507f1f77bcf86cd799439011`), não o nome do plano.

**Payload (UpdateAdminPlanDto):**
```json
{
  "name": "Plano Mensal Atualizado",
  "price": 39.90,
  "popular": true
}
```

### 4. Deletar Plano (Admin)
```
DELETE /v1/admin/plans/{id}
Headers: Authorization: Bearer {token_admin}
```

**Importante:** `{id}` deve ser o **UUID real** do banco.

**Resposta:** 200 (Plano desativado com sucesso)

---

## O que o Frontend Precisa

### 1. Listar Planos na Landing Page (Público)
```
GET /v1/plans
Headers: Nenhum (público)
```

**Payload de resposta esperado ( PlanInfo):**
```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Mensal",
      "price": "29,90",           // ← String formatada para exibição
      "period": "/mês",
      "description": "Sem compromisso",
      "features": ["Transações ilimitadas", "Suporte prioritário"],
      "popular": true
    }
  ]
}
```

### 2. Flux Correto no Admin

```typescript
// 1. Buscar planos (retorna UUIDs reais)
const plans = await api.get('/v1/admin/plans');

// 2. Usar o ID real para operações
const planId = plans.data[0].id; // Ex: "507f1f77bcf86cd799439011"

// 3. Deletar/Atualizar usando o UUID
await api.delete(`/v1/admin/plans/${planId}`);
await api.patch(`/v1/admin/plans/${planId}`, { price: 39.90 });
```

---

## Possíveis Problemas no Backend

### 1. Erro 500 no POST /v1/admin/plans
**Causa provável:** O backend pode estar esperando campos diferentes do que o frontend envia.

**Verificar:**
- O campo `price` deve aceitar `number` (29.90) ou `string` ("29.90")?
- O campo `billingPeriod` deve seguir qual padrão? 
  - Atual no frontend: `"mês"`, `"semestre"`, `"ano"`
  - Esperado pela API: `"monthly"`, `"quarterly"`, `"yearly"`?

### 2. Erro 400 no DELETE /v1/admin/plans/{id}
**Causa:** IDs inválidos sendo enviados (nomes em vez de UUIDs).

**Solução:** Garantir que o frontend está usando os IDs retornados pelo `GET /v1/admin/plans`.

---

## Checklist para o Backend

- [ ] Verificar se o endpoint `GET /v1/admin/plans` está retornando UUIDs válidos no campo `id`
- [ ] Verificar se o `POST /v1/admin/plans` aceita o formato de `price` enviado (number)
- [ ] Confirmar quais valores são aceitos em `billingPeriod` (monthly/quarterly/yearly ou mês/semestre/ano?)
- [ ] Verificar se o `DELETE /v1/admin/plans/{id}` está tratando corretamente UUIDs
- [ ] Adicionar logs no backend para capturar o que está sendo enviado e gerando o erro 500

---

## Exemplo de Teste com cURL

### Listar Planos (precisa de token admin)
```bash
curl -X GET "https://api.doutorcashapp.com.br/v1/admin/plans" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json"
```

### Criar Plano
```bash
curl -X POST "https://api.doutorcashapp.com.br/v1/admin/plans" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plano Teste",
    "description": "Plano para testes",
    "price": 29.90,
    "billingPeriod": "monthly",
    "features": [
      {"name": "Feature 1", "included": true}
    ],
    "popular": false
  }'
```

### Deletar Plano (usando UUID real)
```bash
curl -X DELETE "https://api.doutorcashapp.com.br/v1/admin/plans/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

---

## Arquivos do Frontend que Interagem com a API

- **Hook de Admin:** `src/features/admin/hooks/use-admin-plans.ts`
- **Hook Público:** `src/features/payments/hooks/use-plan-info.ts`
- **Cliente API:** `src/lib/api/client.ts`
- **Página Admin:** `src/pages/admin/AdminPlans.tsx`
- **Landing Page:** `src/components/landing/Pricing.tsx`

---

**Essa integração está quase pronta!** O problema principal é garantir que o backend está retornando UUIDs válidos e que o frontend está usando esses IDs corretamente.
