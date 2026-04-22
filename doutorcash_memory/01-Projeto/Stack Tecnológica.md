---
title: Stack Tecnológica
tags:
  - projeto
  - stack
  - dependencias
---

# Stack Tecnológica

## Core

| Lib | Versão | Papel |
|-----|--------|-------|
| React | 18.3.1 | UI library |
| TypeScript | 5.8.3 | Tipagem estática |
| Vite | 5.4.19 | Build tool + dev server |
| @vitejs/plugin-react-swc | — | Transpilação rápida com SWC |

## Roteamento

| Lib | Versão | Papel |
|-----|--------|-------|
| react-router-dom | 6.30.1 | Client-side routing com nested routes |

## Estado e Data Fetching

| Lib | Versão | Papel |
|-----|--------|-------|
| @tanstack/react-query | 5.83.0 | Server state, cache, background refetch |
| react-hook-form | 7.61.1 | Estado de formulários |
| AuthContext (custom) | — | Auth state via React Context |

## UI e Estilização

| Lib | Versão | Papel |
|-----|--------|-------|
| shadcn/ui | — | 60+ componentes headless |
| Radix UI | — | Primitivos acessíveis |
| Tailwind CSS | 3.4.17 | Utility-first CSS |
| tailwindcss-animate | 1.0.7 | Animações Tailwind |
| @tailwindcss/typography | — | Estilo para rich text |
| framer-motion | 12.34.0 | Animações avançadas |
| lucide-react | 1.8.0 | Biblioteca de ícones |
| class-variance-authority | 0.7.1 | Gerenciamento de variantes |
| clsx | 2.1.1 | Merge de class names |
| tailwind-merge | 2.6.0 | Merge com deduplication |

## Componentes Especializados

| Lib | Versão | Papel |
|-----|--------|-------|
| embla-carousel-react | 8.6.0 | Carrossel |
| react-resizable-panels | 2.1.9 | Painéis redimensionáveis |
| vaul | 0.9.9 | Drawer/Sheet animado |
| input-otp | 1.4.2 | Input de código OTP |
| react-day-picker | 8.10.1 | Calendário/DatePicker |
| next-themes | 0.3.0 | Dark/light mode |

## Formulários e Validação

| Lib | Versão | Papel |
|-----|--------|-------|
| zod | 3.25.76 | Schema validation TypeScript-first |
| @hookform/resolvers | 3.10.0 | Integração Zod + React Hook Form |

## Visualização de Dados

| Lib | Versão | Papel |
|-----|--------|-------|
| recharts | 2.15.4 | Gráficos (Bar, Line, Pie, Area) |

## HTTP e API

| Lib | Versão | Papel |
|-----|--------|-------|
| axios | 1.15.2 | HTTP client com interceptors |

## Notificações (Toast)

| Lib | Versão | Papel |
|-----|--------|-------|
| sonner | 1.7.4 | Toast notifications modernas |
| @radix-ui/react-toast | — | Toast nativo Radix |

## Datas

| Lib | Versão | Papel |
|-----|--------|-------|
| date-fns | 3.6.0 | Manipulação e formatação de datas |

## Analytics

| Serviço | Lib | Papel |
|---------|-----|-------|
| Google Analytics 4 | via `analytics.ts` | Page views, eventos |
| Mixpanel | via `analytics.ts` | Product analytics |

## i18n

| Lib | Papel |
|-----|-------|
| i18n Context custom | Suporte pt/en/es sem lib externa |

## PWA

| Lib | Versão | Papel |
|-----|--------|-------|
| vite-plugin-pwa | 1.2.0 | Geração de Service Worker |
| workbox | — | Estratégias de cache |

## Build e Otimização

| Lib | Papel |
|-----|-------|
| vite-plugin-compression | Brotli + gzip |
| rollup-plugin-visualizer | Bundle analysis |

## Testes

| Lib | Versão | Papel |
|-----|--------|-------|
| vitest | 3.2.4 | Unit/integration tests |
| @vitest/browser | 3.2.4 | Browser tests |
| @vitest/coverage-v8 | — | Coverage report |
| playwright | 1.58.2 | E2E testing |
| @testing-library/react | 16.0.0 | React testing utilities |
| @testing-library/dom | 10.4.1 | DOM queries |
| @testing-library/jest-dom | 6.6.0 | Custom matchers |
| axe-core | 4.11.1 | Accessibility testing |
| happy-dom | 20.5.0 | DOM rápido para testes |

## Documentação de Componentes

| Lib | Versão | Papel |
|-----|--------|-------|
| storybook | 8.2.9 | Component docs |
| lovable-tagger | 1.1.13 | Tag de componentes para design tools |

## Code Quality

| Lib | Versão | Papel |
|-----|--------|-------|
| eslint | 9.32.0 | Linting |
| typescript-eslint | 8.38.0 | Regras TypeScript |
| husky | 9.1.7 | Git hooks |
| lint-staged | 16.2.7 | Pre-commit linting |

---

Veja também: [[Visão Geral]] | [[Arquitetura]] | [[../07-Estilizacao/Tailwind Config]]
