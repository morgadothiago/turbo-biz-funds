import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor, cleanup } from "@testing-library/react";
import { AuthProvider, useAuth, useAuthLoading } from "@/contexts/AuthContext";
import React from "react";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext - Core Functionality", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should login successfully with admin credentials", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login("admin@financeai.com", "admin123");
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.role).toBe("admin");
    expect(result.current.user?.email).toBe("admin@financeai.com");
  });

  it("should login successfully with user credentials", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login("usuario@financeai.com", "user123");
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.role).toBe("user");
    expect(result.current.user?.name).toBe("João Silva");
  });

  it("should throw error for invalid credentials", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    let error: Error | null = null;
    await act(async () => {
      try {
        await result.current.login("invalid@email.com", "wrongpassword");
      } catch (e) {
        error = e as Error;
      }
    });
    
    expect(error).not.toBeNull();
    expect(error?.message).toBe("Email ou senha inválidos");
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should logout successfully", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login("admin@financeai.com", "admin123");
    });
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should set loading state during login", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    act(() => {
      result.current.login("admin@financeai.com", "admin123");
    });
    
    expect(result.current.isLoading).toBe(true);
  });

  it("should return user name correctly after login", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login("admin@financeai.com", "admin123");
    });
    
    expect(result.current.user?.name).toBe("Administrador");
  });
});

describe("AuthContext - Initialization", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should initialize with no user", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("should remain unauthenticated if no token in localStorage", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});

describe("AuthContext - useAuthLoading Hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should return loading state correctly", async () => {
    const { result } = renderHook(() => useAuthLoading(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("should show loading during login", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    act(() => {
      result.current.login("admin@financeai.com", "admin123");
    });
    
    expect(result.current.isLoading).toBe(true);
  });
});

describe("AuthContext - Error Handling", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should handle localStorage errors gracefully on login", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("Storage error");
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      try {
        await result.current.login("admin@financeai.com", "admin123");
      } catch {
        // Expected to throw
      }
    });
    
    expect(result.current.isLoading).toBe(false);
    consoleSpy.mockRestore();
  });
});

describe("AuthContext - User Data", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should have userId in user data after login", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login("admin@financeai.com", "admin123");
    });
    
    expect(result.current.user?.id).toBe("1");
    expect(result.current.user?.email).toBe("admin@financeai.com");
  });

  it("should handle different user roles", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login("usuario@financeai.com", "user123");
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.role).toBe("user");
    expect(result.current.user?.id).toBe("2");
  });
});
