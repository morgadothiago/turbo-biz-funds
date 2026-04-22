---
title: Rotas Administrativas
tags:
  - rotas
  - admin
  - privado
---

# Rotas Administrativas

Rotas protegidas pelo guard `AdminRoute`. Apenas usuários com `role === "admin"` têm acesso. Não-admins autenticados são redirecionados para `/dashboard`.

O layout base é `AdminLayout.tsx`.

## Mapa de Rotas

| Path | Componente | Arquivo | Descrição |
|------|-----------|---------|-----------|
| `/admin` | `AdminDashboard` | `pages/admin/AdminDashboard.tsx` | Analytics e visão geral |
| `/admin/clientes` | `AdminUsers` | `pages/admin/AdminUsers.tsx` | Gerenciar usuários |
| `/admin/empresas` | `AdminCompanies` | `pages/admin/AdminCompanies.tsx` | Gerenciar empresas |
| `/admin/assinaturas` | `AdminSubscriptions` | `pages/admin/AdminSubscriptions.tsx` | Assinaturas ativas |
| `/admin/planos` | `AdminPlans` | `pages/admin/AdminPlans.tsx` | Gerenciar planos |

## Detalhes das Páginas

### `/admin` — Admin Dashboard
- Estatísticas globais: total usuários, MRR, churn
- Gráfico de receita
- Lista de clientes recentes
- Feed de atividade
- Hook: `use-admin-dashboard`
- Endpoints: `GET /v1/admin/stats`, `GET /v1/admin/revenue`, `GET /v1/admin/activity`

### `/admin/clientes` — Usuários
- Listagem de todos os usuários
- Filtros por plano, status, data de cadastro
- Ver detalhes de um usuário
- Hook: `use-admin-users`
- Endpoints: `GET /v1/admin/users`, `GET /v1/admin/users/{id}`

### `/admin/empresas` — Empresas
- Listagem de empresas cadastradas
- Hook: `use-admin-companies`
- Endpoint: `GET /v1/admin/companies`

### `/admin/assinaturas` — Assinaturas
- Assinaturas ativas com status de pagamento
- Hook: `use-admin-subscriptions`
- Endpoint: `GET /v1/admin/subscriptions`

### `/admin/planos` — Planos
- Visualizar e gerenciar planos disponíveis
- Hook: `use-admin-plans`
- Endpoint: `GET /v1/admin/plans`

---

Veja também: [[Sistema de Guards]] | [[../03-Features/Admin]] | [[../04-API/Endpoints Admin]]
