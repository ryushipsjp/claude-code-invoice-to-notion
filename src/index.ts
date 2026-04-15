import { config } from "dotenv";
config({ override: true });
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { extractInvoice } from "./extract.js";
import { appendToCsv } from "./csv.js";

async function main() {
  const pdfArg = process.argv[2];
  if (!pdfArg) {
    console.error("Usage: npm run add -- <path/to/invoice.pdf> [output.csv]");
    process.exit(1);
  }

  const pdfPath = resolve(pdfArg);
  if (!existsSync(pdfPath)) {
    console.error(`File not found: ${pdfPath}`);
    process.exit(1);
  }

  const csvPath = resolve(process.argv[3] ?? "invoices.csv");

  console.log(`📄 Extracting: ${pdfPath}`);
  const data = await extractInvoice(pdfPath);
  console.log("✅ Extracted:\n" + JSON.stringify(data, null, 2));

  appendToCsv(data, pdfPath, csvPath);
  console.log(`✅ Appended to: ${csvPath}`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
