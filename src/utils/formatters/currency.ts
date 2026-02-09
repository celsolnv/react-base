/**
 * Formata um valor como moeda
 */
export function formatCurrency(
  value: unknown,
  currency = "BRL",
  locale = "pt-BR"
): string {
  if (value === null || value === undefined) return "-";

  const numericValue = typeof value === "number" ? value : Number(value);

  if (Number.isNaN(numericValue)) return "-";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(numericValue);
}
