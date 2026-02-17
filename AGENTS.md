# AGENTS.md
# Purpose: Defines human and automated agents (roles), responsibilities, triggers and interfaces

[HUMAN_AGENTS]
- Product Owner: Alexander Bogdanovski
  responsibilities: Approve content & sign-off, provide legal/brand assets, priority decisions
  contact: contact@erudika.com

- Content Author (Technical Writer)
  responsibilities: Migrate/author pages and blog posts, optimize copy for SEO, create meta tags

- Frontend Engineer (Astro + Tailwind)
  responsibilities: Implement templates and components in Astro, Tailwind + daisyUI, ensure no React usage

- DevOps / Release Engineer
  responsibilities: Configure Bun-based build, CI with GitHub Actions, deploy static build to GitHub Pages

- SEO Specialist
  responsibilities: Keyword research, metadata, structured data (JSON-LD), sitemap, robots

- QA / Accessibility Engineer
  responsibilities: Performance testing, Lighthouse audits, A11y checks, cross-browser checks

[AUTOMATED_AGENTS]
- BuildAgent
  type: CI job (GitHub Actions)
  trigger: push to main / PR
  actions:
    - install Bun
    - run: bun install
    - run: bun run build (Astro build with tsdown if enabled)
    - artifacts: /dist static output
  outputs: dist/

- DeployAgent
  type: CI job or GitHub Pages deploy action
  trigger: successful BuildAgent on main
  actions:
    - push dist/ to gh-pages branch (or use GitHub Pages upload action)
  outputs: public URL

- MarkdownIndexer
  type: local build script
  trigger: blog markdown added/changed
  actions:
    - validate frontmatter
    - generate slugs and feeds
    - create/update sitemap entries

- ImageOptimizer
  type: pre-build script
  trigger: image added to repo
  actions:
    - generate responsive sizes (srcset)
    - compress images losslessly
    - output to /public/images/optimized

- SEOReporter
  type: periodic audit (CI scheduled job)
  trigger: nightly/weekly
  actions:
    - run Lighthouse/Pa11y audit
    - check canonical tags, hreflang, sitemap
    - report regressions via GitHub Issues or Slack

[INTERFACES]
- Content -> MarkdownIndexer: Frontmatter YAML with title, date, tags, excerpt, canonical, img
- BuildAgent -> DeployAgent: artifact path (dist/) and build hash
- Site -> Analytics: consent-first analytics only (serverless or static-friendly)

[SECURITY_CONSIDERATIONS]
- No server-side secrets in repository; use GitHub Secrets for API keys
- DeployAgent must have least-privilege token for GitHub Pages
- Remove any third-party trackers not covered by privacy policy
