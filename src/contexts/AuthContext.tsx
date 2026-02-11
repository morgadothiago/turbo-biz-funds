import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { User, AuthContextType } from "@/types/auth";
import { storage, generateToken, getMockUsers } from "@/lib/storage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
