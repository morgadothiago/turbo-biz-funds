/**
 * Utilitários de formatação — padrão PT-BR
 *
 * fmtBRL(1000)        → "R$ 1.000,00"
 * fmtBRL(-253)        → "-R$ 253,00"
 * fmtNumber(1000)     → "1.000,00"
 * parseBRNumber("1.000,50") → 1000.5
 */

// Instância reutilizada — Intl é caro para criar repetidamente
const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const intFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formata valor como moeda BRL.
 * fmtBRL(1000)    → "R$ 1.000,00"
 * fmtBRL(-253.5)  → "-R$ 253,50"
 */
export function fmtBRL(value: number): string {
  return brlFormatter.format(value);
}

/**
 * Formata valor numérico sem símbolo de moeda.
 * fmtNumber(1000) → "1.000,00"
 */
export function fmtNumber(value: number): string {
  return numberFormatter.format(value);
}

/**
 * Formata inteiro sem casas decimais.
 * fmtInt(1500) → "1.500"
 */
export function fmtInt(value: number): string {
  return intFormatter.format(value);
}

/**
 * Parseia string em formato PT-BR para number.
 * Trata ponto como separador de milhar e vírgula como decimal.
 *
 * parseBRNumber("1.000")      → 1000
 * parseBRNumber("1.000,50")   → 1000.5
 * parseBRNumber("1000")       → 1000
 * parseBRNumber("R$ 1.500,00") → 1500
 */
export function parseBRNumber(v: string | number): number {
  if (typeof v === "number") return isNaN(v) ? 0 : v;
  const s = String(v)
    .replace(/R\$\s?/g, "")  // remove prefixo R$
    .trim()
    .replace(/\./g, "")       // remove separador de milhar
    .replace(",", ".");        // troca decimal
  return parseFloat(s) || 0;
}
