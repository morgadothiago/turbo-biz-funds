# Plano de Melhorias - OrganizaAI (Frontend Only)

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Escopo:** Melhorias no Frontend (sem Backend)  
**Pré-requisitos:** React 18, TypeScript, Vite

---

## 📋 Visão Geral

Este documento apresenta um plano de melhorias incrementais para a aplicação frontend do OrganizaAI. Todas as melhorias podem ser implementadas mantendo o estado atual de dados mock/simulados, sem necessidade de backend.

**Nota:** Algumas melhorias são标注adas como "Backend Required" - estas devem ser implementadas quando o backend estiver disponível.

---

## 🎯 Prioridades e Cronograma Sugerido

| Fase | Escopo | Duração | Impacto |
|------|---------|---------|---------|
| **Fase 1** | Arquitetura de Estado | 1 semana | Alto |
| **Fase 2** | Componentes & UI | 2 semanas | Alto |
| **Fase 3** | Performance | 1 semana | Médio |
| **Fase 4** | Qualidade & DX | 1 semana | Médio |
| **Fase 5** | Funcionalidades | 2 semanas | Alto |

---

## 🚀 Fase 1: Arquitetura de Estado

### 1.1 Implementar Zustand Store Global

**Problema Atual:** Cada página tem seus próprios dados mock em useState. Sem persistência entre navegações.

**Solução:** Criar store global com Zustand para gerenciar estado de negócio.

```bash
# Install Zustand
npm install zustand
```

**Arquivo:** `src/store/index.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface Card {
  id: string;
  name: string;
  lastFourDigits: string;
  brand: string;
  limit: number;
  currentSpend: number;
}

// Store
interface AppState {
  // Transactions
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  removeTransaction: (id: string) => void;
  
  // Categories
  categories: Category[];
  addCategory: (c: Category) => void;
  
  // Goals
  goals: Goal[];
  addGoal: (g: Goal) => void;
  updateGoalProgress: (id: string, amount: number) => void;
  
  // Cards
  cards: Card[];
  addCard: (c: Card) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial mock data
      transactions: [],
      categories: [],
      goals: [],
      cards: [],
      
      addTransaction: (t) => set((state) => ({
        transactions: [t, ...state.transactions]
      })),
      
      removeTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      
      addCategory: (c) => set((state) => ({
        categories: [...state.categories, c]
      })),
      
      addGoal: (g) => set((state) => ({
        goals: [...state.goals, g]
      })),
      
      updateGoalProgress: (id, amount) => set((state) => ({
        goals: state.goals.map(g => 
          g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
        )
      })),
      
      addCard: (c) => set((state) => ({
        cards: [...state.cards, c]
      })),
    }),
    {
      name: 'organizaai-storage',
    }
  )
);
```

**Arquivo:** `src/store/mock-data.ts`

```typescript
// Dados iniciais mock para popular o store
import type { Transaction, Category, Goal, Card } from './index';

export const initialTransactions: Transaction[] = [
  { id: '1', description: 'Supermercado Extra', category: 'Alimentação', date: '06/02/2026', amount: -245.50, type: 'expense', icon: '🛒' },
  { id: '2', description: 'Salário', category: 'Renda', date: '05/02/2026', amount: 5200.00, type: 'income', icon: '💰' },
  { id: '3', description: 'Uber - Centro', category: 'Transporte', date: '05/02/2026', amount: -28.90, type: 'expense', icon: '🚗' },
  { id: '4', description: 'Netflix', category: 'Lazer', date: '04/02/2026', amount: -39.90, type: 'expense', icon: '🎬' },
  { id: '5', description: 'Conta de Luz', category: 'Contas', date: '03/02/2026', amount: -180.00, type: 'expense', icon: '💡' },
  { id: '6', description: 'Freelance Design', category: 'Renda', date: '02/02/2026', amount: 850.00, type: 'income', icon: '💻' },
];

export const initialCategories: Category[] = [
  { id: '1', name: 'Alimentação', icon: '🍔', color: '#FF6B6B', type: 'expense' },
  { id: '2', name: 'Transporte', icon: '🚗', color: '#4ECDC4', type: 'expense' },
  { id: '3', name: 'Lazer', icon: '🎬', color: '#9B59B6', type: 'expense' },
  { id: '4', name: 'Contas', icon: '💡', color: '#F39C12', type: 'expense' },
  { id: '5', name: 'Renda', icon: '💰', color: '#2ECC71', type: 'income' },
];

export const initialGoals: Goal[] = [
  { id: '1', name: 'Viagem para Disney', targetAmount: 15000, currentAmount: 8500, deadline: '15/12/2026', icon: '🎢' },
  { id: '2', name: 'Novo Carro', targetAmount: 80000, currentAmount: 23000, deadline: '01/01/2028', icon: '🚙' },
];

export const initialCards: Card[] = [
  { id: '1', name: 'Nubank', lastFourDigits: '4242', brand: 'Mastercard', limit: 10000, currentSpend: 2450 },
  { id: '2', name: 'Itaú', lastFourDigits: '8888', brand: 'Visa', limit: 5000, currentSpend: 1200 },
];
```

**Arquivo:** `src/store/index.ts` (atualizado com dados iniciais)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTransactions, initialCategories, initialGoals, initialCards } from './mock-data';

export interface Transaction { /* ... same as above */ }
export interface Category { /* ... same as above */ }
export interface Goal { /* ... same as above */ }
export interface Card { /* ... same as above */ }

interface AppState {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  removeTransaction: (id: string) => void;
  // ... other methods
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initialize with mock data
      transactions: initialTransactions,
      categories: initialCategories,
      goals: initialGoals,
      cards: initialCards,
      
      addTransaction: (t) => set((state) => ({
        transactions: [t, ...state.transactions]
      })),
      
      // ... other methods
    }),
    {
      name: 'organizaai-storage',
    }
  )
);
```

### 1.2 Configurar React Query Corretamente

**Problema:** React Query está configurado mas não é usado para nada.

**Solução:** Preparar hooks de API para quando o backend estiver disponível.

**Arquivo:** `src/hooks/useApi.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiEndpoints } from '@/lib/api/client';
import { useStore, type Transaction, type Category, type Goal, type Card } from '@/store';

// ===== TRANSACTIONS =====

export function useTransactions() {
  // Por agora, retorna do store
  // Backend Required: usar useQuery quando API estiver disponível
  const transactions = useStore((s) => s.transactions);
  
  return {
    data: transactions,
    isLoading: false,
    isError: false,
  };
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  const addTransaction = useStore((s) => s.addTransaction);
  
  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      // Backend Required: api.post(apiEndpoints.transactions.create, transaction)
      // Por agora, salva no store local
      addTransaction(transaction);
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const removeTransaction = useStore((s) => s.removeTransaction);
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Backend Required: api.delete(apiEndpoints.transactions.delete(id))
      removeTransaction(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

// ===== CATEGORIES =====

export function useCategories() {
  const categories = useStore((s) => s.categories);
  return { data: categories, isLoading: false };
}

export function useAddCategory() {
  const queryClient = useQueryClient();
  const addCategory = useStore((s) => s.addCategory);
  
  return useMutation({
    mutationFn: async (category: Category) => {
      addCategory(category);
      return category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// ===== GOALS =====

export function useGoals() {
  const goals = useStore((s) => s.goals);
  return { data: goals, isLoading: false };
}

export function useAddGoal() {
  const queryClient = useQueryClient();
  const addGoal = useStore((s) => s.addGoal);
  
  return useMutation({
    mutationFn: async (goal: Goal) => {
      addGoal(goal);
      return goal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

// ===== CARDS =====

export function useCards() {
  const cards = useStore((s) => s.cards);
  return { data: cards, isLoading: false };
}

export function useAddCard() {
  const queryClient = useQueryClient();
  const addCard = useStore((s) => s.addCard);
  
  return useMutation({
    mutationFn: async (card: Card) => {
      addCard(card);
      return card;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}
```

### 1.3 Criar Tipos Compartilhados

**Problema:** Tipos definidos em múltiplos lugares.

**Solução:** Centralizar todos os tipos em um único local.

**Arquivo:** `src/types/index.ts`

```typescript
// User & Auth
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Transactions
export interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  icon: string;
}

// Categories
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

// Goals
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

// Cards
export interface Card {
  id: string;
  name: string;
  lastFourDigits: string;
  brand: string;
  limit: number;
  currentSpend: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
}

// API Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

---

## 🎨 Fase 2: Componentes & UI

### 2.1 Criar Componentes Reutilizáveis

**Estrutura de componentes a criar:**

```
src/components/
├── common/
│   ├── EmptyState/
│   │   ├── EmptyState.tsx
│   │   ├── EmptyState.module.css
│   │   └── index.ts
│   ├── LoadingSpinner/
│   │   └── LoadingSpinner.tsx
│   └── ErrorMessage/
│       └── ErrorMessage.tsx
├── transactions/
│   ├── TransactionItem.tsx
│   ├── TransactionForm.tsx
│   └── TransactionFilters.tsx
├── categories/
│   ├── CategoryBadge.tsx
│   └── CategorySelect.tsx
├── goals/
│   ├── GoalCard.tsx
│   └── GoalProgress.tsx
└── cards/
    ├── CardItem.tsx
    └── CardForm.tsx
```

**Exemplo - EmptyState Component:**

```tsx
// src/components/common/EmptyState/EmptyState.tsx
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
```

### 2.2 Refatorar Páginas para Usar Store

**Antes (src/pages/Transactions.tsx):**

```tsx
// ❌ RUIM - dados em useState local
const [transactions, setTransactions] = useState(TRANSACTIONS);
```

**Depois:**

```tsx
// ✅ BOM - dados do store global
import { useTransactions } from '@/hooks/useApi';
import { EmptyState } from '@/components/common/EmptyState';
import { TransactionItem } from '@/components/transactions/TransactionItem';

export function TransactionsPage() {
  const { data: transactions, isLoading } = useTransactions();
  
  if (isLoading) return <TransactionsPageSkeleton />;
  
  if (!transactions?.length) {
    return (
      <EmptyState
        icon={Receipt}
        title="Nenhuma transação"
        description="Você ainda não tem transações cadastradas."
        actionLabel="Adicionar Transação"
        onAction={() => {}}
      />
    );
  }
  
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}
```

### 2.3 Criar Componente TransactionItem

**Arquivo:** `src/components/transactions/TransactionItem.tsx`

```tsx
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/types';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

export function TransactionItem({ transaction, onClick, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  
  return (
    <Card 
      className="p-4 hover:shadow-md transition-all cursor-pointer border-border"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-xl">
            {transaction.icon}
          </div>
          <div>
            <p className="font-medium text-foreground">{transaction.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="bg-background text-xs">
                {transaction.category}
              </Badge>
              <span>{transaction.date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${isIncome ? 'text-success' : ''}`}>
            {isIncome ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
          </span>
          {isIncome ? (
            <ArrowUpRight className="w-4 h-4 text-success" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>
    </Card>
  );
}
```

### 2.4 Criar TransactionForm com React Hook Form + Zod

**Arquivo:** `src/components/transactions/TransactionForm.tsx`

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que 0'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
  type: z.enum(['income', 'expense']),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<TransactionFormData>;
}

export function TransactionForm({ onSubmit, onCancel, defaultValues }: TransactionFormProps) {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Supermercado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  placeholder="0,00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
          <Button type="submit" className="flex-1">Salvar</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        </div>
      </form>
    </Form>
  );
}
```

### 2.5 Implementar Error Boundary

**Arquivo:** `src/components/common/ErrorBoundary/ErrorBoundary.tsx`

```tsx
import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, etc)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold mb-2">Algo deu errado</h2>
          <p className="text-muted-foreground mb-6">
            Ocorreu um erro inesperado. Por favor, tente novamente.
          </p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Tentar Novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Uso em AppShell.tsx:**

```tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary/ErrorBoundary';

// No componente AppRoutes:
<ErrorBoundary>
  <Routes>
    {/* ... */}
  </Routes>
</ErrorBoundary>
```

---

## ⚡ Fase 3: Performance

### 3.1 Implementar Virtualização de Lista

**Instalação:**

```bash
npm install @tanstack/react-virtual
```

**Arquivo:** `src/components/transactions/TransactionsList.tsx`

```tsx
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TransactionItem } from './TransactionItem';
import type { Transaction } from '@/types';

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88, // Altura estimada do card
    overscan: 5,
  });

  return (
    <div 
      ref={parentRef} 
      className="h-[600px] overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const transaction = transactions[virtualRow.index];
          return (
            <div
              key={transaction.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="px-1"
            >
              <TransactionItem transaction={transaction} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 3.2 Otimizar Componentes com useMemo/useCallback

**Arquivo:** `src/pages/Transactions.tsx` (versão otimizada)

```tsx
import { useMemo, useCallback } from 'react';
import { useTransactions, useDeleteTransaction } from '@/hooks/useApi';
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { TransactionsFilters } from '@/components/transactions/TransactionsFilters';
import { toast } from 'sonner';

export function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteMutation = useDeleteTransaction();
  
  // Filtragem - useMemo para evitar recálculos
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, filterType]);
  
  // Handlers - useCallback para estabilidade
  const handleDelete = useCallback((id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Transação removida'),
      onError: () => toast.error('Erro ao remover transação'),
    });
  }, [deleteMutation]);
  
  const handleRefresh = useCallback(() => {
    // Implementar refresh
    toast.success('Dados atualizados');
  }, []);

  if (isLoading) return <TransactionsPageSkeleton />;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Transações"
        subtitle="Gerencie todas as suas movimentações"
        action={{
          label: 'Nova Transação',
          onClick: () => {/* abrir modal */}
        }}
      />
      
      <TransactionsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
      />
      
      <TransactionsList 
        transactions={filteredTransactions}
      />
    </div>
  );
}
```

### 3.3 Implementar Lazy Loading para Componentes Pesados

**Arquivo:** `src/components/charts/DashboardCharts.tsx` (lazy load)

```tsx
// Não importar no topo!
// Usar lazy import onde necessário

export function DashboardCharts() {
  const [showCharts, setShowCharts] = useState(false);
  
  const LazyCharts = useMemo(() => {
    if (!showCharts) return null;
    
    // Dynamic import - só carrega quando necessário
    return React.lazy(() => import('./ChartsImplementation'));
  }, [showCharts]);
  
  return (
    <div>
      <Button onClick={() => setShowCharts(true)}>
        Ver Gráficos
      </Button>
      
      {showCharts && LazyCharts && (
        <Suspense fallback={<ChartsSkeleton />}>
          <LazyCharts />
        </Suspense>
      )}
    </div>
  );
}
```

---

## 🧪 Fase 4: Qualidade & Developer Experience

### 4.1 Criar Style Guide de Componentes

**Arquivo:** `docs/STYLE_GUIDE.md`

```markdown
# Style Guide - OrganizaAI

## Estrutura de Arquivos

```
src/components/
└── {ComponentName}/
    ├── {ComponentName}.tsx      # Componente principal
    ├── {ComponentName}.test.tsx # Testes
    ├── {ComponentName}.module.css # Estilos (se necessário)
    └── index.ts                 # Exports
```

## Regras de Componentização

### Quando criar um novo componente?

1. **Reutilização** - Se usado em 2+ lugares
2. **Complexidade** - Se tem > 50 linhas de JSX
3. **Responsabilidade única** - Se faz uma coisa específica
4. **Testabilidade** - Se pode ser testado isoladamente

### Tamanho máximo de componente

- **Componente de página:** 200 linhas máximo
- **Componente de UI:** 100 linhas máximo
- Se exceder, decompor em sub-componentes

## Nomenclatura

- **Arquivos:** PascalCase (`TransactionItem.tsx`)
- **Componentes:** PascalCase (`export function TransactionItem`)
- **Funções utilitárias:** camelCase (`formatCurrency`)
- **Constantes:** UPPER_SNAKE_CASE (`const MAX_AMOUNT = 10000`)
- **Types/Interfaces:** PascalCase com prefix (`interface TransactionProps`)

## Imports

```tsx
// 1. React imports
import { useState, useEffect } from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// 3. UI components (shadcn)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Shared components
import { EmptyState } from '@/components/common/EmptyState';

// 5. Feature components
import { TransactionItem } from '@/components/transactions/TransactionItem';

// 6. Hooks
import { useTransactions } from '@/hooks/useApi';

// 7. Types
import type { Transaction } from '@/types';

// 8. Utils
import { formatCurrency } from '@/lib/utils';
```

## Estados de Componente

Sempre implementar:

```tsx
// Loading state
if (isLoading) return <Skeleton />;

// Error state  
if (isError) return <ErrorMessage />;

// Empty state
if (!data?.length) return <EmptyState />;

// Success state
return <DataList data={data} />;
```

## Testes

### O que testar?

1. **Renderização** - Componente renderiza sem erro
2. **Props** - Renderiza corretamente com diferentes props
3. **Eventos** - handlers são chamados com parâmetros corretos
4. **Estados** - Estados de loading/error/empty

### Exemplo

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionItem } from './TransactionItem';

describe('TransactionItem', () => {
  const mockTransaction = {
    id: '1',
    description: 'Test',
    amount: 100,
    type: 'expense' as const,
    // ...
  };
  
  it('renders correctly', () => {
    render(<TransactionItem transaction={mockTransaction} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<TransactionItem transaction={mockTransaction} onClick={handleClick} />);
    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).toHaveBeenCalledWith('1');
  });
});
```
```

### 4.2 Configurar Husky com Commits Semânticos

**Arquivo:** `.husky/commit-msg`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
```

**Arquivo:** `commitlint.config.js`

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Bug fix
        'docs',     // Documentação
        'style',    // Formatação
        'refactor', // Refatoração
        'test',     // Testes
        'chore',    // Tarefas diversas
        'perf',     // Performance
        'ci',       // CI/CD
      ],
    ],
    'subject-full-max-length': [2, 'always', 100],
  },
};
```

### 4.3 Criar Scripts de Desenvolvimento Úteis

**Arquivo:** `package.json - scripts adicionais`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "analyze": "vite build --analyze",
    "clean": "rm -rf node_modules dist"
  }
}
```

---

## 🔧 Fase 5: Funcionalidades

### 5.1 Implementar Sistema de Toast Centralizado

**Arquivo:** `src/lib/toast.ts`

```typescript
import { toast as sonnerToast, type ToastOptions } from 'sonner';

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'bottom-right',
};

export const toast = {
  success: (message: string, options?: ToastOptions) => 
    sonnerToast.success(message, { ...defaultOptions, ...options }),
  
  error: (message: string, options?: ToastOptions) => 
    sonnerToast.error(message, { ...defaultOptions, ...options }),
  
  warning: (message: string, options?: ToastOptions) => 
    sonnerToast.warning(message, { ...defaultOptions, ...options }),
  
  info: (message: string, options?: ToastOptions) => 
    sonnerToast.info(message, { ...defaultOptions, ...options }),
  
  loading: (message: string, options?: ToastOptions) => 
    sonnerToast.loading(message, { ...defaultOptions, ...options }),
  
  promise: <T>(
    promise: Promise<T>, 
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => sonnerToast.promise(promise, messages),
};
```

### 5.2 Implementar Sistema de Modais Globais

**Arquivo:** `src/contexts/ModalContext.tsx`

```tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalConfig {
  title?: string;
  description?: string;
  content: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'default' | 'destructive';
}

interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const openModal = useCallback((newConfig: ModalConfig) => {
    setConfig(newConfig);
  }, []);

  const closeModal = useCallback(() => {
    if (config?.onCancel) config.onCancel();
    setConfig(null);
  }, [config]);

  const handleConfirm = useCallback(() => {
    if (config?.onConfirm) config.onConfirm();
    setConfig(null);
  }, [config]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      
      <Dialog open={!!config} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent>
          {config?.title && (
            <DialogHeader>
              <DialogTitle>{config.title}</DialogTitle>
              {config.description && (
                <DialogDescription>{config.description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          
          {config?.content}
          
          {(config?.confirmLabel || config?.cancelLabel) && (
            <DialogFooter>
              {config.cancelLabel && (
                <Button variant="outline" onClick={closeModal}>
                  {config.cancelLabel}
                </Button>
              )}
              {config.confirmLabel && (
                <Button 
                  variant={config.confirmVariant === 'destructive' ? 'destructive' : 'default'}
                  onClick={handleConfirm}
                >
                  {config.confirmLabel}
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
```

**Uso:**

```tsx
import { useModal } from '@/contexts/ModalContext';

function TransactionsPage() {
  const { openModal } = useModal();
  
  const handleDelete = (id: string) => {
    openModal({
      title: 'Excluir Transação',
      description: 'Tem certeza que deseja excluir esta transação?',
      content: <p>Esta ação não pode ser desfeita.</p>,
      confirmLabel: 'Excluir',
      confirmVariant: 'destructive',
      onConfirm: () => deleteTransaction(id),
    });
  };
}
```

### 5.3 Implementar Dashboard Stats Reutilizável

**Arquivo:** `src/components/dashboard/DashboardStats.tsx`

```tsx
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardStats } from '@/types';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      title: 'Receitas',
      value: stats.totalIncome,
      icon: ArrowUpRight,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Despesas',
      value: stats.totalExpense,
      icon: ArrowDownRight,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Saldo',
      value: stats.balance,
      icon: Wallet,
      color: stats.balance >= 0 ? 'text-success' : 'text-destructive',
      bgColor: stats.balance >= 0 ? 'bg-success/10' : 'bg-destructive/10',
    },
    {
      title: 'Taxa de Economia',
      value: `${stats.savingsRate}%`,
      icon: PiggyBank,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  R$ {Math.abs(card.value).toFixed(2)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## ✅ Checklist de Implementação

Use este checklist para acompanhar o progresso:

### Fase 1: Arquitetura de Estado
- [ ] Instalar Zustand
- [ ] Criar store com tipos definidos
- [ ] Criar mock data inicial
- [ ] Configurar persistência localStorage
- [ ] Criar hooks useApi (store-based)
- [ ] Centralizar tipos em src/types/index.ts

### Fase 2: Componentes & UI
- [ ] Criar EmptyState component
- [ ] Criar LoadingSpinner component
- [ ] Criar ErrorMessage component
- [ ] Criar TransactionItem component
- [ ] Criar TransactionForm com Zod
- [ ] Criar TransactionsFilters component
- [ ] Implementar ErrorBoundary
- [ ] Refatorar TransactionsPage para usar store
- [ ] Refatorar outras páginas para usar store

### Fase 3: Performance
- [ ] Implementar TransactionsList com virtualização
- [ ] Adicionar useMemo/useCallback onde necessário
- [ ] Implementar lazy loading para gráficos
- [ ] Analisar bundle com vite build --analyze

### Fase 4: Qualidade & DX
- [ ] Criar STYLE_GUIDE.md
- [ ] Configurar commitlint com Conventional Commits
- [ ] Adicionar scripts úteis ao package.json
- [ ] Criar template de PR no GitHub

### Fase 5: Funcionalidades
- [ ] Implementar toast centralizado
- [ ] Implementar ModalContext
- [ ] Criar DashboardStats component
- [ ] Implementar sistema de filtros completo
- [ ] Adicionar validação Zod em todos os formulários

---

## 📚 Recursos e Referências

### Libraries Recomendadas

| Library | Versão | Uso |
|---------|--------|-----|
| zustand | ^5.0.0 | Estado global |
| @tanstack/react-query | ^5.0.0 | Server state (futuro) |
| @tanstack/react-virtual | ^3.0.0 | Virtualização |
| react-hook-form | ^7.0.0 | Forms |
| @hookform/resolvers | ^3.0.0 | Zod + React Hook Form |
| zod | ^3.0.0 | Validação |
| sonner | ^1.0.0 | Toast notifications |
| lucide-react | ^0.300.0 | Ícones |
| date-fns | ^3.0.0 | Datas |

### Fontes de Estudo

- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 🎯 Priorização Final

Se precisar escolher por onde começar, siga esta ordem:

1. **Zustand Store** - Base de tudo, facilita todas as outras tarefas
2. **Refatorar TransactionsPage** - Demonstra o padrão para outras páginas
3. **Error Boundary** - Melhora experiência em produção
4. **TransactionForm** - Funcionalidade essencial
5. **Virtualização** - Performance com muitos dados

---

**Próximos Passos:**

1. Revisar este documento
2. Discutir com a equipe
3. Começar pela Fase 1 (Zustand Store)
4. Implementar incrementalmente

---

*Documento criado para guiar o desenvolvimento de melhorias no frontend do OrganizaAI.*
*Versão: 1.0 - Fevereiro 2026*
