# Backend API Requirements - Admin User Management

## Problema Identificado

O frontend está completo e pronto para gerenciar usuários (bloquear, excluir e promover), mas **os endpoints de escrita não estão implementados no backend**.

O sistema faz um "probe" no carregamento da página e, quando detecta que o backend retorna erro do tipo `Cannot PATCH...`, todos os botões de ação ficam desabilitados com a mensagem *"Aguardando implementação no backend"*.

---

## Endpoints Necessários

### 1. Atualizar Usuário (Bloquear/Desbloquear/Promover/Alterar Plano)

**Método:** `PATCH`
**Endpoint:** `/v1/admin/users/:id`

#### Payload (UpdateAdminUserPayload)
```typescript
{
  plan?: string,      // "free" | "pro" | "business"
  status?: string,    // "Ativo" | "Pendente" | "Bloqueado"
  role?: string,      // "user" | "admin"
  adminPassword?: string  // Obrigatório apenas ao promover para admin
}
```

#### Exemplos de Requisição

**Bloquear usuário:**
```json
PATCH /v1/admin/users/123e4567-e89b-12d3-a456-426614174000
{
  "status": "Bloqueado"
}
```

**Desbloquear usuário:**
```json
PATCH /v1/admin/users/123e4567-e89b-12d3-a456-426614174000
{
  "status": "Ativo"
}
```

**Promover a admin:**
```json
PATCH /v1/admin/users/123e4567-e89b-12d3-a456-426614174000
{
  "role": "admin"
}
```

**Remover admin:**
```json
PATCH /v1/admin/users/123e4567-e89b-12d3-a456-426614174000
{
  "role": "user"
}
```

#### Resposta Esperada (200 OK)
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "+5511999999999",
    "plan": "pro",
    "status": "Ativo",
    "role": "user",
    "lastLogin": "2026-04-29T10:00:00Z",
    "createdAt": "2026-01-15T08:30:00Z",
    "totalTransactions": 42,
    "planExpiresAt": "2026-12-31T23:59:59Z"
  }
}
```

---

### 2. Excluir Usuário

**Método:** `DELETE`
**Endpoint:** `/v1/admin/users/:id`

#### Resposta Esperada (200 OK)
```json
{
  "data": {
    "removed": true
  }
}
```

---

## Estrutura da Entidade AdminUser (Frontend)

```typescript
interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plan: "free" | "pro" | "business" | string;
  status: "Ativo" | "Pendente" | "Bloqueado" | string;
  role: "user" | "admin" | string;
  lastLogin: string;
  createdAt: string;
  totalTransactions?: number;
  planExpiresAt?: string;
}
```

---

## Mapeamento de Status (Backend → Frontend)

O frontend converte os status vindos do backend usando este mapeamento:

| Backend | Frontend |
|---------|----------|
| `active` | `Ativo` |
| `inactive` | `Pendente` |
| `blocked` | `Bloqueado` |

> **Nota:** O frontend aceita ambos os formatos (backend ou frontend). Recomenda-se usar o padrão do backend (`active`, `inactive`, `blocked`).

---

## Códigos de Erro Esperados

| Código | Situação |
|--------|----------|
| 200 | Sucesso |
| 400 | Dados inválidos (ex: status inválido) |
| 401 | Não autenticado |
| 403 | Não autorizado (não é admin) |
| 404 | Usuário não encontrado |
| 422 | Erro de validação do payload |

---

## Verificação de Capacidade (Probe)

O frontend verifica se o endpoint existe fazendo um PATCH com ID fake:

```
PATCH /v1/admin/users/00000000-0000-0000-0000-000000000000
Body: {}
```

- Se retornar erro `Cannot PATCH /v1/admin/users/...` → Rota não existe
- Qualquer outro erro (404, 422, 403) → Rota existe e está implementada

---

## Listagem de Usuários (Já implementado)

**Método:** `GET`
**Endpoint:** `/v1/admin/users?limit=200`

#### Resposta Esperada (200 OK)
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "phone": "+5511999999999",
      "plan": "pro",
      "status": "active",
      "role": "user",
      "lastLogin": "2026-04-29T10:00:00Z",
      "createdAt": "2026-01-15T08:30:00Z",
      "totalTransactions": 42,
      "planExpiresAt": "2026-12-31T23:59:59Z"
    }
  ],
  "stats": {
    "total": 100,
    "active": 80,
    "pending": 15,
    "blocked": 5
  }
}
```

---

## Arquivos Relacionados no Frontend

- Hook de escrita: `src/features/admin/hooks/use-admin-users.ts`
- Verificação de capacidade: `src/features/admin/hooks/use-admin-write-capability.ts`
- Página de usuários: `src/pages/admin/AdminUsers.tsx`
- Configuração da API: `src/lib/api/client.ts`
