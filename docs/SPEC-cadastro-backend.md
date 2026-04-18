# Especificação de Registro de Usuário - Backend

## Endpoint

```
POST /v1/auth/register
Content-Type: application/json
```

## Dados Recebidos do Frontend

O frontend está enviando atualmente:

```json
{
  "email": "string",
  "password": "string"
}
```

## Dados Necessários (Frontend + Backend)

O formulário de cadastro coleta os seguintes dados do usuário:

| Campo | Tipo | Obrigatório | Validação |
|-------|------|--------------|-----------|
| name | string | ✅ Sim | Mínimo 2 caracteres |
| email | string | ✅ Sim | Formato email válido |
| password | string | ✅ Sim | Mínimo 8 caracteres, 1 letra maiúscula, 1 número |
| confirmPassword | string | ✅ Sim | Deve ser igual ao password |
| plan | string | ✅ Sim | Valores: `free`, `pro`, `business` |

### Payload esperado:

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "Senha123",
  "plan": "pro"
}
```

## Response de Sucesso (201)

```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user"
  },
  "token": "jwt_token_aqui"
}
```

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 201 | Usuário criado com sucesso |
| 400 | Dados inválidos (email já existe, senha fraca, etc.) |
| 422 | Erro de validação específico |

## Observações

1. A validação de `confirmPassword` é feita exclusivamente no frontend (não enviar para backend)
2. O campo `plan` deve ser armazenado para posteriormente atribuir a assinatura ao usuário
3. Após o registro, o usuário deve receber um token JWT para autenticação automática