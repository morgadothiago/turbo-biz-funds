# Bug: Categorias do Admin não aparecem para usuários

## Problema

O endpoint `GET /v1/categories` filtra categorias pelo `userId` do usuário autenticado.
Quando o admin cria uma categoria no painel administrativo, ela fica salva com o `userId` do admin e **não aparece** para os usuários comuns.

## Reprodução

1. Logar como admin → acessar painel admin → Categorias → criar "Saúde"
2. Logar como usuário comum → abrir "Nova Transação" ou "Nova Recorrência"
3. A categoria "Saúde" **não aparece** na lista

## Comportamento esperado

Categorias criadas pelo admin devem ser visíveis para **todos os usuários** do sistema.

---

## Solução sugerida

### Opção A — campo `isGlobal` na tabela *(recomendada)*

```sql
ALTER TABLE categories ADD COLUMN is_global BOOLEAN NOT NULL DEFAULT false;
```

Quando admin chama `POST /v1/categories`, salvar com `is_global = true`.

Query do `GET /v1/categories`:
```sql
SELECT * FROM categories
WHERE user_id = :userId OR is_global = true
ORDER BY name ASC;
```

### Opção B — `userId = null` para categorias globais

Quando role = `admin`, salvar `user_id = NULL` ao criar categoria.

Query do `GET /v1/categories`:
```sql
SELECT * FROM categories
WHERE user_id = :userId OR user_id IS NULL
ORDER BY name ASC;
```

---

## Endpoints afetados

| Endpoint | Mudança necessária |
|---|---|
| `GET /v1/categories` | Retornar categorias globais + do próprio usuário |
| `POST /v1/categories` | Quando chamado por admin (`role = admin`), marcar como global |

---

## Impacto

Sem esse fix, o painel admin de categorias **não tem utilidade prática** — as categorias cadastradas pelo admin nunca chegam aos usuários finais. Transações e recorrências ficam sem categorias disponíveis para novos usuários.
