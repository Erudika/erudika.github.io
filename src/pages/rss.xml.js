import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import marketing from "../data/site-data.json";

export async function GET(context) {
  const posts = await getCollection("blog");

  return rss({
    title: marketing.site.meta.blogIndex.title,
    description: marketing.site.meta.blogIndex.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/blog/${post.slug}`
    }))
  });
}
