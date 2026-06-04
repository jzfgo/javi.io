import { defineCollection, z } from "astro:content";

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().optional(),
  translationKey: z.string().optional(),
});

const blogEs = defineCollection({ type: "content", schema: blogSchema });
const blogEn = defineCollection({ type: "content", schema: blogSchema });

export const collections = {
  "blog-es": blogEs,
  "blog-en": blogEn,
};
