# doutorcash — Visão Geral do Produto

> SaaS de gestão de finanças pessoais com IA e integração WhatsApp.

---

## Stack & Arquitetura

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript + Vite + SWC |
| Roteamento | React Router v6 |
| Estado/Cache | TanStack React Query |
| UI | shadcn/ui + Tailwind CSS |
| Validação | Zod |
| Gráficos | Recharts |
| HTTP | Axios com interceptors JWT |
| PWA | VitePWA + Workbox |
| Build | Vite + Brotli/Gzip |

**API Backend:** `https://api.doutorcashapp.com.br` (proxy Vite em dev via `/v1`)

---

## Estrutura de Rotas

```
/                       → Landing Page (pública)
/login                  → Login
/cadastro               → Cadastro (wizard 2 passos: dados + escolha de plano)
/recuperar-senha        → Forgot Password
/redefinir-senha        → Reset Password (código 6 dígitos)
/pagamento              → Checkout (cartão ou Pix)
/pagamento-sucesso      → Confirmação de assinatura

/dashboard              → UserLayout (guard: autenticado)
  /                     → Dashboard principal
  /transacoes           → CRUD transações
  /categorias           → CRUD categorias
  /metas                → CRUD metas financeiras
  /recorrencias         → CRUD recorrências (despesas/receitas fixas)
  /cartoes              → CRUD cartões de crédito
  /whatsapp             → Integração WhatsApp
  /configuracoes        → Perfil, notificações, LGPD

/admin                  → AdminLayout (guard: role === "admin")
  /                     → Dashboard admin
  /clientes             → Usuários
  /empresas             → Empresas
  /assinaturas          → Assinaturas ativas
  /planos               → CRUD planos
```

---

## Módulos Implementados no Frontend

### Autenticação
- [x] Login com email/senha
- [x] Cadastro com wizard (dados pessoais + escolha de plano)
- [x] Recuperação de senha por email (código 6 dígitos)
- [x] Redefinição de senha
- [x] JWT decode para extrair `role` (admin/user)
- [x] Auto-logout em 401
- [ ] OAuth Google (UI criada, endpoint não conectado)

### Dashboard
- [x] Cards de resumo: saldo, receitas, despesas, categorias
- [x] Gráfico de despesas por dia (BarChart)
- [x] Gráfico de despesas por categoria (PieChart)
- [x] Lista de transações recentes
- [x] Progresso das metas

### Transações
- [x] Listagem com filtro por tipo (receita/despesa) e período
- [x] Busca por descrição e categoria
- [x] Criar transação (tipo, categoria, valor, descrição, data)
- [x] Deletar transação
- [ ] Editar transação (UI não implementada)
- [ ] Importar CSV/OFX

### Categorias
- [x] Listagem com resumo visual por categoria
- [x] Criar / editar / deletar categoria
- [x] Gráfico de gastos por categoria

### Metas Financeiras
- [x] Criar meta (nome, valor alvo, já economizado, prazo, ícone, cor, categoria)
- [x] Progress bar visual por meta
- [x] Deletar meta
- [ ] Atualizar progresso de meta (aportar valor)

### Recorrências
- [x] Listar recorrências ativas
- [x] Criar recorrência (tipo, frequência, categoria, valor, descrição, datas)
- [x] Desativar recorrência
- [x] Gerar lançamentos futuros
- [ ] Editar recorrência existente

### Cartões de Crédito
- [x] Listar cartões com uso/limite
- [x] Criar / editar / deletar cartão
- [ ] Fatura do cartão (detalhamento de gastos por cartão)

### Pagamento / Assinatura
- [x] Checkout com cartão de crédito (campos completos)
- [x] Checkout com Pix (QR Code, copia-e-cola, polling de status)
- [x] Confirmação de pagamento
- [x] Tela de sucesso pós-assinatura
- [ ] Portal do cliente (cancelar, trocar plano, ver histórico)

### WhatsApp
- [x] UI de onboarding (3 passos: adicionar número → iniciar conversa → registrar despesas)
- [ ] Integração real (backend webhook + parsing por IA)

### Configurações / LGPD
- [x] Perfil (nome/email — readonly por ora)
- [x] Switches de notificação (WhatsApp, Vencimentos, Email)
- [x] Exportar dados pessoais (download JSON)
- [x] Excluir conta com confirmação (AlertDialog)
- [ ] Editar perfil (nome, telefone)
- [ ] Alterar senha

### Admin Panel
- [x] Dashboard com stats e gráficos (receita, atividade)
- [x] Gerenciar usuários (busca, filtro por plano, editar role, deletar)
- [x] Gerenciar empresas (nome, CNPJ, status, owner)
- [x] Gerenciar assinaturas
- [x] CRUD de planos
- [ ] Impersonar usuário
- [ ] Emitir reembolso
- [ ] Exportar relatórios

---

## Planos e Funcionalidades por Tier

| Feature | Free | Pro | Business |
|---|:---:|:---:|:---:|
| Preço | R$ 0 | R$ 97/mês | R$ 297/mês |
| Transações/mês | 50 | Ilimitado | Ilimitado |
| Categorias | 5 | Ilimitado | Ilimitado |
| Metas | 2 | Ilimitado | Ilimitado |
| Recorrências | 3 | Ilimitado | Ilimitado |
| Cartões | 2 | Ilimitado | Ilimitado |
| Relatórios | Básico | Avançado | Avançado |
| **IA — Categorização automática** | ✗ | ✓ | ✓ |
| **IA — Insights mensais** | ✗ | ✓ | ✓ |
| **IA — Resumo em linguagem natural** | ✗ | ✓ | ✓ |
| **IA — Previsão de gastos** | ✗ | ✗ | ✓ |
| **IA — Chat com suas finanças** | ✗ | ✗ | ✓ |
| **IA — Detecção de anomalias** | ✗ | ✗ | ✓ |
| Integração WhatsApp | ✗ | ✓ | ✓ |
| Exportar dados (CSV/OFX) | ✗ | ✓ | ✓ |
| API de integração | ✗ | ✗ | ✓ |
| Multi-usuário (família/equipe) | ✗ | ✗ | ✓ (até 5) |
| Suporte | Email | Prioritário | VIP |

---

## Features de IA Planejadas

### 1. Categorização Automática (Pro+)
Quando uma transação é criada sem categoria (ou via WhatsApp), a IA sugere a categoria com base na descrição.
- Input: descrição da transação + histórico do usuário
- Output: `categoryId` sugerido + score de confiança
- Modelo: Claude Haiku (custo baixo, latência baixa)

### 2. Insights Mensais (Pro+)
Análise automática gerada todo dia 1° do mês com comparativo do mês anterior.
- "Você gastou 23% a mais com alimentação este mês"
- "Sua categoria que mais cresceu foi Lazer (+R$ 340)"
- Entregue por: notificação no app + WhatsApp

### 3. Resumo em Linguagem Natural (Pro+)
Narrative summary das finanças do mês, gerado pelo LLM.
- "Em março você teve um mês equilibrado: receitas de R$ 5.200 e despesas controladas de R$ 4.100. O maior gasto foi com aluguel (R$ 1.500), seguido de mercado (R$ 800)..."

### 4. Assistente Financeiro / Chat (Business)
Chat conversacional onde o usuário pergunta sobre suas finanças e recebe respostas baseadas em dados reais.
- "Quanto gastei com restaurante nos últimos 3 meses?"
- "Se eu continuar nesse ritmo, quando vou atingir minha meta de R$ 10.000?"
- "Quais são meus maiores gastos recorrentes?"
- Streaming de resposta (SSE)

### 5. Previsão de Gastos (Business)
Com base no histórico dos últimos 6 meses, projeta o próximo mês por categoria.
- Output: gráfico de previsão vs realizado

### 6. Detecção de Anomalias (Business)
Identifica gastos incomuns e alerta o usuário.
- "Detectamos um gasto de R$ 800 em Viagens — 3x acima da sua média"
- Alerta push + WhatsApp

### 7. Parsing WhatsApp por IA (Pro+)
O usuário manda "gastei 45 no mercado" e a IA:
1. Extrai: tipo=EXPENSE, valor=45, descrição="mercado"
2. Sugere categoria automática: "Alimentação"
3. Cria a transação

---

## Endpoints API Mapeados no Frontend

```
POST   /v1/auth/login
POST   /v1/auth/register
POST   /v1/users/forgot-password
POST   /v1/users/reset-password

GET    /v1/categories
POST   /v1/categories
PATCH  /v1/categories/:id
DELETE /v1/categories/:id

GET    /v1/transactions
POST   /v1/transactions
PATCH  /v1/transactions/:id
DELETE /v1/transactions/:id

GET    /v1/summary/balance
GET    /v1/summary/categories

GET    /v1/recurrences/active
POST   /v1/recurrences
PUT    /v1/recurrences/:id
POST   /v1/recurrences/generate

GET    /v1/lgpd/export
DELETE /v1/lgpd

GET    /v1/goals
POST   /v1/goals
PATCH  /v1/goals/:id
DELETE /v1/goals/:id

GET    /v1/cards
POST   /v1/cards
PATCH  /v1/cards/:id
DELETE /v1/cards/:id

GET    /v1/plans
GET    /v1/plans/:id

POST   /v1/payments/intent
POST   /v1/payments/:id/confirm
GET    /v1/payments/:id/status

GET    /v1/admin/stats
GET    /v1/admin/revenue
GET    /v1/admin/clients
GET    /v1/admin/activity
GET    /v1/admin/users
GET    /v1/admin/companies
GET    /v1/admin/subscriptions
GET    /v1/admin/plans
```

---

## O que Falta Implementar no Frontend

| Área | Feature | Prioridade |
|---|---|---|
| Transações | Editar transação | Alta |
| Metas | Aportar valor (atualizar `current`) | Alta |
| IA | Tela de insights mensais | Alta |
| IA | Chat financeiro (Business) | Média |
| IA | Indicador de categorização automática na criação de transação | Alta |
| Perfil | Editar nome/telefone | Média |
| Segurança | Alterar senha | Média |
| Cartões | Fatura do cartão | Baixa |
| Pagamento | Portal do cliente (cancelar/trocar plano) | Média |
| WhatsApp | Onboarding real com número do usuário | Alta |
| Relatórios | Export CSV/OFX (Pro+) | Média |
| Admin | Impersonar usuário | Baixa |

---

## Tipos de Usuário

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  // necessário adicionar:
  plan: "free" | "pro" | "business";
  phone?: string;
  planExpiresAt?: string;
}
```

---

## Variáveis de Ambiente

```env
VITE_API_URL=                    # URL da API (vazio em dev usa proxy)
VITE_TEST_ADMIN_EMAIL=           # Credencial de teste admin
VITE_TEST_ADMIN_PASSWORD=
VITE_TEST_USER_EMAIL=            # Credencial de teste user
VITE_TEST_USER_PASSWORD=
VITE_GA_MEASUREMENT_ID=          # Google Analytics (não implementado)
VITE_MIXPANEL_TOKEN=             # Mixpanel (não implementado)
VITE_GOOGLE_CLIENT_ID=           # OAuth Google (não implementado)
```
