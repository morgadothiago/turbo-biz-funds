# Backend — Atualizar Preço do Plano Pro

**Data:** 2026-06-27  
**Prioridade:** ALTA

---

## Preços Corretos do Plano Pro

| Método | Valor total | Parcelas |
|--------|------------|---------|
| PIX | R$ 99,90 | À vista |
| Cartão de crédito | R$ 154,80 | 12x de R$ 12,90 sem juros |

---

## Bug — Plano Pro no banco tem `price: 29.90`

### Comportamento atual
```
GET /v1/plans → price: 29.9  (ERRADO)
GET /v1/admin/subscriptions → amount: 29.9  (ERRADO para PIX)
```

### Comportamento esperado
```
GET /v1/plans → price: 99.9  (preço PIX)
GET /v1/admin/subscriptions (PIX) → amount: 99.9
GET /v1/admin/subscriptions (cartão) → amount: 154.8
```

### Correção no banco
```sql
UPDATE plans SET price = 99.90 WHERE id = 'pro';
```

---

## Cartão de Crédito — Intent já está correto

O endpoint `POST /v1/payments/intent` com `method: "cartao"` já retorna `amount: 15480` (R$ 154,80). ✓

Verificado em produção:
```json
{ "plan": "pro", "method": "cartao" }
→ { "amount": 15480 }  ✓ correto
```

---

## PIX — Intent com valor errado

`POST /v1/payments/intent` com `method: "pix"` deve retornar `amount: 9990` (R$ 99,90).

Verificar se o backend está usando o preço do plano (que está incorreto como 29.90) ou um valor hardcoded.

Após corrigir `plans.price = 99.90`, o intent PIX deve automaticamente retornar `amount: 9990`.

---

## Análise do "Não autorizado" da Larissa (26/06/2026)

Larissa tentou pagar com cartão. A cobrança de R$ 154,80 chegou ao banco. O banco recusou.

**O código está correto** — tokenização EFI funcionou, a cobrança foi criada no EFI.

Razões comuns para recusa bancária:
1. Banco bloqueou transação e-commerce por segurança
2. Limite insuficiente
3. Banco exige autenticação 3DS

Ação: Larissa deve tentar com outro cartão ou usar PIX.
