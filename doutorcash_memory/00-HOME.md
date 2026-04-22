---
title: DoutorCash — Segundo Cérebro Frontend
tags:
  - moc
  - index
  - frontend
aliases:
  - Home
  - Index
cssclasses:
  - home-note
---

# DoutorCash — Segundo Cérebro Frontend

> SaaS de gestão financeira pessoal com integração WhatsApp e IA.
> Stack: React 18 + TypeScript + Vite + shadcn/ui + React Query + Axios

---

## Navegação Principal

### Projeto
- [[01-Projeto/Visão Geral]] — produto, repositório, scripts
- [[01-Projeto/Stack Tecnológica]] — todas as libs e versões
- [[01-Projeto/Arquitetura]] — padrões, estrutura de pastas
- [[01-Projeto/Variáveis de Ambiente]] — env vars necessárias

### Páginas e Rotas
- [[02-Paginas-e-Rotas/Rotas Públicas]] — landing, login, cadastro, recuperação
- [[02-Paginas-e-Rotas/Rotas Dashboard]] — área do usuário
- [[02-Paginas-e-Rotas/Rotas Admin]] — painel administrativo
- [[02-Paginas-e-Rotas/Sistema de Guards]] — PublicRoute, PrivateRoute, AdminRoute

### Features
- [[03-Features/Auth]] — login, registro, recuperação de senha
- [[03-Features/Dashboard]] — visão geral, gráficos, estatísticas
- [[03-Features/Transações]] — CRUD de transações financeiras
- [[03-Features/Categorias]] — CRUD de categorias
- [[03-Features/Metas]] — metas financeiras
- [[03-Features/Cartões]] — cartões de crédito
- [[03-Features/Recorrências]] — transações recorrentes
- [[03-Features/WhatsApp]] — integração WhatsApp
- [[03-Features/Pagamentos]] — Stripe e Pix
- [[03-Features/LGPD]] — exportação e deleção de dados
- [[03-Features/Admin]] — administração de usuários e planos

### API
- [[04-API/Configuração do Client]] — Axios, interceptors, proxy
- [[04-API/Endpoints Auth]] — login, register, forgot, reset
- [[04-API/Endpoints Transações]] — CRUD completo
- [[04-API/Endpoints Dashboard]] — balance, categories summary
- [[04-API/Endpoints Admin]] — stats, users, companies, plans
- [[04-API/Tratamento de Erros]] — 401, 402, erros genéricos

### Componentes
- [[05-Componentes/UI Components shadcn]] — 60+ componentes base
- [[05-Componentes/Componentes Landing]] — hero, pricing, features
- [[05-Componentes/Componentes de Layout]] — UserLayout, AdminLayout
- [[05-Componentes/Componentes Globais]] — ErrorBoundary, AuthLoading, NavLink

### Estado e Hooks
- [[06-Estado-e-Hooks/AuthContext]] — estado de autenticação
- [[06-Estado-e-Hooks/React Query Config]] — caching, staleTime, retries
- [[06-Estado-e-Hooks/Hooks Customizados]] — use-mobile, use-plan, use-reveal

### Estilização
- [[07-Estilizacao/Sistema de Cores]] — HSL vars, paleta completa
- [[07-Estilizacao/Tailwind Config]] — customizações, plugins
- [[07-Estilizacao/Temas Dark-Light]] — next-themes, ThemeProvider

### Testes
- [[08-Testes/Estratégia de Testes]] — Vitest, Testing Library, Axe
- [[08-Testes/E2E com Playwright]] — testes de ponta a ponta

### Planos
- [[09-Planos/Limites por Plano]] — free, pro, business
- [[09-Planos/Sistema de Pagamentos]] — Stripe, Pix, fluxo

### Decisões e Roadmap
- [[10-Decisoes/ADRs]] — decisões arquiteturais registradas
- [[10-Decisoes/Roadmap]] — próximas features e melhorias

---

## Status da Integração API

> [!info] Branch atual
> `feat/api-integration-doutocash`

> [!warning] Endpoints pendentes de teste
> Consulte [[04-API/Configuração do Client]] para status atual.

---

## Links Rápidos

- Repositório: https://github.com/morgadothiago/turbo-biz-funds
- API Base: `https://api.doutorcashapp.com.br`
- Lovable: https://lovable.dev
