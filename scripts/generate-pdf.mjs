// scripts/generate-pdf.mjs
import { chromium } from 'playwright';
import { resolve, join } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';
import { computeCvMeta } from './cv-meta.mjs';

const { hash } = computeCvMeta();
const distCv = resolve('dist/cv');
if (!existsSync(distCv)) mkdirSync(distCv, { recursive: true });

const configs = [
  { lang: 'en', htmlPath: resolve('dist/en/cv/index.html') },
  { lang: 'es', htmlPath: resolve('dist/es/cv/index.html') },
];

const browser = await chromium.launch();

for (const { lang, htmlPath } of configs) {
  const outPath = join(distCv, `javier-zapata-${lang}-${hash}.pdf`);
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: outPath,
    printBackground: true,
    format: 'A4',
    displayHeaderFooter: false,
    margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
  });
  await page.close();
  console.log(`Generated: ${outPath}`);
}

await browser.close();
