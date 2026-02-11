# Deploy - OrganizaAI

## Ambientes

| Ambiente | URL | Propósito |
|----------|-----|-----------|
| Desenvolvimento | localhost:5173 | Desenvolvimento local |
| staging | - | Testes antes de produção |
| Produção | - | Usuários reais |

## Deploy Local

### Pré-requisitos

```bash
# Node.js 18+
node --version

# npm ou yarn
npm --version
```

### Configuração

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/turbo-biz-funds.git
cd turbo-biz-funds

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações
```

### Desenvolvimento

```bash
npm run dev
# Acessar: http://localhost:5173
```

### Build de Produção

```bash
npm run build
# Output em dist/
```

## Deploy Automático (Vercel)

### Conectar Repositório

1. Acesse [Vercel](https://vercel.com)
2. Clique em "Add New Project"
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente:

```
VITE_API_URL=https://api.sua-app.com
VITE_GA_ID=G-XXXXXXXXXX
```

5. Clique em "Deploy"

### Configurações Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Deploy Manual (Node.js)

### Servidor Ubuntu

```bash
# Atualize o servidor
sudo apt update && sudo apt upgrade -y

# Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instale PM2 para gerenciar processos
sudo npm install -g pm2

# Clone e configure
git clone https://github.com/SEU_USUARIO/turbo-biz-funds.git
cd turbo-biz-funds
npm install
npm run build

# Inicie com PM2
pm2 start npm --name "organizaai" -- run start
pm2 startup
pm2 save
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name sua-app.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Variáveis de Ambiente

### Desenvolvimento

```env
VITE_API_URL=http://localhost:3000/api
VITE_TEST_ADMIN_EMAIL=admin@financeai.com
VITE_TEST_ADMIN_PASSWORD=admin123
```

### Produção

```env
VITE_API_URL=https://api.sua-app.com
VITE_GA_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
```

## Compressão

O build gera versões comprimidas:

- `*.js.br` - Brotli
- `*.js.gz` - Gzip
- `*.css.br` - Brotli
- `*.css.gz` - Gzip

## Cache

Configure cache no seu servidor:

```nginx
# Assets cache por 1 ano
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Monitoramento

### PM2 Dashboard

```bash
pm2 monit
```

### Logs

```bash
pm2 logs organizaai --lines 100
```

## Rollback

```bash
# Liste versões anteriores
pm2 list

# Rollback para versão anterior
pm2 undo organizaai
```

## CI/CD com GitHub Actions

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run build
      
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Checklist de Deploy

- [ ] Tests passando (`npm run test`)
- [ ] Lint passando (`npm run lint`)
- [ ] Build succeedendo (`npm run build`)
- [ ] Variáveis de ambiente configuradas
- [ ] Database migrado (se aplicável)
- [ ] CDN configurado (se aplicável)
- [ ] SSL/HTTPS configurado
- [ ] Monitoramento ativo
- [ ] Logs sendo coletados

## Troubleshooting

### Build Falha

```bash
# Limpe o cache
npm run clean
npm install
npm run build
```

### Assets não carregam

Verifique a configuração de `base` no `vite.config.ts`:

```typescript
export default defineConfig({
  base: './', // ou seu domínio
  // ...
});
```

### Rotas 404 no refresh

Para SPA, configure seu servidor para servir `index.html` em todas as rotas.

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Suporte

- Abra uma issue para bugs
- Discussions para perguntas
- Wiki para documentação adicional
