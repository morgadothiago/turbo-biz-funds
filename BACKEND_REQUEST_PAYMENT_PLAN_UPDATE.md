# Backend Request — PIX não atualiza status

**Data:** 2026-06-23  
**Status:** CRÍTICO — backend não implementou nenhuma das soluções solicitadas

---

## Confirmado pelo Swagger

O Swagger mostra os MESMOS 3 endpoints de payment de antes — nenhuma mudança foi feita:
- `POST /v1/payments/intent` — igual
- `POST /v1/payments/{id}/confirm` — igual  
- `GET /v1/payments/{id}/status` — igual, AINDA retorna "pending" para sempre
- Sem endpoint de webhook

---

## O problema em 1 linha

`GET /v1/payments/{id}/status` lê o banco e retorna `"pending"` para sempre.  
**Nunca consulta a EFI para saber se o PIX foi pago.**

---

## A única mudança necessária no backend

No arquivo/serviço que processa `GET /v1/payments/{paymentId}/status`, adicionar a consulta à EFI:

```typescript
// PaymentsService.getPaymentStatus(paymentId: string)

async getPaymentStatus(paymentId: string) {
  const payment = await this.paymentsRepo.findByPaymentId(paymentId);
  if (!payment) throw new NotFoundException('Payment not found');

  // SE já está aprovado no banco, retorna direto
  if (payment.status === 'approved') {
    return { data: { paymentId, status: 'approved', method: payment.method } };
  }

  // SE é PIX e ainda está pending, consulta a EFI em tempo real
  if (payment.method === 'pix' && payment.status === 'pending') {
    try {
      // Consulta status na EFI usando o txid salvo quando criou o intent
      const efiResponse = await this.efiService.getPixCharge(payment.txid);
      // efiResponse.situacao pode ser: "ATIVA", "CONCLUIDA", "REMOVIDA_PELO_USUARIO_RECEBEDOR", "REMOVIDA_PELO_PSP"

      if (efiResponse.situacao === 'CONCLUIDA') {
        // PIX foi pago — atualiza banco
        await this.paymentsRepo.update(payment.id, { status: 'approved' });
        await this.usersRepo.update(payment.userId, { plan: payment.planId }); // "pro"

        return { data: { paymentId, status: 'approved', method: 'pix' } };
      }

      if (efiResponse.situacao === 'REMOVIDA_PELO_USUARIO_RECEBEDOR' || efiResponse.situacao === 'REMOVIDA_PELO_PSP') {
        await this.paymentsRepo.update(payment.id, { status: 'expired' });
        return { data: { paymentId, status: 'expired', method: 'pix' } };
      }
    } catch (e) {
      // Se falhar a consulta EFI, retorna o status atual do banco
      console.error('Erro ao consultar EFI:', e);
    }
  }

  return { data: { paymentId, status: payment.status, method: payment.method } };
}
```

---

## O que o backend precisa ter salvo no banco

Quando cria o PIX intent (`POST /v1/payments/intent`), o banco precisa salvar:
- `payment.paymentId` = "pay_xxx" (ID interno)
- `payment.txid` = o txid gerado pela EFI (está na resposta da EFI ao criar a cobrança)
- `payment.userId` = ID do usuário
- `payment.planId` = "pro"
- `payment.method` = "pix"
- `payment.status` = "pending"

O txid da EFI aparece na URL do QR Code. Exemplo do nosso teste:  
`qrcodespix.sejaefi.com.br/v2/**87231096055c4f86bb37c346df1119335**`  
→ txid = `87231096055c4f86bb37c346df1119335`

---

## Como consultar a EFI (SDK Node.js)

```typescript
import EfiPay from 'sdk-node-apis-efi';

const efi = new EfiPay({
  client_id: process.env.EFI_CLIENT_ID,
  client_secret: process.env.EFI_CLIENT_SECRET,
  sandbox: false,
  certificate: process.env.EFI_CERTIFICATE_PATH, // arquivo .p12
});

// Consultar cobrança PIX pelo txid
const response = await efi.pixDetailCharge({ txid: payment.txid });
// response.situacao === "CONCLUIDA" → pago
// response.situacao === "ATIVA" → aguardando pagamento
```

---

## Evidência — frontend polls 22+ vezes sem mudança

```
[PIX polling #1]  GET /v1/payments/pay_xxx/status → status: "pending"
[PIX polling #2]  GET /v1/payments/pay_xxx/status → status: "pending"
...
[PIX polling #22] GET /v1/payments/pay_xxx/status → status: "pending"
GET /v1/users/me → plan: "free"   ← nunca muda
```

---

## Checklist

- [ ] `payment.txid` está salvo no banco quando cria PIX intent
- [ ] `getPaymentStatus()` consulta `efi.pixDetailCharge({ txid })` quando status é "pending"
- [ ] Quando `situacao === "CONCLUIDA"`: atualiza `payment.status = "approved"` + `user.plan = "pro"`
- [ ] `GET /v1/users/me` lê `plan` do banco (não do JWT)
- [ ] Corrigir manualmente no banco os usuários que já pagaram (ver lista no canal interno)
