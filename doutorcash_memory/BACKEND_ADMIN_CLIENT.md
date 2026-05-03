# Análise: Backend necessário para Admin e Dashboard do Cliente

> Análise detalhada dos endpoints, contratos de dados e problemas críticos identificados
> nas páginas `/admin/*` e `/dashboard` (cliente).

---

## 1. Dashboard do Cliente (`/dashboard`)

O hook `useDashboardData` faz **5 chamadas em paralelo** via `Promise.all`. Quatro delas não têm `.catch()` — qualquer falha derruba o dashboard inteiro com tela de erro.

### 1.1 `GET /v1/summary/balance?period=30d`

**Response esperada:**
```json
{
  "data": {
    "income": 5000.00,
    "expense": 3200.00,
    "balance": 1800.00
  }
}
```

**Usado para:** cards de "Saldo do Mês", "Receitas" e "Despesas".

**Comportamento com falha:** Derruba o dashboard inteiro (sem `.catch()`).

---

### 1.2 `GET /v1/transactions?period=30d`

**Response esperada:**
```json
{
  "data": [
    {
      "id": "uuid",
      "categoryId": "uuid",
      "type": "INCOME",
      "amount": 1500.00,
      "description": "Salário",
      "occurredAt": "2026-04-01T10:00:00Z"
    }
  ]
}
```

**Campos obrigatórios:** `id`, `categoryId`, `type` (`"INCOME"` ou `"EXPENSE"` — maiúsculas), `amount`, `occurredAt`.  
`description` pode ser `null`.

**Usado para:** gráfico de despesas por dia, lista de transações recentes (5 primeiras).

**Comportamento com falha:** Derruba o dashboard inteiro.

---

### 1.3 `GET /v1/categories`

**Response esperada:**
```json
{
  "data": [
    { "id": "uuid", "name": "Alimentação" }
  ]
}
```

**Usado para:** resolver nomes de categorias nos gráficos e na lista de transações. O card "Categorias" mostra `categories.length`.

**Comportamento com falha:** Derruba o dashboard inteiro.

---

### 1.4 `GET /v1/summary/categories?period=30d`

**Response esperada:**
```json
{
  "data": [
    {
      "categoryId": "uuid",
      "income": 0.00,
      "expense": 850.00
    }
  ]
}
```

**Usado para:** gráfico de pizza por categoria (filtra apenas itens com `expense > 0`).

**Comportamento com falha:** Derruba o dashboard inteiro.

> **Nota:** Este endpoint agrega os gastos por categoria no período. O frontend faz um join com `GET /v1/categories` para exibir os nomes.

---

### 1.5 `GET /v1/goals`

**Response esperada:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Viagem Europa",
      "current": 3000.00,
      "target": 10000.00,
      "deadline": "2026-12-31",
      "color": "#10b981",
      "icon": "✈️",
      "category": "Viagem"
    }
  ]
}
```

**Campos opcionais:** `color`, `icon`, `category` (o frontend aplica defaults se ausentes).

**Usado para:** componente GoalsProgress — exibe as 4 primeiras metas.

**Comportamento com falha:** Tem `.catch(() => [])` — falha silenciosamente, exibe lista vazia.

---

## 2. Painel Admin — Dashboard (`/admin`)

O hook `useAdminDashboard` também faz **5 chamadas em paralelo**. Quatro sem `.catch()`.

### 2.1 `GET /v1/admin/stats`

**Response esperada:**
```json
{
  "data": {
    "mrr": 15800,
    "mrrChange": "+12%",
    "mrrTrend": "up",
    "totalClients": 342,
    "clientsChange": "+8%",
    "activeClients": 298,
    "activeChange": "+5%",
    "conversionRate": "4.2%",
    "conversionChange": "-0.3%",
    "conversionTrend": "down"
  }
}
```

**Campos de trend:** apenas `"up"` ou `"down"` (string literal).  
**Campos de change:** string formatada, ex: `"+12%"`, `"-0.3%"` — o frontend exibe diretamente.

**Comportamento com falha:** Derruba o dashboard admin inteiro.

---

### 2.2 `GET /v1/admin/revenue`

**Response esperada:**
```json
{
  "data": [
    { "month": "Nov", "receita": 12000, "clientes": 280 },
    { "month": "Dez", "receita": 13500, "clientes": 298 },
    { "month": "Jan", "receita": 14200, "clientes": 310 }
  ]
}
```

> **CRÍTICO:** Os nomes dos campos são em português — `receita` e `clientes`. O Recharts usa `dataKey="receita"` diretamente. Se o backend retornar `revenue`/`revenue_amount` ou qualquer outro nome, o gráfico ficará em branco **sem lançar erro**.

**Usado para:** gráfico de linha "Evolução da Receita" (últimos 6 meses).

**Comportamento com falha:** Derruba o dashboard admin inteiro.

---

### 2.3 `GET /v1/admin/clients?limit=5`

**Response esperada:**
```json
{
  "data": [
    {
      "name": "João Silva",
      "email": "joao@email.com",
      "plan": "Pro",
      "status": "Ativo",
      "date": "24/04/2026"
    }
  ]
}
```

**Valores esperados de `plan`:** `"Free"`, `"Pro"`, `"Business"` (com inicial maiúscula).  
**Valores esperados de `status`:** `"Ativo"`, `"Pendente"`, `"Bloqueado"`.  
**`date`:** string já formatada (ex: `"24/04/2026"`).

O parâmetro `?limit=5` deve ser respeitado — o frontend espera no máximo 5 clientes recentes.

**Comportamento com falha:** Derruba o dashboard admin inteiro.

---

### 2.4 `GET /v1/admin/activity?limit=5`

**Response esperada:**
```json
{
  "data": [
    {
      "type": "signup",
      "message": "Novo cadastro: Maria Souza",
      "time": "5 minutos"
    }
  ]
}
```

**Valores válidos de `type`:** `"signup"`, `"payment"`, `"upgrade"`, `"support"` — cada um renderiza um ícone diferente.  
**`time`:** string já formatada, usada como `"Há {time}"`.

**Comportamento com falha:** Derruba o dashboard admin inteiro.

---

### 2.5 `GET /v1/admin/plans` (usado pelo dashboard)

Neste contexto, o dashboard só usa `.data[].{ id, name, subscribers }` para montar o gráfico de barras de distribuição de planos. Planos com `subscribers === 0` são filtrados.

**Comportamento com falha:** Tem `.catch(() => [])` — falha silenciosamente, oculta o gráfico.

---

## 3. Admin — Usuários (`/admin/usuarios`)

### 3.1 `GET /v1/admin/users`

**Response esperada:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "11999999999",
      "plan": "pro",
      "status": "Ativo",
      "role": "user",
      "lastLogin": "23/04/2026",
      "createdAt": "01/01/2026",
      "totalTransactions": 47,
      "planExpiresAt": "30/04/2026"
    }
  ],
  "stats": {
    "total": 342,
    "active": 298,
    "pending": 30,
    "blocked": 14
  }
}
```

**Atenção — valores de `plan`:** o frontend mapeia tanto minúsculas (`free`, `pro`, `business`) quanto maiúsculas (`Free`, `Pro`, `Business`). Qualquer outro valor cai no fallback "Free".

**Atenção — valores de `status`:** o frontend mapeia `"Ativo"`, `"Pendente"`, `"Bloqueado"` (português) E também `"active"`, `"suspended"` (inglês). Recomenda-se padronizar no backend e garantir consistência com o que é enviado no PATCH.

**`phone`, `totalTransactions`, `planExpiresAt`:** campos opcionais, exibidos no painel de detalhes.

**Sem paginação server-side:** o frontend busca todos os usuários de uma vez e faz paginação client-side (10 por página). Para volumes maiores isso precisará ser revisto.

---

### 3.2 `PATCH /v1/admin/users/:id`

**Request body (campos opcionais, envia apenas o que muda):**
```json
{
  "plan": "pro",
  "status": "Bloqueado",
  "role": "admin"
}
```

**Response esperada:**
```json
{
  "data": {
    "id": "uuid",
    "name": "João Silva",
    ...
  }
}
```

**Usado para:** alterar plano, bloquear/desbloquear, promover/remover admin.

> **Atenção:** O frontend envia `status` como `"Ativo"` ou `"Bloqueado"` (strings em português). Se o backend normaliza para `"active"`/`"suspended"`, precisa garantir que a listagem também retorne esses valores, ou haverá inconsistência no display após o PATCH.

---

### 3.3 `DELETE /v1/admin/users/:id`

**Response esperada:**
```json
{
  "data": { "removed": true }
}
```

**Comportamento esperado:** remoção permanente do usuário e todos os seus dados.

---

## 4. Admin — Planos (`/admin/planos`)

### 4.1 `GET /v1/admin/plans`

**Response esperada (shape completo — usado por `useAdminPlans`):**
```json
{
  "data": [
    {
      "id": "pro",
      "name": "Pro",
      "description": "Para quem quer mais",
      "price": 97,
      "billingPeriod": "mês",
      "subscribers": 180,
      "mrr": 17460,
      "popular": true,
      "features": [
        { "name": "Transações ilimitadas", "included": true },
        { "name": "Suporte prioritário", "included": false }
      ]
    }
  ],
  "subscriptions": [
    {
      "id": "uuid",
      "client": "João Silva",
      "plan": "Pro",
      "status": "Ativo",
      "startDate": "01/01/2026",
      "nextBilling": "01/05/2026",
      "amount": 97
    }
  ]
}
```

> **Atenção:** Este mesmo endpoint é usado pelo `useAdminDashboard` (que só precisa de `{ id, name, subscribers }`). O shape completo é compatível — o dashboard simplesmente ignora os campos extras.

---

### 4.2 Criar/Editar Plano — **NÃO IMPLEMENTADO NO FRONTEND**

Os botões "Criar Plano" e "Salvar Alterações" nos dialogs de `AdminPlans.tsx` **não chamam nenhuma API**. São apenas UI shells. Quando o backend estiver pronto, será necessário conectar:

- `POST /v1/admin/plans` — criar plano
- `PUT /v1/admin/plans/:id` — editar plano
- `DELETE /v1/admin/plans/:id` — desativar plano

---

## 5. Admin — Assinaturas (`/admin/assinaturas`)

### 5.1 `GET /v1/admin/subscriptions`

**Response esperada:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user": {
        "name": "João Silva",
        "email": "joao@email.com",
        "avatar": "JO"
      },
      "plan": "Pro",
      "amount": 97.00,
      "interval": "monthly",
      "status": "ativa",
      "startDate": "01/01/2026",
      "nextBilling": "01/05/2026",
      "paymentMethod": "Cartão de crédito",
      "autoRenew": true
    }
  ],
  "stats": {
    "totalRevenue": 15800.00,
    "active": 180,
    "trial": 42,
    "overdue": 12
  }
}
```

**Atenção — `user.avatar`:** o frontend renderiza este campo diretamente como conteúdo do `AvatarFallback` (iniciais). Deve ser uma string de 2 letras, ex: `"JO"`.

**Valores válidos de `status`:** `"ativa"`, `"cancelada"`, `"trial"`, `"inativa"`, `"atrasada"` (minúsculas em português).

---

### 5.2 Ações de assinatura — **NÃO IMPLEMENTADAS NO FRONTEND**

Os itens de dropdown (Pausar, Reativar, Cancelar, Renovar manualmente) **não têm `onClick` conectado a nenhuma API**. Quando o backend estiver pronto, será necessário implementar:

- `PATCH /v1/admin/subscriptions/:id` — pausar / reativar
- `DELETE /v1/admin/subscriptions/:id` — cancelar
- `POST /v1/admin/subscriptions/:id/renew` — renovar manualmente

---

## 6. Admin — Empresas (`/admin/empresas`)

### 6.1 `GET /v1/admin/companies`

**Response esperada:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Empresa XYZ",
      "cnpj": "00.000.000/0001-00",
      "email": "contato@empresa.com",
      "plan": "Business",
      "status": "Ativo",
      "users": 12,
      "mrr": 297.00,
      "usage": 78,
      "createdAt": "01/01/2026",
      "owner": "Maria Souza"
    }
  ],
  "stats": {
    "total": 25,
    "active": 22,
    "defaulting": 3
  }
}
```

**`usage`:** número de 0 a 100 (percentual de uso da conta).

---

## 7. Problemas Críticos — Resumo

| # | Problema | Impacto | Onde |
|---|----------|---------|------|
| 1 | **4/5 endpoints do dashboard do cliente sem `.catch()`** | Tela de erro se qualquer endpoint falhar | `use-dashboard-data.ts` |
| 2 | **4/5 endpoints do dashboard admin sem `.catch()`** | Tela de erro se qualquer endpoint falhar | `use-admin-dashboard.ts` |
| 3 | **`receita` e `clientes` em português no contrato de revenue** | Gráfico em branco se o backend usar nomes diferentes | `AdminDashboard.tsx` linha 140 |
| 4 | **Status enviado em português no PATCH de usuário** | Inconsistência se o backend normaliza para inglês | `use-admin-users.ts` + `AdminUsers.tsx` |
| 5 | **`GET /v1/admin/users` sem paginação server-side** | Performance ruim com muitos usuários | `use-admin-users.ts` |
| 6 | **Criar/Editar Plano — UI pronta, API não conectada** | Funcionalidade silenciosa — parece funcionar mas não persiste | `AdminPlans.tsx` |
| 7 | **Ações de Assinatura — UI pronta, API não conectada** | Pausar/Cancelar/Renovar não fazem nada | `AdminSubscriptions.tsx` |
| 8 | **`user.avatar` em subscriptions deve ser string de 2 letras** | Exibição errada no AvatarFallback | `AdminSubscriptions.tsx` linha 229 |

---

## 8. Checklist de Endpoints por Prioridade

### Alta prioridade (bloqueadores do dashboard)
- [ ] `GET /v1/summary/balance?period=30d`
- [ ] `GET /v1/transactions?period=30d`
- [ ] `GET /v1/categories`
- [ ] `GET /v1/summary/categories?period=30d`
- [ ] `GET /v1/admin/stats`
- [ ] `GET /v1/admin/revenue` ← retornar campos `receita` e `clientes`
- [ ] `GET /v1/admin/clients?limit=5`
- [ ] `GET /v1/admin/activity?limit=5`

### Média prioridade (páginas admin funcionais)
- [ ] `GET /v1/admin/users`
- [ ] `PATCH /v1/admin/users/:id`
- [ ] `DELETE /v1/admin/users/:id`
- [ ] `GET /v1/admin/plans` (shape completo com `subscriptions[]`)
- [ ] `GET /v1/admin/subscriptions`
- [ ] `GET /v1/admin/companies`

### Baixa prioridade (UI pronta, ações não conectadas)
- [ ] `POST /v1/admin/plans`
- [ ] `PUT /v1/admin/plans/:id`
- [ ] `DELETE /v1/admin/plans/:id`
- [ ] `PATCH /v1/admin/subscriptions/:id` (pausar/reativar)
- [ ] `DELETE /v1/admin/subscriptions/:id` (cancelar)
- [ ] `POST /v1/admin/subscriptions/:id/renew`

---

## 9. Nota sobre Goals (Metas)

O `GET /v1/goals` é a única chamada do dashboard do cliente com fallback. No entanto, a página de Metas (`/metas`) também usa endpoints de CRUD:

- `POST /v1/goals` — criar meta
- `PATCH /v1/goals/:id` — atualizar progresso/dados
- `DELETE /v1/goals/:id` — remover meta

Estes não estão contemplados neste documento (focado em Admin + Dashboard), mas estão no `BACKEND_REQUIREMENTS.md` completo.
