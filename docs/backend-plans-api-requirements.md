# Backend API Requirements - Plans Management

## Visão Geral

O frontend possui a interface completa para gerenciamento de planos (criar, editar, desativar), mas precisa que o backend implemente os endpoints de escrita.

---

## Endpoints Necessários

### 1. Listar Planos (Já implementado)

**Método:** `GET`
**Endpoint:** `/v1/admin/plans`

#### Resposta Esperada (200 OK)
```json
{
  "data": [
    {
      "id": "free",
      "name": "Grátis",
      "description": "Para começar",
      "price": 0,
      "billingPeriod": "mês",
      "subscribers": 50,
      "mrr": 0,
      "popular": false,
      "features": [
        { "name": "Até 100 transações/mês", "included": true },
        { "name": "1 usuário", "included": true },
        { "name": "Relatórios básicos", "included": true },
        { "name": "Suporte por email", "included": false }
      ]
    },
    {
      "id": "pro",
      "name": "Pro",
      "description": "Para pequenas empresas",
      "price": 29.90,
      "billingPeriod": "mês",
      "subscribers": 30,
      "mrr": 897,
      "popular": true,
      "features": [
        { "name": "Transações ilimitadas", "included": true },
        { "name": "5 usuários", "included": true },
        { "name": "Relatórios avançados", "included": true },
        { "name": "Suporte prioritário", "included": true }
      ]
    }
  ],
  "subscriptions": [
    {
      "id": "sub_123",
      "client": "João Silva",
      "plan": "Pro",
      "status": "Ativo",
      "startDate": "2026-01-15",
      "nextBilling": "2026-05-15",
      "amount": 29.90
    }
  ]
}
```

---

### 2. Criar Novo Plano

**Método:** `POST`
**Endpoint:** `/v1/admin/plans`

#### Payload (CreatePlanPayload)
```typescript
{
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  features: Array<{ name: string; included: boolean }>;
  popular?: boolean;
}
```

#### Exemplo de Requisição
```json
POST /v1/admin/plans
{
  "name": "Enterprise",
  "description": "Para grandes empresas",
  "price": 99.90,
  "billingPeriod": "mês",
  "popular": false,
  "features": [
    { "name": "Transações ilimitadas", "included": true },
    { "name": "Usuários ilimitados", "included": true },
    { "name": "Relatórios personalizados", "included": true },
    { "name": "Suporte 24/7", "included": true },
    { "name": "API dedicada", "included": true }
  ]
}
```

#### Resposta Esperada (201 Created)
```json
{
  "data": {
    "id": "enterprise",
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

---

### 3. Atualizar Plano

**Método:** `PATCH`
**Endpoint:** `/v1/admin/plans/:id`

#### Payload
Mesmo formato do criar, mas enviado via PATCH (apenas campos a atualizar).

#### Exemplo de Requisição
```json
PATCH /v1/admin/plans/pro
{
  "price": 39.90,
  "description": "Novo plano Pro atualizado"
}
```

#### Resposta Esperada (200 OK)
```json
{
  "data": {
    "id": "pro",
    "name": "Pro",
    "description": "Novo plano Pro atualizado",
    "price": 39.90,
    "billingPeriod": "mês",
    "subscribers": 30,
    "mrr": 1197,
    "popular": true,
    "features": [...]
  }
}
```

---

### 4. Desativar/Deletar Plano

**Método:** `DELETE`
**Endpoint:** `/v1/admin/plans/:id`

Se o plano tiver assinantes ativos, deve retornar erro 400 ou 422.

#### Resposta Esperada (200 OK)
```json
{
  "data": {
    "deleted": true
  }
}
```

---

## Códigos de Erro Esperados

| Código | Situação |
|--------|----------|
| 200 | Sucesso (atualizar/deletar) |
| 201 | Sucesso (criar) |
| 400 | Dados inválidos (ex: plano com assinantes ativos) |
| 401 | Não autenticado |
| 403 | Não autorizado (não é admin) |
| 404 | Plano não encontrado |
| 422 | Erro de validação do payload |

---

## Estrutura da Entidade AdminPlan (Frontend)

```typescript
interface AdminPlanFeature {
  name: string;
  included: boolean;
}

interface AdminPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  subscribers: number;
  mrr: number;
  popular?: boolean;
  features: AdminPlanFeature[];
}
```

---

## Estrutura da Entidade AdminPlanSubscription (Frontend)

```typescript
interface AdminPlanSubscription {
  id: string;
  client: string;
  plan: string;
  status: string;
  startDate: string;
  nextBilling: string;
  amount: number;
}
```

---

## Arquivos Relacionados no Frontend

- Hook de planos: `src/features/admin/hooks/use-admin-plans.ts`
- Página de planos: `src/pages/admin/AdminPlans.tsx`
- Hook de assinaturas: `src/features/admin/hooks/use-admin-subscriptions.ts`
- Configuração da API: `src/lib/api/client.ts` (endpoint: `apiEndpoints.admin.plans`)

---

## Observações

1. O frontend já possui a UI completa com:
   - Cards de planos exibindo preço, descrição, features, assinantes, MRR
   - Dialog para criar novo plano
   - Dialog para editar plano existente
   - Dropdown menu com opções "Editar plano" e "Desativar"

2. As mutations já estão implementadas no hook `use-admin-plans.ts`:
   - `useCreatePlan()` - Para criar novo plano
   - `useUpdatePlan()` - Para atualizar plano existente
   - `useDeletePlan()` - Para desativar plano

3. O backend precisa apenas implementar os endpoints para que as ações funcionem.
