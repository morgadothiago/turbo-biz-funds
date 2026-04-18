# Especificação Backend — Pagamento (Cartão de Crédito e Pix)

> **Para:** Dev Backend  
> **Projeto:** DoutorCash  
> **Data:** 2026-04-16  
> **Depende de:** `SPEC-backend-auth.md` (o usuário precisa estar autenticado com JWT para acessar estes endpoints)

---

## Contexto

Após o cadastro, usuários que escolhem plano **Pro** (R$ 97/mês) ou **Business** (R$ 297/mês) são redirecionados para a tela de pagamento. O usuário pode escolher entre **Cartão de Crédito** ou **Pix**. Após confirmação, a assinatura deve ser ativada e o frontend redireciona para a tela de sucesso.

O plano **Gratuito** não passa pelo fluxo de pagamento.

---

## Planos disponíveis

| `plan`       | Valor        | Ciclo   |
|--------------|--------------|---------|
| `free`       | R$ 0         | —       |
| `pro`        | R$ 97,00     | mensal  |
| `business`   | R$ 297,00    | mensal  |

---

## 1. Criar intenção de pagamento

Chamado assim que o usuário chega na tela de pagamento para obter os dados necessários (QR Code Pix, etc.).

### `POST /v1/payments/intent`

**Auth:** `Authorization: Bearer <token>` (obrigatório)

#### Request body

```json
{
  "plan": "pro",
  "method": "pix"
}
```

| Campo    | Tipo   | Valores aceitos              | Obrigatório |
|----------|--------|------------------------------|-------------|
| `plan`   | string | `"pro"`, `"business"`        | sim         |
| `method` | string | `"cartao"`, `"pix"`          | sim         |

#### Response — 201 Created

**Para `method: "pix"`:**

```json
{
  "data": {
    "paymentId": "pay_abc123",
    "method": "pix",
    "status": "pending",
    "expiresAt": "2026-04-16T21:13:00Z",
    "pix": {
      "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "qrCodeText": "00020126580014BR.GOV.BCB.PIX...",
      "expiresInSeconds": 900
    },
    "amount": 9700,
    "currency": "BRL"
  }
}
```

**Para `method: "cartao"`:**

```json
{
  "data": {
    "paymentId": "pay_abc123",
    "method": "cartao",
    "status": "pending",
    "amount": 9700,
    "currency": "BRL"
  }
}
```

> **Nota sobre `amount`:** valor em centavos. R$ 97,00 = `9700`, R$ 297,00 = `29700`.

> **Nota sobre QR Code:** `qrCodeBase64` é uma imagem PNG em base64 para renderizar no `<img src="data:image/png;base64,...">`. O `qrCodeText` é o código para "Pix Copia e Cola". O timer no frontend começa com `expiresInSeconds` (padrão 900 = 15 min).

---

## 2. Confirmar pagamento com Cartão de Crédito

### `POST /v1/payments/{paymentId}/confirm`

**Auth:** `Authorization: Bearer <token>` (obrigatório)

#### Request body

```json
{
  "card": {
    "number": "4111111111111111",
    "holderName": "JOAO SILVA",
    "expiryMonth": "12",
    "expiryYear": "27",
    "cvv": "123"
  }
}
```

| Campo                | Tipo   | Descrição                        |
|----------------------|--------|----------------------------------|
| `card.number`        | string | 16 dígitos sem espaços           |
| `card.holderName`    | string | Nome como aparece no cartão      |
| `card.expiryMonth`   | string | Mês com 2 dígitos (`"01"`–`"12"`) |
| `card.expiryYear`    | string | Ano com 2 dígitos (ex: `"27"`)   |
| `card.cvv`           | string | 3 ou 4 dígitos                   |

> **Segurança:** Os dados do cartão **nunca devem ser armazenados** no backend. Tokenize imediatamente via gateway (ex: Stripe, Pagar.me, Asaas) e descarte os dados brutos.

#### Response — 200 OK

```json
{
  "data": {
    "paymentId": "pay_abc123",
    "status": "approved",
    "subscription": {
      "id": "sub_xyz789",
      "plan": "pro",
      "status": "active",
      "currentPeriodEnd": "2026-05-16T00:00:00Z"
    }
  }
}
```

#### Respostas de erro

| Status | `code`                  | Situação                              |
|--------|-------------------------|---------------------------------------|
| 402    | `CARD_DECLINED`         | Cartão recusado pela operadora        |
| 402    | `INSUFFICIENT_FUNDS`    | Saldo insuficiente                    |
| 402    | `INVALID_CARD`          | Dados do cartão inválidos             |
| 402    | `EXPIRED_CARD`          | Cartão vencido                        |
| 408    | `PAYMENT_TIMEOUT`       | Timeout no gateway                    |

```json
{
  "message": "Cartão recusado pela operadora.",
  "code": "CARD_DECLINED"
}
```

---

## 3. Verificar status do pagamento Pix

O frontend exibe um botão "Já fiz o pagamento" que chama este endpoint para verificar se o Pix foi recebido.

### `GET /v1/payments/{paymentId}/status`

**Auth:** `Authorization: Bearer <token>` (obrigatório)

#### Response — 200 OK

```json
{
  "data": {
    "paymentId": "pay_abc123",
    "status": "approved",
    "method": "pix",
    "subscription": {
      "id": "sub_xyz789",
      "plan": "pro",
      "status": "active",
      "currentPeriodEnd": "2026-05-16T00:00:00Z"
    }
  }
}
```

**Valores possíveis de `status`:**

| `status`    | Significado                                  |
|-------------|----------------------------------------------|
| `pending`   | Aguardando pagamento                         |
| `approved`  | Pagamento confirmado — ativar assinatura     |
| `expired`   | QR Code expirou — usuário deve gerar novo    |
| `cancelled` | Cancelado                                    |

> **Fluxo no frontend:** se `status === "approved"` → navega para `/pagamento-sucesso`. Se `status === "pending"` → exibe toast "Pagamento ainda não identificado, tente novamente". Se `status === "expired"` → exibe mensagem de QR expirado.

---

## 4. Webhook — confirmação assíncrona

Para Pix especialmente, o pagamento pode ser confirmado de forma assíncrona pelo gateway. O backend deve expor um webhook para receber notificações:

### `POST /v1/webhooks/payment`

O payload depende do gateway escolhido (Pagar.me, Asaas, Stripe, etc.), mas o backend deve:

1. Validar a assinatura do webhook (header do gateway)
2. Atualizar o status do pagamento para `approved`
3. Ativar a assinatura do usuário
4. Enviar e-mail de confirmação ao usuário

---

## 5. Consultar assinatura ativa do usuário

Usado pela tela de dashboard para exibir o plano atual.

### `GET /v1/subscriptions/me`

**Auth:** `Authorization: Bearer <token>` (obrigatório)

#### Response — 200 OK

```json
{
  "data": {
    "id": "sub_xyz789",
    "plan": "pro",
    "status": "active",
    "method": "pix",
    "currentPeriodStart": "2026-04-16T00:00:00Z",
    "currentPeriodEnd": "2026-05-16T00:00:00Z",
    "cancelAtPeriodEnd": false
  }
}
```

| `status`     | Significado             |
|--------------|-------------------------|
| `active`     | Assinatura ativa        |
| `past_due`   | Pagamento em atraso     |
| `cancelled`  | Assinatura cancelada    |
| `trialing`   | Em período de teste     |

---

## 6. Resumo dos Endpoints

| Método | Endpoint                            | Auth | Prioridade      |
|--------|-------------------------------------|------|-----------------|
| POST   | `/v1/payments/intent`               | sim  | **Prioritário** |
| POST   | `/v1/payments/{paymentId}/confirm`  | sim  | **Prioritário** |
| GET    | `/v1/payments/{paymentId}/status`   | sim  | **Prioritário** |
| POST   | `/v1/webhooks/payment`              | não* | Prioritário     |
| GET    | `/v1/subscriptions/me`              | sim  | Recomendado     |

*O webhook usa validação de assinatura do gateway, não JWT.

---

## 7. Fluxo completo — Cartão de Crédito

```
Frontend                          Backend                        Gateway
   │                                 │                               │
   │  POST /v1/payments/intent       │                               │
   │─────────────────────────────────>                               │
   │  { paymentId }                  │                               │
   │<─────────────────────────────────                               │
   │                                 │                               │
   │  POST /v1/payments/{id}/confirm │                               │
   │  { card: { ... } }              │                               │
   │─────────────────────────────────>  Tokeniza e cobra             │
   │                                 │──────────────────────────────>│
   │                                 │  { status: "approved" }       │
   │                                 │<──────────────────────────────│
   │  { status: "approved", sub }    │  Ativa assinatura             │
   │<─────────────────────────────────  Envia e-mail                 │
   │                                 │                               │
   │  Navega → /pagamento-sucesso    │                               │
```

---

## 8. Fluxo completo — Pix

```
Frontend                          Backend                        Gateway
   │                                 │                               │
   │  POST /v1/payments/intent       │                               │
   │  { method: "pix" }              │                               │
   │─────────────────────────────────>  Gera QR Code                 │
   │                                 │──────────────────────────────>│
   │  { qrCodeBase64, qrCodeText,    │  { qrCode, expiresAt }        │
   │    expiresInSeconds }           │<──────────────────────────────│
   │<─────────────────────────────────                               │
   │                                 │                               │
   │  [usuário paga via app do banco]│                               │
   │                                 │                               │
   │  GET /v1/payments/{id}/status   │                               │
   │─────────────────────────────────>                               │
   │  { status: "approved" }         │  ← confirmado via webhook     │
   │<─────────────────────────────────                               │
   │                                 │                               │
   │  Navega → /pagamento-sucesso    │                               │
```

---

## 9. Gateways sugeridos (Brasil)

| Gateway    | Pix nativo | Cartão | Observação                        |
|------------|------------|--------|-----------------------------------|
| **Asaas**  | sim        | sim    | Fácil integração, sem mensalidade |
| **Pagar.me**| sim       | sim    | Robusto, usado em produção        |
| **Stripe** | não nativo | sim    | Melhor para cartão internacional  |
| **Mercado Pago** | sim  | sim    | Opção popular no Brasil           |
