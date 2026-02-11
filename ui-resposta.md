# UI/UX - OrganizaAI Documentação Completa

---

# Visão Geral

## Objetivo da Tela

OrganizaAI é um assistente financeiro pessoal que permite registrar gastos pelo WhatsApp com categorização automática via IA. O painel administrativo (admin) permite que administradores gerenciem clientes, assinaturas e planos da plataforma.

## Problema do Usuário Resolvido

- Administrador não consegue visualizar métricas整体 da plataforma
- Dificuldade em gerenciar clientes e assinaturas
- Falta de controle sobre planos e preços
- Necessidade de visualizar receita e métricas de negócio

## Plataforma

- Web responsiva (desktop e tablet)
- Suporte a dark mode completo
- Layout administrativo com sidebar dedicado

---

# Usuário e Contexto

## Perfil do Usuário

**Administrador:**
- Pessoa responsável pelo gerenciamento da plataforma
- Precisa de visão geral do negócio
- Realiza operações de CRUD em clientes e planos
- Precisa de acesso rápido a métricas importantes

## Contexto de Uso

**Desktop/Tablet:**
- Gerenciamento diário de clientes
- Análise de métricas de receita
- Configuração de planos e preços
- Acompanhamento de assinaturas

---

# Fluxo de UX

## Fluxo Principal: Login Admin → Dashboard Admin

### Dashboard Admin
1. Administrador acessa `/admin`
2. Visualiza métricas principais (receita, clientes, assinaturas ativas)
3. Acessa clientes, assinaturas ou planos pelo sidebar
4. Realiza operações de gerenciamento

### Gestão de Clientes
1. Acessa página de clientes via sidebar
2. Filtra por nome, plano ou status
3. Visualiza lista de clientes
4. Ações via dropdown: editar, bloquear, excluir

### Gestão de Assinaturas
1. Acessa página de assinaturas via sidebar
2. Visualiza métricas de receita
3. Filtra por cliente, plano ou status
4. Ações: visualizar detalhes, alterar plano, pausar/cancelar

### Gestão de Planos
1. Acessa página de planos via sidebar
2. Visualiza cards de cada plano
3. Edita ou cria novos planos via dialog
4. Visualiza assinaturas por plano

## Estados Possíveis

### Loading
- Skeleton screens em todas as páginas
- Spinner em botões durante submit

### Vazio
- Clientes: "Nenhum cliente encontrado"
- Assinaturas: "Nenhuma assinatura"
- Planos: "Nenhum plano configurado"

### Erro
- Toast de erro com mensagem clara
- Opção de retry visível

### Sucesso
- Toast de confirmação após operações
- Feedback visual em ações completadas

---

# Hierarquia Visual

## Prioridade de Elementos

### Nível 1 - Primary Focus
- Cards de estatísticas principais (receita, clientes ativos)
- Tabela de dados principal
- Botões de ação principal (Novo Cliente, Nova Assinatura)

### Nível 2 - Secondary Focus
- Filtros e busca
- Badges de status
- Paginação

### Nível 3 - Supporting
- Metadata de tabelas
- Links secundários
- Ícones de ações

## Ordem de Leitura

1. Header com título e ações (top)
2. Cards de estatísticas (linha horizontal)
3. Filtros e busca
4. Tabela de dados principal
5. Paginação (rodapé)

---

# Layout e Estrutura

## Grid System

### Container
- Max-width: 100% (admin usa toda largura disponível)
- Padding: 24px (mobile: 16px)
- Header flutuante com border-bottom

### Columns
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 4 colunas (stats)

## Espaçamentos (8pt Grid)

| Escala | Pixels | Uso |
|--------|--------|-----|
| xs | 4px | Elementos inline |
| sm | 8px | Gap entre elementos relacionados |
| md | 16px | Card internal spacing |
| lg | 24px | Section gap |
| xl | 32px | Page section separation |

## Responsividade

### Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px

### Mobile-First
- Sidebar: Collapsible com trigger
- Grid: 1 → 2 → 4 colunas
- Headers: Flex-col em mobile, flex-row em tablet+

## Estrutura de Layout Admin

```
Admin Layout
├── Sidebar (collapsible="icon")
│   ├── Logo
│   ├── Navigation
│   │   ├── Dashboard (/admin)
│   │   ├── Clientes (/admin/clientes)
│   │   ├── Assinaturas (/admin/assinaturas)
│   │   └── Planos (/admin/planos)
│   └── User Info + Logout
└── Main Content Area
    ├── Page Content (sem header extra)
    │   ├── Stats Grid (4 cards)
    │   ├── Filters Card
    │   └── Data Table
    └── Pagination (se necessário)
```

---

# Componentes de UI

## AdminDashboard

```typescript
interface StatCardProps {
  stat: {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: LucideIcon;
    color: string;
    bgColor: string;
  };
}
```

**Responsabilidade:** Exibir métrica individual do admin
**Layout:** Card com ícone, título, valor e variação

## AdminUsers

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Business";
  status: "Ativo" | "Pendente" | "Bloqueado" | "Trial";
  lastLogin: string;
  createdAt: string;
}
```

**Responsabilidade:** Lista de clientes com filtros e ações
**Componentes:**
- Search input
- Select filters (plano, status)
- Table com avatar, badges, actions dropdown
- Pagination
- Dialog para novo cliente

## AdminSubscriptions

```typescript
interface Subscription {
  id: string;
  user: { name: string; email: string; avatar: string };
  plan: "Free" | "Pro" | "Business";
  amount: number;
  interval: string;
  status: "ativa" | "trial" | "cancelada" | "atrasada" | "inativa";
  nextBilling: string;
  paymentMethod: string;
}
```

**Responsabilidade:** Gerenciamento de assinaturas
**Componentes:**
- Stats cards (receita, ativas, trial, atrasadas)
- Search e filtros
- Table com status badges coloridos
- Dropdown ações (visualizar, alterar plano, pausar, cancelar)

## AdminPlans

```typescript
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  subscribers: number;
  mrr: number;
  icon: LucideIcon;
  features: { name: string; included: boolean }[];
  popular?: boolean;
}
```

**Responsabilidade:** Gestão de planos
**Componentes:**
- Tabs (Planos / Assinaturas)
- Plan cards com pricing e features
- Dialog criar/editar plano
- Table de assinaturas por plano

---

# Estados Visuais

## Cards Admin

### Default
```
bg-card/50 border-0 shadow-sm
border-radius: lg (12px)
transition: all 200ms ease
```

### Hover
```
bg-card/80
shadow-md
```

## Badges Status

### Ativo (success)
```
bg-emerald-500/10 text-emerald-600 border-emerald-200
dot indicator: w-1.5 h-1.5 rounded-full bg-emerald-500
```

### Trial (info)
```
bg-blue-500/10 text-blue-600 border-blue-200
```

### Pendente (warning)
```
bg-amber-500/10 text-amber-600 border-amber-200
```

### Bloqueado/Inadimplente (destructive)
```
bg-red-500/10 text-red-600 border-red-200
```

### Cancelada/Inativa (muted)
```
bg-slate-500/10 text-slate-600 border-slate-200
```

## Plan Badges

### Free
```
bg-muted text-muted-foreground
```

### Pro
```
bg-blue-500/10 text-blue-600 border-blue-200
```

### Business
```
bg-violet-500/10 text-violet-600 border-violet-200
```

## Tables

### Row Default
```
border-muted/50
hover:bg-muted/30
transition: bg 150ms ease
```

### Header
```
text-xs uppercase tracking-wider
text-muted-foreground font-medium
border-muted/50
```

---

# Acessibilidade (A11Y)

## Requisitos WCAG 2.1 AA

### Contraste Mínimo
```
Textos principais: 4.5:1 mínimo
Badges: 3:1 mínimo
```

### Foco Visível
```
outline: 2px solid var(--ring)
outline-offset: 2px
```

### Labels e ARIA

**Search:**
```jsx
<Input aria-label="Buscar por nome ou email" />
```

**Filters:**
```jsx
<Select aria-label="Filtrar por plano" />
```

**Actions:**
```jsx
<DropdownMenu>
  <DropdownMenuTrigger aria-label="Ações do cliente" />
```

**Buttons:**
```jsx
<Button aria-label="Novo cliente" />
<Button aria-label="Exportar dados" />
```

### Navegação por Teclado
```
Tab: Próximo elemento focalizável
Enter/Space: Ativa elementos
Escape: Fecha modals, dropdowns
Arrow keys: Navegação em selects
```

### Redução de Movimento
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# UX Writing

## Títulos e Headers

### Dashboard Admin
```
"Dashboard" - título principal
"Visão geral da sua plataforma" - subtitle
```

### Clientes
```
"Clientes" - título
"Gerencie os clientes da plataforma" - subtitle
```

### Assinaturas
```
"Assinaturas" - título
"Gerencie as assinaturas da plataforma" - subtitle
```

### Planos
```
"Gestão de Planos" - título
"Configure planos e gerencie assinaturas" - subtitle
```

## Labels

### Buttons
```
"Novo cliente"
"Nova assinatura"
"Novo plano"
"Exportar"
"Salvar"
"Cancelar"
"Editar"
"Excluir"
"Bloquear"
"Ativar"
```

### Filters
```
"Buscar por nome ou email..."
"Plano" (select)
"Status" (select)
"Todos os planos"
"Todos os status"
```

### Table Headers
```
Cliente
Plano
Status
Último acesso
Criado em
Próxima cobrança
Valor
```

## Empty States

```
Clientes: "Nenhum cliente encontrado"
Assinaturas: "Nenhuma assinatura encontrada"
Planos: "Nenhum plano configurado"
```

## Mensagens de Erro

```
"Email ou senha inválidos"
"Não foi possível salvar as alterações"
"Erro de conexão"
```

## Mensagens de Sucesso

```
"Cliente criado com sucesso!"
"Assinatura atualizada!"
"Plano salvo com sucesso!"
"Operação realizada com sucesso!"
```

---

# Regras e Restrições

## O Que NÃO Fazer

1. **Não usar cores fixas para status**
   - Usar classes semânticas (success, warning, destructive)

2. **Não exceder 6 colunas na tabela**
   - Manter informações essenciais visíveis
   - Usar tooltip para metadata adicional

3. **Não mostrar mais de 10 linhas sem paginação**
   - Usar paginação ou scroll infinito

4. **Não bloquear ação sem confirmação**
   - Usar dialog de confirmação para ações destrutivas

5. **Não usar skeleton em elementos pequenos**
   - Skeleton apenas para seções inteiras

## Armadilhas a Evitar

### Performance
- Evitar re-render desnecessário de tabelas
- Usar useMemo para filtros e ordenação

### Mobile
- Tabelas: permitir scroll horizontal
- Dropdowns: garantir que não saiam da tela
- Touch targets: mínimo 44x44px

### Dark Mode
- Não usar cores claras demais
- Manter contraste adequado

---

# Critérios de Sucesso

## Checklist de Implementação

### Funcional
- [ ] Filtros funcionam corretamente
- [ ] Busca filtra por nome e email
- [ ] Dropdown ações abre corretamente
- [ ] Dialogs abrem e fecham
- [ ] Paginação funciona

### Visual
- [ ] Alinhamento consistente
- [ ] Espaçamento uniforme (8pt grid)
- [ ] Badges coloridos corretamente
- [ ] Responsividade fluida

### Acessibilidade
- [ ] Contraste passa WCAG AA
- [ ] Foco visível em elementos interativos
- [ ] Keyboard navigation completa
- [ ] ARIA labels quando necessário

---

# Design System Admin

## Cores Status

```
Success (ativa):  emerald-500
Warning (trial):  blue-500
Warning (pendente): amber-500
Danger (bloqueado): red-500
Muted (inativa):  slate-500
```

## Plan Colors

```
Free:      muted
Pro:       blue-500
Business:  violet-500
```

## Tipografia

```
Títulos página:    text-2xl font-bold tracking-tight
Títulos seção:    text-lg font-semibold
Texto corpo:      text-sm
Metadata:         text-xs text-muted-foreground
```

---

# Especificações por Página Admin

## /admin (Dashboard)

### Stats Grid (4 cards)
1. Receita Mensal (MRR)
2. Total de Clientes
3. Clientes Ativos
4. Taxa de Conversão

### Charts
- Área chart de receita mensal
- Atividade recente (lista)

### Recent Clients Table
- Últimos 5 clientes cadastrados
- Link para página de clientes

---

## /admin/clientes

### Stats Cards (4 cards)
1. Total
2. Ativos
3. Pendentes
4. Bloqueados

### Filters
- Search input
- Select plano
- Select status

### Actions Header
- Exportar
- Novo cliente (dialog)

### Table Columns
- Cliente (avatar + nome + email)
- Plano
- Status
- Último acesso
- Criado em
- Ações (dropdown)

---

## /admin/assinaturas

### Stats Cards (4 cards)
1. Receita Mensal
2. Assinaturas Ativas
3. Em Trial
4. Atrasadas

### Filters
- Search input
- Select plano
- Select status

### Actions Header
- Exportar
- Nova assinatura (dialog)

### Table Columns
- Cliente
- Plano
- Valor
- Status
- Próxima cobrança
- Ações (dropdown)

---

## /admin/planos

### Stats Cards (3 cards)
1. MRR Total
2. Total Assinantes
3. Ticket Médio

### Tabs
- Planos
- Assinaturas

### Plan Cards (Free, Pro, Business)
- Nome e descrição
- Preço
- Métricas (assinantes, MRR)
- Features list com check/cross
- Badges (Popular)
- Ações (editar, desativar)

### Dialogs
- Criar plano
- Editar plano

---

**Última atualização:** 11 de Fevereiro de 2026
**Versão:** 2.1.0
**Status:** Completo para implementação admin
**Autor:** Agente UI/UX
