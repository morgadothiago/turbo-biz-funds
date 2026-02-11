# Testes E2E - OrganizaAI

Este diretório contém testes end-to-end usando Playwright para validar fluxos críticos da aplicação.

## Estrutura dos Testes

```
e2e/
├── login.spec.ts        # Fluxo de login
├── cadastro.spec.ts     # Fluxo de registro
├── dashboard.spec.ts    # Fluxo do dashboard
├── fixtures.ts          # Fixtures compartilhados
└── README.md           # Este arquivo
```

## Executar Testes

### Executar todos os testes E2E
```bash
npm run test:e2e
```

### Executar com interface visual
```bash
npm run test:e2e:ui
```

### Executar em modo headed (ver navegador)
```bash
npm run test:e2e:headed
```

### Executar testes específicos
```bash
npx playwright test e2e/login.spec.ts
npx playwright test e2e/cadastro.spec.ts
npx playwright test e2e/dashboard.spec.ts
```

### Executar em browser específico
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Fluxos Testados

### Login (`login.spec.ts`)
- ✅ Exibição do formulário de login
- ✅ Login com credenciais admin
- ✅ Login com credenciais usuário
- ✅ Erro para credenciais inválidas
- ✅ Validação de campos vazios
- ✅ Navegação para registro
- ✅ Botão de login Google
- ✅ Persistência de email em falha

### Registro (`cadastro.spec.ts`)
- ✅ Exibição do formulário
- ✅ Validação de nome
- ✅ Validação de email
- ✅ Requisitos de senha
- ✅ Navegação entre steps
- ✅ Seleção de planos
- ✅ Criação de conta
- ✅ Links de termos e privacidade

### Dashboard (`dashboard.spec.ts`)
- ✅ Exibição de estatísticas
- ✅ Gráfico de despesas
- ✅ Categorias de despesas
- ✅ Transações recentes
- ✅ Progresso de metas
- ✅ CTA do WhatsApp
- ✅ Navegação entre páginas
- ✅ Logout
- ✅ Proteção de rotas

## Configuração

O arquivo `playwright.config.ts` contém:
- URL base: `http://localhost:5173`
- Screenshots em falhas
- Vídeo em falhas
- Projetos: Chromium, Firefox, Webkit, Mobile

## Pré-requisitos

1. Instalar dependências:
```bash
npm install
```

2. Instalar browsers do Playwright:
```bash
npx playwright install
```

3. Servidor de desenvolvimento rodando:
```bash
npm run dev
```

## CI/CD

Os testes E2E são executados automaticamente no CI com:
- 2 retries em caso de falha
- Screenshots e vídeos de falhas
- Relatório HTML automático

## Dicas

### Debugging
```bash
npx playwright test e2e/login.spec.ts --debug
```

### Gerar testes
```bash
npx playwright codegen http://localhost:5173
```

### Ver relatório
```bash
npx playwright show-report
```
