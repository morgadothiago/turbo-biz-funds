---
title: Feature — Transações
tags:
  - feature
  - transações
  - financeiro
---

# Feature — Transações

## Localização

```
src/features/transactions/
└── hooks/
    └── use-transactions.ts   # CRUD via React Query
```

## Tipo `Transaction`

```typescript
interface Transaction {
  id: string
  description: string
  amount: number          // positivo = receita, negativo = despesa
  type: "income" | "expense"
  category_id: string
  date: string            // ISO 8601
  card_id?: string        // se pago no cartão
  recurrence_id?: string  // se recorrente
  notes?: string
  created_at: string
  updated_at: string
}
```

## Hook: `use-transactions`

```typescript
// Listar
const { data, isLoading } = useTransactions(filters?)

// Criar
const { mutate: createTransaction } = useCreateTransaction()

// Editar
const { mutate: updateTransaction } = useUpdateTransaction()

// Deletar
const { mutate: deleteTransaction } = useDeleteTransaction()
```

### Parâmetros de filtro

```typescript
interface TransactionFilters {
  start_date?: string
  end_date?: string
  category_id?: string
  type?: "income" | "expense"
  page?: number
  limit?: number
}
```

## Endpoints

| Método | Endpoint | Ação |
|--------|----------|------|
| GET | `/v1/transactions` | Listar com filtros |
| POST | `/v1/transactions` | Criar transação |
| PUT | `/v1/transactions/{id}` | Editar transação |
| DELETE | `/v1/transactions/{id}` | Deletar transação |

## Limites por Plano

| Plano | Limite |
|-------|--------|
| free | 50 transações/mês |
| pro | Ilimitado |
| business | Ilimitado |

Quando limite atingido, API retorna `402` → `PlanLimitListener` dispara modal de upgrade.

---

Veja também: [[../04-API/Endpoints Transações]] | [[../09-Planos/Limites por Plano]] | [[Dashboard]]
