/**
 * Tipos compartilhados relacionados a transações financeiras.
 */

export type TransactionType = "income" | "expense";
export type TransactionCategory = 
  | "Alimentação"
  | "Transporte"
  | "Lazer"
  | "Contas"
  | "Renda"
  | "Outros"
  | string;

export interface Transaction {
  id: number | string;
  description: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
  date: string;
  icon?: string;
  paymentMethod?: string;
  isRecurring?: boolean;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  category?: TransactionCategory;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  balance: number;
}
