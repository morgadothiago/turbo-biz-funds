import type { User } from "../types/auth";

const STORAGE_KEYS = {
  TOKEN: "doutocash_token",
  USER: "doutocash_user",
} as const;

function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (!claims.exp) return false;
    // 10s de margem para evitar race conditions
    return Date.now() / 1000 >= claims.exp - 10;
  } catch {
    return true;
  }
}

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
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) return null;
      if (isTokenExpired(token)) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        return null;
      }
      return token;
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch {
      // ignore
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch {
      // ignore
    }
  },

  getUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? (JSON.parse(userStr) as User) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    try {
      // Strip sensitive fields before persisting (LGPD)
      const { cpf: _cpf, ...safeUser } = user;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));
    } catch {
      // ignore
    }
  },

  removeUser: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // ignore
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      sessionStorage.clear();
    } catch {
      // ignore
    }
  },
};
