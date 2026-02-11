import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "./auth.schema";

describe("Auth Schemas", () => {
  describe("loginSchema", () => {
    it("should validate valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("test@example.com");
        expect(result.data.password).toBe("password123");
      }
    });

    it("should reject invalid email", () => {
      const result = loginSchema.safeParse({
        email: "invalid-email",
        password: "password123",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("email válido");
      }
    });

    it("should reject empty email", () => {
      const result = loginSchema.safeParse({
        email: "",
        password: "password123",
      });

      expect(result.success).toBe(false);
    });

    it("should reject empty password", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "",
      });

      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "123",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("should validate valid registration data", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password123",
        plan: "pro",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John Doe");
        expect(result.data.plan).toBe("pro");
      }
    });

    it("should reject short name", () => {
      const result = registerSchema.safeParse({
        name: "J",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password123",
        plan: "pro",
      });

      expect(result.success).toBe(false);
    });

    it("should reject mismatched passwords", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Different123",
        plan: "pro",
      });

      expect(result.success).toBe(false);
    });

    it("should reject password without uppercase", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
        plan: "pro",
      });

      expect(result.success).toBe(false);
    });

    it("should reject password without number", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Passwordabc",
        confirmPassword: "Passwordabc",
        plan: "pro",
      });

      expect(result.success).toBe(false);
    });

    it("should reject empty plan", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password123",
        plan: "",
      });

      expect(result.success).toBe(false);
    });

    it("should extract LoginFormData type correctly", () => {
      const data: { email: string; password: string } = {
        email: "test@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
