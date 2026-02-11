# Fluxos de Autenticação

## Visão Geral

O sistema de autenticação do OrganizaAI utiliza:

- **JWT Tokens** (planejado para produção)
- **React Context** para estado global
- **Local Storage** para persistência
- **TanStack Query** para cache

## Fluxo de Login

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuário   │────▶│   Login     │────▶│   Backend   │────▶│    Token    │
│  acessa app │     │   Page      │     │    API      │     │  gerado     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Dashboard │◀────│  Redirect   │◀────│   Context   │◀────│   Salvo     │
│   acessado  │     │             │     │   atualizado│     │  LocalStorage
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Implementação Atual

### AuthContext

```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

### Uso em Componentes

```tsx
// ✅ Bom: Usar hook useAuth
import { useAuth } from "@/contexts/AuthContext";

function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      <h1>Bem-vindo, {user?.name}</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

## Proteção de Rotas

### PrivateRoute

```typescript
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <AuthLoading />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

### AdminRoute

```typescript
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <AuthLoading />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}
```

## Tipos de Usuário

| Role | Descrição | Rotas |
|------|-----------|-------|
| `user` | Usuário comum | `/dashboard/*` |
| `admin` | Administrador | `/admin/*`, `/dashboard/*` |

## Tokens

### Formato do Token

```
token_{userId}_{timestamp}_{randomHex}
```

Exemplo: `token_1_1704067200000_abc123def456...`

### Validação (Backend)

```javascript
// Exemplo JWT (futuro)
const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
```

## Sessão

### Inicialização

```typescript
useEffect(() => {
  const initAuth = () => {
    const token = storage.getToken();
    const savedUser = storage.getUser();
    
    if (token && savedUser) {
      setUser(savedUser);
    }
    
    setIsLoading(false);
  };
  
  initAuth();
}, []);
```

### Logout

```typescript
const logout = useCallback(() => {
  storage.clear(); // Remove token e user do localStorage
  setUser(null);
}, []);
```

## Segurança

### Implementado

1. **Tokens Criptográficos:** `crypto.getRandomValues()`
2. **Credenciais em .env:** Não hardcoded
3. **Error Boundaries:** Tratamento de crashes
4. **TypeScript Strict:** Verificação em compile time

### Futuro (Produção)

1. **JWT com expiração:** Tokens com TTL
2. **HTTP-only cookies:** Mais seguro que localStorage
3. **CSRF Protection:** Tokens anti-CSRF
4. **Rate Limiting:** Prevenir brute force
5. **Refresh Tokens:** Sessões longas seguras

## Testes

### Login com Credenciais Válidas

```typescript
test("should login successfully with admin credentials", async () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  await act(async () => {
    await result.current.login("admin@financeai.com", "admin123");
  });
  
  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user?.role).toBe("admin");
});
```

### Redirecionamento

```typescript
test("should redirect to dashboard after login", async () => {
  renderWithRouter("/login");
  
  fillLoginForm("admin@financeai.com", "admin123");
  clickButton("Entrar");
  
  await waitFor(() => {
    expect(currentPath()).toBe("/dashboard");
  });
});
```

## Variáveis de Ambiente

```env
VITE_TEST_ADMIN_EMAIL=admin@financeai.com
VITE_TEST_ADMIN_PASSWORD=admin123
VITE_TEST_USER_EMAIL=usuario@financeai.com
VITE_TEST_USER_PASSWORD=user123
```

## FAQ

### Como funciona o remember me?

O token e usuário são salvos no `localStorage`. Na próxima sessão, o `AuthProvider` verifica esses dados automaticamente.

### Posso fazer logout de todos os dispositivos?

Em produção, implementar endpoint `/api/auth/revoke-all` que invalida todos os tokens no backend.

### O que acontece se o token expirar?

React Router redireciona para `/login` automaticamente.
