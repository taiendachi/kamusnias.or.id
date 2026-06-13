import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { AdSlot } from "@/components/AdSlot";
import { fetchDictionary, searchEntries } from "@/lib/dictionary";
import { SITE } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/cari")({
  validateSearch: searchSchema,
  head: () => {
    const title = `Pencarian — ${SITE.name}`;
    const desc = "Cari kosakata Bahasa Nias dan Indonesia di Kamus Nias.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: "/cari" },
      ],
      links: [{ rel: "canonical", href: "/cari" }],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { t } = useI18n();
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["dictionary"],
    queryFn: fetchDictionary,
    staleTime: 1000 * 60 * 60,
  });

  const queryStr = q.trim();
  const results = useMemo(
    () =>
      queryStr.length === 1
        ? entries
            .filter((e) => e.indo.toLowerCase().startsWith(queryStr.toLowerCase()))
            .slice(0, 200)
        : searchEntries(entries, queryStr, 200),
    [entries, queryStr],
  );

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-serif text-2xl font-bold">
          {queryStr ? (
            <>
              Hasil untuk <span className="text-primary">"{queryStr}"</span>
            </>
          ) : (
            "Pencarian"
          )}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading ? t.loading : `${results.length} hasil`}
        </p>

        <AdSlot type="adsense" slot="header" height={90} />

        {results.length === 0 && !isLoading && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            {t.noResults}
          </div>
        )}

        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {results.map((e) => (
            <li key={e.id}>
              <Link
                to="/kata/$slug"
                params={{ slug: e.slug }}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted"
              >
                <div>
                  <div className="font-semibold">{e.indo}</div>
                  {e.jenis && (
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {e.jenis}
                    </div>
                  )}
                </div>
                <div
                  className="text-ocean-deep"
                  style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}
                >
                  {e.nias}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
