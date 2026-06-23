# Documentação de Endpoints — Metas Financeiras (Goals)

**Data:** 2026-06-14  
**Solicitante:** Frontend (turbo-biz-funds)

---

## Visão Geral

Metas representam objetivos financeiros do usuário (viagem, casa própria, reserva de emergência etc.).  
O frontend exibe progresso em barra, totais economizados e prazo de conclusão.

---

## Endpoints Necessários

### 1. `GET /v1/goals`

Lista todas as metas do usuário autenticado.

**Autenticação:** Bearer token (JWT)

#### Resposta 200

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Viagem para Europa",
      "target_value": 15000.00,
      "current_value": 4500.00,
      "target_date": "2026-12-31",
      "goal_category": "Viagem"
    }
  ]
}
```

> O frontend também aceita resposta em array direto (sem wrapper `data`):
> ```json
> [{ "id": "...", ... }]
> ```

| Campo            | Tipo           | Descrição                           |
|------------------|----------------|-------------------------------------|
| `id`             | string (uuid)  | Identificador único                 |
| `title`          | string         | Nome da meta                        |
| `target_value`   | number         | Valor alvo (R$)                     |
| `current_value`  | number         | Valor já economizado (R$)           |
| `target_date`    | `YYYY-MM-DD`   | Prazo da meta                       |
| `goal_category`  | string         | Categoria livre (ex: "Viagem")      |

> **Campos `color` e `icon`** são gerados automaticamente pelo frontend com base no índice da lista.  
> Não precisam ser armazenados no backend (mas podem ser se desejado).

#### Respostas de Erro

| Status | Descrição                          |
|--------|------------------------------------|
| `401`  | Token inválido ou expirado         |

---

### 2. `POST /v1/goals`

Cria uma nova meta.

**Autenticação:** Bearer token (JWT)

#### Request Body

```json
{
  "title": "Viagem para Europa",
  "target_value": 15000.00,
  "current_value": 4500.00,
  "target_date": "2026-12-31",
  "goal_category": "Viagem"
}
```

| Campo           | Tipo     | Obrigatório | Regras                         |
|-----------------|----------|-------------|--------------------------------|
| `title`         | string   | sim         | Nome da meta (não vazio)       |
| `target_value`  | number   | sim         | Valor positivo > 0             |
| `current_value` | number   | não         | Default `0`, entre 0 e `target_value` |
| `target_date`   | string   | sim         | Formato `YYYY-MM-DD`           |
| `goal_category` | string   | não         | Default `"Geral"` se omitido   |

#### Resposta 201

```json
{
  "data": {
    "id": "uuid",
    "title": "Viagem para Europa",
    "target_value": 15000.00,
    "current_value": 4500.00,
    "target_date": "2026-12-31",
    "goal_category": "Viagem"
  }
}
```

#### Respostas de Erro

| Status | Descrição                                    |
|--------|----------------------------------------------|
| `400`  | Campos obrigatórios ausentes                 |
| `401`  | Token inválido ou expirado                   |
| `422`  | Validação falhou (valor negativo, data inválida etc.) |

---

### 3. `PATCH /v1/goals/:id`

Atualiza uma meta existente. Suporta atualização parcial.

**Autenticação:** Bearer token (JWT)

> ⚠️ **Atenção:** O PATCH envia os campos no formato **camelCase** (diferente do POST que usa snake_case).  
> O backend deve aceitar ambos os formatos, ou o frontend precisará ser padronizado.

#### Request Body (formato atual enviado pelo frontend)

```json
{
  "name": "Viagem para Europa",
  "target": 15000.00,
  "current": 5000.00,
  "deadline": "2026-12-31",
  "category": "Viagem"
}
```

| Campo      | Tipo     | Obrigatório | Descrição              |
|------------|----------|-------------|------------------------|
| `name`     | string   | não         | Nome da meta           |
| `target`   | number   | não         | Novo valor alvo        |
| `current`  | number   | não         | Novo valor economizado |
| `deadline` | string   | não         | Novo prazo `YYYY-MM-DD`|
| `category` | string   | não         | Nova categoria         |

#### Opção recomendada

Se o backend padronizar tudo em snake_case, o frontend pode ser atualizado para enviar:

```json
{
  "title": "Viagem para Europa",
  "target_value": 15000.00,
  "current_value": 5000.00,
  "target_date": "2026-12-31",
  "goal_category": "Viagem"
}
```

#### Resposta 200

```json
{
  "data": { /* objeto Goal atualizado */ }
}
```

#### Respostas de Erro

| Status | Descrição                          |
|--------|------------------------------------|
| `401`  | Token inválido ou expirado         |
| `404`  | Meta não encontrada                |
| `422`  | Validação falhou                   |

---

### 4. `DELETE /v1/goals/:id`

Remove permanentemente uma meta.

**Autenticação:** Bearer token (JWT)

**Parâmetros de path:** `id` — UUID da meta

#### Resposta 200 ou 204

```json
{ "removed": true }
```

ou corpo vazio (204 No Content).

#### Respostas de Erro

| Status | Descrição                          |
|--------|------------------------------------|
| `401`  | Token inválido ou expirado         |
| `404`  | Meta não encontrada                |

---

## Mapeamento de Campos (Frontend ↔ Backend)

### GET/lista → Frontend

O frontend faz o mapeamento defensivo abaixo (aceita ambos os formatos):

| Campo backend              | Campo frontend |
|----------------------------|----------------|
| `title` ou `name`          | `name`         |
| `current_value` ou `current` | `current`    |
| `target_value` ou `target` | `target`       |
| `target_date` ou `deadline`| `deadline`     |
| `goal_category` ou `category` | `category`  |

### POST (criação) → Backend (snake_case)

| Campo frontend | Campo enviado ao backend |
|----------------|--------------------------|
| `name`         | `title`                  |
| `target`       | `target_value`           |
| `current`      | `current_value`          |
| `deadline`     | `target_date`            |
| `category`     | `goal_category`          |

### PATCH (edição) → Backend (camelCase — inconsistência atual)

| Campo enviado |
|---------------|
| `name`        |
| `target`      |
| `current`     |
| `deadline`    |
| `category`    |

> **Recomendação:** Backend aceitar snake_case e o frontend ser atualizado para enviar  
> `title`, `target_value`, `current_value`, `target_date`, `goal_category` também no PATCH.

---

## Campos Opcionais (não armazenados no backend)

Os campos `color` e `icon` são gerados pelo frontend automaticamente com base na posição da meta na lista.  
Não precisam ser persistidos, mas podem ser adicionados futuramente para personalização.

**Paleta de cores disponível no frontend:**
`bg-blue-500`, `bg-emerald-500`, `bg-amber-500`, `bg-purple-500`, `bg-pink-500`, `bg-teal-500`, `bg-orange-500`, `bg-red-500`

**Ícones disponíveis:**
`🎯`, `🏠`, `✈️`, `🚗`, `💰`, `📱`, `🎓`, `💊`

---

## Sumário dos Endpoints

| Método   | Path              | Função                   |
|----------|-------------------|--------------------------|
| `GET`    | `/v1/goals`       | Lista metas do usuário   |
| `POST`   | `/v1/goals`       | Cria nova meta           |
| `PATCH`  | `/v1/goals/:id`   | Atualiza meta            |
| `DELETE` | `/v1/goals/:id`   | Remove meta              |

---

## Comportamento do Frontend em caso de erro

| Erro do backend | Comportamento frontend                              |
|-----------------|-----------------------------------------------------|
| `404`           | Lista vazia exibida (sem crash), toast info         |
| `422`           | Toast com mensagem do servidor (`error.message`)    |
| `500`           | Toast "Erro no servidor. Tente novamente."          |
| `401`           | Redirect para login (interceptor global)            |
