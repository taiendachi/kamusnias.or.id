import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BLOG_POSTS } from "@/lib/blog";

const BASE_URL = "https://kamusnias.com";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const items = BLOG_POSTS.map(
          (post) => `
    <item>
      <title>${post.title}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <category>${post.category || "General"}</category>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
        ).join("");

        const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Kamus Nias Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Artikel seputar budaya dan bahasa Nias</description>
${items}
  </channel>
</rss>`;

        return new Response(xml.trim(), {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
