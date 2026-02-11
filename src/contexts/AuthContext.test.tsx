import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor, cleanup } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import React from "react";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("useAuth hook", () => {
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

  it("should login successfully with admin credentials", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login("admin@financeai.com", "admin123");
    });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.role).toBe("admin");
      expect(result.current.user?.email).toBe("admin@financeai.com");
    });
  });

  it("should login successfully with user credentials", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login("usuario@financeai.com", "user123");
    });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.role).toBe("user");
      expect(result.current.user?.name).toBe("João Silva");
    });
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
    
    expect(result.current).toBeDefined();
    expect(result.current.login).toBeDefined();
    
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
