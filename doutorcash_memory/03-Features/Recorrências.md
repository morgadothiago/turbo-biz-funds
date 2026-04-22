---
title: Feature — Recorrências
tags:
  - feature
  - recorrências
  - automação
---

# Feature — Recorrências

## Localização

```
src/features/recurrences/
└── hooks/
    └── use-recurrences.ts
```

## Tipo `Recurrence`

```typescript
interface Recurrence {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  category_id: string
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  start_date: string
  end_date?: string         // null = sem fim
  day_of_month?: number     // para frequency === "monthly"
  day_of_week?: number      // 0-6 para frequency === "weekly"
  is_active: boolean
  user_id: string
}
```

## Hook: `use-recurrences`

```typescript
const { data: recurrences } = useActiveRecurrences()
const { mutate: createRecurrence } = useCreateRecurrence()
const { mutate: updateRecurrence } = useUpdateRecurrence()
const { mutate: generateTransactions } = useGenerateRecurrenceTransactions()
```

## Endpoints

| Método | Endpoint | Ação |
|--------|----------|------|
| GET | `/v1/recurrences/active` | Listar recorrências ativas |
| POST | `/v1/recurrences` | Criar regra de recorrência |
| PUT | `/v1/recurrences/{id}` | Editar recorrência |
| POST | `/v1/recurrences/generate` | Gerar transações do período |

## Fluxo de Geração

```
1. Usuário define regra de recorrência (ex: "salário todo dia 5")
2. No período especificado, chama POST /v1/recurrences/generate
3. API cria transações automaticamente no período
4. Transações aparecem no /dashboard/transacoes
```

---

Veja também: [[Transações]] | [[../09-Planos/Limites por Plano]]
