import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrencyUZS(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value) + " so'm";
}

export function toCsv(rows: Record<string, unknown>[], columns: string[]) {
  const escape = (value: unknown) => {
    const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  return [columns.join(","), ...rows.map((row) => columns.map((column) => escape(row[column])).join(","))].join("\n");
}
