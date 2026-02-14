import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    canonical: z.string().url().optional(),
    "og:image": z.string().optional()
  })
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
  })
});

export const collections = { blog, projects };
