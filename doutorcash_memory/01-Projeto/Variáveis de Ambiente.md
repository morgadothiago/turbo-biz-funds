---
title: Variáveis de Ambiente
tags:
  - projeto
  - configuração
  - env
---

# Variáveis de Ambiente

> [!warning] Segurança
> Nunca commitar o arquivo `.env` com credenciais reais. Use `.env.example` como template.

## Variáveis do Frontend (prefixo `VITE_`)

Apenas variáveis com prefixo `VITE_` são expostas ao bundle pelo Vite.

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_API_URL` | Sim (prod) | URL base da API. Vazio em dev (usa proxy Vite) |
| `VITE_GA_MEASUREMENT_ID` | Não | Google Analytics 4 Measurement ID |
| `VITE_MIXPANEL_TOKEN` | Não | Token do Mixpanel para analytics |
| `VITE_GOOGLE_CLIENT_ID` | Não | Google OAuth Client ID (login social) |

## Como usar no código

```typescript
// Em qualquer arquivo do src/
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const mode = import.meta.env.MODE; // "development" | "production"
```

## Configuração de Dev (Proxy Vite)

Em desenvolvimento, deixar `VITE_API_URL` vazio ativa o proxy configurado em `vite.config.ts`:

```
/v1 → https://api.doutorcashapp.com.br
```

Isso evita problemas de CORS em desenvolvimento.

## Arquivos de Ambiente

| Arquivo | Quando carregado |
|---------|-----------------|
| `.env` | Sempre |
| `.env.local` | Sempre (gitignored, sobrescreve `.env`) |
| `.env.development` | Apenas em `yarn dev` |
| `.env.production` | Apenas em `yarn build` |
| `.env.test` | Apenas em `yarn test` |

## Template `.env.example`

```bash
# API
VITE_API_URL=https://api.doutorcashapp.com.br

# Analytics (opcional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_MIXPANEL_TOKEN=your_mixpanel_token

# Auth social (opcional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

Veja também: [[../04-API/Configuração do Client]] | [[Arquitetura]]
