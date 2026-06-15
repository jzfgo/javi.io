// scripts/generate-docx.mjs
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TabStopPosition,
  TabStopType,
} from "docx";
import {
  readFileSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  copyFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import matter from "gray-matter";
import { computeCvMeta } from "./cv-meta.mjs";

const HALF_LIFE_YEARS = 3;
const MAX_TECH_AGE_YEARS = 5;
const RECENCY_THRESHOLD = Math.pow(0.5, MAX_TECH_AGE_YEARS / HALF_LIFE_YEARS);
const DEFAULT_LIMIT = 25;

function decayScore(date) {
  const yearsAgo = Math.max(
    0,
    (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  );
  return Math.pow(0.5, yearsAgo / HALF_LIFE_YEARS);
}

function computeSkillWeights(entries, limit = DEFAULT_LIMIT) {
  const totals = new Map();
  const peaks = new Map();
  for (const { skills, date } of entries) {
    const score = decayScore(date);
    for (const s of skills ?? []) {
      totals.set(s, (totals.get(s) ?? 0) + score);
      peaks.set(s, Math.max(peaks.get(s) ?? 0, score));
    }
  }
  return [...totals.entries()]
    .filter(([name]) => (peaks.get(name) ?? 0) >= RECENCY_THRESHOLD)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name]) => name);
}

const profilePath = existsSync(resolve("src/content/profile/full.json"))
  ? resolve("src/content/profile/full.json")
  : resolve("src/content/profile/public.json");
const profilePublic = JSON.parse(readFileSync(profilePath, "utf-8"));

// Section labels inlined to avoid TS import issues in plain .mjs
// If src/cv/sections.ts labels change, update these too.
const SECTIONS_DATA = {
  en: {
    summary: "Summary",
    experience: "Professional Experience",
    education: "Certifications",
    skills: "Skills",
    present: "Present",
    updated: "Updated",
  },
  es: {
    summary: "Resumen profesional",
    experience: "Experiencia profesional",
    education: "Certificaciones",
    skills: "Aptitudes",
    present: "Actualidad",
    updated: "Actualizado",
  },
};

const { hash, updated } = computeCvMeta();
const distCv = resolve("dist/cv");
const publicCv = resolve("public/cv");
if (!existsSync(distCv)) mkdirSync(distCv, { recursive: true });
if (!existsSync(publicCv)) mkdirSync(publicCv, { recursive: true });

function parseProjectFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const filePath = join(dir, d.name, "index.md");
      if (!existsSync(filePath)) return null;
      return matter(readFileSync(filePath, "utf-8")).data;
    })
    .filter(Boolean)
    .filter((d) => !d.draft);
}

function parseWorkFiles(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const filePath = join(dir, f);
      const raw = readFileSync(filePath, "utf-8");
      const data = matter(raw).data;
      if (!data.dateStart) {
        throw new Error(`Missing "dateStart" in frontmatter of ${filePath}`);
      }
      if (!data.dateEnd) {
        throw new Error(`Missing "dateEnd" in frontmatter of ${filePath}`);
      }
      return data;
    })
    .filter((d) => d.include?.cv !== false)
    .sort((a, b) => {
      const da = parseDate(a.dateStart);
      const db = parseDate(b.dateStart);
      return db - da;
    });
}

function parseDate(dateVal) {
  if (dateVal instanceof Date) return dateVal;
  const dateStr = String(dateVal || "");
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date: "${dateStr}". Expected YYYY-MM-DD`);
  }
  return d;
}

function formatDate(dateStr, locale) {
  const d = parseDate(dateStr);
  return d.toLocaleString(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatEduDate(isoDate, locale) {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) {
    throw new Error(
      `Invalid education date: "${isoDate}". Expected YYYY-MM-DD`,
    );
  }
  return d.toLocaleString(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function buildDoc(lang) {
  const s = SECTIONS_DATA[lang];
  const locale = lang === "en" ? "en" : "es";
  const workDir = `src/content/work-${lang}`;
  const entries = parseWorkFiles(workDir);
  const projectEntries = parseProjectFiles(`src/content/projects-${lang}`);

  const children = [];

  // Header
  const name = profilePublic.name || "";
  const title = profilePublic.title || "";
  const email = profilePublic.email || "";

  const contactChildren = [new TextRun({ text: email, size: 18 })];
  if (profilePublic.phone) {
    contactChildren.push(
      new TextRun({
        text: "  ·  " + profilePublic.phone,
        size: 18,
        color: "444444",
      }),
    );
  }
  if (profilePublic.location) {
    contactChildren.push(
      new TextRun({
        text: "  ·  " + profilePublic.location,
        size: 18,
        color: "444444",
      }),
    );
  }
  if (profilePublic.linkedin) {
    contactChildren.push(
      new TextRun({
        text:
          "  ·  " + profilePublic.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
        size: 18,
        color: "444444",
      }),
    );
  }
  if (profilePublic.github) {
    contactChildren.push(
      new TextRun({
        text:
          "  ·  " + profilePublic.github.replace(/^https?:\/\/(www\.)?/, ""),
        size: 18,
        color: "444444",
      }),
    );
  }

  children.push(
    new Paragraph({
      children: [new TextRun({ text: name, bold: true, size: 36 })],
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: [new TextRun({ text: title, size: 20, color: "444444" })],
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: contactChildren,
      spacing: { after: 200 },
    }),
  );

  // Summary section
  if (profilePublic.summary && profilePublic.summary[lang]) {
    children.push(
      new Paragraph({
        text: s.summary.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "111111" },
        },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: profilePublic.summary[lang], size: 18 }),
        ],
        spacing: { after: 120 },
      }),
    );
  }

  // Experience section
  children.push(
    new Paragraph({
      text: s.experience.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 80 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "111111" },
      },
    }),
  );

  for (const entry of entries) {
    const start = formatDate(entry.dateStart, locale);
    const endStr = ["current", "actualidad"].includes(
      String(entry.dateEnd ?? "")
        .trim()
        .toLowerCase(),
    )
      ? s.present
      : formatDate(entry.dateEnd, locale);
    const dateRange = `${start} – ${endStr}`;

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: entry.company, bold: true, size: 20 }),
          new TextRun({ text: "\t" + dateRange, size: 18, color: "444444" }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { before: 120, after: 20 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text:
              (entry.role || "") +
              (entry.location ? " · " + entry.location : ""),
            size: 18,
            color: "333333",
          }),
        ],
        spacing: { after: 40 },
      }),
    );

    if (Array.isArray(entry.bullets) && entry.bullets.length > 0) {
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

  // Education section
  const educationPath = resolve("src/content/education/public.json");
  const educationData = existsSync(educationPath)
    ? JSON.parse(readFileSync(educationPath, "utf-8"))
    : [];
  const education = educationData
    .filter((e) => e.include?.cv !== false)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  if (education.length > 0) {
    children.push(
      new Paragraph({
        text: s.education.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "111111" },
        },
      }),
    );

    for (const edu of education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution || "", bold: true, size: 20 }),
            new TextRun({
              text: "\t" + (edu.date ? formatEduDate(edu.date, locale) : ""),
              size: 18,
              color: "444444",
            }),
          ],
          tabStops: [
            { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
          ],
          spacing: { before: 120, after: 20 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: edu.degree || "",
              size: 18,
              color: "333333",
            }),
          ],
          spacing: { after: 40 },
        }),
      );
    }
  }

  // Skills section
  const allSkills = computeSkillWeights([
    ...entries.map((e) => ({
      skills: e.skills,
      date:
        e.dateEnd instanceof Date
          ? e.dateEnd
          : ["current", "actualidad"].includes(
                String(e.dateEnd ?? "")
                  .trim()
                  .toLowerCase(),
              )
            ? new Date()
            : parseDate(e.dateEnd),
    })),
    ...projectEntries.map((e) => ({
      skills: e.skills,
      date: parseDate(e.date),
    })),
    ...education.map((e) => ({ skills: e.skills, date: parseDate(e.date) })),
  ]);
  if (allSkills.length > 0) {
    children.push(
      new Paragraph({
        text: s.skills.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "111111" },
        },
      }),
      new Paragraph({
        children: [new TextRun({ text: allSkills.join(" · "), size: 18 })],
        spacing: { after: 80 },
      }),
    );
  }

  // Updated date
  if (updated) {
    const d = new Date(updated + "T00:00:00Z");
    const dateLabel =
      lang === "en"
        ? s.updated +
          " " +
          d.toLocaleString("en", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          })
        : s.updated +
          " en " +
          d.toLocaleString("es", { month: "long", timeZone: "UTC" }) +
          " de " +
          d.getUTCFullYear();
    children.push(
      new Paragraph({
        children: [new TextRun({ text: dateLabel, size: 16, color: "888888" })],
        alignment: AlignmentType.RIGHT,
        spacing: { before: 200 },
      }),
    );
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 910, bottom: 910, left: 793, right: 793 }, // ~16mm / ~14mm in TWIPs
          },
        },
        children,
      },
    ],
  });
}

for (const lang of ["en", "es"]) {
  const doc = buildDoc(lang);
  const buffer = await Packer.toBuffer(doc);
  const outPath = join(distCv, `javier-zapata-${lang}-${hash}.docx`);
  writeFileSync(outPath, buffer);
  // Also copy to public/cv/ so `pnpm dev` can serve it
  copyFileSync(outPath, join(publicCv, `javier-zapata-${lang}-${hash}.docx`));
  console.log(`Generated: ${outPath}`);
}
