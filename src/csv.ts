import { appendFileSync, existsSync, writeFileSync } from "node:fs";
import type { InvoiceData } from "./extract.js";

const HEADERS = [
  "vendor",
  "invoice_number",
  "issue_date",
  "due_date",
  "currency",
  "subtotal",
  "tax",
  "total",
  "line_items_summary",
  "source_pdf",
  "logged_at",
] as const;

function escape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function appendToCsv(data: InvoiceData, sourcePdf: string, csvPath: string): void {
  if (!existsSync(csvPath)) {
    writeFileSync(csvPath, HEADERS.join(",") + "\n");
  }
  const row = [
    data.vendor,
    data.invoice_number,
    data.issue_date,
    data.due_date,
    data.currency,
    data.subtotal,
    data.tax,
    data.total,
    data.line_items_summary,
    sourcePdf,
    new Date().toISOString(),
  ];
  appendFileSync(csvPath, row.map(escape).join(",") + "\n");
}
