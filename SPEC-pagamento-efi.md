# Integração Efi Bank — DoutorCash

## Status geral

| Funcionalidade | Status |
|---|---|
| Aplicação criada na Efi Bank | ✅ Feito |
| Credenciais de Produção | ✅ Obtidas |
| Credenciais de Homologação (sandbox) | ✅ Obtidas |
| Certificado .p12 | ✅ Baixado e codificado (base64) |
| Serverless Function — PIX | ✅ Criada (aguarda liberação da conta) |
| Serverless Function — PIX Status | ✅ Criada |
| Serverless Function — Cartão de crédito | ✅ Criada |
| PIX liberado na conta Efi Bank | ❌ Pendente — conta 917534-2 sem acesso PIX |
| Chave PIX cadastrada | ❌ Pendente — conta sem acesso ainda |
| Integração na tela de Pagamento | ⏳ Pendente — aguarda chave PIX |
| Deploy das serverless functions | ⏳ Pendente |
| Env vars configuradas no Vercel | ⏳ Pendente |

---

## Credenciais

> ⚠️ Não compartilhar publicamente. Revogar e recriar após testes se necessário.

### Produção
```
Client ID:     Client_Id_7beae1000e4cc82931252f6ae731b38a78506cd2
Client Secret: Client_Secret_8f53cebf90828a066bd37ba709741c33e28a70f4
```

### Homologação (sandbox)
```
Client ID:     Client_Id_f8bc7562fcc6332ad7160bd8248fbfb0acd95270
Client Secret: Client_Secret_560db2b20ff9baa28bf7594c05bded52d1faa80
```

### Certificado .p12
```
Arquivo local: /Users/thiagomorgado/Downloads/producao-917534-key_doutorcash.p12
Env var:       EFI_CERT_BASE64 (já configurada no .env local)
Validade:      23/05/2029
```

---

## Arquivos criados

```
api/
  payment/
    pix.ts          — Cria cobrança PIX imediata, retorna QR code + copia-e-cola
    pix-status.ts   — Consulta status de pagamento PIX por txid
    card.ts         — Processa pagamento via cartão de crédito
```

---

## Variáveis de ambiente necessárias

Configurar no Vercel Dashboard → Settings → Environment Variables:

| Variável | Valor | Ambiente |
|---|---|---|
| `EFI_ENV` | `production` (ou `sandbox` para teste) | All |
| `EFI_CLIENT_ID_PROD` | `Client_Id_7beae...` | All |
| `EFI_CLIENT_SECRET_PROD` | `Client_Secret_8f53...` | All |
| `EFI_CLIENT_ID_SANDBOX` | `Client_Id_f8bc...` | All |
| `EFI_CLIENT_SECRET_SANDBOX` | `Client_Secret_560d...` | All |
| `EFI_PIX_KEY` | sua chave PIX cadastrada | All |
| `EFI_CERT_BASE64` | conteúdo base64 do .p12 | All |

---

## Como liberar PIX na conta Efi Bank

A conta `917534-2` ainda não tem acesso à área PIX.

**Para liberar:**
1. Entrar em contato com suporte Efi Bank
   - Chat em **app.sejaefi.com.br**
   - Telefone: **4007-4442**
2. Solicitar: *"Ativar funcionalidade PIX na conta para uso via API"*
3. Pode ser necessário enviar documentação da empresa (CNPJ)

Após liberar:
1. Acessar **Pix → Minhas chaves** no dashboard
2. Cadastrar uma chave (CPF, CNPJ, e-mail, telefone ou aleatória)
3. Informar a chave para configurar `EFI_PIX_KEY`

---

## Fluxo de pagamento implementado

### PIX
```
Frontend (Pagamento.tsx)
  → POST /api/payment/pix { amount, description }
  → Serverless Function
    → Efi Bank OAuth → token
    → POST /v2/cob → cria cobrança (expira em 1h)
    → GET /v2/loc/{id}/qrcode → QR code + copia-e-cola
  → Retorna { txid, pixCopiaECola, qrcode }

Frontend exibe QR code
  → polling GET /api/payment/pix-status?txid=xxx (a cada 3s)
  → quando status === "CONCLUIDA" → redireciona para /pagamento-sucesso
```

### Cartão de crédito
```
Frontend (Pagamento.tsx)
  → SDK Efi JS tokeniza o cartão (client-side) → paymentToken
  → POST /api/payment/card { amount, installments, paymentToken, customer, billingAddress }
  → Serverless Function
    → Efi Bank OAuth → token
    → POST /v1/charge → cria cobrança
    → POST /v1/charge/{id}/pay → paga com cartão
  → Retorna { chargeId, status }
```

---

## Próximos passos

1. **Você:** Liberar PIX na conta Efi Bank (falar com suporte)
2. **Você:** Cadastrar chave PIX e informar qual é
3. **Dev:** Configurar `EFI_PIX_KEY` no `.env` e Vercel
4. **Dev:** Integrar serverless functions na tela `Pagamento.tsx`
5. **Dev:** Adicionar SDK JS da Efi Bank para tokenização do cartão no frontend
6. **Dev:** Configurar webhook para confirmação automática de PIX
7. **Dev:** Testar em sandbox antes de ir para produção
8. **Dev:** Deploy final e configurar env vars no Vercel

---

## URLs das APIs Efi Bank

| Ambiente | PIX | Cobranças |
|---|---|---|
| Produção | `https://pix.api.efipay.com.br` | `https://cobrancas.api.efipay.com.br` |
| Sandbox | `https://pix-h.api.efipay.com.br` | `https://cobrancas-h.api.efipay.com.br` |

Documentação oficial: https://dev.efipay.com.br
