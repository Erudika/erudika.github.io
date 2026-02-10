# Marketing Foundation Specification

## Overview
This section establishes the refreshed Erudika brand story: a fast-loading Astro homepage hero, credibility proof points, and quick pathways into flagship products. It should quickly communicate "tiny software company, big impact" while previewing the Projects, Blog, and Support areas defined in the roadmap. Every element should reassure technical buyers that the site is modern, SEO-first, and Bun-powered.

## User Flows
- Scan hero: visitor reads headline/subhead, validates positioning badges, and clicks a primary CTA (Explore Projects) or secondary CTA (Contact Team).
- Skim proof carousel: user scrolls through metrics/testimonials and clicks into deeper content like Case Studies or Blog posts.
- Jump to sections: sticky utility nav chips let users jump to Projects, Blog, or Support anchors without leaving the page.
- Trust handoff: user reviews company/contact details, status link, and compliance badges, then proceeds to the Support/Contact section or opens email link.

## UI Requirements
- Split hero layout with bold Space Grotesk headline, supporting paragraph, primary button (indigo) plus ghost secondary action, and optional media card/gradient background.
- Highlight cards for Para, Scoold, Para Cloud with logos, one-line value props, and CTA icons that route to Projects & Solutions Showcase.
- Metrics/testimonial band using pill badges with amber accents, plus a horizontal scroller for quotes or stats.
- Sticky/affixed quick-jump chips that reveal the rest of the roadmap sections and scroll to anchored content blocks.
- Footer-style trust rail including company address, VAT info, status link, and compliance/legal shortcuts.

## Scope Boundaries
- No blog article rendering beyond teasers; full listings belong to Content Hub & Blog.
- No ticket intake or pricing calculators; those live in Support, Contact & Trust.
- Avoid deep-dive product comparisons; those belong in Projects & Solutions Showcase.

## Configuration
- shell: true
