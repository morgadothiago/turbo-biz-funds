# Visão Geral

## Objetivo
Criar uma interface profissional, minimalista e acolhedora para o OrganizaAI - um assistente financeiro pessoal que permite registrar gastos pelo WhatsApp com categorização automática via IA.

## Problema Resolvido
Usuários abandonam planilhas e apps financeiros tradicionais por serem complexos, exigirem muito esforço de entrada de dados e terem interfaces frias. O OrganizaAI resolve isso com uma experiência conversacional via WhatsApp e uma interface web limpa para visualização.

## Plataforma
- Web responsiva (desktop e mobile)
- Progressive Web App (PWA ready)
- Suporte a dark mode

---

# Usuário e Contexto

## Perfil do Usuário
- Usuário comum brasileiro que usa WhatsApp diariamente
- Não é especialista em finanças
- Quer simplicidade e resultados rápidos
- Valoriza economia de tempo
- Prefere interfaces limpas e intuitivas

## Contexto de Uso
- **Desktop**: Visualização detalhada de relatórios, metas e planejamento
- **Mobile**: Registro rápido via WhatsApp, consultas breves de saldo
- **Desktop preferred**: Usuários tendem a usar mais o dashboard web para análise

---

# Fluxo de UX

## Landing Page (Index)
1. Usuário acessa página inicial
2. Vê proposta de valor principal (WhatsApp + IA)
3. Pode ir para Login ou Cadastro
4. Pode assistir vídeo demonstrativo

## Autenticação (Login/Cadastro)
1. Usuário acessa página de login
2. Insere credenciais ou usa Google OAuth
3. Sistema valida e autentica
4. Redireciona para dashboard

## Dashboard Principal
1. Usuário vê visão geral das finanças
2. Pode navegar para seções específicas via sidebar
3. Ações principais são claras e acessíveis

---

# Design System

## Cores

### Paleta Primária (Verde Acolhedora)
```
Primary: hsl(161, 34%, 37%)      #3F7F6B
Primary Light: hsl(149, 29%, 56%)  #6FAF8E
Success: hsl(149, 40%, 45%)       #Sucesso
Warning: hsl(38, 92%, 50%)        #Alertas
Destructive: hsl(0, 84%, 60%)    #Erros
```

### Background
```
Light: hsl(43, 28%, 95%)   #F6F4EF (Bege Areia)
Dark: hsl(161, 20%, 8%)     #Escuro Suave
```

### usage
- **Primary**: Botões principais, CTAs, elementos de navegação
- **Secondary**: Destaques secundários, tags, badges
- **Success**: Valores positivos, metas atingidas
- **Destructive**: Erros, valores negativos, alertas importantes
- **Background**: Cor base da aplicação (bege, não branco hospitalar)

## Tipografia

### Fontes
- **Sans**: Inter (corpo, formulários, textos)
- **Display**: Outfit (títulos, headlines)

### Hierarchy
```
h1: 2.5rem (40px) - Bold
h2: 2rem (32px) - Semibold
h3: 1.5rem (24px) - Semibold
h4: 1.25rem (20px) - Medium
body: 1rem (16px) - Regular
small: 0.875rem (14px) - Regular
caption: 0.75rem (12px) - Regular
```

## Espaçamento (8pt Grid)
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

## Bordas e Shadows
- **Radius**: 1rem (16px) para cards e botões grandes
- **Radius**: 0.75rem (12px) para elementos menores
- **Shadow**: Suave, difuso, sem bordas duras
- **Border**: hsl(43, 20%, 88%) - sutil

---

# Componentes de UI

## Botões (Button)

### Variantes
| Variante | Descrição | Uso |
|----------|-----------|-----|
| `hero` | Gradient verde, maior, glow | CTAs principais |
| `default` | Verde sólido | Ações primárias |
| `outline` | Borda verde, fundo transparente | Ações secundárias |
| `ghost` | Sem fundo, texto verde | Ações terciárias |
| `destructive` | Vermelho | Excluir, danger actions |

### Tamanhos
| Tamanho | Height | Padding | Uso |
|---------|--------|---------|-----|
| `sm` | 36px | px-3 | Badges, botões pequenos |
| `default` | 40px | px-4 | Botões padrão |
| `lg` | 48px | px-6 | CTAs, formulários |
| `xl` | 56px | px-8 | Hero sections |

### Estados
- **Hover**: brightness-110, subtle scale
- **Active**: scale-98
- **Disabled**: opacity-50, cursor-not-allowed
- **Loading**: Spinner + texto indicador

## Cards (Card)

### Estrutura
```
┌─────────────────────────────────────┐
│  Header (opcional)                  │
│    ├─ Title                         │
│    └─ Description                   │
├─────────────────────────────────────┤
│  Content                             │
├─────────────────────────────────────┤
│  Footer (opcional)                   │
└─────────────────────────────────────┘
```

### Propriedades
- Border radius: 1rem
- Border: 1px solid hsl(43, 20%, 88%)
- Shadow: subtle, card-like
- Background: white ou hsl(0, 0%, 100%)

## Inputs (Input)

### Estados
| Estado | Border | Icon | Feedback |
|--------|--------|------|----------|
| Default | hsl(43, 20%, 88%) | Cinza | None |
| Focus | Primary | Primary | Ring glow |
| Error | Destructive | Destructive | Mensagem |
| Disabled | Muted | Muted | Opacity 50 |

### Ícones
- Posição: Absolute left, centered vertically
- Tamanho: 5x5 (w-5 h-5)
- Cor: text-muted-foreground

## Sidebar

### Desktop (Expanded)
- Width: 280px
- Background: hsl(161, 34%, 20%) (Verde escuro)
- Text: hsl(43, 28%, 95%) (Off-white)
- Active: hsl(149, 29%, 56%) highlight + bg-[#25D366]/15

### Mobile (Collapsed)
- Width: 72px (ícones apenas)
- Expansível via Radix UI Sidebar

### Logotipo
- SVG com gradiente #25D366 to #128C7E
- Tamanho: 40x40px

---

# Layout e Estrutura

## Grid System

### Desktop (lg: 1024px+)
- Container: max-w-7xl (1280px), centered
- Grid columns: 12
- Sidebar: 280px fixed
- Main content: fluid

### Tablet (md: 768px - 1023px)
- Grid columns: 8
- Sidebar: collapsible
- Cards: 2 columns

### Mobile (< 768px)
- Grid columns: 4
- Sidebar: drawer/modal
- Cards: 1 column (stack)

## Spacing Scale
```
Page padding: p-6 (mobile), p-8 (desktop)
Section gap: space-y-8 (64px)
Card gap: gap-4 (16px)
Component internal: space-y-5 (20px)
```

---

# Hierarquia Visual

## Prioridade de Elementos

### Nível 1 - Primary Focus
- Headlines principais (h1)
- CTAs (botões hero)
- Valor principal do dashboard (saldo)
- Métricas principais

### Nível 2 - Secondary Focus
- Subtítulos (h2, h3)
- Cards de informação
- Elementos de navegação ativos
- Valores financeiros

### Nível 3 - Supporting
- Labels, descrições
- Metadata, datas
- Textos secundários
- Elementos de UI não interativos

## Ordem de Leitura
1. Logo + Navigation
2. Welcome message
3. Stats cards (3-4 métricas principais)
4. Charts (visualizações)
5. Lists (transações recentes)
6. CTAs secundários
7. Footer/Sidebar

---

# Estados Visuais

## Loading
- Skeletons para conteúdo sendo carregado
- Spinners para ações em progresso
- Progressive loading para listas

## Error
- Border: hsl(0, 84%, 60%)
- Text: hsl(0, 84%, 60%)
- Icon: X circle ou warning
- Toast notification para erros críticos

## Success
- Toast: verde claro (#25D366)
- Valor positivo: text-success
- Metas atingidas: badge verde

## Empty State
- Ilustração opcional
- Texto explicativo
- CTA para primeira ação

## Empty List
- "Nenhuma transação encontrada"
- Sugestão de primeira ação
- CTA opcional

---

# Acessibilidade (A11Y)

## Requisitos WCAG 2.1 AA

### Contraste
- Text on background: 4.5:1 mínimo
- Large text (18px+): 3:1 mínimo
- UI components: 3:1 mínimo

### Foco
- Outline: 2px solid hsl(161, 34%, 37%)
- Offset: 2px
- Visible em todos os elementos interativos

### Labels
- Todos os inputs com labels visíveis
- aria-label em ícones sem texto
- placeholder não substitui label

### Navegação por Teclado
- Tab ordem lógica
- Enter/Space para ativar
- Escape para fechar modais
- Arrow keys em comboboxes

### Redução de Movimento
- Respeitar `prefers-reduced-motion`
- Desabilitar animações heavy em mobile

---

# UX Writing

## Tom de Voz
- Profissional mas acessível
- Não técnico, claro para todos
- Positivo, encorajador
- Brasileiro, informal-friendly

## Labels e Textos

### Formulários
| Campo | Label | Placeholder |
|-------|-------|------------|
| Email | Email | seu@email.com |
| Password | Senha | Mínimo 6 caracteres |
| Name | Nome completo | Seu nome |

### Botões
| Ação | Texto |
|------|-------|
| Submit | Entrar / Continuar / Criar conta |
| Cancel | Cancelar |
| Secondary | Ver como funciona |

### Mensagens de Erro
| Cenário | Mensagem |
|---------|----------|
| Email obrigatório | Email é obrigatório |
| Email inválido | Por favor, insira um email válido |
| Senha curta | A senha deve ter no mínimo 6 caracteres |
| Credenciais inválidas | Email ou senha incorretos |

### Feedbacks
| Ação | Feedback |
|------|----------|
| Login sucesso | Login realizado com sucesso! |
| Logout | Sessão encerrada |
| Cadastro | Conta criada com sucesso! |

---

# Especificações por Página

## Landing Page (Index)

### Hero Section
- **Headline**: "Cansou de planilhas? Organize suas contas pelo WhatsApp"
- **Subhead**: "Você vive sua vida, a gente organiza seu dinheiro"
- **CTAs**: "Comece agora" (primary), "Ver como funciona" (outline)
- **Stats**: 3.000+ usuários, 500k+ gastos, 4.9 avaliação

### Vídeo Demo
- Thumbnail com placeholder
- Botão play centralizado
- Caption: "📱 Manda → 🤖 IA → 📊 Você"

### Conteúdo Secundário
- How it works (3 passos)
- Problema/Solução
- Pricing (se disponível)
- FAQ
- Testimonials

## Login Page

### Layout
- Centered card (max-w-md)
- Logo no topo
- Formulário com 2 campos
- Link para recuperação de senha
- Link para cadastro
- OAuth Google

### Validação
- Email: required + formato
- Password: required + mínimo 6 chars
- Feedback visual imediato
- Mensagens de erro em português

## Cadastro Page

### Wizard (2 passos)
1. **Dados pessoais**: nome, email, senha, confirmar senha
2. **Plano**: Free, Pro, Business (cards com pricing)

### Progress Indicator
- 2 steps visuais
- Ativo: bg-accent
- Inativo: bg-border

### Plan Selection
- Card com border highlight quando selecionado
- Badge "Popular" no Pro
- Checkmark quando selecionado

## Dashboard (UserDashboard)

### Welcome
- "Olá, [Nome]! 👋"
- Subtext contextual

### Stats Grid
- 4 cards: Saldo, Receitas, Despesas, Categorias
- Ícone + valor + variação %
- Variação com cor (verde=up, vermelho=down)

### Charts
- Linha: gastos por dia (mês)
- Pizza: gastos por categoria

### Lists
- Transações recentes (últimas 5)
- scrollable se necessário
- Click para detalhes

### Metas
- Progress bars
- Percentual de conclusão
- Valor atual / alvo

### WhatsApp CTA
- Card com gradient WhatsApp (#25D366)
- Texto explicativo
- Botão "Conectar WhatsApp"

---

# Regras e Restrições

## NÃO FAZER
- Usar cores sem significado semântico
- Criar hierarquia visual confusa
- Usar sombras duras ou pretas
- Deixar inputs sem labels
- Ignorar estados de loading
- Expor informações sensíveis
- Usar gradientes em texto de corpo
- Criar animações que causam enjoo

## Armadilhas a Evitar
- Sobrecarga de informação em uma tela
- Formulários longos sem progressão
- Cores demais (máximo 5 cores principais)
-Ícones inconsistentes (mix de styles)
- Mobile afterthought (design mobile-first)

---

# Critérios de Sucesso

## Visual
- [ ] Hierarquia clara em 3 segundos
- [ ] Cores consistentes em toda a app
- [ ] Espaçamento遵循 8pt grid
- [ ] Tipografia legível e consistente
- [ ] Dark mode funcional

## UX
- [ ] Usuário sabe onde clicar em 5 segundos
- [ ] Formulários completáveis em menos de 30 segundos
- [ ] Feedback claro para cada ação
- [ ] Navegação previsível
- [ ] Loading states presentes

## Acessibilidade
- [ ] Contraste adequado
- [ ] Foco visível
- [ ] Navegação por teclado
- [ ] Screen reader friendly
- [ ] Reduced motion support

## Performance
- [ ] First contentful paint < 1.5s
- [ ] Interactions em menos de 100ms
- [ ] No layout shift (CLS < 0.1)
- [ ] Imagens otimizadas

---

# Documentação de Componentes

## Arquitetura de Componentes

### Atoms (UI Primitives)
- Button, Input, Label, Card, Avatar, Badge, etc.
- shadcn/ui base components
- Located: `src/components/ui/`

### Molecules (Feature UI)
- StatCard, TransactionItem, GoalProgress
- Located: `src/features/dashboard/components/`

### Organisms (Page Sections)
- Header, Sidebar, StatsGrid
- Located: `src/components/[type]/`

### Templates (Page Layouts)
- UserLayout, AdminLayout, AuthLayout
- Located: `src/layouts/`

### Pages (Routes)
- Login, Cadastro, Dashboard
- Located: `src/pages/`

## Convenções de Nomenclatura
- PascalCase para componentes
- camelCase para props
- kebab-case para classes CSS
- Arquivo: `ComponentName.tsx`

## Props Interface
```typescript
interface ComponentNameProps {
  // Required
  title: string;
  // Optional
  variant?: "default" | "primary" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}
```

---

# Checklist de Implementação

## Before Start
- [ ] Instalar dependências: npm install
- [ ] Verificar acesso a variáveis de ambiente
- [ ] Configurar Git hooks (se disponível)

## During Development
- [ ] Seguir estrutura de pastas
- [ ] Usar design system colors
- [ ] Implementar estados de loading
- [ ] Testar responsividade
- [ ] Verificar a11y com axe-devtools

## Before Commit
- [ ] Lint: npm run lint
- [ ] Typecheck: npm run typecheck
- [ ] Testes: npm run test
- [ ] Build: npm run build

## QA Checklist
- [ ] Dark mode funcionando
- [ ] Formulários validados
- [ ] Loading states visíveis
- [ ] Error states claros
- [ ] Mobile responsive
- [ ] Keyboard navigation works
