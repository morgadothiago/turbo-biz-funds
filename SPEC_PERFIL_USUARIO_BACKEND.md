# Spec: Endpoints de Perfil do Usuário

**Prioridade:** Alta  
**Contexto:** O frontend possui tela de Configurações onde o usuário pode editar nome e telefone. Hoje não existe endpoint para buscar ou atualizar esses dados. Nome e telefone ficam apenas em localStorage — se o usuário trocar de browser ou limpar dados, perde as informações.

---

## Problemas atuais

1. **JWT retornado no login não contém `name`** — frontend cai no fallback `email.split("@")[0]`, exibindo `lary_mello1` em vez de `Larissa Mello`
2. **`GET /v1/users/me` não existe** — frontend não consegue buscar o perfil real após login
3. **`PATCH /v1/users/me` não existe** — frontend não consegue persistir nome e telefone no servidor
4. **Registro aceita `phone` no body mas não retorna no response** — dado some após o cadastro

---

## Endpoints necessários

### 1. `GET /v1/users/me`

Retorna o perfil do usuário autenticado.

**Auth:** Bearer JWT (obrigatório)

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Larissa Mello",
    "email": "lary_mello1@hotmail.com",
    "phone": "(35) 99953-7223",
    "role": "user",
    "plan": "pro"
  }
}
```

---

### 2. `PATCH /v1/users/me`

Atualiza nome e/ou telefone do usuário autenticado.

**Auth:** Bearer JWT (obrigatório)

**Request body:**
```json
{
  "name": "Larissa Mello",
  "phone": "(35) 99953-7223"
}
```

- Ambos os campos são **opcionais** — enviar apenas o que mudar
- `name`: string, mínimo 2 caracteres, máximo 100
- `phone`: string, formato brasileiro `(DD) 9XXXX-XXXX` ou `(DD) XXXX-XXXX`, opcional (pode ser null para remover)

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Larissa Mello",
    "email": "lary_mello1@hotmail.com",
    "phone": "(35) 99953-7223",
    "role": "user",
    "plan": "pro"
  }
}
```

**Erros:**
- `400` — campo inválido (name vazio, phone fora do formato)
- `401` — token inválido ou expirado

---

### 3. Incluir `name` no JWT (ou no response do login)

Hoje o login retorna apenas `{ data: { token } }` e o JWT não contém o campo `name`.

**Opção A (recomendada) — incluir `name` no JWT:**

```json
{
  "sub": "uuid",
  "id": "uuid",
  "email": "lary_mello1@hotmail.com",
  "name": "Larissa Mello",
  "role": "user",
  "plan": "pro",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Opção B — incluir `user` no response do login:**

```json
{
  "data": {
    "token": "jwt...",
    "user": {
      "id": "uuid",
      "name": "Larissa Mello",
      "email": "lary_mello1@hotmail.com",
      "role": "user",
      "plan": "pro"
    }
  }
}
```

> O register já retorna `data.user` com `name` — seria consistente fazer o mesmo no login.

---

### 4. Retornar `phone` no response do registro

Hoje o `RegisterUserResponse` não inclui `phone`, mas o campo é aceito no body.

**Ajuste no `POST /v1/auth/register` response:**

```json
{
  "data": {
    "token": "jwt...",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "(11) 99999-9999",
      "role": "user"
    }
  }
}
```

---

## Resumo das mudanças

| Item | Tipo | Impacto |
|------|------|---------|
| `GET /v1/users/me` | Novo endpoint | Alto — nome real no login |
| `PATCH /v1/users/me` | Novo endpoint | Alto — salvar nome e telefone |
| `name` no JWT ou login response | Alteração | Alto — elimina fallback email prefix |
| `phone` no register response | Alteração | Médio — telefone persistido desde o cadastro |

---

## Como o frontend vai consumir

```
Login → GET /v1/users/me → exibe nome e telefone reais em todo o app
Configurações → PATCH /v1/users/me → persiste no servidor → atualiza estado local
```

Após implementação, o frontend remove o workaround de localStorage e passa a confiar no servidor como fonte de verdade.
