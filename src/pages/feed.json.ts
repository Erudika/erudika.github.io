import { getCollection } from "astro:content";
import { site } from "../data/site-data.json";

export async function GET(context) {
  const posts = (await getCollection("blog"))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: site.meta.blogIndex.title,
    home_page_url: site.organization.url,
    feed_url: `${site.organization.url}/feed.json`,
    description: site.meta.blogIndex.description,
    language: "en",
    authors: [{ name: site.organization.name, url: site.organization.url }],
    items: posts.map((post) => ({
      id: `${site.organization.url}/blog/${post.id}/`,
      url: `${site.organization.url}/blog/${post.id}/`,
      title: post.data.title,
      date_published: post.data.date.toISOString(),
      summary: post.data.excerpt,
      tags: post.data.tags,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json" },
  });
}
