---
title: Feature — Dashboard
tags:
  - feature
  - dashboard
---

# Feature — Dashboard

## Localização

```
src/features/dashboard/
├── components/
│   ├── StatCard.tsx         # Card de estatística (saldo, receita, despesa)
│   ├── ExpenseChart.tsx     # Gráfico de gastos (Recharts BarChart)
│   ├── CategoryChart.tsx    # Gráfico por categoria (Recharts PieChart)
│   ├── GoalsProgress.tsx    # Progresso das metas
│   ├── TransactionList.tsx  # Lista de transações recentes
│   ├── WhatsAppCTA.tsx      # Call-to-action WhatsApp
│   └── index.ts             # Re-exports
├── types/
│   ├── dashboard.types.ts   # DashboardData, DashboardFilter, StatCardData
│   └── index.ts
└── hooks/
    ├── use-dashboard-data.ts # React Query hook principal
    └── index.ts
```

## Tipos

```typescript
interface DashboardData {
  balance: number
  income: number
  expenses: number
  transactions: Transaction[]
  categories: CategorySummary[]
  goals: Goal[]
}

interface DashboardFilter {
  period: "week" | "month" | "year"
  startDate?: string
  endDate?: string
}
```

## Hook: `use-dashboard-data`

```typescript
const { data, isLoading, error } = useDashboardData(filter)
```

Fetches em paralelo:
- `GET /v1/summary/balance` → saldo, receita, despesas
- `GET /v1/summary/categories` → gastos por categoria

## Componentes Visuais

### `StatCard`
Card com:
- Título (ex: "Saldo Atual")
- Valor formatado em BRL
- Ícone Lucide
- Variação percentual (opcional)
- Cor de fundo conforme tipo (verde=receita, vermelho=despesa)

### `ExpenseChart`
- `BarChart` do Recharts
- Eixo X: meses
- Eixo Y: valor em R$
- Barras: receita vs despesa
- Tooltip customizado

### `CategoryChart`
- `PieChart` do Recharts
- Fatias por categoria de gasto
- Legenda com percentuais

### `GoalsProgress`
- Lista de metas com `Progress` bar (shadcn)
- Exibe valor atual vs meta
- Cor muda conforme % atingido

### `TransactionList`
- Últimas N transações
- Ícone da categoria, descrição, data, valor
- Tipo: entrada (verde) ou saída (vermelho)

### `WhatsAppCTA`
- Banner de CTA para ativar integração WhatsApp
- Aparece apenas se integração não configurada

---

Veja também: [[../02-Paginas-e-Rotas/Rotas Dashboard]] | [[../04-API/Endpoints Dashboard]] | [[Transações]]
