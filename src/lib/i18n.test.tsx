/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import {
  getTranslatedValue,
  translations,
} from "./i18n";

describe("i18n Utilities", () => {
  describe("getTranslatedValue", () => {
    it("should return correct value for pt locale", () => {
      const result = getTranslatedValue("pt", "common", "login");
      expect(result).toBe("Entrar");
    });

    it("should return correct value for en locale", () => {
      const result = getTranslatedValue("en", "common", "login");
      expect(result).toBe("Sign In");
    });

    it("should return correct value for es locale", () => {
      const result = getTranslatedValue("es", "common", "login");
      expect(result).toBe("Entrar");
    });

    it("should return key when translation not found", () => {
      const result = getTranslatedValue("pt", "common", "unknownKey");
      expect(result).toBe("unknownKey");
    });

    it("should translate auth section in english", () => {
      const result = getTranslatedValue("en", "auth", "signIn");
      expect(result).toBe("Sign In");
    });

    it("should translate dashboard section in portuguese", () => {
      const result = getTranslatedValue("pt", "dashboard", "income");
      expect(result).toBe("Receitas");
    });

    it("should translate goals section in spanish", () => {
      const result = getTranslatedValue("es", "goals", "progress");
      expect(result).toBe("Progreso");
    });

    it("should handle section access dynamically", () => {
      const ptLogin = getTranslatedValue("pt", "auth", "loginTitle");
      const enLogin = getTranslatedValue("en", "auth", "loginTitle");
      const esLogin = getTranslatedValue("es", "auth", "loginTitle");

      expect(ptLogin).toBe("Bem-vindo de volta");
      expect(enLogin).toBe("Welcome back");
      expect(esLogin).toBe("Bienvenido de nuevo");
    });
  });

  describe("translations object structure", () => {
    it("should have translations for all locales", () => {
      expect(translations.pt).toBeDefined();
      expect(translations.en).toBeDefined();
      expect(translations.es).toBeDefined();
    });

    it("should have all required sections in each locale", () => {
      const requiredSections = ["common", "auth", "dashboard", "transactions", "goals", "categories", "errors"] as const;

      requiredSections.forEach((section) => {
        expect(translations.pt[section]).toBeDefined();
        expect(translations.en[section]).toBeDefined();
        expect(translations.es[section]).toBeDefined();
      });
    });

    it("should have appName in common section for all locales", () => {
      expect(translations.pt.common.appName).toBe("OrganizaAI");
      expect(translations.en.common.appName).toBe("OrganizaAI");
      expect(translations.es.common.appName).toBe("OrganizaAI");
    });

    it("should have login button in all locales", () => {
      expect(translations.pt.common.login).toBe("Entrar");
      expect(translations.en.common.login).toBe("Sign In");
      expect(translations.es.common.login).toBe("Entrar");
    });

    it("should have password field in all locales", () => {
      expect(translations.pt.common.password).toBe("Senha");
      expect(translations.en.common.password).toBe("Password");
      expect(translations.es.common.password).toBe("Contraseña");
    });

    it("should support all currency translations", () => {
      expect(translations.pt.transactions.amount).toBe("Valor");
      expect(translations.en.transactions.amount).toBe("Amount");
      expect(translations.es.transactions.amount).toBe("Valor");
    });
  });
});
