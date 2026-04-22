---
title: Feature — Metas Financeiras
tags:
  - feature
  - metas
  - goals
---

# Feature — Metas Financeiras

## Localização

```
src/features/goals/
└── hooks/
    └── use-goals.ts
```

## Tipo `Goal`

```typescript
interface Goal {
  id: string
  title: string
  target_amount: number     // valor alvo
  current_amount: number    // valor acumulado
  deadline?: string         // data limite (ISO 8601)
  description?: string
  icon?: string
  color?: string
  user_id: string
  created_at: string
  updated_at: string
}
```

## Hook: `use-goals`

```typescript
const { data: goals, isLoading } = useGoals()
const { mutate: createGoal } = useCreateGoal()
const { mutate: updateGoal } = useUpdateGoal()
const { mutate: deleteGoal } = useDeleteGoal()
```

## Endpoints

| Método | Endpoint | Ação |
|--------|----------|------|
| GET | `/v1/goals` | Listar metas |
| POST | `/v1/goals` | Criar meta |
| PUT | `/v1/goals/{id}` | Atualizar meta |
| DELETE | `/v1/goals/{id}` | Deletar meta |

## Exibição Visual

- `GoalsProgress` no Dashboard mostra barra de progresso
- Percentual calculado: `(current_amount / target_amount) * 100`
- Cores:
  - `< 30%` → vermelho
  - `30-70%` → amarelo
  - `> 70%` → verde

---

Veja também: [[Dashboard]] | [[../09-Planos/Limites por Plano]]
