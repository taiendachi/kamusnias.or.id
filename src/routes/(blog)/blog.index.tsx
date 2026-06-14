import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AdSlot } from "@/components/AdSlot";
import { SITE } from "@/lib/site-config";
import { BLOG_POSTS } from "@/lib/blog";
import { CalendarDays, ArrowRight } from "lucide-react";
import { BlogSidebar } from "@/components/BlogSidebar";

const title = `Blog — ${SITE.longName}`;
const desc = `Artikel seputar Bahasa Nias (Li Niha), budaya, dan pembelajaran kosakata di ${SITE.longName}.`;

export const Route = createFileRoute("/(blog)/blog/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: "/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: title,
          description: desc,
          inLanguage: "id",
          blogPost: BLOG_POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            author: { "@type": "Organization", name: p.author ?? SITE.organization },
            url: `/blog/${p.slug}`,
          })),
        }),
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <Layout>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="font-serif text-3xl font-bold md:text-4xl">Blog Kamus Nias</h1>
          <p className="mt-2 text-muted-foreground">{desc}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-4 mt-4">
        <AdSlot type="adsense" slot="header" label="Header banner" height={90} />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-4">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ul className="grid gap-5 md:grid-cols-2">
              {BLOG_POSTS.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition hover:border-primary hover:shadow"
                  >
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(p.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <h2 className="mt-2 font-serif text-xl font-bold leading-snug group-hover:text-primary">
                      {p.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                    <span className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Baca selengkapnya <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <BlogSidebar />
          </div>
        </div>
      </section>
    </Layout>
  );
}
