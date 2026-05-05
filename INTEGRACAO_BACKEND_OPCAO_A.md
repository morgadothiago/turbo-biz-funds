# Integração de Planos - Backend (Opção A: IDs como Nomes)

## Objetivo

Alinhar o backend com o documento de requisitos original, **usando nomes dos planos como IDs** (ex: `free`, `pro`, `enterprise`), conforme especificado em `backend-plans-api-requirements (2).md`.

---

## 🔴 Problemas Atuais

### 1. Erro 400 no DELETE
```
DELETE https://api.doutorcashapp.com.br/v1/admin/plans/pro 400 (Bad Request)
DELETE https://api.doutorcashapp.com.br/v1/admin/plans/free 400 (Bad Request)
```

**Causa:** Backend está esperando UUIDs, mas deve aceitar **nomes** (`pro`, `free`, `enterprise`).

### 2. Erro 500 no POST
```
POST https://api.doutorcashapp.com.br/v1/admin/plans 500 (Internal Server Error)
```

**Causa:** Backend quebra ao criar plano. Provavelmente formato de `price` ou `billingPeriod`.

### 3. Erro 400 no PATCH
```
PATCH https://api.doutorcashapp.com.br/v1/admin/plans/pro 400 (Bad Request)
```

**Causa:** Mesmo problema do DELETE - backend quer UUID, deve aceitar nome.

---

## ✅ O que o Backend Deve Implementar

### 1. IDs dos Planos = Nomes (NÃO UUIDs)

**Documento de Requisitos (Seção 1 - GET /v1/admin/plans):**
```json
{
  "data": [
    {
      "id": "free",           ← USA O NOME, NÃO UUID!
      "name": "Grátis",
      "description": "Para começar",
      "price": 0,
      "billingPeriod": "mês",
      "subscribers": 50,
      "mrr": 0,
      "popular": false,
      "features": [...]
    },
    {
      "id": "pro",            ← USA O NOME, NÃO UUID!
      "name": "Pro",
      "description": "Para pequenas empresas",
      "price": 29.90,
      "billingPeriod": "mês",
      ...
    }
  ]
}
```

### 2. POST /v1/admin/plans (Corrigir Erro 500)

**Endpoint:** `POST https://api.doutorcashapp.com.br/v1/admin/plans`

**Payload Esperado (CreatePlanPayload):**
```json
{
  "name": "Enterprise",
  "description": "Para grandes empresas",
  "price": 99.90,              ← NUMBER (não string)
  "billingPeriod": "mês",      ← Aceitar com acento: "mês", "semestre", "ano"
  "popular": false,
  "features": [
    {"name": "Transações ilimitadas", "included": true},
    {"name": "Usuários ilimitados", "included": true}
  ]
}
```

**Resposta Esperada (201 Created):**
```json
{
  "data": {
    "id": "enterprise",      ← USA O NOME COMO ID!
    "name": "Enterprise",
    "description": "Para grandes empresas",
    "price": 99.90,
    "billingPeriod": "mês",
    "subscribers": 0,
    "mrr": 0,
    "popular": false,
    "features": [...]
  }
}
```

**Possíveis Causas do Erro 500:**
- Backend espera `price` como string ("99.90") mas frontend envia number (99.90)
- Backend não está tratando campo `features` corretamente
- Validador está falhando silenciosamente

**Solução Sugerida:**
```typescript
// Backend deve aceitar price como number ou string
const price = typeof body.price === 'string' ? parseFloat(body.price) : body.price;

// Features deve ser array de objetos { name: string, included: boolean }
if (body.features && !Array.isArray(body.features)) {
  throw new BadRequestException('Features deve ser um array');
}
```

### 3. PATCH /v1/admin/plans/:id (Aceitar Nome)

**Endpoint:** `PATCH https://api.doutorcashapp.com.br/v1/admin/plans/pro`

**Nota:** `:id` deve ser o **nome do plano** (`pro`, `free`, `enterprise`), não UUID!

**Payload (UpdatePlanPayload):**
```json
{
  "price": 39.90,
  "description": "Novo plano Pro atualizado",
  "popular": true
}
```

**Resposta Esperada (200 OK):**
```json
{
  "data": {
    "id": "pro",
    "name": "Pro",
    "price": 39.90,
    ...
  }
}
```

### 4. DELETE /v1/admin/plans/:id (Aceitar Nome)

**Endpoint:** `DELETE https://api.doutorcashapp.com.br/v1/admin/plans/pro`

**Nota:** `:id` deve ser o **nome do plano** (`pro`, `free`, `enterprise`), não UUID!

**Regra de Negócio:**
- Se plano tiver assinantes ativos → retornar erro 400 com mensagem clara
- Se plano não tiver assinantes → desativar (soft delete) e retornar 200

**Resposta Esperada (200 OK):**
```json
{
  "data": {
    "deleted": true
  }
}
```

**Erro Esperado se Tiver Assinantes (400 Bad Request):**
```json
{
  "message": "Não é possível deletar plano com assinantes ativos",
  "code": "PLAN_HAS_SUBSCRIBERS"
}
```

---

## 📋 Checklist para o Backend

### Endpoints Públicos (Landing Page)
- [ ] `GET /v1/plans` - Deve retornar planos com `id` = nome (`free`, `pro`, `enterprise`)
- [ ] Certificar que `price` vem formatado como string para exibição (`"29,90"`) ou number (`29.90`)

### Endpoints Admin
- [ ] `GET /v1/admin/plans` - Retornar planos com `id` = nome (NÃO UUID!)
- [ ] `POST /v1/admin/plans` - Corrigir erro 500 (aceitar `price` como number)
- [ ] `PATCH /v1/admin/plans/:id` - Aceitar `:id` como nome (`/pro`, `/free`)
- [ ] `DELETE /v1/admin/plans/:id` - Aceitar `:id` como nome (`/pro`, `/free`)

### Validações Importantes
- [ ] `billingPeriod` deve aceitar: `"mês"`, `"semestre"`, `"ano"` (com acentos)
- [ ] `price` deve aceitar number (29.90) ou string ("29.90")
- [ ] `features` deve ser array de `{ name: string, included: boolean }`
- [ ] Não permitir DELETE de plano com assinantes ativos (retornar 400)

---

## 🧪 Exemplos de Teste com cURL

### 1. Listar Planos (Admin)
```bash
curl -X GET "https://api.doutorcashapp.com.br/v1/admin/plans" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json"
```

**Resultado esperado:**
```json
{
  "data": [
    {"id": "free", "name": "Grátis", ...},
    {"id": "pro", "name": "Pro", ...}
  ]
}
```

### 2. Criar Plano (Corrigir 500)
```bash
curl -X POST "https://api.doutorcashapp.com.br/v1/admin/plans" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enterprise",
    "description": "Para grandes empresas",
    "price": 99.90,
    "billingPeriod": "mês",
    "popular": false,
    "features": [
      {"name": "Recursos ilimitados", "included": true}
    ]
  }'
```

**Resultado esperado:** 201 Created com `"id": "enterprise"`

### 3. Atualizar Plano (Usando Nome)
```bash
curl -X PATCH "https://api.doutorcashapp.com.br/v1/admin/plans/pro" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"price": 39.90, "popular": true}'
```

**Resultado esperado:** 200 OK

### 4. Deletar Plano (Usando Nome)
```bash
curl -X DELETE "https://api.doutorcashapp.com.br/v1/admin/plans/pro" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

**Resultado esperado:** 200 OK com `{"data": {"deleted": true}}`

---

## 🔄 Mudanças no Frontend (Já Implementadas)

### 1. use-admin-plans.ts (Hook Admin)
```typescript
// ✅ Já está correto - usa apiEndpoints.admin.plans
export function useDeletePlan() {
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`${apiEndpoints.admin.plans}/${id}`),  // /v1/admin/plans/pro
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
    },
  });
}
```

### 2. AdminPlans.tsx (Página Admin)
```typescript
// ✅ Já está enviando o nome do plano como ID
const handleDeletePlan = (planId: string) => {
  deletePlan.mutate(planId);  // planId = "pro", "free", etc.
};
```

### 3. Pricing.tsx (Landing Page - Público)
```typescript
// ✅ Já está usando usePlansList() para buscar planos públicos
const { plans, isLoading, isError } = usePlansList();
```

---

## 📞 Resumo para o Backend

**O frontend JÁ ESTÁ PRONTO** seguindo a Opção A (IDs como nomes).

**O backend precisa:**
1. ✅ Usar **nomes** como IDs (`free`, `pro`, `enterprise`) em vez de UUIDs
2. ✅ Corrigir erro **500 no POST** (provavelmente parse de `price` ou `features`)
3. ✅ Aceitar **nomes** no PATCH e DELETE (`/pro`, `/free`, não UUIDs)
4. ✅ Retornar IDs como **nomes** no GET `/v1/admin/plans`

**Assim que o backend corrigir:**
- ✅ Deletar planos funcionará (`DELETE /v1/admin/plans/pro`)
- ✅ Criar planos funcionará (sem erro 500)
- ✅ Atualizar planos funcionará (`PATCH /v1/admin/plans/pro`)
- ✅ Landing page exibirá os planos cadastrados dinamicamente

---

## 📎 Arquivos Relacionados

**Frontend:**
- Hook Admin: `src/features/admin/hooks/use-admin-plans.ts`
- Página Admin: `src/pages/admin/AdminPlans.tsx`
- Hook Público: `src/features/payments/hooks/use-plan-info.ts`
- Landing Page: `src/components/landing/Pricing.tsx`
- Cliente API: `src/lib/api/client.ts`

**Documentação:**
- Requisitos Original: `/Users/thiagomorgado/Downloads/backend-plans-api-requirements (2).md`
- Integração Anterior: `INTEGRACAO_PLANOS_BACKEND.md` (Opção B - UUIDs)

---

**🚀 Ação Imediata:** O backend deve seguir o documento `backend-plans-api-requirements (2).md` e usar **nomes como IDs**!
