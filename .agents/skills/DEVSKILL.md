---
name: frontend-developer
description: CSkills matrix and hiring/onboarding checklist for roles required to deliver and maintain the website
license: Complete terms in LICENSE.txt
---

## Core technical skills
- Astro (SSG): templates, collections, content collections, layouts
- Bun: install, bun scripts, bun-based toolchain
- tsdown: knowledge of TypeScript-to-JS bundling and any integrations (optional)
- Tailwind CSS: utility-first styling, config, purge
- daisyUI: component usage and theming with Tailwind
- Markdown: frontmatter (YAML), content structure, embedding images and code blocks
- HTML/CSS/Vanilla JS: small interactive components without React or other SPA frameworks
- Git/GitHub: branching, PRs, GitHub Pages deployment, Actions for CI/CD
- Refer to the skill files `UI_SKILL.md` and `E2E_SKILL.md`

## SEO & Content
- On-page SEO: meta tags, canonical, open graph, robots
- Structured Data: JSON-LD for organization, breadcrumb, article schema
- Content strategy: keyword research, headings, internal linking
- Performance & Accessibility: Core Web Vitals, Lighthouse, WCAG 2.1 AA

## DevOps & Automation
- CI with GitHub Actions (or similar): set up Bun-based runners
- Image optimization tooling (sharp, squoosh CLI, or Bun-native tools)
- Static asset caching & cache-control headers (set via hosting)

## Onboarding checklist
1. Clone repo and run `bun install` and `bun run dev`
2. Review Astro project structure (src/pages, src/layouts, src/components, content/)
3. Run build locally: `bun run build`
4. Validate blog markdown: frontmatter present, dates, tags
5. Run Lighthouse and basic accessibility checks

## Optional skills (nice-to-have)
- Familiarity with tsdown and alternative fast TypeScript transpilers
- Experience with GitHub Pages advanced configs (CNAME, custom domain)
