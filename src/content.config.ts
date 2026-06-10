import { file, glob } from "astro/loaders";
import { defineCollection, type SchemaContext } from "astro:content";
import { z } from "zod";

const parseWorkDate = (val: string): Date => {
  const [m, d, y] = val.split("/").map(Number);
  if (isNaN(m) || isNaN(d) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31) {
    throw new Error(`Invalid date values in: "${val}". Expected MM/DD/YYYY`);
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  if (
    isNaN(date.getTime()) ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    throw new Error(
      `Invalid date format or value: "${val}". Expected MM/DD/YYYY`,
    );
  }
  return date;
};

const blogSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    translationKey: z.string().optional(),
    hero: image().optional(),
  });

const blogEs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog-es" }),
  schema: blogSchema,
});
const blogEn = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog-en" }),
  schema: blogSchema,
});

const workSchema = z.object({
  company: z.string(),
  role: z.string(),
  dateStart: z.string().transform(parseWorkDate),
  dateEnd: z
    .string()
    .transform((val) =>
      ["current", "actualidad"].includes(val.trim().toLowerCase())
        ? val
        : parseWorkDate(val),
    ),
  location: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  tech: z.array(z.string()).optional(),
  include: z
    .object({
      cv: z.boolean().default(true),
      web: z.boolean().default(true),
    })
    .default({ cv: true, web: true }),
});

const workEs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work-es" }),
  schema: workSchema,
});
const workEn = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work-en" }),
  schema: workSchema,
});

const projectsSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  type: z.enum(["personal", "professional"]),
  draft: z.boolean().optional(),
  demoURL: z.string().optional(),
  repoURL: z.string().optional(),
  translationKey: z.string().optional(),
});

const projectsEs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects-es" }),
  schema: projectsSchema,
});
const projectsEn = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects-en" }),
  schema: projectsSchema,
});

const education = defineCollection({
  loader: file("src/content/education/public.json"),
  schema: z.object({
    institution: z.string(),
    degree: z.string(),
    year: z.string(),
    credentialUrl: z.string().url().optional(),
    skills: z.array(z.string()).optional(),
    include: z
      .object({
        cv: z.boolean().optional(),
        web: z.boolean().optional(),
      })
      .optional(),
  }),
});

export const collections = {
  "blog-es": blogEs,
  "blog-en": blogEn,
  "work-es": workEs,
  "work-en": workEn,
  "projects-es": projectsEs,
  "projects-en": projectsEn,
  education: education,
};
