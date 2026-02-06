# 🚀 CI/CD - GitHub Actions + Vercel

Este documento explica como configurar o pipeline de CI/CD para executar testes automaticamente antes de fazer deploy na Vercel.

## 📋 Fluxo do Pipeline

```
Push para main/master
       ↓
┌─────────────────┐
│ 1. Lint & Type  │
│    Check        │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 2. Unit Tests   │
│   (Vitest)      │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 3. E2E Tests    │
│  (Playwright)   │
└────────┬────────
         ↓
┌─────────────────┐
│ 4. Build        │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 5. Deploy       │
│   (Vercel)      │
└─────────────────┘
```

## 🔧 Configuração

### 1. Obter Tokens da Vercel

Você precisa de 3 informações da Vercel:

#### a) Vercel Token
1. Acesse: https://vercel.com/account/tokens
2. Clique em "Create Token"
3. Dê um nome (ex: "GitHub Actions")
4. Copie o token gerado

#### b) Org ID e Project ID
1. No seu projeto na Vercel, vá em **Settings** → **General**
2. Role até a seção **Root Directory**
3. Você verá algo assim:
   ```
   PROJECT_ID: prj_xxxxxxxxxxxxxxxx
   ORG_ID: team_xxxxxxxxxxxxxxxx
   ```

### 2. Configurar Secrets no GitHub

1. No GitHub, vá em: **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione os 3 secrets:

| Nome | Valor |
|------|-------|
| `VERCEL_TOKEN` | Token gerado no passo 1a |
| `VERCEL_ORG_ID` | Org ID do passo 1b |
| `VERCEL_PROJECT_ID` | Project ID do passo 1b |

## 🎯 Comportamento do Workflow

### Em Pull Requests:
- ✅ Executa Lint
- ✅ Executa Type Check
- ✅ Executa Testes Unitários
- ✅ Executa Testes E2E
- ✅ Faz Build
- ❌ **NÃO faz deploy** (só testa)

### Em Push para main/master:
- ✅ Executa TODOS os passos acima
- ✅ **Faz deploy na Vercel** (produção)

### Em outros branches:
- ✅ Executa TODOS os testes
- ❌ **NÃO faz deploy**

## 📊 Verificação de Qualidade

O pipeline verifica:

1. **Lint** - Código segue padrões ESLint
2. **Type Check** - TypeScript sem erros
3. **Unit Tests** - 70%+ de cobertura
4. **E2E Tests** - Fluxos críticos funcionando
5. **Build** - Aplicação compila sem erros

## 🚨 Se o Pipeline Falhar

Se algum teste falhar:
1. ❌ **Deploy é BLOQUEADO automaticamente**
2. Você recebe notificação no GitHub
3. Corrija os erros e faça novo commit
4. O pipeline recomeça automaticamente

## 🔍 Visualizando Resultados

### No GitHub:
1. Vá na aba **Actions** do repositório
2. Clique no workflow mais recente
3. Veja o status de cada job

### Reports:
- **Coverage**: Disponível em `coverage-report` (artifacts)
- **E2E**: Screenshots e vídeos em `playwright-report` (artifacts)

## 📝 Exemplo de Uso

### Cenário 1: Desenvolvimento Normal
```bash
# Você faz alterações
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# GitHub Actions automaticamente:
# 1. Roda lint ✅
# 2. Roda testes ✅
# 3. Faz build ✅
# 4. Deploy na Vercel ✅
```

### Cenário 2: Pull Request
```bash
# Cria PR para main
git checkout -b feature/nova-func
# ... faz alterações ...
git push origin feature/nova-func

# No GitHub, cria PR
# GitHub Actions roda TODOS os testes
# Se passar, você pode fazer merge
```

### Cenário 3: Teste Falhou
```bash
git push origin main

# GitHub Actions:
# 1. Roda lint ✅
# 2. Roda testes ❌ (falhou!)
# 3. Deploy BLOQUEADO ❌

# Você corrige...
git add .
git commit -m "fix: corrige teste quebrado"
git push origin main

# Pipeline recomeça...
```

## 🎨 Customização

### Alterar cobertura mínima:
Edite `vitest.config.ts`:
```typescript
thresholds: {
  lines: 80,      // Aumente para 80%
  functions: 80,
  branches: 70,
  statements: 80,
}
```

### Adicionar notificação Slack/Discord:
Adicione no final do arquivo `.github/workflows/ci-cd.yml`:
```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,eventName
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Deploy em Preview (não produção):
Altere o job de deploy:
```yaml
vercel-args: ''  # Remove --prod
```

## 🔒 Segurança

- **NUNCA** commit tokens diretamente no código
- Use sempre `secrets.XXX` no workflow
- Tokens da Vercel têm permissões limitadas
- Revogue tokens antigos periodicamente

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no GitHub Actions
2. Confira se os secrets estão configurados corretamente
3. Teste localmente: `npm run test && npm run build`
4. Verifique se o projeto builda localmente

## ✅ Checklist de Configuração

- [ ] Criar Vercel Token
- [ ] Obter Org ID e Project ID
- [ ] Adicionar 3 secrets no GitHub
- [ ] Testar push em branch de feature
- [ ] Verificar se testes rodam
- [ ] Fazer merge para main e verificar deploy

**Pronto! Seu projeto agora tem CI/CD completo!** 🚀
