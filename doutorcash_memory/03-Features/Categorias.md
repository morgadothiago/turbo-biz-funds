---
title: Feature — Categorias
tags:
  - feature
  - categorias
---

# Feature — Categorias

## Localização

```
src/features/categories/
└── hooks/
    └── use-categories.ts
```

## Tipo `Category`

```typescript
interface Category {
  id: string
  name: string
  type: "income" | "expense"
  icon?: string     // nome do ícone Lucide
  color?: string    // hex ou HSL
  user_id: string
  created_at: string
}
```

## Hook: `use-categories`

```typescript
const { data: categories, isLoading } = useCategories()
const { mutate: createCategory } = useCreateCategory()
const { mutate: updateCategory } = useUpdateCategory()
const { mutate: deleteCategory } = useDeleteCategory()
```

## Endpoints

| Método | Endpoint | Ação |
|--------|----------|------|
| GET | `/v1/categories` | Listar categorias do usuário |
| POST | `/v1/categories` | Criar categoria |
| PUT | `/v1/categories/{id}` | Editar categoria |
| DELETE | `/v1/categories/{id}` | Deletar categoria |

## Uso em Outras Features

- **Transações**: cada transação tem `category_id`
- **Dashboard**: `CategoryChart` agrupa gastos por categoria
- **Filtros**: seletor de categoria em listagens

---

Veja também: [[Transações]] | [[Dashboard]] | [[../04-API/Endpoints Transações]]
