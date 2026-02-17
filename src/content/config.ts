import { defineCollection, z } from "astro:content";
import { author } from "hexo/dist/hexo/default_config";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    author: z.string(),
    // excerpt: z.string(),
    // canonical: z.string().url().optional(),
    img: z.string().optional()
  })
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
  })
});

export const collections = { blog, projects };
