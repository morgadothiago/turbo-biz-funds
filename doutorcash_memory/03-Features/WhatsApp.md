---
title: Feature — Integração WhatsApp
tags:
  - feature
  - whatsapp
  - integração
---

# Feature — Integração WhatsApp

## Localização

```
src/pages/WhatsApp.tsx          # Página de configuração
src/features/dashboard/
└── components/WhatsAppCTA.tsx  # CTA no dashboard
```

## Propósito

Permitir que o usuário:
- Receba relatórios financeiros automaticamente via WhatsApp
- Configure alertas de gastos excessivos por categoria
- Interaja com o bot para registrar transações por mensagem

## Interface de Configuração (`/dashboard/whatsapp`)

- Número de telefone para integração
- Agendamento de relatórios (diário, semanal, mensal)
- Configuração de alertas por categoria

## `WhatsAppCTA` (Dashboard)

- Componente de call-to-action exibido no dashboard
- Aparece quando a integração não está configurada
- Link para `/dashboard/whatsapp`

> [!note] Status
> Funcionalidade de integração real com API WhatsApp depende de configuração de backend (ex: Twilio, WhatsApp Business API). Verificar `docs/MISSING_ENDPOINTS_SPEC.md` para endpoints pendentes.

---

Veja também: [[Dashboard]] | [[../02-Paginas-e-Rotas/Rotas Dashboard]]
