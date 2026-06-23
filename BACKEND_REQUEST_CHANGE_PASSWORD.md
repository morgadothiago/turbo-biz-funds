# Solicitação: Endpoint para Alteração de Senha

**Data:** 2026-06-13  
**Solicitante:** Frontend (turbo-biz-funds)

---

## Problema

A tela de Configurações do usuário possui um formulário funcional de alteração de senha.  
O frontend chama atualmente `PATCH /v1/users/me/password` e recebe **404 — rota inexistente**.

---

## Endpoint Necessário

### `PATCH /v1/users/me/password`

**Autenticação:** Bearer token (JWT) no header `Authorization`

#### Request Body

```json
{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha456"
}
```

| Campo             | Tipo   | Obrigatório | Regras                                      |
|-------------------|--------|-------------|---------------------------------------------|
| `currentPassword` | string | sim         | Senha atual do usuário                      |
| `newPassword`     | string | sim         | Mín. 8 chars, 1 maiúscula, 1 número        |

#### Respostas Esperadas

| Status | Descrição                         |
|--------|-----------------------------------|
| `200`  | Senha alterada com sucesso        |
| `400`  | Validação falhou (body inválido)  |
| `401`  | `currentPassword` incorreta ou token inválido |
| `422`  | `newPassword` não atende aos requisitos |

#### Exemplo de Resposta 200

```json
{
  "message": "Senha alterada com sucesso"
}
```

---

## Contexto Atual no Frontend

- Endpoint chamado: `PATCH /v1/users/me/password`
- Método HTTP no `AuthContext`: `api.patch("/v1/users/me/password", { currentPassword, newPassword })`
- O frontend já trata `401` como "senha atual incorreta" e exibe toast de erro
- Validação client-side já aplicada: mín. 8 chars + maiúscula + número + confirmação de senha

---

## Alternativa Aceita

Se preferir rota diferente, qualquer uma abaixo funciona — só comunicar para atualizar o frontend:

- `POST /v1/auth/change-password`
- `PATCH /v1/auth/change-password`
- `PATCH /v1/users/me` aceitando `currentPassword` + `newPassword` no body
