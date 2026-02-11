import { getCollection } from "astro:content";

const PAGE_SIZE = 6;

const staticRoutes = [
  { loc: "/", priority: 1.0 },
  { loc: "/about", priority: 0.7 },
  { loc: "/projects", priority: 0.8 },
  { loc: "/projects/para", priority: 0.8 },
  { loc: "/projects/scoold", priority: 0.8 },
  { loc: "/projects/para-cloud", priority: 0.8 },
  { loc: "/projects/scoold-cloud", priority: 0.8 },
  { loc: "/projects/scoold-pro", priority: 0.75 },
  { loc: "/projects/robo-translator", priority: 0.6 },
  { loc: "/support", priority: 0.7 },
  { loc: "/contact", priority: 0.7 },
  { loc: "/privacy", priority: 0.3 },
  { loc: "/terms", priority: 0.3 },
  { loc: "/blog", priority: 0.8 },
  { loc: "/blog/tags", priority: 0.5 }
];

const toSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, "-");

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export async function GET({ site }: { site?: URL }) {
  const siteUrl = (site?.toString() ?? "https://erudika.com").replace(/\/$/, "");
  const posts = await getCollection("blog");
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => tagSet.add(toSlug(tag)));
  });

  const blogPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const paginatedRoutes = Array.from({ length: blogPages }, (_, i) => ({
    loc: i === 0 ? "/blog" : `/blog/page/${i + 1}`,
    priority: 0.6
  }));

  const urls = [
    ...staticRoutes.map((route) => ({
      loc: route.loc,
      priority: route.priority
    })),
    ...paginatedRoutes,
    ...posts.map((post) => ({
      loc: `/blog/${post.slug}`,
      lastmod: formatDate(post.data.date),
      priority: 0.7
    })),
    ...Array.from(tagSet).map((tag) => ({
      loc: `/blog/tags/${tag}`,
      priority: 0.5
    }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((route) => {
      const loc = `${siteUrl}${route.loc}`;
      const lastmod = route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : "";
      const priority = route.priority ? `\n    <priority>${route.priority.toFixed(1)}</priority>` : "";
      return `  <url>\n    <loc>${loc}</loc>${lastmod}${priority}\n  </url>`;
    })
    .join("\n")}\n</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=UTF-8"
    }
  });
}
