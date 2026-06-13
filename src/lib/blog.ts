import fm from "front-matter";

// ===== CARA MENULIS ARTIKEL (struktur SEO) =====
// Judul artikel (title) otomatis menjadi H1 — JANGAN tulis `#` di konten.
// Di dalam `content` gunakan sintaks markdown ringan berikut:
//
//   ## Sub-judul utama        → H2
//   ### Sub-bagian            → H3
//   #### Poin detail          → H4
//   - item                    → bullet point
//   1. item                   → numbered list
//   | Kolom A | Kolom B |     → tabel (baris pertama = header,
//   | ------- | ------- |       baris kedua = pemisah, sisanya isi)
//   | isi     | isi     |
//   > kutipan                 → blockquote
//   **tebal**  *miring*  `kode` → format inline
//
// Pisahkan setiap blok dengan satu baris kosong.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO YYYY-MM-DD
  author?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  content: string; // markdown content
}

// Load content from markdown files
const markdownFiles = import.meta.glob("/content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const BLOG_POSTS: BlogPost[] = Object.keys(markdownFiles)
  .map((path) => {
    const fileContent = markdownFiles[path] as string;
    const { attributes, body } = fm(fileContent) as any;
    return {
      slug: attributes.slug,
      title: attributes.title,
      description: attributes.description,
      date: attributes.publishedAt || attributes.date,
      author: attributes.author || "Tim Kamus Nias",
      coverImage: attributes.coverImage,
      category: attributes.category,
      tags: attributes.tags || [],
      content: body,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getPost = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);
