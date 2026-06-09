// scripts/generate-docx.mjs
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, TabStopPosition, TabStopType,
} from 'docx';
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import matter from 'gray-matter';
import { computeCvMeta } from './cv-meta.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const profilePublic = require('../src/content/profile/public.json');

// Section labels inlined to avoid TS import issues in plain .mjs
// If src/cv/sections.ts labels change, update these too.
const SECTIONS_DATA = {
  en: { experience: 'Experience', education: 'Education', skills: 'Skills', present: 'Present', updated: 'Updated' },
  es: { experience: 'Experiencia', education: 'Educación', skills: 'Conocimientos', present: 'Actualidad', updated: 'Actualizado' },
};

const { hash, updated } = computeCvMeta();
const distCv = resolve('dist/cv');
const publicCv = resolve('public/cv');
if (!existsSync(distCv)) mkdirSync(distCv, { recursive: true });
if (!existsSync(publicCv)) mkdirSync(publicCv, { recursive: true });

function parseWorkFiles(dir) {
  return readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = readFileSync(join(dir, f), 'utf-8');
      return matter(raw).data;
    })
    .filter(d => d.include?.cv !== false)
    .sort((a, b) => {
      const da = new Date(a.dateStart.split('/').reverse().join('-'));
      const db = new Date(b.dateStart.split('/').reverse().join('-'));
      return db - da;
    });
}

function parseDate(dateStr) {
  const [m, d, y] = dateStr.split('/').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatDate(dateStr, locale) {
  const d = parseDate(dateStr);
  return d.toLocaleString(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function buildDoc(lang) {
  const s = SECTIONS_DATA[lang];
  const locale = lang === 'en' ? 'en' : 'es';
  const workDir = `src/content/work-${lang}`;
  const entries = parseWorkFiles(workDir);

  const children = [];

  // Header
  children.push(
    new Paragraph({
      children: [new TextRun({ text: profilePublic.name, bold: true, size: 36 })],
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: [new TextRun({ text: profilePublic.title, size: 20, color: '444444' })],
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: profilePublic.email, size: 18 }),
        new TextRun({ text: '  ·  ' + profilePublic.location, size: 18, color: '444444' }),
        new TextRun({ text: '  ·  ' + profilePublic.linkedin.replace('https://', ''), size: 18, color: '444444' }),
      ],
      spacing: { after: 200 },
    }),
  );

  // Experience section
  children.push(
    new Paragraph({
      text: s.experience.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '111111' } },
    }),
  );

  for (const entry of entries) {
    const start = formatDate(entry.dateStart, locale);
    const endStr = ['current', 'actualidad'].includes((entry.dateEnd ?? '').toLowerCase())
      ? s.present
      : formatDate(entry.dateEnd, locale);
    const dateRange = `${start} – ${endStr}`;

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: entry.company, bold: true, size: 20 }),
          new TextRun({ text: '\t' + dateRange, size: 18, color: '444444' }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { before: 120, after: 20 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: entry.role + (entry.location ? ' · ' + entry.location : ''),
            size: 18, color: '333333',
          }),
        ],
        spacing: { after: 40 },
      }),
    );

    if (entry.bullets && entry.bullets.length > 0) {
      for (const bullet of entry.bullets) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: bullet, size: 18 })],
            bullet: { level: 0 },
            spacing: { after: 20 },
          }),
        );
      }
    }
  }

  // Skills section
  if (entries.some(e => e.tech && e.tech.length > 0)) {
    const allTech = [...new Set(entries.flatMap(e => e.tech ?? []))];
    children.push(
      new Paragraph({
        text: s.skills.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '111111' } },
      }),
      new Paragraph({
        children: [new TextRun({ text: allTech.join(' · '), size: 18 })],
        spacing: { after: 80 },
      }),
    );
  }

  // Updated date
  if (updated) {
    const d = new Date(updated + 'T00:00:00Z');
    const dateLabel = lang === 'en'
      ? s.updated + ' ' + d.toLocaleString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })
      : s.updated + ' ' + d.toLocaleString('es', { month: 'long', timeZone: 'UTC' }) + ' de ' + d.getUTCFullYear();
    children.push(
      new Paragraph({
        children: [new TextRun({ text: dateLabel, size: 16, color: '888888' })],
        alignment: AlignmentType.RIGHT,
        spacing: { before: 200 },
      }),
    );
  }

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 910, bottom: 910, left: 793, right: 793 }, // ~16mm / ~14mm in TWIPs
        },
      },
      children,
    }],
  });
}

for (const lang of ['en', 'es']) {
  const doc = buildDoc(lang);
  const buffer = await Packer.toBuffer(doc);
  const outPath = join(distCv, `javier-zapata-${lang}-${hash}.docx`);
  writeFileSync(outPath, buffer);
  // Also copy to public/cv/ so `pnpm dev` can serve it
  copyFileSync(outPath, join(publicCv, `javier-zapata-${lang}-${hash}.docx`));
  console.log(`Generated: ${outPath}`);
}
