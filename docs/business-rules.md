# Business Rules

## Domínio
Gestão financeira pessoal para clientes individuais (pessoas físicas), focado em controle de despesas e receitas. O aplicativo **não é destinado a empresas**.

## Regras de Negócio

### [Geral]
- **BR-001:** O aplicativo é exclusivo para clientes individuais (pessoas físicas). Funcionalidades relacionadas a "empresas" foram removidas permanentemente.
- **BR-002:** Não é permitido o uso de dados mockados em qualquer ambiente (desenvolvimento, staging, produção). Todos os dados devem vir de APIs reais.
- **BR-003:** Planos de assinatura devem ter período de cobrança definido: `MONTHLY` (mensal) ou `YEARLY` (anual).
- **BR-004:** O campo `features` de planos deve ser um array de strings, contendo os benefícios incluídos no plano.

### [Notificações]
- **BR-005:** Notificações devem ser geradas automaticamente a partir de:
  1. Novos cadastros de usuários (endpoint `/v1/admin/users`)
  2. Pagamentos de planos não gratuitos (endpoint `/v1/admin/subscriptions`)
- **BR-006:** Notificações de novos cadastros devem ter tipo `signup` e incluir nome/email do usuário.
- **BR-007:** Notificações de pagamentos devem ter tipo `payment` e incluir valor do plano e nome do usuário.

### [Dashboard]
- **BR-008:** O gráfico "Evolução da Receita" deve ser derivado do MRR (Monthly Recurring Revenue) retornado por `/v1/admin/stats` e `/v1/admin/plans`.
- **BR-009:** A seção "Atividades Recentes" deve mostrar no máximo 5 itens derivados de cadastros e assinaturas.

## Restrições de Negócio
- **RN-001:** Endpoints utilizados devem seguir rigorosamente o contrato Swagger disponível em https://api.doutorcashapp.com.br/docs
- **RN-002:** Falhas em chamadas de API individuais não devem quebrar o dashboard inteiro (usar `Promise.allSettled` para tratamento gracioso)

## Glossário
| Termo | Definição |
|-------|-----------|
| MRR | Monthly Recurring Revenue (Receita Recorrente Mensal) |
| Doutorcash | Aplicativo de gestão financeira pessoal para indivíduos |
| Plano Gratuito | Plano sem custo, sem notificações de pagamento |
| Plano Pago | Planos com valor > 0, geram notificações de pagamento ao serem assinados |
