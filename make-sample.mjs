import PDFDocument from "pdfkit";
import { createWriteStream } from "node:fs";

const doc = new PDFDocument({ size: "A4", margin: 40 });
doc.pipe(createWriteStream("sample-invoice.pdf"));

// Header band
doc.rect(0, 0, 595, 110).fill("#0B0D12");
doc.fillColor("#FFFFFF").fontSize(32).font("Helvetica-Bold").text("INVOICE", 40, 40);
doc.fontSize(10).font("Helvetica").fillColor("#9AA4B2").text("Acme Cloud Services Inc.", 40, 78);
doc.fillColor("#F59E0B").fontSize(10).text("billing@acmecloud.com", 40, 92);

// Top-right meta
doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(11).text("INV-2026-0042", 400, 40, { width: 155, align: "right" });
doc.fillColor("#9AA4B2").font("Helvetica").fontSize(9).text("Issued 2026-04-15  ·  Due 2026-05-15", 400, 58, { width: 155, align: "right" });

doc.fillColor("#111827");

// Addresses
doc.font("Helvetica-Bold").fontSize(10).fillColor("#6B7280").text("FROM", 40, 140);
doc.font("Helvetica").fontSize(11).fillColor("#111827")
  .text("Acme Cloud Services Inc.", 40, 156)
  .text("123 Market Street, Suite 400", 40, 172)
  .text("San Francisco, CA 94103, USA", 40, 188)
  .text("Tax ID: 88-1234567", 40, 204);

doc.font("Helvetica-Bold").fontSize(10).fillColor("#6B7280").text("BILL TO", 320, 140);
doc.font("Helvetica").fontSize(11).fillColor("#111827")
  .text("Example Customer Co.", 320, 156)
  .text("Attn: Accounts Payable", 320, 172)
  .text("1-1-1 Example, Tokyo, Japan", 320, 188)
  .text("ap@example.com", 320, 204);

// Line items table
const tableTop = 260;
doc.rect(40, tableTop, 515, 26).fill("#0B0D12");
doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(10)
  .text("DESCRIPTION", 52, tableTop + 8)
  .text("QTY", 330, tableTop + 8, { width: 40, align: "right" })
  .text("UNIT", 380, tableTop + 8, { width: 70, align: "right" })
  .text("AMOUNT", 460, tableTop + 8, { width: 85, align: "right" });

const rows = [
  ["Pro Plan subscription (April 2026)", "1", "$99.00", "$99.00"],
  ["API overage — 120,000 tokens @ $0.01 / 1k", "1", "$1.20", "$1.20"],
  ["Priority support add-on (monthly)", "1", "$29.00", "$29.00"],
  ["Engineering consult — Q2 onboarding", "1", "$0.00", "$0.00"],
];
let y = tableTop + 36;
doc.font("Helvetica").fontSize(10).fillColor("#111827");
rows.forEach((r, i) => {
  if (i % 2 === 0) doc.rect(40, y - 6, 515, 24).fill("#F9FAFB");
  doc.fillColor("#111827")
    .text(r[0], 52, y, { width: 270 })
    .text(r[1], 330, y, { width: 40, align: "right" })
    .text(r[2], 380, y, { width: 70, align: "right" })
    .text(r[3], 460, y, { width: 85, align: "right" });
  y += 24;
});

// Totals block
const tx = 340, ty = y + 20;
doc.font("Helvetica").fontSize(10).fillColor("#6B7280")
  .text("Subtotal", tx, ty, { width: 100 })
  .text("Tax (10%)", tx, ty + 18, { width: 100 });
doc.fillColor("#111827")
  .text("$129.20", tx + 100, ty, { width: 105, align: "right" })
  .text("$12.92",  tx + 100, ty + 18, { width: 105, align: "right" });

doc.rect(tx, ty + 40, 215, 34).fill("#0B0D12");
doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(12)
  .text("TOTAL", tx + 12, ty + 51)
  .text("$142.12 USD", tx + 100, ty + 51, { width: 105, align: "right" });

// Payment info
doc.font("Helvetica").fontSize(9).fillColor("#6B7280")
  .text("Payment terms: Net 30. Wire transfer or credit card.", 40, ty + 110, { width: 515 })
  .text("Questions? billing@acmecloud.com — Thank you for your business.", 40, ty + 126, { width: 515 });

doc.end();
console.log("Wrote sample-invoice.pdf");
