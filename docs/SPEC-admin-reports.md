# Especificação Técnica - Tela de Relatórios Admin

## Visão Geral

A tela de Relatórios Admin é uma página de análise completa da plataforma DoutorCash, permitindo que administradores visualizem métricas de negócio, evolução de receita, crescimento de usuários, distribuição de planos e análise de churn.

---

## Estrutura da Página

### Header
- Título: "Relatórios Admin"
- Seletor de período: Semanal / Mensal / Trimestral / Anual
- Botão de exportar (PDF/Excel)

### Cards de Métricas
1. **Receita Mensal** - Total de assinaturas (R$)
2. **Novos Cadastros** - Usuários registrados
3. **Taxa de Conversão** - Trial → Assinatura (%)

### Abas de Relatórios

| Aba | Título | Descrição |
|-----|--------|-----------|
| `revenue` | Receita | Evolução da receita bruta (MRR) |
| `users` | Usuários | Novos cadastros e ativações |
| `plans` | Planos | Assinaturas por plano |
| `churn` | Churn | Usuários que cancelaram |

### Rodapé
- Botões para download de relatórios rápidos (PDF/Excel)

---

## Endpoints Necessários

### 1. Estatísticas Gerais

**Método:** `GET`
**Endpoint:** `/v1/admin/stats`

**Query Params:**
```typescript
{
  period: "weekly" | "monthly" | "quarterly" | "yearly",
  startDate?: string,    // ISO date
  endDate?: string,      // ISO date
}
```

**Response:**
```json
{
  "totalRevenue": 12450.00,
  "newUsers": 1234,
  "conversionRate": 23.4,
  "revenueGrowth": 12,
  "usersGrowth": 8,
  "conversionGrowth": 2.1
}
```

---

### 2. Dados de Receita (MRR)

**Método:** `GET`
**Endpoint:** `/v1/admin/revenue`

**Query Params:**
```typescript
{
  period: "monthly" | "quarterly" | "yearly",
  year: number,          // ex: 2026
  startDate?: string,     // ISO date (opcional)
  endDate?: string,      // ISO date (opcional)
}
```

**Response:**
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
    },
    {
      "month": "2026-02",
      "revenue": 12450.00,
      "expenses": 2500.00,
      "netRevenue": 9950.00,
      "mrr": 12450.00,
      "newSubscriptions": 60,
      "cancellations": 8,
      "churnRate": 1.8
    }
  ],
  "summary": {
    "totalRevenue": 22450.00,
    "totalExpenses": 4500.00,
    "totalNetRevenue": 17950.00,
    "averageMrr": 11225.00,
    "totalNewSubscriptions": 110,
    "totalCancellations": 18,
    "averageChurnRate": 2.15
  }
}
```

---

### 3. Fluxo de Caixa

**Método:** `GET`
**Endpoint:** `/v1/admin/cashflow`

**Query Params:**
```typescript
{
  year: number,           // ex: 2026
  month?: number,         // 1-12 (opcional)
  startDate?: string,    // ISO date (opcional)
  endDate?: string,      // ISO date (opcional)
}
```

**Response:**
```json
{
  "entries": [
    {
      "id": "uuid",
      "date": "2026-01-15",
      "type": "revenue" | "expense",
      "category": "assinatura | upgrade | refund | infraestrutura | marketing | operacional",
      "description": "Descrição da transação",
      "amount": 99.90,
      "balance": 5000.00,
      "subscriptionId": "uuid ou null",
      "userId": "uuid ou null"
    }
  ],
  "summary": {
    "openingBalance": 0,
    "totalRevenue": 15000.00,
    "totalExpenses": 5000.00,
    "closingBalance": 10000.00
  }
}
```

---

### 4. Gráfico de Receita

**Método:** `GET`
**Endpoint:** `/v1/admin/revenue/chart`

**Query Params:**
```typescript
{
  period: "monthly" | "quarterly" | "yearly",
  year: number,
  months?: number,  // quantidade de meses (padrão 12)
}
```

**Response:**
```json
{
  "labels": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  "datasets": {
    "revenue": [8000, 9000, 10000, 11000, 12000, 12450],
    "expenses": [1500, 1800, 2000, 2200, 2400, 2500],
    "netRevenue": [6500, 7200, 8000, 8800, 9600, 9950]
  }
}
```

---

### 5. Crescimento de Usuários

**Método:** `GET`
**Endpoint:** `/v1/admin/users/growth`

**Query Params:**
```typescript
{
  period: "monthly" | "quarterly" | "yearly",
  year: number,
  months?: number  // quantidade de meses
}
```

**Response:**
```json
{
  "data": [
    {
      "period": "2026-01",
      "totalUsers": 100,
      "newUsers": 20,
      "activeUsers": 80,
      "inactiveUsers": 10,
      "blockedUsers": 5
    },
    {
      "period": "2026-02",
      "totalUsers": 130,
      "newUsers": 30,
      "activeUsers": 100,
      "inactiveUsers": 15,
      "blockedUsers": 8
    }
  ],
  "summary": {
    "totalUsers": 130,
    "totalNewUsers": 50,
    "totalActiveUsers": 100,
    "totalInactiveUsers": 15,
    "totalBlockedUsers": 8,
    "growthRate": 30
  }
}
```

---

### 6. Distribuição de Planos

**Método:** `GET`
**Endpoint:** `/v1/admin/plans/distribution`

**Query Params:**
```typescript
{
  period: "monthly" | "quarterly" | "yearly",
}
```

**Response:**
```json
{
  "plans": [
    {
      "planId": "free",
      "planName": "Gratuito",
      "subscribers": 500,
      "revenue": 0,
      "percentage": 65
    },
    {
      "planId": "pro",
      "planName": "Pro",
      "subscribers": 200,
      "revenue": 5980.00,
      "percentage": 26
    },
    {
      "planId": "business",
      "planName": "Business",
      "subscribers": 70,
      "revenue": 6470.00,
      "percentage": 9
    }
  ],
  "summary": {
    "totalSubscribers": 770,
    "totalRevenue": 12450.00,
    "averageRevenuePerUser": 16.17
  }
}
```

---

### 7. Análise de Churn

**Método:** `GET`
**Endpoint:** `/v1/admin/churn`

**Query Params:**
```typescript
{
  period: "monthly" | "quarterly" | "yearly",
  year: number,
  months?: number
}
```

**Response:**
```json
{
  "churnByPeriod": [
    {
      "period": "2026-01",
      "cancelledCount": 10,
      "cancelledRevenue": 299.00,
      "churnRate": 2.5,
      "reason": "cancelado pelo usuário"
    },
    {
      "period": "2026-02",
      "cancelledCount": 8,
      "cancelledRevenue": 249.00,
      "churnRate": 1.8,
      "reason": "falta de uso"
    }
  ],
  "topReasons": [
    { "reason": "cancelado pelo usuário", "count": 15 },
    { "reason": "falta de uso", "count": 8 },
    { "reason": "problemas financeiros", "count": 5 }
  ],
  "summary": {
    "totalChurned": 18,
    "totalChurnedRevenue": 548.00,
    "averageChurnRate": 2.15,
    "churnTrend": "decreasing"  // decreasing | increasing | stable
  }
}
```

---

### 8. Exportação de Relatórios

**Método:** `GET`
**Endpoint:** `/v1/admin/reports/export`

**Query Params:**
```typescript
{
  type: "revenue" | "users" | "subscriptions" | "cashflow",
  format: "pdf" | "excel",
  period: "monthly" | "quarterly" | "yearly",
  startDate?: string,
  endDate?: string,
}
```

**Response:**
- Retorna um arquivo (PDF ou Excel) para download

---

## Campos do Frontend

### Interface de Dados de Receita
```typescript
interface RevenueData {
  month: string;        // "2026-01"
  revenue: number;
  expenses: number;
  netRevenue: number;
  mrr: number;
  newSubscriptions: number;
  cancellations: number;
  churnRate: number;
}
```

### Interface de Crescimento de Usuários
```typescript
interface UserGrowthData {
  period: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  blockedUsers: number;
}
```

### Interface de Distribuição de Planos
```typescript
interface PlanDistribution {
  planId: string;
  planName: string;
  subscribers: number;
  revenue: number;
  percentage: number;
}
```

### Interface de Churn
```typescript
interface ChurnData {
  period: string;
  cancelledCount: number;
  cancelledRevenue: number;
  churnRate: number;
  reason: string;
}
```

---

## Funcionalidades Esperadas

### 1. Filtros de Período
- Semanal (última semana)
- Mensal (últimos 12 meses)
- Trimestral (últimos 4 trimestres)
- Anual (últimos 5 anos)
- Personalizado (data início + data fim)

### 2. Gráficos
- Linha de receita mensal (MRR)
- Barra de novos usuários por período
- Pizza de distribuição de planos
- Linha de churn rate
- Fluxo de caixa (entrada/saída)

### 3. Exportação
- Relatório de Receita (PDF)
- Relatório de Usuários (Excel)
- Relatório de Assinaturas (PDF)
- Relatório de Fluxo de Caixa (PDF/Excel)

### 4. Métricas em Tempo Real
- Receita mensal atual
- Total de novos cadastros
- Taxa de conversão (trial → pago)
- Variação percentual vs período anterior

---

## Códigos de Erro Esperados

| Código | Situação |
|--------|----------|
| 200 | Sucesso |
| 401 | Não autenticado |
| 403 | Não autorizado (não é admin) |
| 404 | Dados não encontrados |
| 422 | Parâmetros inválidos |
| 500 | Erro interno do servidor |

---

## Observações

1. **MRR (Monthly Recurring Revenue)**: Receita recorrente mensal - soma de todas as assinaturas ativas
2. **Churn Rate**: Percentual de clientes que cancelaram no período
3. **Fluxo de Caixa**: Entradas (assinaturas, upgrades) e saídas (estornos, refunds, custos operacionais)
4. **Conversão**: Percentual de usuários trial que tornaram-se pagantes
5. O frontend já tem a estrutura completa - falta apenas o backend implementar os endpoints

---

## Arquivos Relacionados

- Frontend: `src/pages/admin/AdminReports.tsx`
- Hooks: `src/features/admin/hooks/use-admin-reports.ts` (a criar)
- API: `src/lib/api/client.ts`

---

## Próximos Passos para Backend

1. Implementar endpoint `/v1/admin/stats` com métricas gerais
2. Implementar endpoint `/v1/admin/cashflow` para fluxo de caixa
3. Implementar endpoint `/v1/admin/revenue` com dados mensais
4. Implementar endpoint `/v1/admin/users/growth` para crescimento
5. Implementar endpoint `/v1/admin/plans/distribution` para distribuição
6. Implementar endpoint `/v1/admin/churn` para análise de cancelamento
7. Implementar endpoint `/v1/admin/reports/export` para downloads

---

## Status de Implementação

| Endpoint | Status |
|----------|--------|
| GET /v1/admin/stats | ✅ Implementado |
| GET /v1/admin/revenue | ❌ Pendente |
| GET /v1/admin/cashflow | ❌ Pendente |
| GET /v1/admin/users/growth | ❌ Pendente |
| GET /v1/admin/plans/distribution | ❌ Pendente |
| GET /v1/admin/churn | ❌ Pendente |
| GET /v1/admin/reports/export | ❌ Pendente |