---
title: Rotas Públicas
tags:
  - rotas
  - páginas
  - público
---

# Rotas Públicas

Rotas acessíveis sem autenticação, protegidas pelo guard `PublicRoute` (redireciona usuários já autenticados para `/dashboard` ou `/admin`).

## Mapa de Rotas

| Path | Componente | Arquivo | Descrição |
|------|-----------|---------|-----------|
| `/` | `Index` | `pages/Index.tsx` | Landing page principal |
| `/login` | `Login` | `pages/Login.tsx` | Login com email/senha |
| `/cadastro` | `Cadastro` | `pages/Cadastro.tsx` | Registro de novo usuário |
| `/recuperar-senha` | `ForgotPassword` | `pages/ForgotPassword.tsx` | Solicitação de recuperação |
| `/redefinir-senha` | `ResetPassword` | `pages/ResetPassword.tsx` | Reset com token de 6 dígitos |

## Rotas de Pagamento

Fora do guard `PublicRoute` mas também públicas:

| Path | Componente | Arquivo | Descrição |
|------|-----------|---------|-----------|
| `/pagamento` | `Pagamento` | `pages/Pagamento.tsx` | Checkout Stripe/Pix |
| `/pagamento-sucesso` | `PagamentoSucesso` | `pages/PagamentoSucesso.tsx` | Confirmação de pagamento |

## Detalhes das Páginas

### `/` — Landing Page (`Index.tsx`)
Seções:
- Hero com CTA
- Features do produto
- Pricing (planos e preços)
- Testimonials
- FAQ
- Footer

Componentes usados: `src/components/landing/`

### `/login` — Login (`Login.tsx`)
- Form: email + senha
- Validação com Zod (`loginSchema`)
- Submit → `POST /v1/auth/login`
- Redireciona para `/dashboard` após sucesso
- Link para `/recuperar-senha` e `/cadastro`

### `/cadastro` — Cadastro (`Cadastro.tsx`)
Wizard em 2 etapas:
1. **Dados pessoais**: nome, email, senha, telefone
2. **Seleção de plano**: free / pro / business

Validação: `registerSchema` (Zod)
Submit → `POST /v1/auth/register`

### `/recuperar-senha` — Forgot Password (`ForgotPassword.tsx`)
- Form: só email
- Submit → `POST /v1/auth/forgot-password`
- Mostra confirmação após envio

### `/redefinir-senha` — Reset Password (`ResetPassword.tsx`)
- Form: token (6 dígitos) + nova senha + confirmação
- Token recebido por email
- Submit → `POST /v1/auth/reset-password`
- Input OTP para o token

---

Veja também: [[Sistema de Guards]] | [[../03-Features/Auth]] | [[../04-API/Endpoints Auth]]
