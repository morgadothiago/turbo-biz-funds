---
title: Arquitetura do Frontend
tags:
  - projeto
  - arquitetura
  - patterns
---

# Arquitetura do Frontend

## Padrão Geral

O projeto segue uma arquitetura **Feature-Sliced Design (FSD)** simplificada, com camadas bem definidas.

```
src/
├── types/          # Tipos globais do domínio
├── contexts/       # Contextos React (AuthContext)
├── shared/         # Tipos compartilhados entre features
├── lib/            # Utilitários e serviços de infraestrutura
├── hooks/          # Hooks React globais
├── components/     # Componentes UI reutilizáveis
├── layouts/        # Layouts de página
├── pages/          # Componentes de página (entrada de rota)
└── features/       # Módulos de feature com lógica encapsulada
```

## Camada: `lib/`

Serviços de infraestrutura transversais.

| Arquivo | Responsabilidade |
|---------|-----------------|
| `api/client.ts` | Axios instance + endpoints + interceptors |
| `storage.ts` | Persistência no localStorage (token, user) |
| `utils.ts` | Função `cn()` (clsx + tailwind-merge) |
| `analytics.ts` | GA4 + Mixpanel |
| `i18n.tsx` | Contexto de internacionalização |
| `i18n-provider.tsx` | Provider de i18n |
| `plan-limits.ts` | Limites por plano (free/pro/business) |
| `performance.ts` | Monitoramento de performance |

## Camada: `features/`

Cada feature é um módulo isolado com:
- `hooks/` — React Query hooks para API
- `types/` — Tipos TypeScript locais
- `schemas/` — Validações Zod
- `components/` — Componentes específicos da feature

### Features existentes

```
features/
├── auth/           # Login, register, forgot/reset password
├── dashboard/      # Visão geral, gráficos, stats
├── transactions/   # CRUD de transações
├── categories/     # CRUD de categorias
├── goals/          # CRUD de metas financeiras
├── cards/          # CRUD de cartões de crédito
├── recurrences/    # Transações recorrentes
├── payments/       # Stripe + Pix
├── lgpd/           # Exportação e deleção de dados
└── admin/          # Painel administrativo
```

## Camada: `pages/`

Componentes que correspondem a rotas. São **orquestradores**: conectam layouts, features e dados, mas não contêm lógica de negócio diretamente.

## Camada: `components/`

Componentes UI sem lógica de negócio:
- `ui/` — shadcn/ui (60+ componentes base)
- `landing/` — Seções da landing page
- `user/` — Componentes específicos do dashboard de usuário
- `admin/` — Componentes específicos do admin
- `upgrade/` — Upgrade de plano

## Entry Points

```
src/
├── main.tsx        # React DOM root + providers externos
├── App.tsx         # Router principal (rotas públicas + shell)
└── AppShell.tsx    # Rotas privadas + QueryClientProvider + AuthProvider
```

### Hierarquia de Providers

```
<QueryClientProvider>
  <AuthProvider>
    <I18nProvider>
      <ThemeProvider>
        <RouterProvider>
          <App />
        </RouterProvider>
      </ThemeProvider>
    </I18nProvider>
  </AuthProvider>
</QueryClientProvider>
```

## Fluxo de Dados

```
API (doutorcashapp) 
  ↓ axios (client.ts)
  ↓ feature hook (use-transactions, etc.)
  ↓ React Query (cache + estado de loading)
  ↓ Page Component
  ↓ UI Components
```

## Convenções

- **Nomes de arquivos**: kebab-case (`use-transactions.ts`)
- **Nomes de componentes**: PascalCase (`TransactionList.tsx`)
- **Hooks**: prefixo `use-` + kebab-case
- **Schemas Zod**: sufixo `.schema.ts`
- **Tipos**: sufixo `.types.ts`

---

Veja também: [[Visão Geral]] | [[Stack Tecnológica]] | [[../06-Estado-e-Hooks/React Query Config]]
