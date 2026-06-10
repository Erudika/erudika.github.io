import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import marketing from "../data/site-data.json";

export async function GET(context) {
  const posts = (await getCollection("blog"))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: marketing.site.meta.blogIndex.title,
    description: marketing.site.meta.blogIndex.description,
    site: context.site,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: [
      `<language>en</language>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      `<atom:link href="${new URL("rss.xml", context.site)}" rel="self" type="application/rss+xml" />`,
    ].join("\n"),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/blog/${post.id}/`,
      customData: `<guid isPermaLink="true">${new URL(`/blog/${post.id}/`, context.site)}</guid>`,
    })),
  });
}
