# Backend Request — Pagamentos (Cartão + PIX)

**Data:** 2026-06-23  
**Prioridade:** CRÍTICA — nenhum método de pagamento funciona em produção

---

## BUG 1 — Cartão de Crédito: `user_not_found` ao confirmar

### Endpoint com problema
```
POST /v1/payments/{paymentId}/confirm
```

### Erro retornado
```json
HTTP 404
{ "message": "user_not_found", "code": "NotFoundException" }
```

### Fluxo que ocorre
1. `POST /v1/payments/intent` com `{ plan: "pro", method: "cartao" }` → **funciona**, retorna `paymentId`
2. Frontend tokeniza o cartão na EFI (funciona)
3. `POST /v1/payments/{paymentId}/confirm` com `{ paymentToken, holderName, cpf, installments }` → **404**

### Causa provável
O endpoint de confirmação tenta buscar o usuário mas não encontra. Possíveis causas:
- O `userId` do JWT não está sendo salvo em `payments.userId` ao criar o intent
- A query de confirmação faz `WHERE paymentId = :id AND userId = :userId` mas o userId não bate
- O endpoint busca o usuário por algum campo que não existe no banco

### Paymentid de teste
```
pay_1782248813352_q0m0ok
```

### O que o backend precisa fazer
```typescript
// PaymentsService.confirmPayment(paymentId, userId, dto)

async confirmPayment(paymentId: string, userId: string, dto: ConfirmPaymentDto) {
  // 1. Buscar o payment pelo paymentId
  const payment = await this.paymentsRepo.findOne({ where: { paymentId } });
  if (!payment) throw new NotFoundException('payment_not_found');

  // 2. Verificar que o payment pertence ao usuário autenticado
  if (payment.userId !== userId) throw new NotFoundException('user_not_found');

  // 3. Chamar a EFI para confirmar o pagamento com o token do cartão
  const efiResult = await this.efiService.confirmCreditCardCharge({
    chargeId: payment.efiChargeId, // ID da cobrança na EFI
    paymentToken: dto.paymentToken,
    holderName: dto.holderName,
    cpf: dto.cpf,
    installments: dto.installments ?? 1,
  });

  // 4. Se aprovado, atualizar banco
  if (efiResult.status === 'approved') {
    await this.paymentsRepo.update(payment.id, { status: 'approved' });
    await this.usersRepo.update(payment.userId, { plan: payment.planId }); // "pro"
  }

  return { data: { paymentId, status: efiResult.status } };
}
```

### Checklist cartão
- [ ] Ao criar intent com `method: "cartao"`, salvar `userId` em `payments.userId`
- [ ] `confirmPayment()` busca payment por `paymentId` (sem filtrar por userId desnecessariamente)
- [ ] Chama EFI para processar o token do cartão
- [ ] Quando aprovado: `payment.status = "approved"` + `user.plan = "pro"`
- [ ] `GET /v1/users/me` retorna `plan: "pro"` após aprovação

---

## BUG 2 — PIX: status nunca muda de `"pending"`

### Endpoint com problema
```
GET /v1/payments/{paymentId}/status
```

### Comportamento atual
Após o usuário pagar o PIX, o endpoint continua retornando:
```json
{ "data": { "paymentId": "pay_xxx", "status": "pending", "method": "pix" } }
```

O frontend faz polling a cada 5s por até 15 minutos — **nunca recebe "approved"**.

### Causa
O backend lê o status do banco mas nunca consulta a EFI para saber se o PIX foi pago.

### O que o backend precisa fazer

**Opção A (recomendada — mais simples):** Consultar a EFI dentro do endpoint de status:

```typescript
// GET /v1/payments/{paymentId}/status
async getPaymentStatus(paymentId: string) {
  const payment = await this.paymentsRepo.findOne({ where: { paymentId } });
  if (!payment) throw new NotFoundException('payment_not_found');

  // Se já aprovado no banco, retorna direto
  if (payment.status === 'approved') {
    return { data: { paymentId, status: 'approved', method: 'pix' } };
  }

  // Se PIX pendente, consulta a EFI em tempo real
  if (payment.method === 'pix' && payment.status === 'pending') {
    const efiStatus = await this.efiService.pixDetailCharge({ txid: payment.txid });
    // efiStatus.situacao: "ATIVA" | "CONCLUIDA" | "REMOVIDA_PELO_USUARIO_RECEBEDOR" | "REMOVIDA_PELO_PSP"

    if (efiStatus.situacao === 'CONCLUIDA') {
      await this.paymentsRepo.update(payment.id, { status: 'approved' });
      await this.usersRepo.update(payment.userId, { plan: payment.planId }); // "pro"
      return { data: { paymentId, status: 'approved', method: 'pix' } };
    }

    if (['REMOVIDA_PELO_USUARIO_RECEBEDOR', 'REMOVIDA_PELO_PSP'].includes(efiStatus.situacao)) {
      await this.paymentsRepo.update(payment.id, { status: 'expired' });
      return { data: { paymentId, status: 'expired', method: 'pix' } };
    }
  }

  return { data: { paymentId, status: payment.status, method: payment.method } };
}
```

**Opção B:** Configurar webhook EFI que chama `POST /v1/webhooks/efi/pix` quando o PIX é pago.

### Campos necessários no banco (tabela payments)
| Campo | Tipo | Descrição |
|---|---|---|
| `paymentId` | string | ID interno (ex: `pay_xxx`) |
| `txid` | string | txid da EFI (para consultar status PIX) |
| `efiChargeId` | int/string | ID da cobrança na EFI (para confirmar cartão) |
| `userId` | uuid | ID do usuário dono do payment |
| `planId` | string | `"pro"` |
| `method` | string | `"pix"` ou `"cartao"` |
| `status` | string | `"pending"` / `"approved"` / `"expired"` |

### Checklist PIX
- [ ] `payment.txid` salvo ao criar intent PIX
- [ ] `getPaymentStatus()` chama `efiService.pixDetailCharge({ txid })` quando status = "pending"
- [ ] Quando `situacao === "CONCLUIDA"`: `payment.status = "approved"` + `user.plan = "pro"`
- [ ] `GET /v1/users/me` retorna `plan: "pro"` após aprovação

---

## Resposta esperada pelo frontend após pagamento aprovado

### Status do payment
```json
{ "data": { "paymentId": "pay_xxx", "status": "approved", "method": "pix" } }
```

### Dados do usuário
```json
{ "data": { "id": "uuid", "name": "...", "email": "...", "plan": "pro" } }
```

---

## Usuários que já pagaram e precisam de correção manual no banco
| Usuário | ID | Ação |
|---|---|---|
| Larissa | `b47aa460-1259-484b-b006-07295ac489b9` | Setar `plan = "pro"` |
