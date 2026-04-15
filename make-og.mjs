import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const W = 1600, H = 900;
const BG = "#0B0D12";
const FG = "#F8FAFC";
const MUTED = "#8B95A7";
const LINE = "#1F2937";
const ACCENT = "#F59E0B";

const KEY = "#7DD3FC";
const STR = "#86EFAC";
const NUM = "#FDBA74";
const PUNC = "#94A3B8";

// Left card dims
const cardX = 110, cardY = 260, cardW = 520, cardH = 540;
// Right code dims
const codeX = 970, codeY = 260, codeW = 520, codeH = 540;

const jsonLines = [
  [["{", PUNC]],
  [["  ", PUNC], ["\"vendor\"", KEY], [": ", PUNC], ["\"Acme Cloud Services Inc.\"", STR], [",", PUNC]],
  [["  ", PUNC], ["\"invoice_number\"", KEY], [": ", PUNC], ["\"INV-2026-0042\"", STR], [",", PUNC]],
  [["  ", PUNC], ["\"issue_date\"", KEY], [": ", PUNC], ["\"2026-04-15\"", STR], [",", PUNC]],
  [["  ", PUNC], ["\"due_date\"", KEY], [": ", PUNC], ["\"2026-05-15\"", STR], [",", PUNC]],
  [["  ", PUNC], ["\"currency\"", KEY], [": ", PUNC], ["\"USD\"", STR], [",", PUNC]],
  [["  ", PUNC], ["\"subtotal\"", KEY], [": ", PUNC], ["129.20", NUM], [",", PUNC]],
  [["  ", PUNC], ["\"tax\"", KEY], [": ", PUNC], ["12.92", NUM], [",", PUNC]],
  [["  ", PUNC], ["\"total\"", KEY], [": ", PUNC], ["142.12", NUM]],
  [["}", PUNC]],
];

function measure(text, size) { return text.length * size * 0.6; }

let codeSvg = "";
const codeFont = 20;
const codeLH = 30;
const codePadX = 28, codePadY = 64;
jsonLines.forEach((tokens, i) => {
  const y = codeY + codePadY + i * codeLH;
  let x = codeX + codePadX;
  tokens.forEach(([t, c]) => {
    const esc = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    codeSvg += `<text x="${x}" y="${y}" font-family="Consolas, 'SF Mono', Menlo, monospace" font-size="${codeFont}" fill="${c}" xml:space="preserve">${esc}</text>`;
    x += measure(t, codeFont);
  });
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
      <feOffset dx="0" dy="8" result="off"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.45"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="accent" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#F97316"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="${BG}"/>

  <!-- subtle top accent bar -->
  <rect x="0" y="0" width="${W}" height="3" fill="url(#accent)" opacity="0.9"/>

  <!-- Headline -->
  <text x="${W / 2}" y="140" font-family="Segoe UI, Inter, -apple-system, sans-serif" font-size="72" font-weight="800" fill="${FG}" text-anchor="middle" letter-spacing="-1.5">PDF in. Clean data out.</text>
  <text x="${W / 2}" y="190" font-family="Segoe UI, Inter, -apple-system, sans-serif" font-size="26" font-weight="400" fill="${MUTED}" text-anchor="middle">No OCR. No regex. Just Claude.</text>

  <!-- Left card (paper) -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="14" fill="#FFFFFF" filter="url(#shadow)"/>
  <!-- PDF image placeholder area; actual image composited later -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="14" fill="none" stroke="#E5E7EB" stroke-width="1"/>

  <!-- Left caption -->
  <text x="${cardX + cardW / 2}" y="${cardY + cardH + 36}" font-family="Consolas, monospace" font-size="18" fill="${MUTED}" text-anchor="middle">sample-invoice.pdf</text>

  <!-- Arrow: thick bar + chevron for clearer before->after visual -->
  <g transform="translate(${W / 2 - 80}, ${cardY + cardH / 2 - 20})">
    <rect x="0" y="8" width="130" height="24" rx="4" fill="url(#accent)"/>
    <polygon points="120,-8 170,20 120,48" fill="url(#accent)"/>
  </g>
  <text x="${W / 2}" y="${cardY + cardH / 2 + 70}" font-family="Consolas, monospace" font-size="18" font-weight="700" fill="${ACCENT}" text-anchor="middle">Claude Opus 4.6</text>
  <text x="${W / 2}" y="${cardY + cardH / 2 + 94}" font-family="Consolas, monospace" font-size="13" fill="${MUTED}" text-anchor="middle">reads PDF natively</text>

  <!-- Right code block -->
  <rect x="${codeX}" y="${codeY}" width="${codeW}" height="${codeH}" rx="14" fill="#111827" stroke="${LINE}" stroke-width="1" filter="url(#shadow)"/>
  <!-- window dots -->
  <circle cx="${codeX + 22}" cy="${codeY + 24}" r="6" fill="#EF4444" opacity="0.85"/>
  <circle cx="${codeX + 42}" cy="${codeY + 24}" r="6" fill="#F59E0B" opacity="0.85"/>
  <circle cx="${codeX + 62}" cy="${codeY + 24}" r="6" fill="#10B981" opacity="0.85"/>
  <text x="${codeX + codeW - 20}" y="${codeY + 30}" font-family="Consolas, monospace" font-size="14" fill="${MUTED}" text-anchor="end">extracted.json</text>
  <line x1="${codeX}" y1="${codeY + 44}" x2="${codeX + codeW}" y2="${codeY + 44}" stroke="${LINE}"/>

  ${codeSvg}

  <!-- Right caption -->
  <text x="${codeX + codeW / 2}" y="${codeY + codeH + 36}" font-family="Consolas, monospace" font-size="18" fill="${MUTED}" text-anchor="middle">structured JSON → any sink</text>

  <!-- Footer -->
  <line x1="110" y1="845" x2="${W - 110}" y2="845" stroke="${LINE}"/>
  <text x="${W / 2}" y="880" font-family="Consolas, monospace" font-size="17" fill="${MUTED}" text-anchor="middle">github.com/ryushipsjp/claude-code-invoice-to-notion    ·    @ryushipsjp    ·    Week 1</text>
</svg>`;

writeFileSync("og.svg", svg);

// Composite: render SVG then overlay PDF image on the left card
const pdfImg = await sharp("capture-invoice.png")
  .resize({ width: cardW - 24, height: cardH - 24, fit: "contain", background: "#FFFFFF" })
  .png()
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: pdfImg, top: cardY + 12, left: cardX + 12 }])
  .png()
  .toFile("og.png");

console.log("Wrote og.png");
