# Data Model

## Entities

### Project
Represents each Erudika product offering (Para, Scoold, Robo Translator, etc.) with the story, visuals, and calls-to-action used on the homepage and showcase sections.

### BlogPost
Long-form Markdown article with frontmatter powering the blog listing, teasers, RSS feeds, and SEO metadata.

### Tag
Topical label (e.g., "Cloud", "Release") applied to BlogPosts for filtered views and dedicated tag pages.

### SupportPlan
Describes a support tier including pricing, coverage, response targets, and the recommended contact path.

### ContactChannel
A concrete way to reach the team (email, static form, mailto, status link) that can be embedded in support/contact surfaces.

### ContactInquiry
Optional submission generated when someone reaches out, capturing who contacted the team, what they need, and their preferred SupportPlan or Channel.

### LegalPage
Static policy page (Privacy, Terms, etc.) referenced from the footer and trust sections to give visitors compliance details.

## Relationships

- Project entries are highlighted across the Marketing Foundation and Projects & Solutions sections to guide visitors toward CTAs.
- BlogPost has many Tags, and each Tag groups many BlogPosts for tag landing pages (many-to-many).
- SupportPlan lists the ContactChannels that apply to that tier, while a ContactChannel can serve multiple SupportPlans.
- ContactInquiry references both the ContactChannel used and (if specified) the SupportPlan tier the visitor is interested in.
- LegalPage links are surfaced alongside SupportPlan and ContactChannel information within the Support, Contact & Trust section.
