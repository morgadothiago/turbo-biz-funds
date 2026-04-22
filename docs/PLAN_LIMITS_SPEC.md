# Especificação: Limitação de Uso por Plano

## Objetivo

Implementar restrições de criação de recursos no backend conforme o plano do usuário (`free`, `pro`, `business`).

---

## Limites por Plano

| Recurso | Free | Pro | Business |
|---|---|---|---|
| Transações | 3 total | Ilimitado | Ilimitado |
| Metas (`goals`) | 1 | Ilimitado | Ilimitado |
| Cartões (`cards`) | 1 | Ilimitado | Ilimitado |
| Recorrências | 1 | Ilimitado | Ilimitado |

> **Nota**: O limite de transações no plano Free é **total** (não por mês). Se necessário mudar para mensal, alinhar com o frontend.

---

## Comportamento Esperado

Quando o usuário atingir o limite do seu plano e tentar criar um novo recurso, a API deve retornar:

### HTTP 402 Payment Required

```json
{
  "error": {
    "code": "PLAN_LIMIT_EXCEEDED",
    "message": "Você atingiu o limite de 3 transações no plano gratuito",
    "resource": "transactions",
    "limit": 3,
    "currentCount": 3,
    "upgrade": {
      "url": "/pagamento",
      "plans": ["pro", "business"]
    }
  }
}
```

### Campos obrigatórios na resposta

| Campo | Tipo | Descrição |
|---|---|---|
| `error.code` | string | Sempre `"PLAN_LIMIT_EXCEEDED"` |
| `error.message` | string | Mensagem legível em português |
| `error.resource` | string | `"transactions"`, `"goals"`, `"cards"` ou `"recurrences"` |
| `error.limit` | number | Limite do plano atual |
| `error.currentCount` | number | Quantidade atual do usuário |
| `error.upgrade.url` | string | URL de upgrade |
| `error.upgrade.plans` | string[] | Planos que desbloqueiam o recurso |

---

## Endpoints que Precisam de LimitGuard

### Transações
```
POST /v1/transactions
→ Contar transações do usuário
→ Se count >= limite do plano → retornar 402
```

### Metas
```
POST /v1/goals
→ Contar metas do usuário
→ Se count >= limite do plano → retornar 402
```

### Cartões
```
POST /v1/cards
→ Contar cartões do usuário
→ Se count >= limite do plano → retornar 402
```

### Recorrências
```
POST /v1/recurrences
→ Contar recorrências ativas do usuário
→ Se count >= limite do plano → retornar 402
```

---

## Implementação Sugerida (NestJS)

### 1. Constantes de limite

```typescript
// src/plans/plan-limits.constants.ts

export type PlanSlug = 'free' | 'pro' | 'business';
export type PlanResource = 'transactions' | 'goals' | 'cards' | 'recurrences';

export const PLAN_LIMITS: Record<PlanSlug, Record<PlanResource, number>> = {
  free: {
    transactions: 3,
    goals: 1,
    cards: 1,
    recurrences: 1,
  },
  pro: {
    transactions: Infinity,
    goals: Infinity,
    cards: Infinity,
    recurrences: Infinity,
  },
  business: {
    transactions: Infinity,
    goals: Infinity,
    cards: Infinity,
    recurrences: Infinity,
  },
};
```

### 2. Guard

```typescript
// src/plans/plan-limit.guard.ts

import { CanActivate, ExecutionContext, Injectable, PaymentRequiredException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PLAN_LIMITS, PlanResource } from './plan-limits.constants';

@Injectable()
export class PlanLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly transactionsRepo: TransactionsRepository,
    private readonly goalsRepo: GoalsRepository,
    private readonly cardsRepo: CardsRepository,
    private readonly recurrencesRepo: RecurrencesRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resource = this.reflector.get<PlanResource>('plan_resource', context.getHandler());
    if (!resource) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const plan = user.plan ?? 'free';
    const limit = PLAN_LIMITS[plan][resource];

    if (limit === Infinity) return true;

    const count = await this.getCount(resource, user.id);

    if (count >= limit) {
      throw new HttpException(
        {
          error: {
            code: 'PLAN_LIMIT_EXCEEDED',
            message: `Você atingiu o limite de ${limit} ${resource} no plano gratuito`,
            resource,
            limit,
            currentCount: count,
            upgrade: {
              url: '/pagamento',
              plans: ['pro', 'business'],
            },
          },
        },
        402,
      );
    }

    return true;
  }

  private async getCount(resource: PlanResource, userId: string): Promise<number> {
    switch (resource) {
      case 'transactions': return this.transactionsRepo.countByUser(userId);
      case 'goals': return this.goalsRepo.countByUser(userId);
      case 'cards': return this.cardsRepo.countByUser(userId);
      case 'recurrences': return this.recurrencesRepo.countActiveByUser(userId);
    }
  }
}
```

### 3. Decorator

```typescript
// src/plans/plan-resource.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { PlanResource } from './plan-limits.constants';

export const PlanResource = (resource: PlanResource) =>
  SetMetadata('plan_resource', resource);
```

### 4. Uso nos controllers

```typescript
// Exemplo: TransactionsController

@Post()
@UseGuards(AuthGuard, PlanLimitGuard)
@PlanResource('transactions')
async create(@Body() dto: CreateTransactionDto, @CurrentUser() user: User) {
  return this.transactionsService.create(user.id, dto);
}
```

```typescript
// GoalsController
@Post()
@UseGuards(AuthGuard, PlanLimitGuard)
@PlanResource('goals')
async create(@Body() dto: CreateGoalDto, @CurrentUser() user: User) {
  return this.goalsService.create(user.id, dto);
}
```

```typescript
// CardsController
@Post()
@UseGuards(AuthGuard, PlanLimitGuard)
@PlanResource('cards')
async create(@Body() dto: CreateCardDto, @CurrentUser() user: User) {
  return this.cardsService.create(user.id, dto);
}
```

```typescript
// RecurrencesController
@Post()
@UseGuards(AuthGuard, PlanLimitGuard)
@PlanResource('recurrences')
async create(@Body() dto: CreateRecurrenceDto, @CurrentUser() user: User) {
  return this.recurrencesService.create(user.id, dto);
}
```

---

## JWT Payload

O campo `plan` **deve estar presente no JWT** para que o frontend e o guard funcionem corretamente:

```json
{
  "sub": "user-uuid",
  "email": "user@email.com",
  "role": "user",
  "plan": "free",
  "iat": 1700000000,
  "exp": 1700003600
}
```

> **Importante**: O frontend extrai `plan` do JWT decodificado. Se o campo não estiver no token, o sistema assume `"free"` como padrão.

---

## Fluxo Completo

```
Usuário free com 1 meta tenta criar 2ª meta
  ↓
Frontend: goals.length (1) >= limite free (1) → abre UpgradeModal
  ↓ (se bypassar o frontend)
POST /v1/goals → PlanLimitGuard → count (1) >= limit (1)
  ↓
HTTP 402 { code: "PLAN_LIMIT_EXCEEDED", ... }
  ↓
Frontend client.ts: detecta 402 → dispara evento "plan:limit-exceeded"
```

---

## Testes Recomendados

```typescript
describe('PlanLimitGuard', () => {
  it('deve bloquear criação quando free user atingiu limite de metas (1)', async () => {
    // mock: user.plan = 'free', goalsRepo.countByUser = 1
    // expect: HTTP 402, code: PLAN_LIMIT_EXCEEDED
  });

  it('deve permitir criação quando pro user cria meta (sem limite)', async () => {
    // mock: user.plan = 'pro', goalsRepo.countByUser = 100
    // expect: 201
  });

  it('deve permitir criação quando free user ainda não atingiu limite', async () => {
    // mock: user.plan = 'free', goalsRepo.countByUser = 0
    // expect: 201
  });
});
```
