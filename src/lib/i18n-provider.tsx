import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { translations } from "./i18n";
import type { Locale } from "./i18n";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (section: string, key: string) => string;
  availableLocales: readonly Locale[];
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = "organizaai-locale";
const SUPPORTED_LOCALES = ["pt", "en", "es"] as const;

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  // Always use Portuguese
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== "pt") {
      localStorage.setItem(STORAGE_KEY, "pt");
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    // Update document lang attribute
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback((section: string, key: string): string => {
    const translationsObj = translations[locale];
    const sectionData = translationsObj[section as keyof typeof translationsObj];
    if (!sectionData) return key;
    return (sectionData as Record<string, string>)[key] || key;
  }, [locale]);

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    availableLocales: SUPPORTED_LOCALES,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Language names for display
export const LANGUAGE_NAMES: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
};

// Export available locales
export { SUPPORTED_LOCALES as AVAILABLE_LOCALES };
export type { Locale };
