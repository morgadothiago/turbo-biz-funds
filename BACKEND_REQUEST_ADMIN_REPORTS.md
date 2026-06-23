# Documentação de Endpoints — Admin Reports

**Data:** 2026-06-19  
**Solicitante:** Frontend (turbo-biz-funds)

---

## Visão Geral

A tela de relatórios do painel admin (`/admin/reports`) consome 7 endpoints para exibir métricas de receita, crescimento de usuários, distribuição de planos, churn e cashflow.

Todos os endpoints requerem **autenticação Bearer token JWT com role admin**.

O frontend usa `Promise.allSettled` — cada endpoint é independente. Se um falhar, os demais continuam funcionando (fallback para dados mock locais).

---

## Query Parameters Comuns

| Parâmetro | Tipo | Valores aceitos | Descrição |
|-----------|------|-----------------|-----------|
| `period` | string | `weekly` \| `monthly` \| `quarterly` \| `yearly` | Agrupamento temporal |
| `year` | number | ex: `2026` | Ano de referência |

---

## Endpoints

### 1. `GET /v1/admin/stats`

KPIs principais exibidos nos cards do topo da tela.

**Query params:** `?period=monthly`

#### Resposta 200

```json
{
  "data": {
    "totalRevenue": 12450.00,
    "revenueGrowth": 12.5,
    "newUsers": 1234,
    "usersGrowth": 8.3,
    "conversionRate": 23.4,
    "conversionGrowth": 2.1
  }
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `totalRevenue` | number | Receita total do período |
| `revenueGrowth` | number | Variação percentual vs período anterior (positivo = crescimento) |
| `newUsers` | number | Novos usuários no período |
| `usersGrowth` | number | Variação percentual de usuários |
| `conversionRate` | number | Taxa de conversão (%) |
| `conversionGrowth` | number | Variação da taxa de conversão |

> **Alternativas aceitas:** `mrr` (alias de `totalRevenue`), `mrrChange` (alias de `revenueGrowth`), `totalClients` (alias de `newUsers`).

---

### 2. `GET /v1/admin/revenue`

Série histórica de receita por período para tabela e gráfico de barras.

**Query params:** `?period=monthly&year=2026`

#### Resposta 200

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

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `month` | string | Período no formato `YYYY-MM` (ou `period` como alias) |
| `revenue` | number | Receita bruta |
| `expenses` | number | Despesas |
| `netRevenue` | number | Receita líquida (`revenue - expenses`) |
| `mrr` | number | MRR do mês |
| `newSubscriptions` | number | Novas assinaturas |
| `cancellations` | number | Cancelamentos |
| `churnRate` | number | Taxa de churn (%) |

---

### 3. `GET /v1/admin/revenue/chart`

Dados formatados para o gráfico de linha de receita.

**Query params:** `?period=monthly&year=2026`

#### Resposta 200

```json
{
  "labels": ["Jan", "Fev", "Mar", "Abr", "Mai"],
  "datasets": {
    "revenue": [10000, 11000, 11500, 12000, 12450],
    "expenses": [2000, 2200, 2400, 2500, 2600],
    "netRevenue": [8000, 8800, 9100, 9500, 9850]
  }
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `labels` | string[] | Rótulos do eixo X |
| `datasets.revenue` | number[] | Receita bruta por período |
| `datasets.expenses` | number[] | Despesas por período |
| `datasets.netRevenue` | number[] | Receita líquida por período |

---

### 4. `GET /v1/admin/users/growth`

Série histórica de crescimento de usuários.

**Query params:** `?period=monthly&year=2026`

#### Resposta 200

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

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `period` | string | Período (`YYYY-MM` ou alias `month`) |
| `totalUsers` | number | Total acumulado de usuários |
| `newUsers` | number | Novos cadastros no período |
| `activeUsers` | number | Usuários ativos |
| `inactiveUsers` | number | Usuários inativos |
| `blockedUsers` | number | Usuários bloqueados |

---

### 5. `GET /v1/admin/plans/distribution`

Distribuição de assinantes e receita por plano.

**Query params:** `?period=monthly`

#### Resposta 200

```json
{
  "plans": [
    {
      "planId": "uuid",
      "planName": "Pro",
      "subscribers": 200,
      "revenue": 5980.00,
      "percentage": 26.0
    }
  ]
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `planId` | string | ID do plano (ou `id` como alias) |
| `planName` | string | Nome do plano (ou `name` como alias) |
| `subscribers` | number | Número de assinantes ativos |
| `revenue` | number | Receita gerada pelo plano no período |
| `percentage` | number | Percentual do total de assinantes (%) |

---

### 6. `GET /v1/admin/churn`

Dados de churn por período.

**Query params:** `?period=monthly&year=2026`

#### Resposta 200

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

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `period` | string | Período `YYYY-MM` |
| `cancelledCount` | number | Quantidade de cancelamentos |
| `cancelledRevenue` | number | Receita perdida com cancelamentos |
| `churnRate` | number | Taxa de churn (%) |
| `reason` | string | Motivo predominante (livre) |

---

### 7. `GET /v1/admin/cashflow`

Extrato de entradas e saídas financeiras.

**Query params:** `?year=2026`

#### Resposta 200

```json
{
  "entries": [
    {
      "id": "uuid",
      "date": "2026-05-01",
      "type": "revenue",
      "category": "assinatura",
      "description": "Nova assinatura Pro",
      "amount": 29.90,
      "balance": 12450.00,
      "subscriptionId": "uuid",
      "userId": "uuid"
    }
  ]
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador do lançamento |
| `date` | string | Data no formato `YYYY-MM-DD` |
| `type` | `"revenue"` \| `"expense"` | Tipo do lançamento |
| `category` | string | Categoria (ex: `"assinatura"`, `"infraestrutura"`) |
| `description` | string | Descrição livre |
| `amount` | number | Valor (negativo para despesas) |
| `balance` | number | Saldo acumulado após o lançamento |
| `subscriptionId` | string \| null | UUID da assinatura relacionada (se houver) |
| `userId` | string \| null | UUID do usuário relacionado (se houver) |

---

## Respostas de Erro (todos os endpoints)

| Status | Descrição |
|--------|-----------|
| `401` | Token inválido ou expirado |
| `403` | Usuário não tem role admin |
| `422` | Query params inválidos |
| `500` | Erro interno |

---

## Sumário dos Endpoints

| Método | Path | Função |
|--------|------|--------|
| `GET` | `/v1/admin/stats` | KPIs principais (cards do topo) |
| `GET` | `/v1/admin/revenue` | Série histórica de receita |
| `GET` | `/v1/admin/revenue/chart` | Dados formatados para gráfico |
| `GET` | `/v1/admin/users/growth` | Crescimento de usuários |
| `GET` | `/v1/admin/plans/distribution` | Distribuição por plano |
| `GET` | `/v1/admin/churn` | Dados de churn |
| `GET` | `/v1/admin/cashflow` | Extrato financeiro |

---

## Comportamento do Frontend

- Todos os 7 endpoints são disparados **em paralelo** via `Promise.allSettled`
- Se um endpoint retornar erro, os demais continuam normalmente
- Endpoints com falha mostram **dados mock** enquanto os que funcionam mostram **dados reais**
- O frontend suporta aliases de campos para facilitar integração (documentados em cada endpoint acima)
