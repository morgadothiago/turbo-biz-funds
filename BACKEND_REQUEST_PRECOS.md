# Backend — Correção de Preços do Plano Pro

**Data:** 2026-06-27  
**Prioridade:** CRÍTICA — usuários pagando valor errado

---

## Problema

O plano Pro tem `price = 29.90` no banco. O frontend exibe os preços corretos mas o backend gera cobranças com valor errado.

### Estado atual (errado)

| Método | Frontend exibe | Backend cobra |
|--------|---------------|---------------|
| PIX | R$ 99,90 | R$ 29,90 ✗ |
| Cartão | R$ 154,80 | R$ 29,90 ✗ |

### Estado esperado (correto)

| Método | Frontend exibe | Backend cobra |
|--------|---------------|---------------|
| PIX | R$ 99,90 | R$ 99,90 ✓ |
| Cartão | R$ 154,80 em 12x de R$ 12,90 | R$ 154,80 ✓ |

---

## Correção 1 — Atualizar preço do plano no banco

```sql
UPDATE plans SET price = 99.90 WHERE id = 'pro';
```

Isso corrige o PIX automaticamente (intent usa `plan.price * 100`).

---

## Correção 2 — Intent de cartão deve usar preço separado

O endpoint `POST /v1/payments/intent` precisa distinguir o método:

```typescript
// Lógica correta no backend:
const PRO_CARD_PRICE = 15480; // R$ 154,80 em centavos (12x de R$ 12,90 sem juros)

async function createIntent(planId: string, method: string) {
  if (method === 'cartao' || method === 'credit_card') {
    return { amount: PRO_CARD_PRICE }; // sempre 15480 para cartão
  }
  const plan = await planRepository.findById(planId);
  return { amount: Math.round(plan.price * 100) }; // usa preço do plano (9990 após correção 1)
}
```

---

## Verificação após correção

Testar via API autenticada:

```bash
# PIX deve retornar amount: 9990
POST /v1/payments/intent
{ "plan": "pro", "method": "pix" }
→ { "amount": 9990 }  ✓

# Cartão deve retornar amount: 15480
POST /v1/payments/intent
{ "plan": "pro", "method": "cartao" }
→ { "amount": 15480 }  ✓

# Plano deve ter price: 99.90
GET /v1/plans
→ [{ "id": "pro", "price": 99.9 }]  ✓
```

---

## Impacto no frontend

Nenhuma mudança necessária no frontend após essas correções.
O frontend já exibe os valores corretos (R$ 99,90 PIX / R$ 154,80 cartão).
