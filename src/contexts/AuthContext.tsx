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

// Chaves do localStorage
const STORAGE_KEYS = {
  TOKEN: "financeai_token",
  USER: "financeai_user",
} as const;

// Mock users para demonstração
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@financeai.com",
    password: "admin123",
    name: "Administrador",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    email: "usuario@financeai.com",
    password: "user123",
    name: "João Silva",
    role: "user" as UserRole,
  },
];

// Funções de localStorage
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

// Gerar token mock
const generateToken = (userId: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `token_${userId}_${timestamp}_${random}`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao iniciar
  useEffect(() => {
    const initAuth = () => {
      const token = storage.getToken();
      const savedUser = storage.getUser();
      
      if (token && savedUser) {
        // Aqui você pode adicionar validação do token
        setUser(savedUser);
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error("Email ou senha inválidos");
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    const token = generateToken(foundUser.id);
    
    // Salvar no localStorage
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook para verificar se está carregando a autenticação
export function useAuthLoading() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthLoading must be used within an AuthProvider");
  }
  return context.isLoading;
}
