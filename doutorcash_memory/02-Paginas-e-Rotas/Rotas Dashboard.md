---
title: Rotas do Dashboard (Área do Usuário)
tags:
  - rotas
  - dashboard
  - privado
---

# Rotas do Dashboard (Área do Usuário)

Todas as rotas abaixo exigem autenticação (`PrivateRoute`). Usuários não autenticados são redirecionados para `/login`.

O layout base é `UserLayout.tsx` com sidebar e header.

## Mapa de Rotas

| Path | Componente | Arquivo | Descrição |
|------|-----------|---------|-----------|
| `/dashboard` | `UserDashboard` | `pages/UserDashboard.tsx` | Visão geral financeira |
| `/dashboard/transacoes` | `Transactions` | `pages/Transactions.tsx` | CRUD de transações |
| `/dashboard/categorias` | `Categories` | `pages/Categories.tsx` | Gerenciar categorias |
| `/dashboard/metas` | `Goals` | `pages/Goals.tsx` | Metas financeiras |
| `/dashboard/cartoes` | `Cards` | `pages/Cards.tsx` | Cartões de crédito |
| `/dashboard/recorrencias` | `Recorrencias` | `pages/Recorrencias.tsx` | Transações recorrentes |
| `/dashboard/whatsapp` | `WhatsApp` | `pages/WhatsApp.tsx` | Integração WhatsApp |
| `/dashboard/configuracoes` | `Settings` | `pages/Settings.tsx` | Perfil e configurações |

## Detalhes das Páginas

### `/dashboard` — Dashboard Principal
- Saldo atual, receitas, despesas do mês
- Gráfico de gastos por categoria
- Gráfico de evolução mensal
- Lista de transações recentes
- Progresso de metas
- CTA WhatsApp
- Hook: `use-dashboard-data` (React Query)

### `/dashboard/transacoes` — Transações
- Listagem com filtros (período, categoria, tipo)
- Criar/editar/deletar transação
- Tipo: receita ou despesa
- Hook: `use-transactions`
- Limitação por plano (free: limite de registros)

### `/dashboard/categorias` — Categorias
- Listagem de categorias (income/expense)
- Criar/editar/deletar
- Cada categoria tem nome, ícone, cor
- Hook: `use-categories`

### `/dashboard/metas` — Metas Financeiras
- Metas com valor alvo, valor atual, prazo
- Barra de progresso visual
- Criar/editar/deletar
- Hook: `use-goals`

### `/dashboard/cartoes` — Cartões de Crédito
- Cartões com limite, fatura atual, vencimento
- Criar/editar/deletar
- Hook: `use-cards`

### `/dashboard/recorrencias` — Recorrências
- Transações automáticas (mensais, semanais, etc.)
- Criar/editar regras de recorrência
- Geração de transações no período
- Hook: `use-recurrences`

### `/dashboard/whatsapp` — WhatsApp
- Interface para configurar integração
- Envio de relatórios e alertas via WhatsApp

### `/dashboard/configuracoes` — Configurações
Seções:
- **Perfil**: nome, email, telefone
- **Senha**: alterar senha atual
- **Idioma**: seletor pt/en/es (`LanguageSelector`)
- **LGPD**: exportar dados, deletar conta (`use-lgpd`)
- **Plano atual**: info do plano e link para upgrade

---

Veja também: [[Sistema de Guards]] | [[../05-Componentes/Componentes de Layout]] | [[../06-Estado-e-Hooks/AuthContext]]
