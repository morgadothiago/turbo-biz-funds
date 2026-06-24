# DoutorCash — Frontend

SaaS de gestão financeira pessoal com dashboard, metas, recorrências, cartões de crédito e pagamento integrado com EFI Pay (PIX + cartão).

**Produção:** https://doutorcashapp.com.br  
**API:** https://api.doutorcashapp.com.br  
**Repositório:** https://github.com/morgadothiago/turbo-biz-funds

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript 5 + Vite 5 |
| Roteamento | React Router DOM v6 |
| Estado servidor | TanStack Query v5 |
| Formulários | React Hook Form + Zod |
| UI | shadcn/ui + Radix UI + TailwindCSS 3 |
| HTTP | Axios |
| Pagamentos | EFI Pay (payment-token-efi) |
| Analytics | Google Analytics + Mixpanel |
| Deploy | Vercel |
| Testes | Vitest + Testing Library + Playwright |

---

## Requisitos

- Node.js 20+
- npm 10+

---

## Instalação

```bash
git clone https://github.com/morgadothiago/turbo-biz-funds.git
cd turbo-biz-funds
npm install
cp .env.example .env.local
# preencher as variáveis em .env.local
npm run dev
```

---

## Variáveis de Ambiente

Copiar `.env.example` e preencher:

```env
# URL da API backend
VITE_API_URL=https://api.doutorcashapp.com.br

# EFI Pay — Identificador de Conta (EFI Dashboard → API → Introdução → Identificador de Conta)
VITE_EFI_PAYEE_CODE=

# EFI Pay — Client ID da aplicação
VITE_EFI_CLIENT_ID=

# EFI Pay — ambiente (production | sandbox)
VITE_EFI_ENV=sandbox

# WhatsApp (número com DDI, sem + ou espaços. Ex: 5511999999999)
VITE_WHATSAPP_NUMBER=

# Email destino para solicitações de cancelamento (usuários Pro)
VITE_CANCELLATION_EMAIL=suporte@doutorcashapp.com.br

# Analytics (opcional)
VITE_GA_MEASUREMENT_ID=
VITE_MIXPANEL_TOKEN=
```

> Em desenvolvimento com `VITE_API_URL` vazio, o Vite proxy encaminha `/v1/*` para a API real sem CORS.

---

## Scripts

```bash
npm run dev           # servidor de desenvolvimento
npm run build         # build de produção
npm run lint          # ESLint
npm run lint:fix      # ESLint com autofix
npm run test          # Vitest (unit)
npm run test:watch    # Vitest em modo watch
npm run test:coverage # cobertura de código
npm run test:e2e      # Playwright (E2E)
npm run storybook     # Storybook na porta 6006
```

---

## Estrutura de Pastas

```
src/
├── contexts/          # AuthContext — estado global de autenticação
├── features/          # lógica de negócio por domínio (hooks + tipos)
│   ├── admin/         # hooks do painel admin (dashboard, planos, usuários, notificações)
│   ├── cards/         # cartões de crédito
│   ├── categories/    # categorias de transação
│   ├── dashboard/     # dados e componentes do dashboard
│   ├── goals/         # metas financeiras
│   ├── payments/      # integração EFI Pay
│   ├── plans/         # planos públicos
│   ├── recurrences/   # despesas/receitas recorrentes
│   └── transactions/  # transações
├── pages/             # páginas (uma por rota)
│   ├── admin/         # painel administrativo
│   └── ...            # Login, Cadastro, Dashboard, Pagamento, etc.
├── layouts/           # UserLayout e AdminLayout (sidebar + header)
├── components/
│   ├── ui/            # componentes shadcn/ui
│   ├── user/          # UserSidebar, PageHeader, NotificationsSheet, Tutorial
│   ├── admin/         # AdminSidebar, AdminHeader, AdminTutorial
│   ├── landing/       # componentes da landing page
│   └── upgrade/       # modal e listener de upgrade de plano
├── lib/
│   ├── api/client.ts  # Axios + interceptors + apiEndpoints
│   ├── storage.ts     # localStorage (token + user)
│   ├── format.ts      # formatação de moeda e data
│   ├── plan-limits.ts # limites por plano (free/pro/business)
│   └── analytics.ts   # GA + Mixpanel
├── types/
│   └── auth.ts        # User, UserPlan, UserRole, AuthContextType
└── AppShell.tsx       # rotas + guards (PublicRoute, PrivateRoute, DashboardRoute, AdminRoute)
```

---

## Autenticação

`AuthContext` (`src/contexts/AuthContext.tsx`) gerencia o estado global:

| Função | Descrição |
|---|---|
| `login(email, password)` | Autentica, salva JWT + user no localStorage |
| `register(payload)` | Cadastra e autentica automaticamente |
| `logout()` | Limpa localStorage |
| `refreshUser()` | Re-busca dados do usuário na API |
| `activatePro()` | Força `plan = "pro"` localmente (workaround enquanto backend não atualiza via webhook) |
| `updateProfile(data)` | Atualiza nome/telefone |
| `changePassword(data)` | Troca senha |

**Persistência:** JWT + objeto `User` em localStorage com namespace por usuário.  
**JWT:** plano pode estar desatualizado. `fetchAndMergeMe()` mescla com `/v1/users/me` sem fazer downgrade de plano pago.

---

## Planos

| Plano | Acesso |
|---|---|
| `free` | Bloqueado — redirecionado para `/pagamento?plan=pro-annual` |
| `pro` | Acesso completo ao dashboard |
| `business` | Acesso completo ao dashboard |
| `admin` | Painel administrativo em `/admin` |

Limites por plano definidos em `src/lib/plan-limits.ts`.

---

## Fluxo de Pagamento

### PIX
1. `POST /v1/payments/intent` com `{ plan, method: "pix" }` → retorna `paymentId` + QR Code
2. Frontend faz polling em `GET /v1/payments/{id}/status` a cada 5s por até 15min
3. Quando `status === "approved"`: `activatePro()` + navega para `/pagamento-sucesso`

### Cartão de Crédito
1. `POST /v1/payments/intent` com `{ plan, method: "cartao" }` → retorna `paymentId`
2. Frontend tokeniza o cartão via `payment-token-efi` usando `VITE_EFI_PAYEE_CODE` + `VITE_EFI_CLIENT_ID`
3. `POST /v1/payments/{paymentId}/confirm` com `{ paymentToken, holderName, cpf, installments }`
4. Se aprovado: navega para `/pagamento-sucesso`

> **VITE_EFI_PAYEE_CODE** = "Identificador de Conta" em: EFI Dashboard → API → Introdução.

---

## Rotas

| Rota | Guard | Descrição |
|---|---|---|
| `/` | Pública | Landing page |
| `/login` | PublicRoute | Login |
| `/cadastro` | Pública | Cadastro |
| `/recuperar-senha` | PublicRoute | Recuperar senha |
| `/redefinir-senha` | PublicRoute | Redefinir senha |
| `/pagamento` | PrivateRoute | Pagamento (PIX ou cartão) |
| `/pagamento-sucesso` | PrivateRoute | Confirmação de pagamento |
| `/dashboard/*` | DashboardRoute | Área logada (plano pago) |
| `/admin/*` | AdminRoute | Painel admin (role: admin) |

### Subrotas `/dashboard`
`transacoes`, `metas`, `cartoes`, `recorrencias`, `recorrencias/:id`, `whatsapp`, `configuracoes`, `notificacoes`, `suporte`, `relatorio`

### Subrotas `/admin`
`clientes`, `assinaturas`, `planos`, `configuracoes`, `relatorios`, `notificacoes`, `suporte`, `categorias`

---

## API Client

`src/lib/api/client.ts` exporta dois clients Axios:

- **`api`** — autenticado (injeta `Authorization: Bearer <token>`)
- **`publicApi`** — sem autenticação (login, cadastro, recuperação de senha)

**Interceptor de erro:** `401` fora de `/v1/auth/*` e `/pagamento` → dispara `auth:session-expired` → redireciona para `/login`.

**`apiEndpoints`** centraliza todos os endpoints da API.

---

## Cancelamento de Assinatura

Usuários com `plan === "pro"` veem o botão "Cancelar Assinatura" em Configurações.  
Ao confirmar, abre um `mailto:` pré-preenchido com nome, email, telefone, ID da conta e solicitação de estorno.  
Destinatário configurado em `VITE_CANCELLATION_EMAIL`.

---

## Testes

```bash
npm run test              # unit (Vitest)
npm run test:coverage     # cobertura
npm run test:e2e          # E2E (Playwright)
```

Testes em `src/**/*.test.tsx` e `src/**/*.test.ts`. Setup em `src/test/setup.ts`.

---

## Deploy

Deploy automático via Vercel no push para `main`.

```bash
vercel --prod   # deploy manual de produção
```

Variáveis de ambiente gerenciadas no painel Vercel (não commitar `.env.production`).

---

## Pendências no Backend

Ver arquivos `BACKEND_REQUEST_*.md` na raiz do repositório:

| Arquivo | Problema |
|---|---|
| `BACKEND_REQUEST_PAGAMENTOS.md` | PIX sempre "pending" + cartão `user_not_found` |
| `BACKEND_REQUEST_ADMIN_REPORTS.md` | Relatórios admin |
| `BACKEND_REQUEST_CARTOES.md` | Cartões |
| `BACKEND_REQUEST_CHANGE_PASSWORD.md` | Troca de senha |
| `BACKEND_REQUEST_METAS.md` | Metas |
| `BACKEND_REQUEST_RECORRENCIAS.md` | Recorrências |
