import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { User, AuthContextType, UserPlan } from "@/types/auth";
import { storage } from "@/lib/storage";
import { api, publicApi, apiEndpoints } from "@/lib/api/client";

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
  data: { token: string; accessToken?: string };
}

interface RegisterApiResponse {
  data: {
    accessToken?: string;
    token?: string;
    user?: { name?: string; email?: string; role?: string; plan?: string };
  };
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  plan: string;
  phone?: string;
}

function userFromClaims(claims: Record<string, unknown>, fallbackEmail: string): User {
  const role = (claims.role as string) === "admin" ? "admin" : "user";
  const planClaim = claims.plan as string;
  const plan = (["free", "pro", "business"].includes(planClaim) ? planClaim : "free") as UserPlan;

  return {
    id: (claims.sub as string) || (claims.id as string) || "",
    email: (claims.email as string) || fallbackEmail,
    name: (claims.name as string) || fallbackEmail.split("@")[0],
    role,
    plan,
    phone: (claims.phone as string) || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = storage.getToken();
    const savedUser = storage.getUser();
    if (token && savedUser) {
      // Re-decode JWT to pick up any new fields (like plan)
      const claims = decodeJwt(token);
      const refreshedUser: User = {
        ...savedUser,
        plan: savedUser.plan ?? ((["free", "pro", "business"].includes(claims.plan as string) ? claims.plan : "free") as UserPlan),
      };
      setUser(refreshedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await publicApi.post<LoginApiResponse>(apiEndpoints.auth.login, { email, password });
      const raw = response as unknown as Record<string, unknown>;
      const nested = (raw.data ?? {}) as Record<string, unknown>;
      const token = (raw.token ?? raw.accessToken ?? nested.token ?? nested.accessToken ?? "") as string;
      const claims = decodeJwt(token);
      const user = userFromClaims(claims, email);

      console.log("[Auth] Resposta da API (login):", response);
      console.log("[Auth] Claims do JWT:", claims);
      console.log("[Auth] Usuário:", user);

      storage.setToken(token);
      storage.setUser(user);
      setUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    const response = await publicApi.post<RegisterApiResponse>(apiEndpoints.auth.register, payload);
    // API pode retornar token no nível raiz ou aninhado em `data`
    const raw = response as unknown as Record<string, unknown>;
    const nested = (raw.data ?? {}) as Record<string, unknown>;
    const token = (raw.accessToken ?? raw.token ?? nested.accessToken ?? nested.token) as string | undefined;
    console.log("[Auth] Resposta da API (cadastro):", response);
    if (token) {
      const claims = decodeJwt(token);
      const user = userFromClaims(claims, payload.email);
      console.log("[Auth] Claims do JWT (cadastro):", claims);
      console.log("[Auth] Usuário (cadastro):", user);
      storage.setToken(token);
      storage.setUser(user);
      setUser(user);
    } else {
      // API não retornou token no cadastro — faz login automaticamente
      await login(payload.email, payload.password);
    }
  }, [login]);

  const updateProfile = useCallback(async (data: { name?: string; phone?: string }): Promise<void> => {
    await api.patch("/v1/users/me", data);
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      storage.setUser(updated);
      return updated;
    });
  }, []);

  const changePassword = useCallback(async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.patch("/v1/users/me/password", data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post(apiEndpoints.auth.logout);
    } catch {
      // Logout local continua mesmo se o servidor falhar
    } finally {
      storage.clear();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}

export function useAuthLoading() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuthLoading deve ser usado dentro de um AuthProvider");
  return context.isLoading;
}
