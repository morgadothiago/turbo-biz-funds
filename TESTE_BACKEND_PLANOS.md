# Guia de Teste - Planos (Backend)

## ⚠️ Pré-requisito: Ser Admin Logado

Para criar/editar/deletar planos, você precisa:
1. ✅ Estar **cadastrado como admin** no banco de dados
2. ✅ Estar **logado como admin** (ter um JWT token válido com `role: "admin"`)

---

## 🔧 Passo a Passo para Testar

### 1. Fazer Login como Admin

```bash
# Substitua pelo seu email/senha de admin
curl -X POST "https://api.doutorcashapp.com.br/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@doutorcashapp.com.br",
    "password": "sua_senha_admin"
  }'
```

**Resposta esperada (200 OK):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ Guarde o token:** `SEU_TOKEN_ADMIN="eyJhbGci..."`

---

### 2. Verificar se o Token é Admin

```bash
# Decodificar o JWT para ver se tem role: "admin"
echo "SEU_TOKEN_ADMIN" | cut -d. -f2 | base64 -d 2>/dev/null | jq .

# Ou usar o site: https://jwt.io
```

**O JWT deve conter:**
```json
{
  "sub": "...",
  "email": "admin@doutorcashapp.com.br",
  "role": "admin",   ← IMPORTANTE!
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Se `role` não for `"admin"`, o backend vai retornar 403 (Forbidden)!**

---

### 3. Listar Planos (GET - Admin)

```bash
curl -X GET "https://api.doutorcashapp.com.br/v1/admin/plans" \
  -H "Authorization: Bearer $SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json"
```

**Resposta esperada (200 OK):**
```json
{
  "data": [
    {
      "id": "free",           ← NOME DO PLANO (Opção A)
      "name": "Grátis",
      "description": "...",
      "price": 0,
      "billingPeriod": "mês",
      "subscribers": 50,
      "mrr": 0,
      "popular": false,
      "features": [...]
    }
  ],
  "subscriptions": [...]
}
```

---

### 4. Criar Novo Plano (POST - Testar erro 500)

```bash
curl -X POST "https://api.doutorcashapp.com.br/v1/admin/plans" \
  -H "Authorization: Bearer $SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enterprise",
    "description": "Para grandes empresas",
    "price": 99.90,
    "billingPeriod": "mês",
    "popular": false,
    "features": [
      {"name": "Recursos ilimitados", "included": true},
      {"name": "Usuários ilimitados", "included": true}
    ]
  }' \
  -v 2>&1 | grep -A 30 "< HTTP"
```

**Se der erro 500, verifique no terminal do backend:**
1. Qual linha de código quebrou?
2. Qual é a mensagem de erro completa?
3. O backend está fazendo log do erro?

**Possíveis causas do 500:**
- `price` como `number` (99.90) mas backend espera `string` ("99.90")
- `billingPeriod` com acento ("mês") mas backend espera sem acento ("monthly")
- `features` não está sendo parseado corretamente
- Erro no banco (unique constraint, etc.)

---

### 5. Deletar Plano (DELETE - Testar erro 400)

```bash
# Tentar deletar usando o NOME do plano (Opção A)
curl -X DELETE "https://api.doutorcashapp.com.br/v1/admin/plans/pro" \
  -H "Authorization: Bearer $SEU_TOKEN_ADMIN" \
  -v 2>&1 | grep -A 10 "< HTTP"
```

**Se der 400 (Bad Request):**
- Backend está esperando UUID, mas deve aceitar **nome** (`pro`, `free`)
- Verificar se o backend está usando o `id` como nome (conforme doc `backend-plans-api-requirements-(2).md`)

---

## 🔍 O que verificar no código do Backend

### 1. Controller: `plans.controller.ts` ou `admin.controller.ts`

```typescript
// Verificar se o método create está assim:
@Post()
@UseGuards(AuthGuard('jwt'), AdminGuard)  // ← AdminGuard está presente?
async createPlan(@Body() dto: CreatePlanDto) {
  console.log('Payload recebido:', dto);  // ← ADICIONAR LOG!
  try {
    return await this.plansService.create(dto);
  } catch (error) {
    console.error('Erro ao criar plano:', error);  // ← LOG DO ERRO!
    throw error;
  }
}
```

### 2. Service: `plans.service.ts`

```typescript
async create(dto: CreatePlanDto) {
  console.log('CreatePlanDto:', dto);  // ← LOG!
  
  // Verificar se está salvando o ID como NOME (Opção A)
  const plan = new this.planModel({
    id: dto.name.toLowerCase(),  // ← "enterprise" (nome!), não UUID
    name: dto.name,
    description: dto.description,
    price: dto.price,
    billingPeriod: dto.billingPeriod,
    features: dto.features,
    popular: dto.popular || false,
  });
    
  return await plan.save();
}
```

### 3. DTO: `create-plan.dto.ts`

```typescript
import { IsNumber, IsString, IsBoolean, IsArray, ValidateNested } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()  // ← Aceita number (99.90)? Ou deve ser @IsString()?
  price: number;

  @IsString()
  billingPeriod: string;  // ← Aceita "mês" com acento?

  @IsArray()
  @ValidateNested({ each: true })
  features: { name: string; included: boolean }[];

  @IsBoolean()
  popular?: boolean;
}
```

---

## 🐛 Se der erro 500, adicione logs no backend:

### No Controller:
```typescript
@Post()
async createPlan(@Body() dto: CreatePlanDto, @Req() req) {
  console.log('=== INÍCIO CREATE PLAN ===');
  console.log('User:', req.user);  // Verifica se é admin
  console.log('Payload:', JSON.stringify(dto, null, 2));
  console.log('Price type:', typeof dto.price);
  console.log('BillingPeriod:', dto.billingPeriod);
  console.log('Features:', dto.features);
  
  try {
    const result = await this.plansService.create(dto);
    console.log('Sucesso:', result);
    return result;
  } catch (error) {
    console.error('=== ERRO AO CRIAR PLANO ===');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}
```

---

## ✅ Checklist para o Backend

- [ ] Verificar se o admin está logado com token válido (`role: "admin"` no JWT)
- [ ] Adicionar logs no `POST /v1/admin/plans` para identificar o erro 500
- [ ] Verificar se `price` aceita `number` (99.90) ou se precisa ser `string` ("99.90")
- [ ] Verificar se `billingPeriod` aceita `"mês"` com acento ou se deve ser `"monthly"`
- [ ] Confirmar se o `id` do plano está sendo salvo como **nome** (`free`, `pro`) e não UUID
- [ ] Testar `DELETE /v1/admin/plans/pro` (usando nome, não UUID)

---

## 📞 Exemplo de Erro 500 - O que fazer

Se o backend quebrar, envie para mim:
1. **Log completo do terminal** onde roda o backend
2. **Payload exato** que foi enviado
3. **Linha de código** que deu erro

Com essas informações, consigo te ajudar a corrigir rapidamente! 🚀
