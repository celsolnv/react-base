import { format, parseISO } from "date-fns";
/**
 * Formata uma data usando Intl.DateTimeFormat
 */
export function formatDate(
  value: unknown,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
): string {
  if (!value) return "-";

  try {
    const date = typeof value === "string" ? new Date(value) : (value as Date);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("pt-BR", options).format(date);
  } catch {
    return "-";
  }
}

export function formatDateISO(value?: string | null): string {
  if (!value) return "-";
  const date = parseISO(value);
  return format(date, "yyyy-MM-dd");
}
