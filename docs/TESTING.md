# Guia de Testes - OrganizaAI

Este documento fornece um guia completo sobre como executar e criar testes no projeto OrganizaAI.

## 🧪 Tipos de Testes

O projeto utiliza diferentes tipos de testes para garantir qualidade:

### 1. Testes Unitários
Testam funções e hooks isoladamente.

**Localização:** `src/**/*.test.ts` ou `src/**/*.test.tsx`

### 2. Testes de Componentes
Testam componentes React individualmente.

**Localização:** `src/components/**/*.test.tsx`

### 3. Testes de Integração
Testam a integração entre múltiplos componentes.

**Localização:** `src/pages/**/*.test.tsx`

### 4. Testes E2E (End-to-End)
Testam o fluxo completo da aplicação no navegador.

**Localização:** `e2e/**/*.spec.ts`

### 5. Testes de Acessibilidade
Verificam conformidade com padrões de acessibilidade (WCAG).

**Localização:** `src/test/accessibility.test.tsx`

## 🚀 Comandos de Teste

### Executar todos os testes unitários
```bash
npm test
```

### Executar testes em modo watch (desenvolvimento)
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

### Executar testes E2E
```bash
npm run test:e2e
```

### Executar testes E2E com interface visual
```bash
npm run test:e2e:ui
```

### Executar todos os testes (unitários + E2E)
```bash
npm run test:all
```

## 📁 Estrutura de Testes

```
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.test.tsx
│   │   │   ├── input.test.tsx
│   │   │   └── card.test.tsx
│   ├── contexts/
│   │   └── AuthContext.test.tsx
│   ├── lib/
│   │   └── utils.test.ts
│   ├── pages/
│   │   └── Login.test.tsx
│   └── test/
│       ├── setup.ts
│       └── accessibility.test.tsx
├── e2e/
│   └── auth.spec.ts
├── playwright.config.ts
└── vitest.config.ts
```

## 📝 Exemplos de Testes

### Teste Unitário (Função)

```typescript
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });
});
```

### Teste de Componente

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button component", () => {
  it("should handle click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Teste de Integração

```typescript
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";

describe("Login Page", () => {
  it("should render login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });
});
```

### Teste E2E

```typescript
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@email.com');
  await page.getByLabel('Senha').fill('password123');
  await page.getByRole('button', { name: /entrar/i }).click();
  
  await expect(page).toHaveURL(/.*dashboard/);
});
```

## 🎯 Boas Práticas

### 1. Nomenclatura
- Use descrições claras no `describe` e `it`
- Siga o padrão: "should [expected behavior] when [condition]"

```typescript
describe("User authentication", () => {
  it("should display error message when credentials are invalid", () => {
    // test code
  });
});
```

### 2. Arrange-Act-Assert
```typescript
it("should calculate total correctly", () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(30);
});
```

### 3. Mocks
Use mocks para isolar o componente sendo testado:

```typescript
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));
```

### 4. Cobertura de Código
Mantenha a cobertura acima de:
- Linhas: 70%
- Funções: 70%
- Branches: 60%
- Statements: 70%

## 🔍 Debugging

### Console no teste
```typescript
it("should debug", () => {
  const result = someFunction();
  console.log("Result:", result); // Aparece no terminal
});
```

### Playwright Inspector
```bash
npx playwright test --debug
```

### Screenshots em testes E2E
```typescript
test('example', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'screenshot.png' });
});
```

## 📊 Cobertura

Para gerar relatório de cobertura:

```bash
npm run test:coverage
```

O relatório será gerado em `coverage/` com visualização HTML.

## 🎭 Dicas para Playwright

### Gravar ações automaticamente
```bash
npx playwright codegen http://localhost:8080
```

### Executar testes em modo headed (com navegador visível)
```bash
npx playwright test --headed
```

### Executar testes em modo UI
```bash
npx playwright test --ui
```

## 🔧 Configurações Importantes

### Vitest (vitest.config.ts)
- Ambiente: jsdom
- Setup: src/test/setup.ts
- Cobertura: v8 provider

### Playwright (playwright.config.ts)
- Base URL: http://localhost:8080
- Browsers: Chromium, Firefox, WebKit
- Mobile: Pixel 5, iPhone 12

## 📚 Recursos Úteis

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles/)

## 🤝 Contribuindo

Ao adicionar novos testes:

1. Coloque testes ao lado do código fonte (mesma pasta)
2. Use `.test.ts` ou `.test.tsx` como extensão
3. Siga as convenções de nomenclatura
4. Garanta que testes sejam independentes
5. Limpe mocks após cada teste

## 🐛 Resolução de Problemas

### Erro: "Cannot find module"
Execute: `npm install`

### Erro: "Unable to find element"
Verifique se o elemento está renderizado ou use `waitFor`:

```typescript
await waitFor(() => {
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});
```

### Erro de timeout em E2E
Aumente o timeout no playwright.config.ts:

```typescript
timeout: 60 * 1000, // 60 segundos
```

## ✅ Checklist de Qualidade

Antes de fazer commit:

- [ ] Todos os testes passam (`npm test`)
- [ ] Cobertura mantida ou melhorada
- [ ] Testes E2E passam (`npm run test:e2e`)
- [ ] Não há erros de lint (`npm run lint`)
- [ ] Código está bem documentado
