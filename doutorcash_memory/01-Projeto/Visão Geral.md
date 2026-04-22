---
title: Visão Geral do Projeto
tags:
  - projeto
  - overview
aliases:
  - Project Overview
---

# Visão Geral do Projeto

## Identidade

| Campo | Valor |
|-------|-------|
| **Nome do produto** | DoutorCash |
| **Nome do pacote** | `vite_react_shadcn_ts` |
| **Versão** | `0.0.0` |
| **Repositório** | https://github.com/morgadothiago/turbo-biz-funds |
| **Branch principal** | `main` |
| **Branch de integração API** | `feat/api-integration-doutocash` |
| **Lovable Project** | https://lovable.dev |

## Proposta de Valor

SaaS de **gestão financeira pessoal** com:
- Controle de transações, categorias, metas e cartões
- Integração nativa com **WhatsApp** (envio de relatórios/alertas via bot)
- Potencial de IA (planejado no roadmap)
- Suporte a **3 idiomas**: Português, Inglês, Espanhol
- **3 planos**: free, pro, business

## Scripts Disponíveis

```bash
yarn dev              # Dev server (Vite HMR)
yarn build            # Build de produção
yarn build:dev        # Build modo desenvolvimento
yarn build:analyze    # Analisar bundle com Rollup Visualizer
yarn lint             # ESLint
yarn lint:fix         # ESLint com auto-fix
yarn preview          # Preview do build de produção
yarn test             # Vitest (unitário)
yarn test:watch       # Vitest em modo watch
yarn test:coverage    # Relatório de cobertura
yarn test:ui          # Vitest UI
yarn test:e2e         # Playwright E2E
yarn test:e2e:ui      # Playwright UI mode
yarn test:e2e:headed  # Playwright headful
yarn storybook        # Storybook (porta 6006)
yarn build-storybook  # Build Storybook estático
```

## Estrutura de Pastas (raiz)

```
turbo-biz-funds/
├── src/                # Código fonte React
├── docs/               # Documentação técnica (7.464 linhas)
├── public/             # Assets estáticos
├── e2e/                # Testes Playwright
├── .storybook/         # Configuração Storybook
├── doutorcash_memory/  # Este vault Obsidian
├── .env                # Variáveis de ambiente (não commitar!)
├── vite.config.ts      # Configuração Vite
├── tailwind.config.ts  # Configuração Tailwind
├── tsconfig.json       # Configuração TypeScript
└── package.json        # Dependências e scripts
```

## Documentação Existente

A pasta `docs/` contém:
- `PROJECT_OVERVIEW.md` — visão geral do produto
- `API.md` — referência de endpoints
- `AUTH.md` — fluxo de autenticação
- `ARCHITECTURE.md` — padrões de arquitetura
- `DEPLOY.md` — instruções de deploy
- `CONTRIBUTING.md` — guia de contribuição
- `TESTING.md` — estratégia de testes
- `PLAN_LIMITS_SPEC.md` — limitações por plano
- `MISSING_ENDPOINTS_SPEC.md` — endpoints faltantes

---

Veja também: [[Stack Tecnológica]] | [[Arquitetura]] | [[Variáveis de Ambiente]]
