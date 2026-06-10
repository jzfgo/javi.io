// scripts/generate-pdf.mjs
import { chromium } from "playwright";
import { resolve, join } from "node:path";
import { mkdirSync, existsSync, copyFileSync } from "node:fs";
import { computeCvMeta } from "./cv-meta.mjs";
import { pathToFileURL } from "node:url";

const { hash } = computeCvMeta();
const distCv = resolve("dist/cv");
const publicCv = resolve("public/cv");

const configs = [
  { lang: "en", htmlPath: resolve("dist/en/cv/index.html") },
  { lang: "es", htmlPath: resolve("dist/es/cv/index.html") },
];

// Verify files exist first
for (const { htmlPath } of configs) {
  if (!existsSync(htmlPath)) {
    console.error("Error: HTML file not found at " + htmlPath + ". Did you run pnpm build first?");
    process.exit(1);
  }
}

if (!existsSync(distCv)) mkdirSync(distCv, { recursive: true });
if (!existsSync(publicCv)) mkdirSync(publicCv, { recursive: true });

const browser = await chromium.launch();
try {
  for (const { lang, htmlPath } of configs) {
    const outPath = join(distCv, `javier-zapata-${lang}-${hash}.pdf`);
    const page = await browser.newPage();
    await page.goto(pathToFileURL(htmlPath).href);
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: outPath,
      printBackground: true,
      format: "A4",
      displayHeaderFooter: false,
      margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
    });
    await page.close();
    // Also copy to public/cv/ so `pnpm dev` can serve it
    const publicPath = join(publicCv, `javier-zapata-${lang}-${hash}.pdf`);
    copyFileSync(outPath, publicPath);
    console.log(`Generated: ${outPath}`);
  }
} finally {
  await browser.close();
}
