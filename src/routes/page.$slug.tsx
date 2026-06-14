import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPage } from "@/lib/pages";
import { Layout } from "@/components/Layout";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet-async";

export const Route = createFileRoute("/page/$slug")({
  component: PageComponent,
  loader: ({ params }) => {
    const page = getPage(params.slug);
    if (!page) {
      throw notFound();
    }
    return page;
  },
});

function PageComponent() {
  const page = Route.useLoaderData();

  const components: Components = {
    img: ({ node, ...props }) => <img {...props} loading="lazy" className="rounded-xl max-w-full h-auto" />,
    a: ({ node, ...props }) => <a {...props} className="break-words" />,
    p: ({ node, ...props }) => <p {...props} className="break-words" />,
    ul: ({ node, ...props }) => <ul {...props} className="break-words" />,
    ol: ({ node, ...props }) => <ol {...props} className="break-words" />,
    blockquote: ({ node, ...props }) => <blockquote {...props} className="break-words" />,
    table: ({ node, ...props }) => (
      <div className="responsive-table-container">
        <table {...props} className="responsive-table" />
      </div>
    ),
    th: ({ node, ...props }) => <th {...props} className="border-b border-border px-4 py-3 text-left font-semibold bg-muted/70" />,
    td: ({ node, ...props }) => <td {...props} className="border-b border-border px-4 py-3 align-top last:border-b-0" />,
    code: ({ node, ...props }) => <code {...props} className="break-all" />,
  };

  return (
    <Layout>
      <Helmet>
        <title>{page.title} — Kamus Nias</title>
        <meta name="description" content={page.description} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
      </Helmet>
      <main className="mx-auto max-w-4xl px-4 py-10 md:py-16">
        <div className="mb-8">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <h1 className="font-serif text-3xl font-bold md:text-5xl">{page.title}</h1>
          {page.updatedAt && (
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>Diperbarui pada: {page.updatedAt}</span>
            </div>
          )}
        </div>

        <article className="prose prose-gray w-full min-w-0 max-w-full break-words dark:prose-invert prose-headings:font-serif prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl md:prose-lg">
          <div className="overflow-x-hidden md:overflow-x-visible w-full max-w-full">
            <Markdown remarkPlugins={[remarkGfm]} components={components}>{page.content}</Markdown>
          </div>
        </article>
      </main>
    </Layout>
  );
}

