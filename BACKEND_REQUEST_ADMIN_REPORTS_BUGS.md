# Backend Bugs — Admin Reports

**Data:** 2026-06-27  
**Verificado via:** chamadas autenticadas à API em produção (`admin@finance.local`)  
**Prioridade:** CRÍTICA — dados errados no painel admin

---

## Bug 1 — `revenue` e `expenses` somando transações pessoais dos usuários

### Endpoint afetado
`GET /v1/admin/revenue?period=monthly&year=2026`

### Resposta atual (errada)
```json
{
  "month": "2026-06",
  "revenue": 19000,
  "expenses": 162529,
  "netRevenue": -143529
}
```

### Causa
O backend está somando **todas as transações pessoais dos usuários** (tabela `transactions`) como se fossem receita/despesa da plataforma.

**Prova:** somando o cashflow retornado:
- Revenue pessoal dos usuários: `1000 + 8000 + 6000 + 1500 + 2500 = 19000` ✓ (bate exato)
- Expenses pessoais dos usuários: `250 + 80 + 150000 + 1000 + 1400 + 6480 + 370 + 300 + 2599 + 50 = 162529` ✓ (bate exato)

### Correção necessária
`revenue` e `expenses` do endpoint `/v1/admin/revenue` devem vir da tabela de **pagamentos de assinatura** (`payments`), não da tabela de transações dos usuários (`transactions`).

```sql
-- CORRETO: receita da plataforma = pagamentos aprovados de assinatura
SELECT 
  TO_CHAR(p.paid_at, 'YYYY-MM') AS month,
  SUM(p.amount) AS revenue,
  0 AS expenses,  -- despesas de infraestrutura (servidor, EFI, etc.) — inserir manualmente ou via tabela própria
  SUM(p.amount) AS net_revenue
FROM payments p
WHERE p.status = 'approved'
  AND EXTRACT(YEAR FROM p.paid_at) = 2026
GROUP BY TO_CHAR(p.paid_at, 'YYYY-MM')
ORDER BY month;
```

### Valor real esperado (junho/2026)
Com base na distribuição de planos:
- Pro: 3 assinantes × R$ 29,90 = R$ 89,70
- Enterprise: 1 assinante × R$ 99,90 = R$ 99,90
- **Total receita real: ~R$ 189,60**

---

## Bug 2 — `conversionRate: 200%` impossível

### Endpoint afetado
`GET /v1/admin/stats?period=monthly`

### Resposta atual (errada)
```json
{
  "totalRevenue": 19000,
  "newUsers": 6,
  "conversionRate": 200,
  "revenueGrowth": 100,
  "paidUsers": 4
}
```

### Causa
Taxa de conversão de 200% é matematicamente impossível. O cálculo atual provavelmente está fazendo:
```
conversionRate = (paidUsers / newUsers) * 100
= (4 / 6) * 100 = 66.67%  ← correto
```
Mas está retornando 200. Provável bug de divisão ou uso de variável errada.

### Correção
```typescript
// Correto:
const conversionRate = totalUsers > 0 
  ? (paidUsers / totalUsers) * 100 
  : 0;
// Resultado: (4/6)*100 = 66.67%
```

---

## Bug 3 — `cashflow` retorna transações pessoais dos usuários

### Endpoint afetado
`GET /v1/admin/cashflow?year=2026`

### Problema
O cashflow admin está retornando lançamentos **pessoais dos usuários** (Aluguel, Fatura Nubank, Compra de comida, Bolo, etc.) em vez do fluxo de caixa **da plataforma**.

### Dados retornados (errado)
```json
[
  { "description": "Aluguel", "amount": 150000, "userId": "b2e26..." },
  { "description": "Fatura cartão Nubank", "amount": 250, "userId": "b2e26..." },
  { "description": "Compra de comida", "amount": 300, "userId": "b2e26..." },
  { "description": "Bolo", "amount": 50, "userId": "b2e26..." }
]
```

### Causa
O backend está consultando a tabela `transactions` dos usuários em vez de uma tabela de movimentações financeiras da plataforma.

### Correção
O cashflow admin deve conter apenas movimentações **da plataforma**:

```sql
-- Entradas da plataforma = pagamentos de assinatura aprovados
SELECT 
  p.id,
  p.paid_at AS date,
  'revenue' AS type,
  'assinatura' AS category,
  CONCAT('Assinatura ', pl.name, ' - ', u.name) AS description,
  p.amount,
  p.user_id
FROM payments p
JOIN users u ON u.id = p.user_id
JOIN plans pl ON pl.id = p.plan_id
WHERE p.status = 'approved'
  AND EXTRACT(YEAR FROM p.paid_at) = :year
ORDER BY p.paid_at DESC;
```

---

## Bug 4 — `category: "undefined"` (string literal)

### Endpoint afetado
`GET /v1/admin/cashflow?year=2026`

### Problema
Vários itens retornam `"category": "undefined"` como string literal em vez de `null` ou uma categoria real.

### Resposta atual (errada)
```json
{ "category": "undefined", "description": "Investimento" }
{ "category": "undefined", "description": "Salário" }
```

### Causa
O backend provavelmente está fazendo:
```typescript
category: transaction.category?.name ?? "undefined"  // ← errado
```

### Correção
```typescript
category: transaction.category?.name ?? null  // ou string vazia ""
```

---

## Resumo das Correções

| Bug | Endpoint | Impacto | Correção |
|-----|----------|---------|----------|
| Revenue/Expenses errados | `/admin/revenue` | Receita mostra R$ 19.000 em vez de ~R$ 189,60 | Query na tabela `payments`, não `transactions` |
| ConversionRate impossível | `/admin/stats` | Mostra 200% em vez de ~66,67% | Corrigir fórmula |
| Cashflow com dados pessoais | `/admin/cashflow` | Mostra gastos dos usuários como se fossem da empresa | Query na tabela `payments` |
| Category "undefined" string | `/admin/cashflow` | String literal inválida | Usar `null` como fallback |

---

## Dados Corretos Esperados (Junho/2026)

```json
{
  "stats": {
    "totalRevenue": 189.60,
    "newUsers": 6,
    "paidUsers": 4,
    "conversionRate": 66.67,
    "revenueGrowth": 100
  },
  "revenue": [{
    "month": "2026-06",
    "revenue": 189.60,
    "expenses": 0,
    "netRevenue": 189.60,
    "mrr": 189.60,
    "newSubscriptions": 4,
    "cancellations": 0,
    "churnRate": 0
  }]
}
```
