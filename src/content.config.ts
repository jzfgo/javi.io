import { file, glob } from "astro/loaders";
import { defineCollection, type SchemaContext } from "astro:content";
import { z } from "zod";

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
  dateStart: z.coerce.date(),
  dateEnd: z.union([
    z.string().refine(s => ["current", "actualidad"].includes(s.trim().toLowerCase())),
    z.coerce.date(),
  ]),
  location: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
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

const projectsSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(["personal", "professional"]),
    draft: z.boolean().optional(),
    demoURL: z.string().optional(),
    repoURL: z.string().optional(),
    translationKey: z.string().optional(),
    hero: image().optional(),
    skills: z.array(z.string()).optional(),
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
    date: z.coerce.date(),
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
