# Spec: Sistema de Notificações — DoutorCash

**Data:** 2026-05-27  
**Solicitante:** Frontend  
**Prioridade:** Alta

---

## Contexto

O frontend já possui a UI de notificações pronta (sino no header, sheet lateral, página `/dashboard/notificacoes`). Atualmente as notificações são geradas **client-side** a partir dos dados de recorrências. Precisamos migrar para notificações **server-side** para suportar alertas em tempo real, histórico persistido e futuramente push notifications.

---

## 1. Banco de Dados

### Tabela `notifications`

```sql
CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         VARCHAR(50)  NOT NULL,
  severity     VARCHAR(10)  NOT NULL,
  title        VARCHAR(255) NOT NULL,
  body         TEXT         NOT NULL,
  action_label VARCHAR(100),
  action_href  VARCHAR(255),
  dedup_key    VARCHAR(255) UNIQUE,   -- evita duplicatas no cron
  read_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread
  ON notifications(user_id, read_at)
  WHERE read_at IS NULL;

CREATE INDEX idx_notifications_user_created
  ON notifications(user_id, created_at DESC);
```

### Valores válidos

| Campo | Valores |
|-------|---------|
| `type` | `rec_overdue` \| `rec_today` \| `rec_soon` \| `activity` \| `system` |
| `severity` | `error` \| `warning` \| `info` \| `success` |

---

## 2. Endpoints

### `GET /v1/notifications`

Retorna notificações do usuário autenticado, ordenadas por `created_at DESC`.

**Query params opcionais:**

| Param | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| `limit` | number | 50 | Máximo de itens |
| `unread` | boolean | — | Se `true`, retorna apenas não lidas |

**Response `200`:**

```json
{
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "type": "rec_overdue",
      "severity": "error",
      "title": "Pagamento atrasado: Aluguel",
      "body": "Venceu há 2 dias (25/05/2026). Valor: R$ 1.200,00",
      "action": {
        "label": "Ver recorrência",
        "href": "/dashboard/recorrencias/abc123"
      },
      "readAt": null,
      "createdAt": "2026-05-27T08:00:00Z"
    },
    {
      "id": "7cb12e11-...",
      "type": "rec_today",
      "severity": "warning",
      "title": "Último dia para pagar: Netflix",
      "body": "Netflix vence hoje (27/05/2026). Valor: R$ 55,90",
      "action": {
        "label": "Ver recorrência",
        "href": "/dashboard/recorrencias/def456"
      },
      "readAt": null,
      "createdAt": "2026-05-27T08:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

---

### `PATCH /v1/notifications/:id/read`

Marca uma notificação como lida. Só permite marcar notificações do próprio usuário.

**Response `200`:**

```json
{
  "data": {
    "id": "3fa85f64-...",
    "readAt": "2026-05-27T14:35:00Z"
  }
}
```

**Response `404`** se notificação não existe ou pertence a outro usuário.

---

### `POST /v1/notifications/read-all`

Marca todas as notificações do usuário autenticado como lidas.

**Response `200`:**

```json
{
  "data": {
    "updated": 5
  }
}
```

---

## 3. Job Agendado (Cron)

**Horário:** Todo dia às **07:00** (horário de Brasília)

### Lógica para cada usuário com recorrências ativas:

```
Para cada recorrência WHERE active = true AND type = 'EXPENSE':

  1. Calcular next_due_date (próxima ocorrência >= hoje)
     - frequency = 'daily'   → startDate + N dias
     - frequency = 'weekly'  → startDate + N semanas
     - frequency = 'monthly' → startDate + N meses
     - frequency = 'yearly'  → startDate + N anos
     (avançar N até que next_due >= hoje)
     
  2. Se endDate existe e next_due > endDate → recorrência encerrada, ignorar

  3. Calcular dias_ate_vencimento = next_due_date - hoje

  4. Inserir notificação conforme tabela abaixo:
```

| Condição | type | severity | Título | dedup_key |
|----------|------|----------|--------|-----------|
| `dias_ate_vencimento < 0` | `rec_overdue` | `error` | `Pagamento atrasado: {description}` | `rec_overdue-{rec_id}-{next_due}` |
| `dias_ate_vencimento = 0` | `rec_today` | `warning` | `Último dia para pagar: {description}` | `rec_today-{rec_id}-{next_due}` |
| `dias_ate_vencimento = 1` | `rec_soon` | `info` | `Vence amanhã: {description}` | `rec_soon-{rec_id}-{next_due}` |
| `dias_ate_vencimento = 2` | `rec_soon` | `info` | `Vence em 2 dias: {description}` | `rec_soon-{rec_id}-{next_due}` |
| `dias_ate_vencimento = 3` | `rec_soon` | `info` | `Vence em 3 dias: {description}` | `rec_soon-{rec_id}-{next_due}` |

**Template do body:**

```
rec_overdue: "Venceu há {N} dia(s) ({data_formatada}). Valor: R$ {amount}"
rec_today:   "{description} vence hoje ({data_formatada}). Valor: R$ {amount}"
rec_soon:    "{description} vence em {data_formatada}. Valor: R$ {amount}"
```

**Dedup:** Usar `INSERT ... ON CONFLICT (dedup_key) DO NOTHING` para não duplicar ao rodar o cron.

---

## 4. Eventos em Mutations

### Criação de recorrência — `POST /v1/recurrences` (on success)

```json
{
  "type": "activity",
  "severity": "success",
  "title": "Recorrência criada",
  "body": "{description} — R$ {amount} ({frequency_label})",
  "action_label": "Ver recorrências",
  "action_href": "/dashboard/recorrencias"
}
```

### Edição de recorrência — `PATCH /v1/recurrences/:id` (on success)

```json
{
  "type": "activity",
  "severity": "info",
  "title": "Recorrência editada",
  "body": "{description} foi atualizada",
  "action_label": "Ver recorrências",
  "action_href": "/dashboard/recorrencias"
}
```

### Labels de frequency para o body:

| Valor | Label |
|-------|-------|
| `daily` | Diário |
| `weekly` | Semanal |
| `monthly` | Mensal |
| `yearly` | Anual |

---

## 5. Interface esperada pelo Frontend

O frontend espera exatamente este shape no response de `GET /v1/notifications`:

```typescript
interface UserNotification {
  id: string;
  type: string;
  severity: "error" | "warning" | "info" | "success";
  title: string;
  body: string;
  action?: {
    label: string;
    href: string;
  };
  readAt: string | null;   // ISO 8601
  createdAt: string;       // ISO 8601
}

interface NotificationsResponse {
  data: UserNotification[];
  unreadCount: number;
}
```

> ⚠️ Os campos `action_label` e `action_href` do banco devem ser serializados como `action: { label, href }` no response JSON.

---

## 6. Checklist de Entrega

- [ ] Migration: tabela `notifications` com índices
- [ ] `GET /v1/notifications` com paginação e filtro `unread`
- [ ] `PATCH /v1/notifications/:id/read`
- [ ] `POST /v1/notifications/read-all`
- [ ] Cron diário 07:00 BRT com dedup por `dedup_key`
- [ ] Evento ao criar recorrência
- [ ] Evento ao editar recorrência
- [ ] Testes: cron não duplica notificações ao rodar 2x no mesmo dia

---

## 7. Notas Adicionais

- Autenticação via **Bearer JWT** (padrão atual da API)
- Fuso horário para o cron: `America/Sao_Paulo`
- Manter histórico de notificações por **90 dias** (job de limpeza opcional)
- Notificações de `activity` não precisam de `dedup_key` (cada ação gera uma nova)
- Quando o backend estiver pronto, o frontend só precisa trocar a fonte de dados no hook — a UI já está implementada
