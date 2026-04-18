# Especificação Backend — Autenticação (Login, Cadastro, Recuperação de Senha)

> **Para:** Dev Backend  
> **Projeto:** DoutorCash / OrganizaAI  
> **Data:** 2026-04-16  
> **Base URL esperada pelo frontend:** `VITE_API_URL` + `/v1/...`

---

## Contexto

O frontend já está integrado e aguardando os endpoints abaixo. O cliente HTTP é Axios com `Content-Type: application/json`. Todas as rotas autenticadas enviam o token via header:

```
Authorization: Bearer <jwt>
```

O token é armazenado em `localStorage` com a chave `financeai_token`.

---

## 1. Login

### `POST /v1/auth/login`

#### Request body

```json
{
  "email": "usuario@exemplo.com",
  "password": "Senha123"
}
```

| Campo      | Tipo   | Obrigatório | Validação                   |
|------------|--------|-------------|-----------------------------|
| `email`    | string | sim         | formato de e-mail válido    |
| `password` | string | sim         | mínimo 6 caracteres         |

#### Response — 200 OK

```json
{
  "data": {
    "token": "<jwt>"
  }
}
```

**Atenção:** o frontend espera exatamente a estrutura `{ data: { token } }`.

#### JWT — claims obrigatórios

O frontend decodifica o JWT para montar o objeto `User`. Os seguintes claims são lidos:

| Claim   | Uso no frontend              | Tipo   |
|---------|------------------------------|--------|
| `sub`   | ID do usuário (preferencial) | string |
| `id`    | ID do usuário (fallback)     | string |
| `email` | E-mail exibido               | string |
| `role`  | Controle de rota (ver nota)  | string |

> **Nota sobre `role`:** O frontend redireciona usuários com `role === "admin"` para `/admin` e os demais para `/dashboard`. Inclua `role` no JWT com os valores `"admin"` ou `"user"`.

#### Respostas de erro esperadas

| Status | Situação                           | `message` sugerido                  |
|--------|------------------------------------|-------------------------------------|
| 401    | Credenciais inválidas              | `"Email ou senha inválidos"`        |
| 422    | Payload malformado / falta de campo| `"Dados inválidos"`                 |
| 429    | Rate limit                         | `"Muitas tentativas, tente novamente em X minutos"` |

Formato padrão de erro:

```json
{
  "message": "Email ou senha inválidos",
  "code": "INVALID_CREDENTIALS"
}
```

> O interceptor do Axios lê `response.data.message` e `response.data.code`. Qualquer erro com status **401** limpa o localStorage e redireciona para `/login` automaticamente.

---

## 2. Cadastro

### `POST /v1/auth/register`

#### Request body

```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "Senha123",
  "plan": "pro"
}
```

| Campo      | Tipo   | Obrigatório | Validação                                                    |
|------------|--------|-------------|--------------------------------------------------------------|
| `name`     | string | sim         | mínimo 2, máximo 100 caracteres                              |
| `email`    | string | sim         | formato de e-mail válido, único no sistema                   |
| `password` | string | sim         | mínimo 8 caracteres, ao menos 1 maiúscula e 1 número        |
| `plan`     | string | sim         | valores aceitos: `"free"`, `"pro"`, `"business"`            |

> **Atenção:** O frontend valida `name`, `password` com força total e `confirmPassword` localmente antes de enviar. O campo `confirmPassword` **não é enviado** para a API.

#### Planos disponíveis

| `plan`       | Preço         | Descrição                          |
|--------------|---------------|------------------------------------|
| `"free"`     | R$ 0          | 1 empresa, recursos básicos        |
| `"pro"`      | R$ 97/mês     | 3 empresas, IA + WhatsApp          |
| `"business"` | R$ 297/mês    | Empresas ilimitadas, API + VIP     |

#### Response — 201 Created

```json
{
  "message": "Conta criada com sucesso"
}
```

Após o cadastro o frontend **não faz login automático** — redireciona para `/login` com toast de sucesso pedindo ao usuário que faça login.

#### Respostas de erro esperadas

| Status | Situação                    | `message` sugerido               |
|--------|-----------------------------|----------------------------------|
| 409    | E-mail já cadastrado        | `"Este e-mail já está em uso"`   |
| 422    | Payload inválido            | `"Dados inválidos"`              |

---

## 3. Recuperação de Senha

A tela de login já possui o link "Esqueceu a senha?" apontando para `/recuperar-senha`. **Esta página ainda não foi criada no frontend**, mas os endpoints abaixo já devem existir no backend para que o frontend possa ser conectado.

### 3.1 Solicitar redefinição — `POST /v1/auth/forgot-password`

#### Request body

```json
{
  "email": "usuario@exemplo.com"
}
```

#### Response — 200 OK

```json
{
  "message": "Se este e-mail estiver cadastrado, você receberá as instruções em breve."
}
```

> Retorne sempre 200 independente de o e-mail existir ou não (prevenção de user enumeration).

O backend deve enviar um e-mail com link de redefinição contendo um token de uso único com validade de **1 hora**.

---

### 3.2 Redefinir senha — `POST /v1/auth/reset-password`

#### Request body

```json
{
  "token": "<token-do-email>",
  "password": "NovaSenha123"
}
```

| Campo      | Tipo   | Obrigatório | Validação                                       |
|------------|--------|-------------|-------------------------------------------------|
| `token`    | string | sim         | token válido e não expirado                     |
| `password` | string | sim         | mínimo 8 caracteres, 1 maiúscula e 1 número    |

#### Response — 200 OK

```json
{
  "message": "Senha redefinida com sucesso."
}
```

#### Respostas de erro

| Status | Situação                  | `message` sugerido                          |
|--------|---------------------------|---------------------------------------------|
| 400    | Token inválido ou expirado| `"Link inválido ou expirado"`               |
| 422    | Senha fraca               | `"A senha não atende os requisitos mínimos"`|

---

## 4. Refresh de Token (recomendado)

O frontend não implementa refresh automático ainda, mas **preparar o endpoint** evita retrabalho:

### `POST /v1/auth/refresh`

```json
// Request
{ "refreshToken": "<refresh_jwt>" }

// Response 200
{ "data": { "token": "<novo_access_jwt>" } }
```

---

## 5. Logout (opcional, para invalidação server-side)

### `POST /v1/auth/logout`

Requer header `Authorization: Bearer <token>`.

```json
// Response 200
{ "message": "Logout realizado com sucesso" }
```

O frontend já faz logout local limpando o `localStorage` — este endpoint é opcional para blacklist de tokens.

---

## 6. OAuth Google (tela já tem botão)

O botão "Continuar com Google" existe nas telas de Login e Cadastro mas **ainda não está conectado**. Quando for implementar:

- Client ID configurado via `VITE_GOOGLE_CLIENT_ID` no frontend
- Endpoint sugerido: `POST /v1/auth/google` recebendo o `id_token` do Google
- Response: mesmo formato do login — `{ data: { token } }`

---

## 7. Resumo dos Endpoints

| Método | Endpoint                     | Auth necessária | Status |
|--------|------------------------------|-----------------|--------|
| POST   | `/v1/auth/login`             | Não             | **Prioritário** |
| POST   | `/v1/auth/register`          | Não             | **Prioritário** |
| POST   | `/v1/auth/forgot-password`   | Não             | Prioritário     |
| POST   | `/v1/auth/reset-password`    | Não             | Prioritário     |
| POST   | `/v1/auth/refresh`           | Não             | Recomendado     |
| POST   | `/v1/auth/logout`            | Sim (Bearer)    | Opcional        |
| POST   | `/v1/auth/google`            | Não             | Futuro          |

---

## 8. Configuração de Ambiente (frontend)

O frontend lê a URL base da API via variável de ambiente:

```env
# .env (desenvolvimento)
VITE_API_URL=http://localhost:3000

# produção
VITE_API_URL=https://api.seudominio.com
```

Em desenvolvimento com `VITE_API_URL` vazio, o Vite proxy encaminha `/v1/*` para a API local — configure `vite.config.ts` se necessário.

---

## 9. CORS

O backend precisa aceitar requisições de:

- `http://localhost:5173` (dev Vite)
- `http://localhost:3000` (se rodar localmente)
- Domínio de produção (a definir)

Headers mínimos necessários:

```
Access-Control-Allow-Origin: <origem>
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```
