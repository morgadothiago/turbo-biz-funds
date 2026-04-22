---
title: Feature — Pagamentos
tags:
  - feature
  - pagamentos
  - stripe
  - pix
---

# Feature — Pagamentos

## Localização

```
src/features/payments/
└── hooks/
    ├── use-payments.ts     # Fluxo de pagamento
    └── use-plan-info.ts    # Info do plano atual
src/pages/Pagamento.tsx         # Checkout page
src/pages/PagamentoSucesso.tsx  # Confirmação
```

## Métodos de Pagamento Suportados

| Método | Status |
|--------|--------|
| Stripe (cartão de crédito) | Implementado |
| Pix | Implementado |

## Fluxo de Checkout

```
1. Usuário seleciona plano no /cadastro ou upgrade
2. Redireciona para /pagamento?plan=pro
3. Página carrega info do plano selecionado
4. Usuário escolhe forma de pagamento
5. POST /v1/payments/intent → recebe payment_intent_id
6. Usuário finaliza pagamento
7. POST /v1/payments/{id}/confirm
8. Polling: GET /v1/payments/{id}/status
9. Status "success" → redireciona para /pagamento-sucesso
```

## Hooks

### `use-payments`

```typescript
const { createPaymentIntent, confirmPayment, getPaymentStatus } = usePayments()
```

### `use-plan-info`

```typescript
const { plan, isLoading } = usePlanInfo(planId)
// Fetcha GET /v1/plans/{id} para exibir preço e features
```

## Endpoints

| Método | Endpoint | Ação |
|--------|----------|------|
| GET | `/v1/plans` | Listar planos disponíveis |
| GET | `/v1/plans/{id}` | Info de um plano |
| POST | `/v1/payments/intent` | Criar intenção de pagamento |
| POST | `/v1/payments/{id}/confirm` | Confirmar pagamento |
| GET | `/v1/payments/{id}/status` | Status do pagamento |

## Evento de Limite de Plano (402)

Quando qualquer endpoint retorna status `402`:
1. Axios interceptor captura o erro
2. Dispara evento customizado `plan:limit-exceeded`
3. `PlanLimitListener` (em `components/upgrade/`) captura o evento
4. Exibe modal de upgrade de plano

---

Veja também: [[../09-Planos/Limites por Plano]] | [[../09-Planos/Sistema de Pagamentos]] | [[../04-API/Tratamento de Erros]]
