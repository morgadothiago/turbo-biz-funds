# Especificação Completa - Recorrências

Este documento consolida todas as informações necessárias para implementar a funcionalidade de Recorrências.

---

## Visão Geral

As recorrências permitem que o usuário cadastre transações que se repetem automaticamente (diária, semanal, mensal ou anualmente). O sistema pode gerar lançamentos futuros automaticamente com base nessas recorrências.

---

## Funcionalidades Esperadas

### 1. Cadastro de Recorrência
- Selecionar categoria
- Definir tipo (receita/despesa)
- Informar valor
- Definir descrição (opcional)
- Escolher frequência (diária, semanal, mensal, anual)
- Data de início
- Data de fim (opcional)

### 2. Listagem de Recorrências
- Exibir todas as recorrências ativas
- Mostrar total de receitas e despesas recorrentes
- Permitir desativar/reativar recorrências

### 3. Geração de Lançamentos
- Gerar lançamentos futuros com base nas recorrências ativas
- Criar transações no banco de dados para os próximos períodos

---

## Endpoints Necessários

### GET /v1/recurrences/active
Lista todas as recorrências ativas do usuário.

**Resposta esperada:**
```json
{
  "data": [
    {
      "id": "uuid",
      "category_id": "uuid-da-categoria",
      "category_name": "Assinaturas",
      "type": "EXPENSE",
      "amount": 55.90,
      "description": "Netflix",
      "frequency": "monthly",
      "start_date": "2026-01-01",
      "end_date": null,
      "active": true,
      "created_at": "2026-01-01T10:30:00Z"
    }
  ]
}
```

---

### POST /v1/recurrences
Cria uma nova recorrência.

**Payload esperado:**
```json
{
  "category_id": "uuid-da-categoria",
  "type": "EXPENSE",
  "amount": 55.90,
  "description": "Netflix",
  "frequency": "monthly",
  "start_date": "2026-01-01",
  "end_date": null
}
```

**Campos:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|--------------|-----------|
| category_id | string | Sim | ID da categoria |
| type | string | Sim | "INCOME" ou "EXPENSE" |
| amount | number | Sim | Valor em centavos (ex: 55.90 = R$ 55,90) |
| description | string | Não | Descrição da recorrência |
| frequency | string | Sim | "daily", "weekly", "monthly" ou "yearly" |
| start_date | string | Sim | Data de início (YYYY-MM-DD) |
| end_date | string | Não | Data de fim (YYYY-MM-DD), pode ser null |

**Resposta esperada (201):**
```json
{
  "data": {
    "id": "uuid",
    "category_id": "uuid",
    "type": "EXPENSE",
    "amount": 55.90,
    "description": "Netflix",
    "frequency": "monthly",
    "start_date": "2026-01-01",
    "end_date": null,
    "active": true,
    "created_at": "2026-02-01T10:30:00Z"
  }
}
```

---

### PUT /v1/recurrences/{id}
Atualiza uma recorrência existente.

**Payload (todos os campos são opcionais):**
```json
{
  "category_id": "uuid-da-categoria",
  "type": "EXPENSE",
  "amount": 65.90,
  "description": "Netflix atualizado",
  "frequency": "monthly",
  "start_date": "2026-01-01",
  "end_date": "2027-01-01",
  "active": false
}
```

**Resposta esperada (200):**
```json
{
  "data": {
    "id": "uuid",
    "updated_at": "2026-02-15T10:30:00Z"
  }
}
```

---

### DELETE /v1/recurrences/{id}
Remove uma recorrência.

**Resposta esperada (200):**
```json
{
  "data": {
    "removed": true
  }
}
```

---

### POST /v1/recurrences/generate
Gera lançamentos futuros baseado nas recorrências ativas.

**Request:** (corpo vazio)

**Resposta esperada (200):**
```json
{
  "data": {
    "generated": 15
  }
}
```

---

## Frequencies Válidas

| Valor | Descrição | Exemplo de recorrência |
|-------|-----------|------------------------|
| daily | Diário | Luz (todo dia) |
| weekly | Semanal | Academia (todas as quintas) |
| monthly | Mensal | Netflix (todo dia 15) |
| yearly | Anual | IPTU (todo ano em janeiro) |

---

## Tipos de Transação

| Valor | Descrição |
|-------|-----------|
| INCOME | Receita (entrada de dinheiro) |
| EXPENSE | Despesa (saída de dinheiro) |

---

## Códigos de Status HTTP

| Código | Significado | Ação recomendada |
|--------|-------------|-------------------|
| 200 | Sucesso | Exibir dados normalmente |
| 201 | Criado | Exibir mensagem de sucesso |
| 400 | Requisição inválida | Mostrar erro genérico |
| 401 | Não autenticado | Redirecionar para login |
| 404 | Recurso não encontrado | Mostrar "não encontrado" |
| 422 | Dados inválidos | Mostrar mensagem de validação do backend |
| 500 | Erro interno | Mostrar "tente novamente mais tarde" |

---

## Cenários de Erro

### 1. Endpoint não existe (404)
O frontend está mostrando erro ao criar recorrência.

**Causa possível:** Endpoint `/v1/recurrences` não foi criado no backend.

**Solução:** Criar o endpoint no backend.

---

### 2. Validação falhou (422)
O backend retorna erro de validação.

**Exemplo de resposta de erro:**
```json
{
  "message": "Dados inválidos",
  "errors": {
    "category_id": ["Categoria não encontrada"],
    "amount": ["Valor deve ser maior que 0"]
  }
}
```

**Solução:** Implementar validações e retornar erros específicos para o frontend exibir.

---

## Frontend - Estado Atual

### Tela de Recorrências (Recorrencias.tsx)

O frontend envia o payload no formato:
```json
{
  "category_id": "uuid",
  "type": "EXPENSE",
  "amount": 55.90,
  "description": "Netflix",
  "frequency": "monthly",
  "start_date": "2026-01-01",
  "end_date": null
}
```

### Hook (use-recurrences.ts)

```typescript
// Payload enviado pelo frontend
interface RecurrencePayload {
  category_id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description?: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date?: string | null;
}
```

---

## Checklist de Implementação

### Backend precisa implementar:

- [ ] GET `/v1/recurrences/active` - Listar recorrências ativas
- [ ] POST `/v1/recurrences` - Criar recorrência
- [ ] PUT `/v1/recurrences/{id}` - Atualizar recorrência
- [ ] DELETE `/v1/recurrences/{id}` - Deletar recorrência
- [ ] POST `/v1/recurrences/generate` - Gerar lançamentos futuros

### Validações necessárias:

- [ ] category_id deve existir no banco
- [ ] type deve ser "INCOME" ou "EXPENSE"
- [ ] amount deve ser maior que 0
- [ ] frequency deve ser um valor válido
- [ ] start_date deve ser data válida
- [ ] end_date deve ser maior que start_date (se informado)

---

## Fluxo de Uso

```
1. Usuário acessa tela de Recorrências
   └─> GET /v1/recurrences/active

2. Usuário clica em "Nova Recorrência"
   └─> Preenche formulário

3. Usuário clica em "Criar"
   └─> POST /v1/recurrences

4. Sistema cria recorrência e retorna sucesso

5. (Opcional) Usuário clica em "Gerar Lançamentos"
   └─> POST /v1/recurrences/generate
   └─> Sistema cria transações futuras
```

---

## Exemplos de Dados

### Receitas Recorrentes
- Salário: monthly, todo dia 5
- Aluguel recebido: monthly, todo dia 10
-freelance: weekly, toda sexta

### Despesas Recorrentes
- Netflix: monthly, todo dia 15
- Conta de luz: monthly, todo dia 20
- Academia: monthly, todo dia 1
- IPTU: yearly, todo janeiro

---

## Observações

1. O endpoint de listar pode retornar tanto um array direto quanto um objeto com `data`:
   - `{ "data": [...] }` ou `[...]`

2. O campo `amount` deve aceitar decimais (ex: 55.90)

3. O frontend trata erros 404/500 mostrando dados vazios, mas precisa do endpoint funcionando para criar novas recorrências

4. A geração de lançamentos deve criar transações futuras baseadas na frequência e data de início de cada recorrência ativa