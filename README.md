# claude-code-invoice-to-notion

Drop an invoice PDF → get structured data. Built with Claude.

No OCR libraries. No regex. Claude reads the PDF directly and returns clean JSON.

## Get the Code

> Full source code is available on Gumroad — includes repo zip, setup guide, and support.
>
> **[→ Get the code ($19)](https://whsiky.gumroad.com/l/fzguhn)**

> **Current output: CSV (zero-auth, works out of the box).**
> Notion / Google Sheets / Airtable adapters are a ~30-line file away.

## Why

Every solo founder loses hours per month logging invoices by hand.
This is ~100 lines of code that does it for you.

## Setup

```bash
npm install
cp .env.example .env
# add your ANTHROPIC_API_KEY
```

## Usage

```bash
npm run add -- ./invoice.pdf
```

Output:

```
📄 Extracting: /abs/path/invoice.pdf
✅ Extracted:
{
  "vendor": "Acme Inc.",
  "invoice_number": "INV-0042",
  "issue_date": "2026-04-10",
  "due_date": "2026-05-10",
  "currency": "JPY",
  "subtotal": 100000,
  "tax": 10000,
  "total": 110000,
  "line_items_summary": "3x widget @ 33000, 1x setup fee @ 1000"
}
✅ Appended to: /abs/path/invoices.csv
```

Second arg chooses the CSV path (default: `./invoices.csv`):

```bash
npm run add -- ./invoice.pdf ./2026-q2.csv
```

## Stack

`Claude Opus 4.6` · `TypeScript` · `Anthropic SDK`

## Extend it

Want to push to Notion / Sheets / your DB instead of CSV?
Copy `src/csv.ts` → `src/<your-sink>.ts`, implement the same `append` function, swap the import in `src/index.ts`. That's it.

## License

MIT. Build on it. Ship your own.

---

Shipped by [@ryushipsjp](https://x.com/ryushipsjp) — new Claude Code automation every Friday.
