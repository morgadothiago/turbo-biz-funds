# Arquitetura do OrganizaAI

## Visão Geral

O OrganizaAI é uma aplicação web de gestão financeira pessoal/despesas, construída com as melhores práticas de desenvolvimento React moderno.

## Stack Tecnológica

| Tecnologia | Versão | Propósito |
|-----------|---------|----------|
| React | 18.3 | Framework UI |
| TypeScript | 5.8 | Tipagem estática |
| Vite | 5.4 | Build tool |
| Tailwind CSS | 3.4 | Styling |
| shadcn/ui | - | Componentes UI |
| React Router | 6.30 | Roteamento |
| TanStack Query | 5.83 | Data fetching |
| Zod | 3.25 | Validação |
| React Hook Form | 7.61 | Formulários |
| Recharts | 2.15 | Gráficos |
| Framer Motion | 12.34 | Animações |
| Vitest | 3.2 | Testes unitários |
| Playwright | 1.58 | Testes E2E |

## Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   └── ui/             # Componentes shadcn/ui
├── contexts/            # React Context (Auth, Theme)
├── features/           # Código organizado por feature
│   ├── auth/           # Autenticação
│   │   └── schemas/   # Zod schemas
│   └── dashboard/      # Dashboard
│       ├── components/
│       ├── data/
│       └── hooks/
├── hooks/              # Hooks personalizados
├── lib/                # Utilitários
├── pages/              # Componentes de página
├── types/              # Tipos TypeScript
├── docs/               # Documentação
└── e2e/               # Testes E2E Playwright
```

## Padrões de Arquitetura

### 1. Componentização

```tsx
// ✅ Bom: Componente pequeno e focado
export function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Icon className="w-8 h-8" />
          <span className="text-2xl font-bold">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. Hooks Personalizados

```typescript
// ✅ Bom: Hook com responsabilidade única
export function useDashboardData(options: UseDashboardOptions = {}) {
  const { enabled = true, refetchInterval } = options;

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
```

### 3. Zod para Validação

```typescript
// ✅ Bom: Schema Zod para validação
export const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
```

### 4. Lazy Loading

```tsx
// ✅ Bom: Lazy loading de páginas
const Login = lazy(() => import(/* webpackChunkName: "auth-login" */ "./pages/Login"));
const UserDashboard = lazy(() => import(/* webpackChunkName: "dashboard-user" */ "./pages/UserDashboard"));
```

## Fluxos de Dados

### Autenticação

```
Usuário → Login Page → useAuth() hook → AuthContext → localStorage
                                                  ↓
                                      Token gerado com crypto
                                      User persistido no storage
```

### Dashboard

```
Dashboard → useDashboardData() → React Query → Mock API
                                              ↓
                                      Dados em cache (5min)
```

## Decisões Técnicas

### 1. TanStack Query para Data Fetching

**Motivo:** Cache automático, loading states, retry automático.

### 2. Zod + React Hook Form

**Motivo:** Validação no client, type safety, performance.

### 3. Context API para Auth

**Motivo:** Estado global simples, não precisa Redux.

### 4. Lazy Loading com Suspense

**Motivo:** Code splitting automático, melhor FCP.

## Performance

### Estratégias Implementadas

1. **Code Splitting:** Por feature (auth, dashboard, pages)
2. **Lazy Loading:** Todas as páginas
3. **Tree-shaking:** Rollup configured
4. **Compression:** Brotli + Gzip
5. **Memoization:** useCallback, useMemo, React.memo

### Métricas de Performance

| Métrica | Target | Atual |
|---------|--------|-------|
| LCP | <2.5s | ✅ |
| FID | <100ms | ✅ |
| CLS | <0.1 | ✅ |
| Bundle Size | <500KB | ✅ |

## Segurança

### Medidas Implementadas

1. **Tokens Criptográficos:** `crypto.getRandomValues()`
2. **Variáveis de Ambiente:** Credenciais fora do código
3. **TypeScript Strict:** Verificação em tempo de compilação
4. **Error Boundaries:** Tratamento de erros em runtime

## Testes

### Estratícia de Testes

| Tipo | Cobertura Target | Atual |
|------|------------------|-------|
| Unit Tests | 85% | 90.59% |
| E2E Tests | Fluxos críticos | 42 testes |

### Ferramentas

- **Vitest:** Testes unitários
- **React Testing Library:** Testes de componentes
- **Playwright:** Testes E2E
- **axe-core:** Testes de acessibilidade

## Deployment

### Build

```bash
npm run build
```

### Output

```
dist/
├── assets/
│   ├── vendor-*.js      # Vendor chunks (cacheable)
│   ├── auth-*.js         # Auth chunk
│   ├── dashboard-*.js     # Dashboard chunk
│   └── index-*.js        # Main bundle
├── index.html
└── *.gz / *.br          # Compressed versions
```

### Ambiente

- **Desenvolvimento:** `npm run dev` (porta 5173)
- **Produção:** Build otimizado com compression

## Contribuição

Ver `CONTRIBUTING.md` para guidelines de contribuição.

## Licença

MIT
