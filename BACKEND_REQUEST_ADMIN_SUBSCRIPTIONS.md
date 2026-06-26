# Backend Request — Admin Subscriptions

**Data:** 2026-06-25  
**Endpoint:** `GET /v1/admin/subscriptions`

---

## Problema Atual

Os campos `amount` e `paymentMethod` retornados estão incorretos:

- `amount`: mostra R$ 29.90 para todos, mesmo que o usuário tenha pago valor diferente
- `paymentMethod`: mostra "pix" para todos, mesmo que o pagamento tenha sido feito com cartão de crédito

---

## Resposta Esperada

```json
{
  "data": [
    {
      "id": "uuid-da-assinatura",
      "status": "ACTIVE",
      "startDate": "2026-06-01T00:00:00.000Z",
      "nextBilling": "2026-07-01T00:00:00.000Z",
      "autoRenew": true,

      "user": {
        "id": "uuid-do-usuario",
        "name": "Thiago Morgado",
        "email": "thiago@email.com"
      },

      "plan": {
        "id": "uuid-do-plano",
        "name": "pro",
        "price": 29.90
      },

      "amount": 29.90,
      "paymentMethod": "credit_card"
    }
  ],
  "stats": {
    "totalRevenue": 119.60,
    "active": 4,
    "trial": 0,
    "overdue": 0
  }
}
```

---

## Campos Críticos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `amount` | number | Valor **real** cobrado do usuário (em reais, ex: 29.90). Não o preço do plano, mas o que foi efetivamente cobrado no pagamento. |
| `paymentMethod` | string | Método usado no pagamento: `"pix"` ou `"credit_card"` |

---

## Valores Aceitos para `paymentMethod`

| Valor | Exibição no frontend |
|-------|---------------------|
| `"pix"` | Badge verde "PIX" |
| `"credit_card"` | Badge azul "Cartão" |
| `"card"` | Badge azul "Cartão" |
| `"boleto"` | Texto "Boleto" |

---

## Fonte dos Dados

O `amount` e `paymentMethod` devem vir do **registro de pagamento** associado à assinatura (tabela `payments`), não do preço atual do plano. Exemplo de join necessário:

```sql
SELECT 
  s.id,
  s.status,
  s.start_date,
  s.next_billing_at,
  u.name AS user_name,
  u.email AS user_email,
  pl.name AS plan_name,
  p.amount,           -- ← valor real pago
  p.method AS payment_method  -- ← método real usado
FROM subscriptions s
JOIN users u ON u.id = s.user_id
JOIN plans pl ON pl.id = s.plan_id
LEFT JOIN payments p ON p.subscription_id = s.id AND p.status = 'approved'
ORDER BY s.created_at DESC
```

---

## Status Aceitos

| Valor no banco | Mapeado para |
|----------------|-------------|
| `ACTIVE` / `active` | Ativo |
| `CANCELLED` / `canceled` | Cancelado |
| `PAST_DUE` / `past_due` | Inadimplente |
| `TRIAL` / `trial` | Trial |
