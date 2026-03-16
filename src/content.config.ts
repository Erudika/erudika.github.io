import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  // type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    author: z.string(),
    excerpt: z.string(),
    // canonical: z.string().url().optional(),
    img: z.string().optional(),
    thumb: z.string().optional()
  })
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
  })
});

export const collections = { blog: blog, projects: projects };