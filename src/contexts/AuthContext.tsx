import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: "financeai_token",
  USER: "financeai_user",
} as const;

interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

const getMockUsers = (): MockUser[] => [
  {
    id: "1",
    email: import.meta.env.VITE_TEST_ADMIN_EMAIL || "admin@financeai.com",
    password: import.meta.env.VITE_TEST_ADMIN_PASSWORD || "admin123",
    name: "Administrador",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    email: import.meta.env.VITE_TEST_USER_EMAIL || "usuario@financeai.com",
    password: import.meta.env.VITE_TEST_USER_PASSWORD || "user123",
    name: "João Silva",
    role: "user" as UserRole,
  },
];

const storage = {
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

const generateToken = (userId: string): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const token = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `token_${userId}_${Date.now()}_${token}`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = storage.getToken();
      const savedUser = storage.getUser();
      
      if (token && savedUser) {
        setUser(savedUser);
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUsers = getMockUsers();
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error("Email ou senha inválidos");
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    const token = generateToken(foundUser.id);
    
    storage.setToken(token);
    storage.setUser(userWithoutPassword);
    
    setUser(userWithoutPassword);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    storage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function useAuthLoading() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthLoading deve ser usado dentro de um AuthProvider");
  }
  return context.isLoading;
}
