# Changelog

Todas as mudanças notáveis deste projeto serão documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
seguindo [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Fixed
- Corrigido erro `ReferenceError: FileBarChart is not defined` no AdminSidebar.tsx
  - Substituído ícone inexistente `FileBarChart` por `BarChart2` do lucide-react
  - Item "Relatórios" no menu admin agora renderiza corretamente

- Corrigido gráfico "Evolução da Receita e Usuários" que não aparecia no AdminDashboard
  - Endpoint `/v1/admin/revenue` não existe no backend → derivados dados a partir de `/v1/admin/plans` (que tem MRR real)
  - Implementado `Promise.allSettled` para tratamento gracioso de falhas individuais das APIs
  - Gráfico agora mostra 6 meses de dados baseados no MRR real dos planos

- Corrigido seção "Atividades Recentes" que não mostrava dados
  - Endpoint `/v1/admin/activity` não existe no backend → atividades derivadas de:
    - `/v1/admin/users` (novos cadastros → type: "signup")
    - `/v1/admin/subscriptions` (pagamentos/upgrades → type: "payment" ou "upgrade")
  - Seção agora mostra até 5 atividades recentes com dados reais da API

### Changed
- Removidos todos os dados mockados (`MOCK_REVENUE_DATA`, `MOCK_RECENT_CLIENTS`, `MOCK_RECENT_ACTIVITY`)
- Hook `useAdminDashboard` agora usa exclusivamente dados reais da API
- Atualizados testes para trabalhar com dados derivados da API (9/9 passando)

### Removed
- **Removida funcionalidade "Empresas" do admin** (app é para clientes individuais, não empresas)
  - Removido item "Empresas" do `AdminSidebar.tsx`
  - Removido arquivo `AdminCompanies.tsx`
  - Removido hook `use-admin-companies.ts` e seus testes
  - Removida rota `/admin/empresas` do `AppShell.tsx`
  - Removidas referências em `AdminLayout.tsx`
  - Atualizadas descrições em `use-plan-info.ts` (removidas menções a "empresas")
  - FAQ mantido (já informa corretamente que o app não é para empresas)

## [0.1.0] - 2026-05-03
### Added
- Setup inicial do projeto
- Autenticação de usuários e administradores
- Dashboard com gráficos e métricas
- Sistema de planos e assinaturas
- Interface admin com sidebar responsiva
