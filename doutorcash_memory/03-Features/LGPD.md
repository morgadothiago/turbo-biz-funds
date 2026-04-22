---
title: Feature — LGPD (Proteção de Dados)
tags:
  - feature
  - lgpd
  - privacidade
  - gdpr
---

# Feature — LGPD (Proteção de Dados)

## Localização

```
src/features/lgpd/
└── hooks/
    └── use-lgpd.ts
```

## Propósito

Conformidade com a **Lei Geral de Proteção de Dados (LGPD)** brasileira, equivalente ao GDPR europeu.

Permite ao usuário:
1. **Exportar** todos os seus dados (portabilidade)
2. **Deletar** sua conta e todos os dados associados

## Hook: `use-lgpd`

```typescript
const { exportData, deleteAccount, isExporting, isDeleting } = useLGPD()
```

### Exportar dados
```typescript
exportData() 
// POST /v1/lgpd/export
// Retorna arquivo ZIP com todos os dados do usuário em JSON
```

### Deletar conta
```typescript
deleteAccount()
// DELETE /v1/lgpd
// Remove todos os dados e redireciona para /
```

## Endpoints

| Método | Endpoint | Ação |
|--------|----------|------|
| POST | `/v1/lgpd/export` | Solicitar exportação dos dados |
| DELETE | `/v1/lgpd` | Deletar conta e todos os dados |

## Localização na UI

Acessível em `/dashboard/configuracoes` → aba LGPD/Privacidade.

> [!warning] Ação irreversível
> A deleção de conta é permanente. Deve exigir confirmação explícita do usuário (modal com digitação de senha ou confirmação textual).

---

Veja também: [[../02-Paginas-e-Rotas/Rotas Dashboard]] | [[../06-Estado-e-Hooks/AuthContext]]
