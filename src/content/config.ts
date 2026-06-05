import { defineCollection, z } from "astro:content";

const parseWorkDate = (val: string): Date => {
  const [m, d, y] = val.split("/").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

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
  dateStart: z.string().transform(parseWorkDate),
  dateEnd: z.string().transform(val =>
    ["Current", "Actualidad"].includes(val) ? val : parseWorkDate(val)
  ),
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
