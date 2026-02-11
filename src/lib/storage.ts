import type { User } from "../types/auth";

const STORAGE_KEYS = {
  TOKEN: "financeai_token",
  USER: "financeai_user",
} as const;

export interface StorageUtils {
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  getUser(): User | null;
  setUser(user: User): void;
  removeUser(): void;
  clear(): void;
}

export const storage: StorageUtils = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error("Erro ao salvar token:", error);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Erro ao remover token:", error);
    }
  },

  getUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  },

  removeUser: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error("Erro ao limpar storage:", error);
    }
  },
};

export const generateToken = (userId: string): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const token = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `token_${userId}_${Date.now()}_${token}`;
};

export const getMockUsers = (): import("../types/auth").MockUser[] => [
  {
    id: "1",
    email: import.meta.env.VITE_TEST_ADMIN_EMAIL || "admin@financeai.com",
    password: import.meta.env.VITE_TEST_ADMIN_PASSWORD || "admin123",
    name: "Administrador",
    role: "admin",
  },
  {
    id: "2",
    email: import.meta.env.VITE_TEST_USER_EMAIL || "usuario@financeai.com",
    password: import.meta.env.VITE_TEST_USER_PASSWORD || "user123",
    name: "João Silva",
    role: "user",
  },
];
