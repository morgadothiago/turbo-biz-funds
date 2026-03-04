/**
 * Sistema de internacionalização (i18n)
 * Suporte a múltiplos idiomas para a aplicação
 */

export type Locale = "pt" | "en" | "es";

export interface Translations {
  common: {
    appName: string;
    welcome: string;
    login: string;
    logout: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    loading: string;
    error: string;
    success: string;
    submit: string;
    back: string;
    next: string;
    close: string;
    search: string;
    filter: string;
    settings: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    invalidCredentials: string;
    emailRequired: string;
    passwordRequired: string;
    passwordMinLength: string;
    passwordRequirements: string;
    noAccount: string;
    hasAccount: string;
    createAccount: string;
    signIn: string;
    signUp: string;
    signInWithGoogle: string;
    orContinueWithEmail: string;
  };
  dashboard: {
    title: string;
    monthlyBalance: string;
    income: string;
    expenses: string;
    categories: string;
    recentTransactions: string;
    myGoals: string;
    connectWhatsApp: string;
    allTransactions: string;
  };
  transactions: {
    title: string;
    newTransaction: string;
    description: string;
    category: string;
    amount: string;
    date: string;
    type: string;
    expense: string;
    income: string;
    noTransactions: string;
  };
  goals: {
    title: string;
    addGoal: string;
    noGoals: string;
    configureGoals: string;
    current: string;
    target: string;
    deadline: string;
    progress: string;
  };
  categories: {
    title: string;
    addCategory: string;
    noCategories: string;
    food: string;
    transport: string;
    leisure: string;
    bills: string;
    other: string;
  };
  errors: {
    genericError: string;
    networkError: string;
    validationError: string;
    notFound: string;
    unauthorized: string;
    serverError: string;
    reloadPage: string;
  };
  landing: {
    // Navbar
    navHowItWorks: string;
    navTestimonials: string;
    navPricing: string;
    navFAQ: string;
    navLogin: string;
    navSignUp: string;
    // Hero
    heroBadge: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroSubtitle: string;
    heroCTA: string;
    heroWatchDemo: string;
    heroStatUsers: string;
    heroStatExpenses: string;
    heroStatRating: string;
    heroStatTime: string;
    heroProcess: string;
    heroSeconds: string;
    heroSent: string;
    heroSentExample: string;
    heroCategorized: string;
    heroCategoryFood: string;
    // Problem
    problemSubtitle: string;
    problemTitle: string;
    problemDescription: string;
    problemIdentified: string;
    problemCreated: string;
    problemCTA: string;
    problemModalTitle: string;
    problemModalDescription: string;
    problemModalTestInfo: string;
    // New Intermediate Section (Organized Life)
    organizedLifeTitle: string;
    organizedLifeSubtitle: string;
    organizedLifeClosing: string;
    // How It Works
    howItWorksBadge: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    step1Title: string;
    step1Description: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
    dashboardLabel: string;
    dashboardBalance: string;
    dashboardExpenses: string;
    dashboardSavings: string;
    dashboardGoal: string;
    expensesByCategory: string;
    whatsappFeature: string;
    whatsappFeatureDescription: string;
    // Testimonials
    testimonialsBadge: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    // Pricing
    pricingBadge: string;
    pricingTitle: string;
    pricingSubtitle: string;
    planTest: string;
    planTestDescription: string;
    planTestPrice: string;
    planTestPeriod: string;
    planMonthly: string;
    planMonthlyDescription: string;
    planMonthlyPrice: string;
    planQuarterly: string;
    planQuarterlyDescription: string;
    planQuarterlyPrice: string;
    planAnnual: string;
    planAnnualDescription: string;
    planAnnualPrice: string;
    planFeatures1: string[];
    planFeatures2: string[];
    planFeatures3: string[];
    planCTA1: string;
    planCTA2: string;
    planCTA3: string;
    trustSecurePayment: string;
    trustCancelAnyTime: string;
    trustHumanSupport: string;
    pricingWhyNoFree: string;
    // FAQ
    faqBadge: string;
    faqTitle: string;
    faqSubtitle: string;
    faqStillQuestions: string;
    faqContactWhatsApp: string;
    // Footer
    footerProduct: string;
    footerSupport: string;
    footerLegal: string;
    footerHowItWorks: string;
    footerPricing: string;
    footerTestimonials: string;
    footerFAQ: string;
    footerHelpCenter: string;
    footerContactUs: string;
    footerWhatsApp: string;
    footerPrivacy: string;
    footerTerms: string;
    footerLGPD: string;
    footerDescription: string;
    footerCopyright: string;
    footerMadeInBrazil: string;
  };
}

export const translations: Record<Locale, Translations> = {
  pt: {
    common: {
      appName: "Planeja Aí",
      welcome: "Bem-vindo",
      login: "Entrar",
      logout: "Sair",
      register: "Cadastrar",
      email: "Email",
      password: "Senha",
      confirmPassword: "Confirmar senha",
      name: "Nome",
      save: "Salvar",
      cancel: "Cancelar",
      delete: "Excluir",
      edit: "Editar",
      loading: "Carregando...",
      error: "Erro",
      success: "Sucesso",
      submit: "Enviar",
      back: "Voltar",
      next: "Próximo",
      close: "Fechar",
      search: "Buscar",
      filter: "Filtrar",
      settings: "Configurações",
    },
    auth: {
      loginTitle: "Bem-vindo de volta",
      loginSubtitle: "Entre com sua conta para acessar",
      registerTitle: "Crie sua conta",
      registerSubtitle: "Comece a organizar suas finanças hoje mesmo",
      invalidCredentials: "Email ou senha inválidos",
      emailRequired: "Email é obrigatório",
      passwordRequired: "Senha é obrigatória",
      passwordMinLength: "A senha deve ter no mínimo 6 caracteres",
      passwordRequirements: "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
      noAccount: "Não tem uma conta?",
      hasAccount: "Já tem uma conta?",
      createAccount: "Crie sua conta",
      signIn: "Entrar",
      signUp: "Cadastrar",
      signInWithGoogle: "Continuar com Google",
      orContinueWithEmail: "ou continue com email",
    },
    dashboard: {
      title: "Dashboard",
      monthlyBalance: "Saldo do Mês",
      income: "Receitas",
      expenses: "Despesas",
      categories: "Categorias",
      recentTransactions: "Transações Recentes",
      myGoals: "Minhas Metas",
      connectWhatsApp: "Conecte ao WhatsApp",
      allTransactions: "Ver todas as transações",
    },
    transactions: {
      title: "Transações",
      newTransaction: "Nova Transação",
      description: "Descrição",
      category: "Categoria",
      amount: "Valor",
      date: "Data",
      type: "Tipo",
      expense: "Despesa",
      income: "Receita",
      noTransactions: "Nenhuma transação encontrada",
    },
    goals: {
      title: "Metas",
      addGoal: "Adicionar Meta",
      noGoals: "Nenhuma meta configurada",
      configureGoals: "Configure suas metas financeiras",
      current: "Atual",
      target: "Meta",
      deadline: "Prazo",
      progress: "Progresso",
    },
    categories: {
      title: "Categorias",
      addCategory: "Adicionar Categoria",
      noCategories: "Nenhuma categoria",
      food: "Alimentação",
      transport: "Transporte",
      leisure: "Lazer",
      bills: "Contas",
      other: "Outros",
    },
    errors: {
      genericError: "Algo deu errado",
      networkError: "Erro de conexão",
      validationError: "Erro de validação",
      notFound: "Não encontrado",
      unauthorized: "Não autorizado",
      serverError: "Erro no servidor",
      reloadPage: "Recarregar página",
    },
    landing: {
      // Navbar
      navHowItWorks: "Como Funciona",
      navTestimonials: "Depoimentos",
      navPricing: "Preços",
      navFAQ: "Dúvidas",
      navLogin: "Entrar",
      navSignUp: "Começar agora",
      // Hero - Nova estrutura com duas linhas
      heroBadge: "Chega de Planilhas",
      heroTitleLine1: "Cansou de planilhas?",
      heroTitleLine2: "Você ainda tenta lembrar tudo de cabeça ou não sabe para onde está indo o seu dinheiro?",
      heroSubtitle: "Tenha um assessor financeiro pessoal trabalhando 24 horas por dia para você. Mande áudio, foto ou texto. Seu assistente financeiro resolve tudo pra você — sem planilha, sem estresse.",
      heroCTA: "Comece agora",
      heroWatchDemo: "Ver como funciona",
      heroStatUsers: "3.000+ usuários",
      heroStatExpenses: "500k+ gastos",
      heroStatRating: "4.9 avaliação",
      heroStatTime: "< 5min para começar",
      heroProcess: "📱 Manda → 🤖 Assistente → 📊 Você visualiza",
      heroSeconds: "30 seg",
      heroSent: "Você enviou:",
      heroSentExample: "Gastei 45 no mercado",
      heroCategorized: "Categorizado:",
      heroCategoryFood: "🛒 Alimentação",
      // Problem
      problemSubtitle: "A gente entende",
      problemTitle: "A gente sabe como é...",
      problemDescription: "Você não precisa de mais uma ferramenta complicada. Precisa de algo que funcione no seu dia a dia, sem esforço.",
      problemIdentified: "Se identificou?",
      problemCreated: "A gente criou algo pra você nunca mais passar por isso.",
      problemCTA: "Quero organizar minhas finanças",
      problemModalTitle: "Comece agora",
      problemModalDescription: "Deixe seu email para começar a organizar suas finanças pelo WhatsApp.",
      problemModalTestInfo: "Você receberá acesso ao teste de R$ 9,90.",
      // Nova Seção Intermediária - Sua vida organizada sem esforço
      organizedLifeTitle: "Sua vida organizada sem esforço.",
      organizedLifeSubtitle: "Já se perdeu no meio das tarefas e das despesas? Esquece compromissos? Já levou um susto com a fatura do cartão?",
      organizedLifeClosing: "O Planeja Aí resolve isso. Organização financeira simples e direta pelo WhatsApp.",
      // How It Works
      howItWorksBadge: "Simples assim",
      howItWorksTitle: "Organize em 3 passos",
      howItWorksSubtitle: "Em 3 passos você organiza suas finanças sem complicação. Sem planilhas, sem apps difíceis.",
      step1Title: "Conecte o WhatsApp",
      step1Description: "Escaneie o QR Code e conecte em 30 segundos. Nada de app novo para baixar.",
      step2Title: "Mande seus gastos",
      step2Description: "Foto do comprovante, áudio 'gastei 50 no mercado', ou mensagem. O Assistente Financeiro entende tudo e categoriza automaticamente.",
      step3Title: "Gráficos e Resumos em Tempo Real",
      step3Description: "Acesse dashboards com gráficos de gastos, evolução patrimonial, alertas de orçamento e resumos que você nunca mais vai querer perder.",
      dashboardLabel: "app.organizaai.com.br/dashboard",
      dashboardBalance: "Saldo",
      dashboardExpenses: "Gastos",
      dashboardSavings: "Economia",
      dashboardGoal: "Meta",
      expensesByCategory: "Gastos por Categoria",
      whatsappFeature: "Pergunte pelo WhatsApp",
      whatsappFeatureDescription: "Não precisa abrir o app. Pergunte direto na conversa:",
      // Testimonials
      testimonialsBadge: "Histórias reais",
      testimonialsTitle: "Pessoas que tomaram o controle",
      testimonialsSubtitle: "Veja como pessoas comuns estão organizando suas finanças sem estresse",
      // Pricing
      pricingBadge: "Investimento",
      pricingTitle: "Organize seu dinheiro de forma simples.",
      pricingSubtitle: "Sem complicação, sem planilhas difíceis. Você no controle das suas contas todos os dias.",
      planTest: "Teste",
      planTestDescription: "Experimente por 15 dias",
      planTestPrice: "9,90",
      planTestPeriod: "único",
      planMonthly: "Mensal",
      planMonthlyDescription: "Sem compromisso",
      planMonthlyPrice: "29,90",
      planQuarterly: "Semestral",
      planQuarterlyDescription: "Economize 10%",
      planQuarterlyPrice: "79,90",
      planAnnual: "Anual",
      planAnnualDescription: "Maior economia",
      planAnnualPrice: "159,90",
      planFeatures1: ["15 dias de acesso completo", "Lançamentos ilimitados", "Integração WhatsApp", "Dashboard completo", "Suporte por WhatsApp"],
      planFeatures2: ["Tudo do Teste +", "Relatórios automáticos", "Categorias personalizadas", "Metas de economia", "Alertas de gastos", "Suporte prioritário"],
      planFeatures3: ["Tudo do Mensal +", "Equivale a R$ 26,63/mês", "Prioridade no suporte", "Acesso antecipado", "3 meses de organização"],
      planCTA1: "Começar Teste",
      planCTA2: "Assinar Mensal",
      planCTA3: "Assinar Semestral",
      trustSecurePayment: "Pagamento seguro",
      trustCancelAnyTime: "Cancele quando quiser",
      trustHumanSupport: "Suporte humanizado",
      pricingWhyNoFree: "Por que não temos plano gratuito?",
      // FAQ
      faqBadge: "Dúvidas",
      faqTitle: "Perguntas frequentes",
      faqSubtitle: "Tudo que você precisa saber antes de começar",
      faqStillQuestions: "Ainda tem dúvidas?",
      faqContactWhatsApp: "Fale com a gente no WhatsApp",
      // Footer
      footerProduct: "Produto",
      footerSupport: "Suporte",
      footerLegal: "Legal",
      footerHowItWorks: "Como Funciona",
      footerPricing: "Preços",
      footerTestimonials: "Depoimentos",
      footerFAQ: "FAQ",
      footerHelpCenter: "Central de Ajuda",
      footerContactUs: "Fale Conosco",
      footerWhatsApp: "WhatsApp",
      footerPrivacy: "Privacidade",
      footerTerms: "Termos de Uso",
      footerLGPD: "LGPD",
      footerDescription: "Organize suas finanças pessoais pelo WhatsApp. Simples, sem planilhas, sem estresse.",
      footerCopyright: "Todos os direitos reservados.",
      footerMadeInBrazil: "Feito com 💚 no Brasil",
    },
  },
  en: {
    common: {
      appName: "Planeja Aí",
      welcome: "Welcome",
      login: "Sign In",
      logout: "Sign Out",
      register: "Sign Up",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      name: "Name",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      submit: "Submit",
      back: "Back",
      next: "Next",
      close: "Close",
      search: "Search",
      filter: "Filter",
      settings: "Settings",
    },
    auth: {
      loginTitle: "Welcome back",
      loginSubtitle: "Sign in to access your account",
      registerTitle: "Create your account",
      registerSubtitle: "Start organizing your finances today",
      invalidCredentials: "Invalid email or password",
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 6 characters",
      passwordRequirements: "Password must contain at least one uppercase, one lowercase and one number",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      createAccount: "Create your account",
      signIn: "Sign In",
      signUp: "Sign Up",
      signInWithGoogle: "Continue with Google",
      orContinueWithEmail: "or continue with email",
    },
    dashboard: {
      title: "Dashboard",
      monthlyBalance: "Monthly Balance",
      income: "Income",
      expenses: "Expenses",
      categories: "Categories",
      recentTransactions: "Recent Transactions",
      myGoals: "My Goals",
      connectWhatsApp: "Connect to WhatsApp",
      allTransactions: "View all transactions",
    },
    transactions: {
      title: "Transactions",
      newTransaction: "New Transaction",
      description: "Description",
      category: "Category",
      amount: "Amount",
      date: "Date",
      type: "Type",
      expense: "Expense",
      income: "Income",
      noTransactions: "No transactions found",
    },
    goals: {
      title: "Goals",
      addGoal: "Add Goal",
      noGoals: "No goals configured",
      configureGoals: "Configure your financial goals",
      current: "Current",
      target: "Target",
      deadline: "Deadline",
      progress: "Progress",
    },
    categories: {
      title: "Categories",
      addCategory: "Add Category",
      noCategories: "No categories",
      food: "Food",
      transport: "Transport",
      leisure: "Leisure",
      bills: "Bills",
      other: "Other",
    },
    errors: {
      genericError: "Something went wrong",
      networkError: "Connection error",
      validationError: "Validation error",
      notFound: "Not found",
      unauthorized: "Unauthorized",
      serverError: "Server error",
      reloadPage: "Reload page",
    },
    landing: {
      // Navbar
      navHowItWorks: "How It Works",
      navTestimonials: "Testimonials",
      navPricing: "Pricing",
      navFAQ: "FAQ",
      navLogin: "Sign In",
      navSignUp: "Try for $9.90",
      // Hero - Nova estrutura com duas linhas
      heroBadge: "No More Spreadsheets",
      heroTitleLine1: "Tired of spreadsheets?",
      heroTitleLine2: "Do you still try to remember everything by heart or don't know where your money is going?",
      heroSubtitle: "Have a personal financial advisor working 24 hours a day for you. Send voice note, photo or text. Your financial assistant solves everything for you — no spreadsheets, no stress.",
      heroCTA: "Get Started",
      heroWatchDemo: "See how it works",
      heroStatUsers: "3,000+ users",
      heroStatExpenses: "500k+ expenses",
      heroStatRating: "4.9 rating",
      heroStatTime: "< 5min to start",
      heroProcess: "📱 Send → 🤖 Assistant → 📊 You view",
      heroSeconds: "30 sec",
      heroSent: "You sent:",
      heroSentExample: "Spent 45 at the market",
      heroCategorized: "Categorized:",
      heroCategoryFood: "🛒 Food",
      // Problem
      problemSubtitle: "We get it",
      problemTitle: "We know how it is...",
      problemDescription: "You don't need another complicated tool. You need something that works in your daily life, effortlessly.",
      problemIdentified: "Resonated?",
      problemCreated: "We created something so you never go through this again.",
      problemCTA: "I want to organize my finances",
      problemModalTitle: "Start now",
      problemModalDescription: "Leave your email to start organizing your finances via WhatsApp.",
      problemModalTestInfo: "You'll receive access to the $9.90 test.",
      // Nova Seção Intermediária - Organized life
      organizedLifeTitle: "Your organized life, effortlessly.",
      organizedLifeSubtitle: "Have you ever lost track of tasks and expenses? Forget appointments? Ever get a shock from your credit card bill?",
      organizedLifeClosing: "Planeja Aí solves this. Simple and direct financial organization via WhatsApp.",
      // How It Works
      howItWorksBadge: "It's that simple",
      howItWorksTitle: "Organize in 3 steps",
      howItWorksSubtitle: "In 3 steps you organize your finances without complications. No spreadsheets, no difficult apps.",
      step1Title: "Connect WhatsApp",
      step1Description: "Scan the QR Code and connect in 30 seconds. No new app to download.",
      step2Title: "Send your expenses",
      step2Description: "Photo of receipt, voice note 'spent 50 at the market', or text. The Financial Assistant understands everything and categorizes automatically.",
      step3Title: "Real-Time Charts & Summaries",
      step3Description: "Access dashboards with expense charts, wealth evolution, budget alerts and summaries you'll never want to miss.",
      dashboardLabel: "app.organizaai.com.br/dashboard",
      dashboardBalance: "Balance",
      dashboardExpenses: "Expenses",
      dashboardSavings: "Savings",
      dashboardGoal: "Goal",
      expensesByCategory: "Expenses by Category",
      whatsappFeature: "Ask via WhatsApp",
      whatsappFeatureDescription: "No need to open the app. Ask right in the chat:",
      // Testimonials
      testimonialsBadge: "Real stories",
      testimonialsTitle: "People who took control",
      testimonialsSubtitle: "See how ordinary people are organizing their finances without stress",
      // Pricing
      pricingBadge: "Investment",
      pricingTitle: "Invest in peace of mind",
      pricingSubtitle: "Less than a coffee a day to never get lost in your accounts again. Cancel anytime, no bureaucracy.",
      planTest: "Test",
      planTestDescription: "Try for 15 days",
      planTestPrice: "9.90",
      planTestPeriod: "one-time",
      planMonthly: "Monthly",
      planMonthlyDescription: "No commitment",
      planMonthlyPrice: "29.90",
      planQuarterly: "Quarterly",
      planQuarterlyDescription: "Save 10%",
      planQuarterlyPrice: "79.90",
      planAnnual: "Annual",
      planAnnualDescription: "Best value",
      planAnnualPrice: "159.90",
      planFeatures1: ["15 days full access", "Unlimited entries", "WhatsApp Integration", "Complete Dashboard", "WhatsApp Support"],
      planFeatures2: ["Everything in Test +", "Automatic Reports", "Custom Categories", "Savings Goals", "Spending Alerts", "Priority Support"],
      planFeatures3: ["Everything in Monthly +", "Equivalent to $26.63/mo", "Priority Support", "Early Access", "3 months of organization"],
      planCTA1: "Start Test",
      planCTA2: "Subscribe Monthly",
      planCTA3: "Subscribe Quarterly",
      trustSecurePayment: "Secure payment",
      trustCancelAnyTime: "Cancel anytime",
      trustHumanSupport: "Human support",
      pricingWhyNoFree: "Why no free plan?",
      // FAQ
      faqBadge: "Questions",
      faqTitle: "Frequently asked questions",
      faqSubtitle: "Everything you need to know before starting",
      faqStillQuestions: "Still have questions?",
      faqContactWhatsApp: "Chat with us on WhatsApp",
      // Footer
      footerProduct: "Product",
      footerSupport: "Support",
      footerLegal: "Legal",
      footerHowItWorks: "How It Works",
      footerPricing: "Pricing",
      footerTestimonials: "Testimonials",
      footerFAQ: "FAQ",
      footerHelpCenter: "Help Center",
      footerContactUs: "Contact Us",
      footerWhatsApp: "WhatsApp",
      footerPrivacy: "Privacy",
      footerTerms: "Terms of Use",
      footerLGPD: "LGPD",
      footerDescription: "Organize your personal finances via WhatsApp. Simple, no spreadsheets, no stress.",
      footerCopyright: "All rights reserved.",
      footerMadeInBrazil: "Made with 💚 in Brazil",
    },
  },
  es: {
    common: {
      appName: "Planeja Aí",
      welcome: "Bienvenido",
      login: "Entrar",
      logout: "Salir",
      register: "Registrarse",
      email: "Correo",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      name: "Nombre",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      submit: "Enviar",
      back: "Volver",
      next: "Siguiente",
      close: "Cerrar",
      search: "Buscar",
      filter: "Filtrar",
      settings: "Configuraciones",
    },
    auth: {
      loginTitle: "Bienvenido de nuevo",
      loginSubtitle: "Ingresa para acceder a tu cuenta",
      registerTitle: "Crea tu cuenta",
      registerSubtitle: "Comienza a organizar tus finanzas hoy",
      invalidCredentials: "Correo o contraseña inválidos",
      emailRequired: "El correo es obligatorio",
      passwordRequired: "La contraseña es obligatoria",
      passwordMinLength: "La contraseña debe tener al menos 6 caracteres",
      passwordRequirements: "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
      noAccount: "¿No tienes cuenta?",
      hasAccount: "¿Ya tienes cuenta?",
      createAccount: "Crea tu cuenta",
      signIn: "Entrar",
      signUp: "Registrarse",
      signInWithGoogle: "Continuar con Google",
      orContinueWithEmail: "o continuar con correo",
    },
    dashboard: {
      title: "Dashboard",
      monthlyBalance: "Saldo del Mes",
      income: "Ingresos",
      expenses: "Gastos",
      categories: "Categorías",
      recentTransactions: "Transacciones Recientes",
      myGoals: "Mis Metas",
      connectWhatsApp: "Conectar a WhatsApp",
      allTransactions: "Ver todas las transacciones",
    },
    transactions: {
      title: "Transacciones",
      newTransaction: "Nueva Transacción",
      description: "Descripción",
      category: "Categoría",
      amount: "Valor",
      date: "Fecha",
      type: "Tipo",
      expense: "Gasto",
      income: "Ingreso",
      noTransactions: "No se encontraron transacciones",
    },
    goals: {
      title: "Metas",
      addGoal: "Agregar Meta",
      noGoals: "No hay metas configuradas",
      configureGoals: "Configura tus metas financieras",
      current: "Actual",
      target: "Meta",
      deadline: "Fecha límite",
      progress: "Progreso",
    },
    categories: {
      title: "Categorías",
      addCategory: "Agregar Categoría",
      noCategories: "Sin categorías",
      food: "Alimentación",
      transport: "Transporte",
      leisure: "Ocio",
      bills: "Facturas",
      other: "Otros",
    },
    errors: {
      genericError: "Algo salió mal",
      networkError: "Error de conexión",
      validationError: "Error de validación",
      notFound: "No encontrado",
      unauthorized: "No autorizado",
      serverError: "Error del servidor",
      reloadPage: "Recargar página",
    },
    landing: {
      // Navbar
      navHowItWorks: "Cómo Funciona",
      navTestimonials: "Testimonios",
      navPricing: "Precios",
      navFAQ: "Preguntas",
      navLogin: "Entrar",
      navSignUp: "Probar por R$ 9,90",
      // Hero - Nova estrutura com duas linhas
      heroBadge: "Basta de Hojas de Cálculo",
      heroTitleLine1: "¿Cansado de hojas de cálculo?",
      heroTitleLine2: "¿Aún intentas recordar todo de memoria o no sabes a dónde va tu dinero?",
      heroSubtitle: "Ten un asesor financiero personal trabajando 24 horas al día para ti. Envía audio, foto o texto. Tu asistente financiero resuelve todo por ti — sin hojas de cálculo, sin estrés.",
      heroCTA: "Comenzar Ahora",
      heroWatchDemo: "Ver cómo funciona",
      heroStatUsers: "3,000+ usuarios",
      heroStatExpenses: "500k+ gastos",
      heroStatRating: "4.9 calificación",
      heroStatTime: "< 5min para empezar",
      heroProcess: "📱 Envía → 🤖 Asistente → 📊 Tú ves",
      heroSeconds: "30 seg",
      heroSent: "Tú enviaste:",
      heroSentExample: "Gasté 45 en el mercado",
      heroCategorized: "Categorizado:",
      heroCategoryFood: "🛒 Alimentación",
      // Problem
      problemSubtitle: "Entendemos",
      problemTitle: "Nosotros sabemos cómo es...",
      problemDescription: "No necesitas otra herramienta complicada. Necesitas algo que funcione en tu vida diaria, sin esfuerzo.",
      problemIdentified: "¿Te identificaste?",
      problemCreated: "Creamos algo para que nunca más pasen esto.",
      problemCTA: "Quiero organizar mis finanzas",
      problemModalTitle: "Comenzar ahora",
      problemModalDescription: "Deja tu correo para comenzar a organizar tus finanzas por WhatsApp.",
      problemModalTestInfo: "Recibirás acceso a la prueba de R$ 9,90.",
      // Nova Seção Intermediária - Organized life
      organizedLifeTitle: "Tu vida organizada, sin esfuerzo.",
      organizedLifeSubtitle: "¿Te has perdido entre tareas y gastos? ¿Olvidas compromisos? ¿Te has llevado un susto con la factura de la tarjeta?",
      organizedLifeClosing: "Planeja Aí lo resuelve. Organización financiera simple y directa por WhatsApp.",
      // How It Works
      howItWorksBadge: "Tan simple como eso",
      howItWorksTitle: "Organiza en 3 pasos",
      howItWorksSubtitle: "En 3 pasos organizas tus finanzas sin complicaciones. Sin hojas de cálculo, sin apps difíciles.",
      step1Title: "Conecta WhatsApp",
      step1Description: "Escanea el QR Code y conecta en 30 segundos. No hay nueva app para descargar.",
      step2Title: "Envía tus gastos",
      step2Description: "Foto del recibo, audio 'gasté 50 en el mercado', o mensaje. El Asistente Financiero entiende todo y categoriza automáticamente.",
      step3Title: "Gráficos y Resúmenes en Tiempo Real",
      step3Description: "Accede a dashboards con gráficos de gastos, evolución patrimonial, alertas de presupuesto y resúmenes que nunca más vas a querer perder.",
      dashboardLabel: "app.organizaai.com.br/dashboard",
      dashboardBalance: "Saldo",
      dashboardExpenses: "Gastos",
      dashboardSavings: "Ahorro",
      dashboardGoal: "Meta",
      expensesByCategory: "Gastos por Categoría",
      whatsappFeature: "Pregunta por WhatsApp",
      whatsappFeatureDescription: "No necesitas abrir la app. Pregunta directo en el chat:",
      // Testimonials
      testimonialsBadge: "Historias reales",
      testimonialsTitle: "Personas que tomaron control",
      testimonialsSubtitle: "Mira cómo personas comunes están organizando sus finanzas sin estrés",
      // Pricing
      pricingBadge: "Inversión",
      pricingTitle: "Invierte en tranquilidad",
      pricingSubtitle: "Menos que un café al día para nunca perderte en las cuentas. Cancela cuando quieras, sin burocracia.",
      planTest: "Prueba",
      planTestDescription: "Prueba por 15 días",
      planTestPrice: "9,90",
      planTestPeriod: "único",
      planMonthly: "Mensual",
      planMonthlyDescription: "Sin compromiso",
      planMonthlyPrice: "29,90",
      planQuarterly: "Trimestral",
      planQuarterlyDescription: "Ahorra 10%",
      planQuarterlyPrice: "79,90",
      planAnnual: "Anual",
      planAnnualDescription: "Mejor valor",
      planAnnualPrice: "159,90",
      planFeatures1: ["15 días de acceso completo", "Lanzamientos ilimitados", "Integración WhatsApp", "Dashboard completo", "Soporte por WhatsApp"],
      planFeatures2: ["Todo de Prueba +", "Reportes automáticos", "Categorías personalizadas", "Metas de ahorro", "Alertas de gastos", "Soporte prioritario"],
      planFeatures3: ["Todo de Mensual +", "Equivale a R$ 26,63/mes", "Prioridad en soporte", "Acceso anticipado", "3 meses de organización"],
      planCTA1: "Comenzar Prueba",
      planCTA2: "Suscribir Mensual",
      planCTA3: "Suscribir Trimestral",
      trustSecurePayment: "Pago seguro",
      trustCancelAnyTime: "Cancela cuando quieras",
      trustHumanSupport: "Soporte humanizado",
      pricingWhyNoFree: "¿Por qué no tenemos plan gratuito?",
      // FAQ
      faqBadge: "Preguntas",
      faqTitle: "Preguntas frecuentes",
      faqSubtitle: "Todo lo que necesitas saber antes de comenzar",
      faqStillQuestions: "¿Aún tienes preguntas?",
      faqContactWhatsApp: "Escríbenos en WhatsApp",
      // Footer
      footerProduct: "Producto",
      footerSupport: "Soporte",
      footerLegal: "Legal",
      footerHowItWorks: "Cómo Funciona",
      footerPricing: "Precios",
      footerTestimonials: "Testimonios",
      footerFAQ: "FAQ",
      footerHelpCenter: "Centro de Ayuda",
      footerContactUs: "Contáctanos",
      footerWhatsApp: "WhatsApp",
      footerPrivacy: "Privacidad",
      footerTerms: "Términos de Uso",
      footerLGPD: "LGPD",
      footerDescription: "Organiza tus finanzas personales por WhatsApp. Simple, sin hojas de cálculo, sin estrés.",
      footerCopyright: "Todos los derechos reservados.",
      footerMadeInBrazil: "Hecho con 💚 en Brasil",
    },
  },
};

import React from "react";

const i18nContext = React.createContext<Locale>("pt");

export function I18nProvider({
  children,
  locale
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <i18nContext.Provider value={locale}>
      {children}
    </i18nContext.Provider>
  );
}

export function useLocale() {
  return React.useContext(i18nContext);
}

export function useTranslation() {
  const locale = useLocale();
  const t = React.useMemo(() => translations[locale], [locale]);
  return { t, locale };
}

export function getTranslatedValue<K extends keyof Translations>(
  locale: Locale,
  section: K,
  key: string
): string {
  const sectionData = translations[locale][section];
  return (sectionData as Record<string, string>)[key] || key;
}

export function changeLocale(newLocale: Locale) {
  if (typeof window !== "undefined") {
    localStorage.setItem("organizaai-locale", newLocale);
  }
}

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "pt";

  const stored = localStorage.getItem("organizaai-locale") as Locale;
  return (stored && ["pt", "en", "es"].includes(stored)) ? stored : "pt";
}
