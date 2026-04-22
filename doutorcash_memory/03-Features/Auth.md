---
title: Feature — Auth
tags:
  - feature
  - auth
  - autenticação
---

# Feature — Auth

## Localização

```
src/features/auth/
└── schemas/
    ├── auth.schema.ts   # Schemas Zod de validação
    └── index.ts         # Re-exports
```

## Schemas de Validação (Zod)

### `loginSchema`
```typescript
{
  email: string (email válido),
  password: string (mínimo 6 caracteres)
}
```

### `registerSchema`
```typescript
{
  name: string (2-100 caracteres),
  email: string (email válido),
  password: string (
    mínimo 8 chars,
    1 maiúscula,
    1 minúscula,
    1 número
  ),
  confirmPassword: string (deve ser igual a password),
  phone: string (opcional),
  plan: "free" | "pro" | "business"
}
```

### `forgotPasswordSchema`
```typescript
{
  email: string (email válido)
}
```

### `resetPasswordSchema`
```typescript
{
  token: string (6 dígitos),
  password: string (mesmas regras do register),
  confirmPassword: string
}
```

## Fluxo de Autenticação

### Login
```
1. Usuário preenche email + senha
2. Zod valida com loginSchema
3. POST /v1/auth/login
4. Resposta: { token, user }
5. JWT decodificado → extrai { id, email, name, role, plan }
6. Token salvo em localStorage via storage.ts
7. User salvo em localStorage
8. AuthContext atualiza estado: isAuthenticated = true
9. Guard redireciona para /dashboard ou /admin
```

### Registro
```
1. Wizard step 1: dados pessoais
2. Wizard step 2: seleção de plano
3. Zod valida com registerSchema
4. POST /v1/auth/register
5. Resposta: { token, user }
6. Mesmo fluxo de persistência do login
7. Redireciona para /dashboard
```

### Recuperação de Senha
```
1. POST /v1/auth/forgot-password { email }
2. API envia email com token de 6 dígitos
3. Usuário acessa /redefinir-senha
4. POST /v1/auth/reset-password { token, password }
5. Redireciona para /login
```

### Logout
```
1. Chama logout() do AuthContext
2. Remove token e user do localStorage
3. Redireciona para /login
```

## Persistência (storage.ts)

```typescript
// Salvar token
setToken(token: string): void

// Recuperar token
getToken(): string | null

// Salvar user
setUser(user: User): void

// Recuperar user
getUser(): User | null

// Limpar tudo
clearStorage(): void
```

## Decodificação do JWT

O `AuthContext` decodifica o JWT (sem biblioteca externa, apenas `atob` na parte payload) para extrair:
- `sub` → `id`
- `email`
- `name`
- `role`
- `plan`
- `exp` → verificação de expiração (margem de 10s)

---

Veja também: [[../02-Paginas-e-Rotas/Rotas Públicas]] | [[../06-Estado-e-Hooks/AuthContext]] | [[../04-API/Endpoints Auth]]
