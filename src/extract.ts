import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";

export type InvoiceData = {
  vendor: string;
  invoice_number: string | null;
  issue_date: string;
  due_date: string | null;
  currency: string;
  subtotal: number | null;
  tax: number | null;
  total: number;
  line_items_summary: string;
};

const SYSTEM = `You extract structured data from invoices and receipts.
Return ONLY a JSON object matching the provided schema. No prose, no markdown fences.
Dates must be ISO 8601 (YYYY-MM-DD). Amounts are numbers without currency symbols or commas.
If a field is genuinely missing from the document, use null (strings that are required use empty string "").`;

const SCHEMA_HINT = `{
  "vendor": string,
  "invoice_number": string | null,
  "issue_date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD" | null,
  "currency": "JPY" | "USD" | string,
  "subtotal": number | null,
  "tax": number | null,
  "total": number,
  "line_items_summary": string
}`;

export async function extractInvoice(pdfPath: string): Promise<InvoiceData> {
  const client = new Anthropic();
  const pdfBase64 = readFileSync(pdfPath).toString("base64");

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
          },
          {
            type: "text",
            text: `Extract invoice data. Output JSON exactly matching:\n${SCHEMA_HINT}`,
          },
        ],
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  const cleaned = text.replace(/^```(?:json)?\s*|\s*```$/g, "");
  return JSON.parse(cleaned) as InvoiceData;
}
