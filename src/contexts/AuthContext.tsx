import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { User, AuthContextType } from "@/types/auth";
import { storage } from "@/lib/storage";
import { api, apiEndpoints } from "@/lib/api/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

interface LoginApiResponse {
  data: { token: string };
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  plan: string;
  phone?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = storage.getToken();
    const savedUser = storage.getUser();
    if (token && savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await api.post<LoginApiResponse>(apiEndpoints.auth.login, {
        email,
        password,
      });

      const token = response.data.token;
      const claims = decodeJwt(token);

      const role = (claims.role as string) === "admin" ? "admin" : "user";

      const user: User = {
        id: (claims.sub as string) || (claims.id as string) || "",
        email: (claims.email as string) || email,
        name: (claims.name as string) || email.split("@")[0],
        role,
      };

      storage.setToken(token);
      storage.setUser(user);
      setUser(user);

      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    await api.post(apiEndpoints.auth.register, payload);
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
        register,
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
