# Segurança — Ações Obrigatórias no Backend

> Gerado em: 2026-04-21  
> Resultado da análise de segurança do frontend doutorcash.  
> Os itens abaixo **não podem ser resolvidos no frontend** e requerem implementação no backend.

---

## 🔴 CRÍTICO — P0 (Bloqueia produção)

### 1. Migrar autenticação para cookies httpOnly

**Problema atual:**  
O token JWT é armazenado em `localStorage`. Qualquer script JavaScript na página pode lê-lo — se houver uma vulnerabilidade XSS, o atacante rouba o token e assume a conta do usuário.

**O que fazer:**

#### 1.1 — Retornar o token como cookie httpOnly no login e registro

```
Set-Cookie: access_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600
Set-Cookie: refresh_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/v1/auth/refresh; Max-Age=604800
```

#### 1.2 — Remover token do corpo da resposta de login

Antes:
```json
{ "data": { "token": "eyJ..." } }
```

Depois (token vai apenas no cookie, não no body):
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "plan": "free",
      "role": "user"
    }
  }
}
```

> **Nota:** O frontend precisará ser atualizado para parar de ler o token do body e passar a usar `credentials: 'include'` nas requisições. Alinhar com o time frontend após implementação.

#### 1.3 — Endpoint de logout deve invalidar o cookie

```
POST /v1/auth/logout
→ Set-Cookie: access_token=; HttpOnly; Secure; Max-Age=0
→ Set-Cookie: refresh_token=; HttpOnly; Secure; Max-Age=0
→ { "message": "Logged out" }
```

#### 1.4 — CORS configurado para aceitar credenciais

```typescript
// NestJS
app.enableCors({
  origin: ['https://doutorcash.com.br', 'http://localhost:5173'],
  credentials: true,  // OBRIGATÓRIO para cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

### 2. Campo `plan` obrigatório no JWT

**Problema atual:**  
O frontend extrai o plano do usuário do JWT para exibir limitações. Se o campo não estiver no token, todos são tratados como `free`.

**O que fazer:**

Incluir `plan` no payload do JWT em **todos** os endpoints que geram tokens (login, register, refresh):

```typescript
const payload = {
  sub: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  plan: user.plan,  // ← OBRIGATÓRIO
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
};
```

---

### 3. Processamento de cartão de crédito via SDK (PCI DSS)

**Problema atual:**  
O número completo do cartão, CVV e validade passam pelo frontend e são enviados para a API do doutorcash. Isso viola o PCI DSS (Payment Card Industry Data Security Standard) e torna o sistema inteiro responsável por armazenar dados de cartão.

**O que fazer:**

Integrar diretamente com o SDK do gateway de pagamento (Asaas, Stripe, PagSeguro etc.) para que o frontend **nunca** envie dados de cartão para a nossa API.

#### Fluxo correto com Asaas (exemplo):

```
1. Frontend carrega o Asaas.js SDK
2. Usuário preenche formulário de cartão (dentro do iframe/SDK do Asaas)
3. Asaas.js tokeniza o cartão → retorna um token temporário (ex: "tok_abc123")
4. Frontend envia apenas o token para nossa API:
   POST /v1/payments/confirm/:id
   { "cardToken": "tok_abc123" }
5. Nossa API passa o token para o Asaas no lado do servidor
6. Número real do cartão NUNCA chega na nossa API
```

#### Endpoint a atualizar:

```
POST /v1/payments/confirm/:paymentId
Body atual:   { "card": { "number": "...", "cvv": "...", ... } }  ← INSEGURO
Body correto: { "cardToken": "tok_abc123" }                       ← SEGURO
```

> Referência Asaas: https://asaasv3.docs.apiary.io/#reference/0/cartoes-de-credito/tokenizacao-de-cartao

---

## 🟠 ALTO — P1

### 4. Autorização server-side em rotas admin

**Problema atual:**  
As rotas `/admin/*` são protegidas apenas no frontend. Um atacante pode fazer requests diretos para `/v1/admin/*` se tiver qualquer JWT válido.

**O que fazer:**  
Todos os endpoints `/v1/admin/*` devem validar `role === "admin"` no JWT em cada request:

```typescript
// NestJS — exemplo com Guard
@Controller('admin')
@UseGuards(AuthGuard, RoleGuard)
@Roles('admin')
export class AdminController { ... }
```

**Resposta para não-admins:**
```json
HTTP 403 Forbidden
{ "error": { "code": "FORBIDDEN", "message": "Acesso restrito" } }
```

---

### 5. Validação server-side dos limites de plano

**Problema atual:**  
As limitações de plano (free: 1 meta, 1 cartão, etc.) são verificadas apenas no frontend. Um usuário pode fazer requests diretos à API e criar quantos recursos quiser.

**O que fazer:**  
Implementar o `PlanLimitGuard` conforme descrito em `docs/PLAN_LIMITS_SPEC.md`.  
O backend deve retornar `HTTP 402` quando o limite for atingido.

---

### 6. Rate limiting por endpoint sensível

**Problema atual:**  
Não há proteção contra ataques de força bruta nos endpoints de autenticação.

**O que implementar:**

| Endpoint | Limite sugerido |
|---|---|
| `POST /v1/auth/login` | 10 tentativas / 15min por IP |
| `POST /v1/auth/register` | 5 tentativas / hora por IP |
| `POST /v1/users/forgot-password` | 3 tentativas / hora por email |
| `POST /v1/users/reset-password` | 5 tentativas / hora por IP |
| Endpoints de IA | 100 req / min por usuário |

```typescript
// NestJS com @nestjs/throttler
@Throttle({ default: { ttl: 900000, limit: 10 } })
@Post('login')
async login() { ... }
```

---

## 🟡 MÉDIO — P2

### 7. Headers de segurança HTTP

Adicionar os seguintes headers em **todas** as respostas:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

```typescript
// NestJS com Helmet
import helmet from 'helmet';
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

---

### 8. Logs de auditoria para ações sensíveis

Registrar em log (com timestamp, userId, IP, user-agent) as seguintes ações:

| Ação | Por quê logar |
|---|---|
| Login bem-sucedido | Detectar acesso suspeito |
| Login com falha | Detectar força bruta |
| Troca de senha | Rastrear comprometimento |
| Exportação LGPD | Compliance |
| Exclusão de conta | Compliance |
| Mudança de role | Auditoria admin |
| Acesso a `/v1/admin/*` | Auditoria admin |

---

### 9. Invalidação de token no logout

**Problema atual:**  
Ao fazer logout, apenas o cliente apaga o token. O token JWT continua válido até expirar (1h). Se alguém capturou o token, ainda pode usá-lo.

**O que fazer:**  
Manter uma blocklist de tokens inválidos no Redis:

```typescript
// No logout:
await redis.setex(`blacklist:${tokenJti}`, tokenTtl, '1');

// No AuthGuard, antes de aceitar o token:
const isBlacklisted = await redis.exists(`blacklist:${claims.jti}`);
if (isBlacklisted) throw new UnauthorizedException();
```

Exige que o JWT inclua o campo `jti` (JWT ID) único em cada token emitido.

---

### 10. Webhook de pagamento com validação HMAC

**Problema atual:**  
O endpoint `POST /v1/payments/webhook` é público. Qualquer pessoa pode enviar um payload falso fingindo que um pagamento foi confirmado.

**O que implementar:**

```typescript
@Post('webhook')
async handleWebhook(
  @Headers('x-asaas-signature') signature: string,
  @RawBody() rawBody: Buffer,
) {
  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new UnauthorizedException('Invalid webhook signature');
  }
  // processar evento...
}
```

---

## 🟢 BAIXO — P3

### 11. Sanitização de inputs antes de salvar no banco

Validar e sanitizar todos os campos de texto livre antes de persistir:

- `description` em transações: remover HTML/scripts
- `name` em categorias, metas, cartões: trim + max length
- `phone`: validar formato antes de salvar

```typescript
// class-validator + class-transformer
@IsString()
@MaxLength(200)
@Transform(({ value }) => value?.trim())
description?: string;
```

---

### 12. Política de senhas na criação de conta

O frontend já valida, mas o backend deve rejeitar senhas fracas independentemente:

- Mínimo 8 caracteres
- Ao menos 1 letra maiúscula
- Ao menos 1 número
- Retornar `400` com mensagem clara se inválida

---

## Resumo de Prioridades

| Prioridade | Item | Impacto |
|---|---|---|
| 🔴 P0 | JWT em cookie httpOnly | Elimina roubo de token por XSS |
| 🔴 P0 | Campo `plan` no JWT | Limitação de planos funciona corretamente |
| 🔴 P0 | SDK para cartão (PCI DSS) | Conformidade legal + segurança do usuário |
| 🟠 P1 | Autorização admin server-side | Protege dados de todos os usuários |
| 🟠 P1 | PlanLimitGuard no backend | Evita bypass das limitações de plano |
| 🟠 P1 | Rate limiting em auth | Protege contra força bruta |
| 🟡 P2 | Headers HTTP (Helmet) | Proteção contra XSS, clickjacking |
| 🟡 P2 | Logs de auditoria | Compliance e detecção de incidentes |
| 🟡 P2 | Blocklist de tokens no logout | Reduz janela de ataque |
| 🟡 P2 | HMAC em webhooks | Evita pagamentos falsos |
| 🟢 P3 | Sanitização de inputs | Proteção adicional |
| 🟢 P3 | Validação de senha no backend | Defense in depth |
