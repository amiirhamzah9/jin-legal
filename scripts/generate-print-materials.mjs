// Generate PDF + preview PNG for letterhead, amplop besar, amplop kecil
// Usage: node scripts/generate-print-materials.mjs
import { chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRINT_DIR = path.join(ROOT, "assets/print");

const TARGETS = [
  {
    name: "letterhead",
    html: "letterhead.html",
    pdf: "letterhead.pdf",
    pdfFormat: "A4",
    // For PNG preview: render at 144 DPI roughly = 1200×1697 for A4
    previewSize: { width: 1190, height: 1684 }, // 144 DPI A4
  },
  {
    name: "amplop-besar",
    html: "amplop-besar.html",
    pdf: "amplop-besar.pdf",
    pdfWidth: "250mm",
    pdfHeight: "353mm",
    previewSize: { width: 1417, height: 2001 },
  },
  {
    name: "amplop-kecil",
    html: "amplop-kecil.html",
    pdf: "amplop-kecil.pdf",
    pdfWidth: "220mm",
    pdfHeight: "110mm",
    previewSize: { width: 1247, height: 624 },
  },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 2 });

for (const t of TARGETS) {
  const page = await ctx.newPage();
  await page.setViewportSize(t.previewSize);
  const fileUrl = "file://" + path.join(PRINT_DIR, t.html);
  await page.goto(fileUrl, { waitUntil: "networkidle" });
  // Wait a moment for web fonts
  await page.waitForTimeout(800);

  // Render PDF
  await page.pdf({
    path: path.join(PRINT_DIR, t.pdf),
    format: t.pdfFormat,
    width: t.pdfWidth,
    height: t.pdfHeight,
    printBackground: true,
    preferCSSPageSize: true,
  });

  // Render PNG preview
  await page.screenshot({
    path: path.join(PRINT_DIR, `${t.name}-preview.png`),
    fullPage: true,
  });
  console.log(`✓ ${t.name}: PDF + PNG generated`);
  await page.close();
}

// Convert SVG cap to PNG preview using browser
const capSvgUrl = "file://" + path.join(PRINT_DIR, "cap-bulat.svg");
const capPage = await ctx.newPage();
await capPage.setViewportSize({ width: 800, height: 800 });
await capPage.goto(`data:text/html,<html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:%23faf7f1"><img src="${capSvgUrl}" style="width:600px;height:600px"></body></html>`, { waitUntil: "networkidle" });
await capPage.waitForTimeout(800);
await capPage.screenshot({ path: path.join(PRINT_DIR, "cap-bulat-preview.png"), fullPage: true });
console.log(`✓ cap-bulat: PNG preview generated (SVG is the print master)`);
await capPage.close();

await browser.close();
console.log("\nAll print materials generated to assets/print/");
