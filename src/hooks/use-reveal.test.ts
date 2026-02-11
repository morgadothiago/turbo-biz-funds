import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReveal } from "./use-reveal";

describe("useReveal Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return a ref", () => {
    const { result } = renderHook(() => useReveal());
    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty("current");
  });

  it("should accept custom delay parameter", () => {
    const { result } = renderHook(() => useReveal(500));
    expect(result.current).toBeDefined();
  });

  it("should return null ref when not mounted", () => {
    const { result } = renderHook(() => useReveal());
    expect(result.current.current).toBeNull();
  });

  it("should handle zero delay", () => {
    const { result } = renderHook(() => useReveal(0));
    expect(result.current).toBeDefined();
  });

  it("should handle large delay", () => {
    const { result } = renderHook(() => useReveal(2000));
    expect(result.current).toBeDefined();
  });

  it("should handle multiple instances", () => {
    const { result: result1 } = renderHook(() => useReveal(100));
    const { result: result2 } = renderHook(() => useReveal(200));
    const { result: result3 } = renderHook(() => useReveal(300));

    expect(result1.current).toBeDefined();
    expect(result2.current).toBeDefined();
    expect(result3.current).toBeDefined();
  });
});
