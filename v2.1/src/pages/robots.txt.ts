export async function GET({ site }: { site?: URL }) {
  const siteUrl = (site?.toString() ?? "https://erudika.com").replace(/\/$/, "");
  const body = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=UTF-8"
    }
  });
}
