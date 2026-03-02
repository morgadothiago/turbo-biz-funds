# Especificação Técnica – Alterações Landing Page Planeja Aí

## Informações do Projeto

| Campo | Valor |
|-------|-------|
| **Projeto** | Planeja Aí – Landing Page |
| **Versão** | 1.0 |
| **Data** | Fevereiro/2026 |
| **PO** | Product Owner |
| **Destinatário** | Tech Lead / Arquiteto |

---

## 1. Visão Geral das Alterações

Cliente solicitou alterações visuais e de conteúdo na landing page atual. Esta especificação detalha os requisitos funcionais e restrições técnicas para implementação.

**Objetivo estratégico**: Posicionar o Planeja Aí como "assessor financeiro pessoal 24h no WhatsApp – simples como mandar mensagem – inteligente como uma fintech"

---

## 2. Requisitos Funcionais

### 2.1 Paleta de Cores – Aplicação Global

**Cores definidas**:

| Elemento | Cor | Hex |
|----------|-----|-----|
| CTA (botões principais) | Verde | `#0F9D58` |
| CTA Hover | Verde Escuro | `#0C7A45` |
| Elementos de IA / Ícones | Azul Principal | `#1E40AF` |
| Elementos secundários | Azul Secundário | `#3B82F6` |
| Fundo geral | Cinza Claro | `#F1F5F9` |
| Texto principal | Azul Muito Escuro | `#0F172A` |

**Regras de aplicação**:
- CTAs sólidos devem usar `#0F9D58`, com hover em `#0C7A45`
- Ícones e elementos visuais relacionados a IA devem usar tons de azul
- Métricas (números de destaque) devem ter cor azul
- Fundo principal deve ser `#F1F5F9` para contraste adequado

---

### 2.2 Primeira Dobra (Hero Section)

#### Headline – Novo Layout

**Requisitos**:
- duas linhas com mesmo peso visual (ambos H1)
- Linha 1: "Cansou de planilhas?"
- Linha 2: "Você ainda tenta lembrar tudo de cabeça ou não sabe para onde está indo o seu dinheiro?"
- Destaque visual (cor ou peso) para parte "não sabe para onde está ovo seu dinheiro"
- **Texto centralizado**

#### Subheadline

**Conteúdo**:
```
Tenha um assessor financeiro pessoal trabalhando 24 horas por dia para você.
Mande áudio, foto ou texto.
Seu assistente financeiro resolve tudo pra você — sem planilha, sem estresse.
```

**Requisitos técnicos**:
- Fonte menor que H1 (sugestão: H3 ou parágrafo grande)
- Centralizado
- Espaçamento entre linhas: confortável

#### Componentes Abaixo da Headline

Manter estrutura existente:
- Botão "Comece agora" (CTA verde)
- Botão "Ver como funciona" (secundário)
- Bloco de métricas: 3.000+ usuários | 500k+ gastos | 4.9 avaliações | < 5min para começar

---

### 2.3 Área Visual – Substituição de Vídeo

#### Requisito

Remover vídeo atual e substituir por **3 mockups de celular** lado a lado.

#### Layout

| Desktop | Mobile |
|---------|--------|
| 3 mockups alinhados horizontalmente | Empilhados verticalmente |

- Fundo: limpo com leve degradê (verde para azul)
- Responsivo: comportamento adaptativo

#### Conteúdo dos Mockups

**Celular 1 – Registro Simples**:
- Mostrar conversa WhatsApp
- Usuário: "Gastei 50 reais na farmácia"
- Assistente: "Registrado em Saúde."
- Objetivo: demonstrar registro automático e categorização

**Celular 2 – Multiformato**:
- Demonstrar envio de áudio
- Demonstrar envio de foto de comprovante
- Demonstrar envio de texto
- Assistente respondendo e categorizando
- Objetivo: demonstrar facilidade e naturalidade

**Celular 3 – Dashboard Mobile**:
- Gráfico simples
- Categorias de gastos
- Resumo mensal
- Interface limpa
- Objetivo: demonstrar funcionalidade mobile

---

### 2.4 Seção Intermediária

#### Remover
- Título atual "A gente sabe como é"

#### Criar
Faixa visual destacada no meio da página com fundo diferenciado.

**Título**: "Sua vida organizada sem esforço."

**Subtexto**:
```
Já se perdeu no meio das tarefas e das despesas?
Esquece compromissos?
Já levou um susto com a fatura do cartão?
```

**Fechamento**:
```
O Planeja Aí resolve isso.
Organização financeira simples e direta pelo WhatsApp.
```

**Requisitos técnicos**:
- Fundo visual diferenciado (leve degradê ou bloco destacado)
- Centralizado
- Deve criar quebra visual na página

#### Cards de Dor
Manter estrutura atual, ajustar cores para nova paleta:
- Cansaço de planilhas
- Falta de constância
- Medo da fatura
- Viver no escuro

---

### 2.5 Seção "Se Identificou?"

**Manter**: Estrutura atual (título e texto)

**Botão**:
- Texto: "Quero organizar minhas finanças"
- Estilo: sólido verde (`#0F9D58`)
- Hover: `#0C7A45`
- Alto contraste
- Espaçamento adequado

---

### 2.6 Seção "Como Funciona em 3 Passos"

**Manter**: Estrutura atual (título + 3 passos)

**Ajustar**: Cores para nova paleta, garantir espaçamento e clareza visual

---

### 2.7 Seção Planos – Nova Estrutura

#### Requisito

Preparar estrutura para 3 planos (valores serão definidos posteriormente pelo cliente).

| Plano | Destaque | Botão |
|-------|----------|-------|
| Mensal | Não | CTA |
| Semestral | Não | CTA |
| Anual | **Sim** (destaque visual) | CTA |

**Requisitos técnicos**:
- 3 cards visuais
- Diferenciação visual clara para plano anual
- CTA em cada card
- Valores: **não implementar ainda** – preparar estrutura

---

## 3. Restrições e Dependências

### 3.1 Dependências Externas

| Item | Status | Observação |
|------|--------|------------|
| Prints/screenshots reais para mockups | Pendente | Cliente pode fornecer posteriormente |
| Valores dos planos | Pendente | Serão definidos posteriormente |

### 3.2 Restrições Técnicas

- **Responsividade**: Seção de mockups deve funcionar em desktop e mobile
- **Performance**: Degradês e elementos visuais não devem impactar carregamento
- **Acessibilidade**: Contraste de cores deve atender WCAG AA

---

## 4. Priorização (MoSCoW)

### Must Have (Crítico)

- [ ] Aplicação da nova paleta de cores globalmente
- [ ] Nova headline e subheadline
- [ ] Substituição do vídeo pelos 3 mockups
- [ ] Seção intermediária com novo conteúdo
- [ ] Botão CTA verde na seção "Se identificou?"

### Should Have (Importante)

- [ ] Destaque visual para plano anual
- [ ] Degradê verde-azul no fundo dos mockups

### Could Have (Desejável)

- [ ] Animações sutis nos mockups
- [ ] Efeitos hover nos cards de dor

### Won't Have (Fora de Escopo)

- [ ] Valores dos planos (definidos posteriormente)
- [ ] Prints reais para mockups (cliente pode fornecer depois)

---

## 5. Critérios de Aceitação

### Geral

- [ ] Nova paleta de cores aplicada corretamente em todos os elementos
- [ ] Contraste WCAG AA nos textos e botões
- [ ] Responsivo: funciona em desktop (1920px) e mobile (375px)

### Primeira Dobra

- [ ] Headline com duas linhas, mesmo peso visual (H1)
- [ ] Headline centralizada
- [ ] Subheadline com fonte menor que H1, centralizado
- [ ] Botões com cores corretas: verde `#0F9D58`, hover `#0C7A45`
- [ ] Métricas com destaque azul

### Área Visual

- [ ] 3 mockups visíveis em desktop (alinhados)
- [ ] 3 mockups empilhados em mobile
- [ ] Fundo com degradê verde-azul
- [ ] Cada mockup com conteúdo especificado

### Seção Intermediária

- [ ] Fundo visual diferenciado (degradê ou bloco)
- [ ] Texto centralizado
- [ ] Criação de quebra visual na página

### Planos

- [ ] 3 cards visuais
- [ ] Plano anual com destaque visual
- [ ] CTA em cada card

---

## 6. Métricas de Sucesso

| Métrica | Indicador |
|---------|-----------|
| Tempo de carregamento | < 3s |
| Taxa de conversão CTA | Medir antes/depois |
| Visualizações da seção de planos | Analytics |
| Clique nos botões "Ver como funciona" | Analytics |

---

## 7. Próximos Passos

1. **Tech Lead**: Revisar especificação e validar viabilidade técnica
2. **Tech Lead**: Identificar necessidade de dependências ou bibliotecas
3. **Desenvolvimento**: Implementar alterações conformepriorização
4. **QA**: Validar conforme critérios de aceitação
5. **Cliente**: Fornecer prints/screenshots reais (opcional)
6. **Cliente**: Definir valores dos planos (posteriormente)

---

## 8. Contato

**Product Owner**: [A definir]
**Tech Lead**: [A definir]

---

**Documento aprovado pelo PO em**: Fevereiro/2026
