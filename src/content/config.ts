import { defineCollection, z } from "astro:content";

const parseWorkDate = (val: string): Date => {
  const [m, d, y] = val.split("/").map(Number);
  if (isNaN(m) || isNaN(d) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31) {
    throw new Error(`Invalid date values in: "${val}". Expected MM/DD/YYYY`);
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  if (isNaN(date.getTime()) || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    throw new Error(`Invalid date format or value: "${val}". Expected MM/DD/YYYY`);
  }
  return date;
};

const blogSchema = ({ image }: { image: () => z.ZodTypeAny }) =>
  z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    translationKey: z.string().optional(),
    hero: image().optional(),
    assetSlug: z.string().optional(),
  });

const blogEs = defineCollection({ type: "content", schema: blogSchema });
const blogEn = defineCollection({ type: "content", schema: blogSchema });

const workSchema = z.object({
  company: z.string(),
  role: z.string(),
  dateStart: z.string().transform(parseWorkDate),
  dateEnd: z.string().transform(val =>
    ["current", "actualidad"].includes(val.trim().toLowerCase()) ? val : parseWorkDate(val)
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
  translationKey: z.string().optional(),
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
