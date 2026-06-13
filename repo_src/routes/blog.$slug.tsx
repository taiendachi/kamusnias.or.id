import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AdSlot } from "@/components/AdSlot";
import { BlogContent } from "@/components/BlogContent";
import { SITE } from "@/lib/site-config";
import { BLOG_POSTS, getPost } from "@/lib/blog";
import { CalendarDays, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Artikel tidak ditemukan" }] };
    return {
      meta: [
        { title: `${post.title} — ${SITE.name}` },
        { name: "description", content: post.description },
        { name: "keywords", content: (post.tags ?? []).join(", ") },
        { name: "author", content: post.author ?? SITE.organization },
        { property: "article:published_time", content: post.date },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.description },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: "id",
            author: { "@type": "Organization", name: post.author ?? SITE.organization },
            publisher: { "@type": "Organization", name: SITE.organization },
            mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${params.slug}` },
            keywords: (post.tags ?? []).join(", "),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Beranda", item: "/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
              { "@type": "ListItem", position: 3, name: post.title, item: `/blog/${params.slug}` },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold">Artikel tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">
          Mungkin tautan salah atau artikel telah dihapus.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Kembali ke Blog
        </Link>
      </div>
    </Layout>
  ),
  errorComponent: ({ reset }) => (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Artikel gagal dimuat</h1>
        <button
          onClick={reset}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Coba lagi
        </button>
      </div>
    </Layout>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-4 py-10">
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link to="/blog" className="inline-flex items-center gap-1 hover:text-foreground">
            <ChevronLeft className="h-3 w-3" /> Semua artikel
          </Link>
        </nav>
        <header>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {post.author && <span>· {post.author}</span>}
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold leading-tight md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
        </header>

        <AdSlot type="adsense" slot="inArticle" />

        <BlogContent content={post.content} />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tg: string) => (
              <span
                key={tg}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                #{tg}
              </span>
            ))}
          </div>
        )}

        <AdSlot type="mgid" slot="inArticle" />

        {others.length > 0 && (
          <section className="mt-10 border-t border-border pt-6">
            <h2 className="font-serif text-xl font-bold">Artikel lainnya</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="block rounded-lg border border-border bg-card p-4 hover:border-primary"
                  >
                    <div className="font-semibold">{p.title}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {p.description}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </Layout>
  );
}
