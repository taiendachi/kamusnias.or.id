import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { AdSlot } from "@/components/AdSlot";
import { fetchDictionary, jenisLabel, type Entry } from "@/lib/dictionary";
import { SITE } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Copy, Share2, Volume2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/(landing)/kata/$slug")({
  loader: async ({ params, context }) => {
    const entries = await context.queryClient.ensureQueryData({
      queryKey: ["dictionary"],
      queryFn: fetchDictionary,
      staleTime: 1000 * 60 * 60,
    });
    const entry = entries.find((e) => e.slug === params.slug);
    if (!entry) throw notFound();
    const related = entries
      .filter(
        (e) =>
          e.id !== entry.id &&
          (e.indo[0]?.toLowerCase() === entry.indo[0]?.toLowerCase() || e.jenis === entry.jenis),
      )
      .slice(0, 8);
    return { entry, related };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: `Kata — ${SITE.longName}` }] };
    }
    const { entry } = loaderData;
    const jenis = jenisLabel(entry.jenis);
    const title = `${entry.indo} dalam Bahasa Nias = ${entry.nias} — ${SITE.name}`;
    const desc = `Arti "${entry.indo}" dalam Bahasa Nias adalah "${entry.nias}"${jenis ? ` (${jenis})` : ""}. Terjemahan lengkap di ${SITE.longName}.`;
    const url = `/kata/${params.slug}`;

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Beranda", item: "/" },
        { "@type": "ListItem", position: 2, name: "Kamus", item: "/" },
        { "@type": "ListItem", position: 3, name: entry.indo, item: url },
      ],
    };
    const definedTerm = {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "@id": url,
      name: entry.indo,
      alternateName: entry.nias,
      description: `${entry.indo} (Bahasa Indonesia) = ${entry.nias} (Bahasa Nias)${jenis ? `, ${jenis}` : ""}.`,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: SITE.longName,
        url: "/",
        inLanguage: ["id", "nia"],
      },
      inLanguage: "id",
    };
    const article = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: desc,
      mainEntityOfPage: url,
      inLanguage: "id",
      author: { "@type": "Organization", name: SITE.organization },
      publisher: { "@type": "Organization", name: SITE.organization },
    };
    const webpage = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: desc,
      url,
      inLanguage: "id",
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".translation"] },
    };
    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Apa arti "${entry.indo}" dalam Bahasa Nias?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Dalam Bahasa Nias, "${entry.indo}" berarti "${entry.nias}".`,
          },
        },
        {
          "@type": "Question",
          name: `Apa terjemahan "${entry.nias}" ke Bahasa Indonesia?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `"${entry.nias}" diterjemahkan menjadi "${entry.indo}" dalam Bahasa Indonesia.`,
          },
        },
        ...(jenis
          ? [
              {
                "@type": "Question",
                name: `Termasuk jenis kata apa "${entry.indo}"?`,
                acceptedAnswer: { "@type": "Answer", text: `"${entry.indo}" termasuk ${jenis}.` },
              },
            ]
          : []),
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        {
          name: "keywords",
          content: `${entry.indo} bahasa nias, arti ${entry.indo}, terjemahan ${entry.indo}, ${entry.nias} indonesia, kamus nias`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
        { type: "application/ld+json", children: JSON.stringify(definedTerm) },
        { type: "application/ld+json", children: JSON.stringify(article) },
        { type: "application/ld+json", children: JSON.stringify(webpage) },
        { type: "application/ld+json", children: JSON.stringify(faq) },
      ],
    };
  },
  component: WordPage,
});

function WordPage() {
  const { entry, related } = Route.useLoaderData();
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${entry.indo} = ${entry.nias}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSpeak = () => {
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(entry.nias);
    u.lang = "id-ID";
    speechSynthesis.speak(u);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: entry.indo,
          text: `${entry.indo} = ${entry.nias}`,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-4 py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> {t.backHome}
          </Link>
        </nav>

        <header className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.indonesianLabel}
          </div>
          <h1 className="font-serif text-3xl font-bold md:text-4xl">{entry.indo}</h1>
          {entry.jenis && (
            <div className="mt-1 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
              {jenisLabel(entry.jenis)}
            </div>
          )}
          <div className="mt-5 border-t border-dashed border-border pt-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-ocean">
              {t.niasLabel}
            </div>
            <div
              className="translation mt-1 text-3xl text-ocean-deep md:text-5xl"
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.01em",
              }}
            >
              {entry.nias}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted"
            >
              <Copy className="h-3.5 w-3.5" /> {copied ? t.copied : t.copy}
            </button>
            <button
              onClick={handleSpeak}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted"
            >
              <Volume2 className="h-3.5 w-3.5" /> {t.listen}
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted"
            >
              <Share2 className="h-3.5 w-3.5" /> {t.share}
            </button>
          </div>
        </header>

        <AdSlot type="adsense" slot="inArticle" label="In-article" />

        <section className="mt-6 rounded-xl border border-border bg-muted/30 p-5">
          <h2 className="font-serif text-lg font-bold">Penjelasan</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Kata <strong>{entry.indo}</strong> dalam Bahasa Indonesia diterjemahkan menjadi{" "}
            <strong className="text-ocean-deep">{entry.nias}</strong> dalam Bahasa Nias (Li Niha).
            {entry.jenis && (
              <>
                {" "}
                Kata ini termasuk dalam kategori <strong>{jenisLabel(entry.jenis)}</strong>.
              </>
            )}{" "}
            Bahasa Nias dituturkan oleh masyarakat Pulau Nias di Sumatera Utara dan merupakan bagian
            dari rumpun bahasa Austronesia.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-serif text-lg font-bold">{t.faq}</h2>
          <dl className="mt-3 space-y-2">
            <FaqItem
              q={`Apa arti "${entry.indo}" dalam Bahasa Nias?`}
              a={`Dalam Bahasa Nias, "${entry.indo}" berarti "${entry.nias}".`}
            />
            <FaqItem
              q={`Apa terjemahan "${entry.nias}" ke Bahasa Indonesia?`}
              a={`"${entry.nias}" diterjemahkan menjadi "${entry.indo}" dalam Bahasa Indonesia.`}
            />
            {entry.jenis && (
              <FaqItem
                q={`Termasuk jenis kata apa "${entry.indo}"?`}
                a={`"${entry.indo}" termasuk ${jenisLabel(entry.jenis)}.`}
              />
            )}
          </dl>
        </section>

        <AdSlot type="banner" slot="sidebar" label="Direct banner" height={120} />

        {related.length > 0 && (
          <section className="mt-8">
            <h2 className="font-serif text-lg font-bold">{t.relatedWords}</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {related.map((r: Entry) => (
                <Link
                  key={r.id}
                  to="/kata/$slug"
                  params={{ slug: r.slug }}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm hover:border-primary"
                >
                  <span className="font-medium">{r.indo}</span>
                  <span
                    className="text-ocean-deep"
                    style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}
                  >
                    {r.nias}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-lg border border-border bg-card p-3 open:shadow-sm">
      <summary className="cursor-pointer text-sm font-semibold">{q}</summary>
      <p className="mt-2 text-sm text-muted-foreground">{a}</p>
    </details>
  );
}
