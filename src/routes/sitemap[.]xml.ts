import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { fetchDictionary } from "@/lib/dictionary";
import { BLOG_POSTS } from "@/lib/blog";

const BASE_URL = "https://kamusnias.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        type Entry = { path: string; priority: string; changefreq: string; lastmod?: string };
        const staticEntries: Entry[] = [
          { path: "/", priority: "1.0", changefreq: "daily" },
          { path: "/kamus", priority: "0.9", changefreq: "weekly" },
          { path: "/blog", priority: "0.8", changefreq: "weekly" },
          { path: "/tentang", priority: "0.5", changefreq: "yearly" },
          { path: "/kontak", priority: "0.4", changefreq: "yearly" },
          { path: "/saran", priority: "0.5", changefreq: "yearly" },
          { path: "/support", priority: "0.4", changefreq: "yearly" },
        ];

        const blogEntries = BLOG_POSTS.map((p) => ({
          path: `/blog/${p.slug}`,
          priority: "0.7",
          changefreq: "monthly",
          lastmod: p.date,
        }));

        let wordEntries: Entry[] = [];
        try {
          const entries = await fetchDictionary();
          wordEntries = entries.map((e) => ({
            path: `/kata/${e.slug}`,
            priority: "0.6",
            changefreq: "monthly",
          }));
        } catch {
          // sheet unreachable at build time — sitemap still ships
        }

        const all = [...staticEntries, ...blogEntries, ...wordEntries];
        const urls = all
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n${e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ""}    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
