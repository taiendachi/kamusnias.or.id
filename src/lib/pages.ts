import fm from "front-matter";

export interface PageContent {
  slug: string;
  title: string;
  description: string;
  updatedAt?: string; // ISO YYYY-MM-DD
  content: string; // markdown content
}

// Load content from markdown files
const markdownFiles = import.meta.glob("/content/pages/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const STATIC_PAGES: PageContent[] = Object.keys(markdownFiles).map((path) => {
  const fileContent = markdownFiles[path] as string;
  const { attributes, body } = fm(fileContent) as any;
  const slug = attributes.slug || path.split("/").pop()?.replace(".md", "");
  return {
    slug: slug,
    title: attributes.title || "Halaman",
    description: attributes.description || "",
    updatedAt: attributes.updatedAt,
    content: body,
  };
});

export const getPage = (slug: string) => STATIC_PAGES.find((p) => p.slug === slug);
