# Contribuindo para o OrganizaAI

## Boas-Vindas

Obrigado pelo interesse em contribuir! Este documento guia você pelo processo de contribuição.

## Código de Conduta

Este projeto segue o Código de Conduta do Contributor Covenant. Ao participar, você deve manter este padrão.

## Como Contribuir

### 1. Encontrar Issues

- Verifique issues abertas com标签 `good first issue`
- Issues com标签 `help wanted` também são bem-vindas
- Crie uma issue para novas funcionalidades ou bugs

### 2. Fork e Clone

```bash
# Fork o repositório no GitHub

# Clone localmente
git clone https://github.com/SEU_USUARIO/turbo-biz-funds.git
cd turbo-biz-funds

# Adicione o upstream
git remote add upstream https://github.com/ORIGINAL_USUARIO/turbo-biz-funds.git
```

### 3. Configurar Ambiente

```bash
# Instale dependências
npm install

# Crie um arquivo .env
cp .env.example .env

# Execute o servidor de desenvolvimento
npm run dev
```

### 4. Criar Branch

```bash
# Sincronize com upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crie sua branch
git checkout -b feature/minha-nova-funcionalidade
```

### 5. Desenvolver

```bash
# Execute testes
npm run test

# Execute lint
npm run lint

# Build para verificar
npm run build
```

### 6. Commits

```bash
# Use Conventional Commits
git add .
git commit -m "feat: adiciona nova funcionalidade"
git commit -m "fix: corrige bug no login"
git commit -m "docs: atualiza README"
```

#### Tipos de Commit

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação, ponto-e-vírgula, etc |
| `refactor` | Refatoração de código |
| `test` | Adição de testes |
| `chore` | Tarefas de manutenção |

### 7. Pull Request

```bash
# Push para seu fork
git push origin feature/minha-nova-funcionalidade

# Crie PR no GitHub
```

#### Checklist do PR

- [ ] Testes adicionados/atualizados
- [ ] Lint passando
- [ ] Build passando
- [ ] Documentação atualizada
- [ ] Commits seguem o padrão

## Padrões de Código

### TypeScript

```typescript
// ✅ Bom: Tipagem explícita
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Ruim: any implícito
function getData(data: any) {
  return data.value;
}
```

### React

```tsx
// ✅ Bom: Hook personalizado
export function useUser(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });
}

// ✅ Bom: Componente com memo
export const StatCard = memo(function StatCard({ value }: StatCardProps) {
  return <Card>{value}</Card>;
});
```

### CSS/Tailwind

```tsx
// ✅ Bom: Classes Tailwind organizadas
<div className="
  flex flex-col gap-4 p-6
  bg-white rounded-lg shadow
  hover:shadow-md transition-shadow
">
  <h2 className="text-xl font-semibold">{title}</h2>
</div>
```

### Testes

```typescript
// ✅ Bom: Teste descritivo
test("should login successfully with admin credentials", async () => {
  const { result } = renderHook(() => useAuth());
  
  await act(async () => {
    await result.current.login("admin@financeai.com", "admin123");
  });
  
  expect(result.current.isAuthenticated).toBe(true);
});
```

## Estrutura de Arquivos

```
src/
├── components/    # Componentes UI
├── contexts/     # React Context
├── features/     # Código por feature
├── hooks/        # Hooks personalizados
├── lib/          # Utilitários
├── pages/        # Páginas
└── types/        # Tipos TypeScript
```

## Git Flow

```
main (produção)
  │
  ├── develop (desenvolvimento)
  │     │
  │     ├── feature/* (novas funcionalidades)
  │     │
  │     └── hotfix/* (correções urgentes)
  │
  └── release/* (preparação para release)
```

## Revisão de Código

Durante a revisão:

1. Seja respeitoso e construtivo
2. Explique o rationale das sugestões
3. Foque em código, não em opinião pessoal
4. Reconheça boas práticas
5. Dê exemplos de código quando possível

## Dúvidas?

- Abra uma issue com label `question`
- Contribua com a Wiki do projeto
- Discussões no GitHub Discussions
