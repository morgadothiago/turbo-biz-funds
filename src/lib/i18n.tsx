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
}

export const translations: Record<Locale, Translations> = {
  pt: {
    common: {
      appName: "OrganizaAI",
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
  },
  en: {
    common: {
      appName: "OrganizaAI",
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
  },
  es: {
    common: {
      appName: "OrganizaAI",
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
