# Especificação: Fluxo de Cadastro + Pagamento

## Visão Geral do Fluxo

```
Usuário preenche cadastro
        ↓
POST /v1/auth/register  →  retorna token JWT
        ↓
Se plano != "free":
        ↓
POST /v1/payments/intent  →  retorna paymentId + dados PIX ou aguarda cartão
        ↓
PIX: polling GET /v1/payments/{paymentId}/status
Cartão: POST /v1/payments/{paymentId}/confirm  →  confirma pagamento
        ↓
Assinatura ativada → usuário acessa dashboard
```

---

## 1. Cadastro — `POST /v1/auth/register`

### Request
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "Senha123",
  "plan": "pro",
  "phone": "(11) 99999-9999"
}
```

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `name` | string | ✅ | 2–100 caracteres |
| `email` | string | ✅ | formato válido |
| `password` | string | ✅ | mín. 8 chars, 1 letra + 1 número |
| `plan` | string | ✅ | `free` \| `pro` \| `business` \| `enterprise` |
| `phone` | string | ❌ | formato `(DD) 9XXXX-XXXX` |

### Response `201`
```json
{
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "user"
    }
  }
}
```

### Erros
| Status | Código | Motivo |
|---|---|---|
| 400 | — | Payload inválido |
| 409 | — | Email já cadastrado |
| 422 | — | Regra de senha inválida |

### ⚠️ Questão em aberto
**O que acontece com o plano no registro?**

O campo `plan` é enviado no cadastro, mas o `RegisterUserResponse` não retorna `plan` — só `id`, `name`, `email`, `role`.

Precisamos confirmar:
- O backend cria a assinatura automaticamente ao registrar com plano pago?
- Ou apenas salva a intenção e aguarda o pagamento ser confirmado?
- Se o usuário registrar com `plan: "pro"` mas não pagar, qual plano fica ativo? `free`?

**Comportamento esperado:** registrar com `plan: "pro"` deve criar conta com plano `free` temporariamente. Após pagamento confirmado, upgrade para `pro`.

---

## 2. Criar Intenção de Pagamento — `POST /v1/payments/intent`

**Requer:** Bearer token (usuário autenticado)

### Request
```json
{
  "plan": "pro",
  "method": "pix"
}
```

| Campo | Tipo | Obrigatório | Valores |
|---|---|---|---|
| `plan` | string | ✅ | `pro` \| `business` \| `enterprise` |
| `method` | string | ✅ | `pix` \| `cartao` |

### Response `201` — PIX
```json
{
  "data": {
    "paymentId": "uuid",
    "method": "pix",
    "status": "pending",
    "amount": 9700,
    "currency": "BRL",
    "expiresAt": "2026-05-28T15:00:00.000Z",
    "pix": {
      "qrCodeBase64": "data:image/png;base64,...",
      "qrCodeText": "00020126...",
      "expiresInSeconds": 3600
    }
  }
}
```

### Response `201` — Cartão
```json
{
  "data": {
    "paymentId": "uuid",
    "method": "cartao",
    "status": "pending",
    "amount": 9700,
    "currency": "BRL"
  }
}
```

### ⚠️ Questões em aberto
- `amount` vem em centavos (ex: `9700` = R$ 97,00) ou reais (`97.00`)?
- `expiresAt` existe para método `cartao` também?
- Qual o valor exato de `amount` por plano? Está hardcoded no backend ou vem da tabela de planos?

---

## 3. Confirmar Pagamento com Cartão — `POST /v1/payments/{paymentId}/confirm`

**Requer:** Bearer token

### Request
```json
{
  "card": {
    "number": "4111111111111111",
    "holderName": "JOÃO SILVA",
    "expiryMonth": "12",
    "expiryYear": "2030",
    "cvv": "123"
  }
}
```

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `card.number` | string | ✅ | 16 dígitos sem espaço |
| `card.holderName` | string | ✅ | nome no cartão |
| `card.expiryMonth` | string | ✅ | `"01"` a `"12"` |
| `card.expiryYear` | string | ✅ | `"2025"` a `"2035"` |
| `card.cvv` | string | ✅ | 3–4 dígitos |

### Response `201`
```json
{
  "data": {
    "paymentId": "uuid",
    "status": "approved",
    "subscription": { }
  }
}
```

### ⚠️ Questões em aberto
- O objeto `subscription` retorna quais campos? `plan`, `status`, `nextBilling`?
- Após confirmação, o JWT do usuário é atualizado automaticamente com o novo plano ou precisa fazer novo login?
- Quais são os status possíveis? `approved` | `declined` | `pending`?

---

## 4. Verificar Status do Pagamento — `GET /v1/payments/{paymentId}/status`

**Requer:** Bearer token (usado para polling do PIX)

### Response `201`
```json
{
  "data": {
    "paymentId": "uuid",
    "status": "approved",
    "method": "pix",
    "subscription": { }
  }
}
```

### ⚠️ Questões em aberto
- Quais são os status possíveis? `pending` | `approved` | `expired` | `declined` | `cancelled`?
- Qual o intervalo de polling recomendado para PIX? (frontend usa 5s atualmente)
- Após expirar o QR Code PIX, é necessário criar nova intent ou reativar a mesma?

---

## 5. Assinatura Ativa — `GET /v1/subscriptions/me`

**Status atual:** retorna **404** — endpoint não implementado.

### Response esperado
```json
{
  "data": {
    "plan": "pro",
    "status": "active",
    "nextBilling": "2026-06-28T00:00:00.000Z",
    "amount": 9700
  }
}
```

**Este endpoint é usado pelo frontend para:**
- Exibir notificações de cobrança próxima
- Exibir status da assinatura nas configurações
- Verificar plano ativo no dashboard

---

## 6. Resumo — O que falta implementar no backend

| # | Endpoint | Status | Prioridade |
|---|---|---|---|
| 1 | Clarificar comportamento do `plan` no registro | ⚠️ Indefinido | Alta |
| 2 | `POST /v1/payments/intent` — documentar response completo | ⚠️ Parcial | Alta |
| 3 | `POST /v1/payments/{id}/confirm` — documentar `subscription` no response | ⚠️ Parcial | Alta |
| 4 | `GET /v1/payments/{id}/status` — listar todos os status possíveis | ⚠️ Parcial | Alta |
| 5 | `GET /v1/subscriptions/me` | ❌ Não implementado | Alta |
| 6 | Atualizar plano do usuário no JWT após pagamento | ⚠️ Indefinido | Alta |
| 7 | Webhook para confirmação assíncrona (PIX) | ❌ Não definido | Média |

---

## 7. Fluxo Frontend Atual

```
/cadastro  →  step 1: nome/email/senha  →  step 2: escolha de plano
              ↓
         register({ name, email, password, plan, phone })
              ↓
         se plan == "free"  →  /dashboard
         se plan != "free"  →  /pagamento?plan=pro
              ↓
         /pagamento  →  escolhe PIX ou Cartão
              ↓
         createPaymentIntent({ plan, method })
              ↓
         PIX: exibe QR Code + polling a cada 5s no status
         Cartão: exibe form → confirmCardPayment({ paymentId, card })
              ↓
         status "approved"  →  /dashboard
```
