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
    img: ({ node, ...props }) => <img {...props} loading="lazy" />,
    table: ({ node, ...props }) => (
      <div className="my-5 overflow-x-auto rounded-lg border border-border">
        <table {...props} className="w-full border-collapse text-sm m-0" />
      </div>
    ),
    th: ({ node, ...props }) => <th {...props} className="border-b border-border px-3 py-2 text-left font-semibold bg-muted/70 whitespace-nowrap" />,
    td: ({ node, ...props }) => <td {...props} className="border-b border-border px-3 py-2 align-top last:border-b-0 whitespace-nowrap md:whitespace-normal" />,
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

        <article className="prose prose-gray max-w-none dark:prose-invert prose-headings:font-serif prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl md:prose-lg">
          <Markdown remarkPlugins={[remarkGfm]} components={components}>{page.content}</Markdown>
        </article>
      </main>
    </Layout>
  );
}

