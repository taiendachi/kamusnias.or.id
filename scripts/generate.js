import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PUBLIC_URL = "https://kamusnias.com";
const contentDir = path.join(process.cwd(), "content/posts");
const publicDir = path.join(process.cwd(), "public");

function generate() {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
      const { data } = matter(raw);
      return data;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Generate Sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${PUBLIC_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${PUBLIC_URL}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts
    .map(
      (post) => `
  <url>
    <loc>${PUBLIC_URL}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt || post.publishedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("")}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap.trim());
  console.log("✅ Sitemap generated!");

  // Generate RSS
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Kamus Nias Blog</title>
    <link>${PUBLIC_URL}/blog</link>
    <description>Artikel seputar budaya dan bahasa Nias</description>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>${PUBLIC_URL}/blog/${post.slug}</link>
      <description>${post.excerpt}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(publicDir, "rss.xml"), rss.trim());
  console.log("✅ RSS generated!");
}

generate();
