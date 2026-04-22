---
title: Feature — Cartões de Crédito
tags:
  - feature
  - cartões
  - cards
---

# Feature — Cartões de Crédito

## Localização

```
src/features/cards/
└── hooks/
    └── use-cards.ts
```

## Tipo `CreditCard`

```typescript
interface CreditCard {
  id: string
  name: string              // ex: "Nubank", "Itaú Visa"
  limit: number             // limite total
  current_balance: number   // fatura atual
  due_day: number           // dia do vencimento (1-31)
  closing_day: number       // dia de fechamento
  color?: string            // cor visual do cartão
  brand?: string            // "visa" | "mastercard" | "elo" etc.
  user_id: string
  created_at: string
}
```

## Hook: `use-cards`

```typescript
const { data: cards, isLoading } = useCards()
const { mutate: createCard } = useCreateCard()
const { mutate: updateCard } = useUpdateCard()
const { mutate: deleteCard } = useDeleteCard()
```

## Endpoints

| Método | Endpoint | Ação |
|--------|----------|------|
| GET | `/v1/cards` | Listar cartões |
| POST | `/v1/cards` | Criar cartão |
| PUT | `/v1/cards/{id}` | Editar cartão |
| DELETE | `/v1/cards/{id}` | Deletar cartão |

## Relação com Transações

Transações podem ter `card_id` para indicar que foram pagas em cartão específico.

---

Veja também: [[Transações]] | [[../09-Planos/Limites por Plano]]
