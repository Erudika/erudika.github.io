# Product Requirements Document (PRD)

## Project: Erudika Company Website (Static, Astro, Tailwind)

### Purpose / Executive Summary
Replace the existing Erudika website (https://erudika.com) with a modern, SEO-first, static website built using Astro, styled with Tailwind CSS and daisyUI components where applicable. The site must compile with Bun for fast builds and deploy statically to GitHub Pages. No React or SPA frameworks are allowed.

### Objectives (measurable)
- Improve organic search traffic by 25% within 6 months (baseline: existing site metrics).
- Achieve Lighthouse performance score ≥ 90 on desktop and ≥ 80 on mobile.
- Reduce build time by 50% vs current build baseline by using Bun and optimized pipelines.
- Maintain or improve content parity: all pages present on the current site (homepage, projects, blog, support, contact, legal).

### Stakeholders
- Product Owner: Alexander Bogdanovski
- Frontend: Implementation team
- SEO: SEO Specialist
- Operations: DevOps/Release

### Users & Personas
1. Developer evaluating Para/Scoold for backend components
2. CTO/Engineering manager seeking reliable backend or SaaS
3. Community members looking for documentation and blog posts
4. Potential customers seeking support/pricing/contact

### Key Features & Requirements
#### Content & Pages
- Homepage: headline, short company description, projects list (Open Source, Cloud Services, Self-Hosted), priority support summary, blog teasers, contact info and address. Use content from existing site as starting copy.
- Projects Page: detail cards with logos, descriptions, links to each project (Para, Scoold, Para Cloud, Scoold Cloud, Robo Translator, Scoold Pro).
- Blog: collection of Markdown files with frontmatter (title, date, tags, excerpt, img, canonical). Support pagination, tag pages, RSS/Atom feed, and preview cards.
- Support & Contact: contact form (optional static form via Formspree or mailto fallback), support pricing & hours as on current site.
- Legal: Privacy Policy, Terms (static pages or links to existing policies).
- Status: link to existing status page (status.erudika.com)

#### SEO
- Each page must have unique title and meta description.
- Implement JSON-LD (Organization, Website, BreadcrumbList, Article for blog posts).
- Generate sitemap.xml and robots.txt (and `AGENTS.TXT` as a local project spec file, not robots substitute).
- Set canonical URLs and Open Graph tags for social sharing.

#### Performance & Accessibility
- Use responsive images and `srcset`.
- Use lazy loading for below-the-fold images.
- Ensure semantic HTML and WCAG 2.1 AA compliance.

#### Design & UI
- Tailwind CSS with a central config, theme tokens for branding.
- Use daisyUI components for consistent UI (cards, navbar, buttons). Customize daisyUI theme to match brand colors.
- Create reusable components: Header, Footer, ProjectCard, BlogCard, SEO head partial, Image component (responsive + optimized)

#### Build & Tooling
- Static site generator: Astro (no React or other SPA frameworks). Use Astro components written in plain HTML/Vanilla JS.
- Styling: Tailwind CSS + daisyUI plugin.
- Markdown support: Astro content collections or integrations to read Markdown files.
- Bun as runtime for local dev and build: use `bun` to run dev server and `bun run build` for production build. Prefer Bun-native scripts in package.json.
- tsdown: consider for TypeScript to JS output if components use TypeScript — mark as optional and include fallbacks to Bun's transpilation if tsdown not viable.
- CI: GitHub Actions configured to run Bun, cache Bun dependencies, run BuildAgent, run Lighthouse audits (optional), and deploy to GitHub Pages.

### Constraints
- No React, Preact, Svelte, Vue or other SPA frameworks.
- Site must be static and deploy to GitHub Pages (no server-side rendering on the host).
- Keep third-party JS minimal to preserve performance and privacy.

### Content Migration Plan
1. Audit current site pages and map to new sitemap.
2. Copy content from current site (using reviewed copy as starting point). Save images into `/content/images/` and run ImageOptimizer.
3. Convert blog posts into Markdown files with required frontmatter.
4. QA for broken links, images, and metadata.

### SEO Migration
- Preserve URLs where feasible; where changing, add 301 redirects (GitHub Pages supports redirects via meta-refresh or client-side? Note: GitHub Pages can't easily do server 301—if redirects change, consider preserving URL structure).
- Generate sitemap and submit to Google Search Console.

### CI/CD & Deployment
- Use GitHub Actions with separate jobs:
  - `test`: linting, markdown frontmatter validation
  - `build`: runs bun install, bun run build
  - `audit`: optional Lighthouse run
  - `deploy`: push dist/ to gh-pages branch
- Use GitHub Pages with custom domain (CNAME). Configure cache headers (where possible) in hosting layer (GitHub Pages has default cache behavior—consider optional CDN in front if strict caching needed).

### Success Metrics
- Organic sessions, average position for target keywords, Core Web Vitals metrics, build time, deployment frequency, number of SEO errors reported in monthly audit.

### Milestones (suggested)
- Week 0: Project kickoff, repo scaffold, Bun + Astro prototype
- Week 1: Homepage, Header/Footer, Tailwind + daisyUI theme
- Week 2: Projects page, markdown blog support, content migration start
- Week 3: Blog listing, tags, RSS, sitemap, SEO meta templates
- Week 4: QA, Lighthouse, accessibility fixes, final content import
- Week 5: Final reviews, switch DNS (if needed), deploy to GitHub Pages

### Risks & Mitigations
- Bun incompatibility with specific Astro plugins -> fallback: run `astro` with `node` only for that step or replace plugin.
- GitHub Pages limitations for redirects and caching -> mitigation: keep stable URL structure or use Cloudflare as CDN.
- tsdown integration might not speed up build -> mark tsdown as optional and measure build times.

### Appendix: Starting content references (from live site)
- Homepage headline: "A tiny software company"
- Tagline: "We build software that runs in the cloud."
- Projects mentioned: Para, Scoold, Para Cloud, Scoold Cloud, Robo Translator, Scoold Pro
- Contact and company details: Erudika LTD., 4 Lelinska chuka Street, Sofia, 1618, Bulgaria. VAT BG-200368755. LAR: Alexander Bogdanovski. contact@erudika.com
