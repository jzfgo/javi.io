import { defineCollection, z } from "astro:content";

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().optional(),
  translationKey: z.string().optional(),
  hero: z.string().optional(),
});

const blogEs = defineCollection({ type: "content", schema: blogSchema });
const blogEn = defineCollection({ type: "content", schema: blogSchema });

const workSchema = z.object({
  company: z.string(),
  role: z.string(),
  dateStart: z.coerce.date(),
  dateEnd: z.union([z.coerce.date(), z.string()]),
});

const workEs = defineCollection({ type: "content", schema: workSchema });
const workEn = defineCollection({ type: "content", schema: workSchema });

const projectsSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().optional(),
  demoURL: z.string().optional(),
  repoURL: z.string().optional(),
});

const projectsEs = defineCollection({ type: "content", schema: projectsSchema });
const projectsEn = defineCollection({ type: "content", schema: projectsSchema });

export const collections = {
  "blog-es": blogEs,
  "blog-en": blogEn,
  "work-es": workEs,
  "work-en": workEn,
  "projects-es": projectsEs,
  "projects-en": projectsEn,
};
