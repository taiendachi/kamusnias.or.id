import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SearchBox } from "@/components/SearchBox";
import { AdSlot } from "@/components/AdSlot";
import { fetchDictionary } from "@/lib/dictionary";
import { SITE } from "@/lib/site-config";

const ALPHABET = "ABCDEFGHIJKLMNOPRSTUWYZ".split("");
const title = `Kamus Nias - Li Niha | Telusuri Kosakata Indonesia ⇄ Nias`;
const desc = `Telusuri seluruh kosakata Kamus Nias - Li Niha. Cari kata Indonesia atau Nias, atau telusuri berdasarkan huruf awal.`;

export const Route = createFileRoute("/kamus")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: "/kamus" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/kamus" }],
  }),
  component: KamusPage,
});

function KamusPage() {
  const { data: entries = [] } = useQuery({
    queryKey: ["dictionary"],
    queryFn: fetchDictionary,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <Layout>
      <section className="border-b border-border nias-motif-bg">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center">
          <h1 className="font-serif text-3xl font-bold md:text-4xl">Kamus Nias - Li Niha</h1>
          <p className="mt-2 text-muted-foreground">{desc}</p>
          <div className="mx-auto mt-5 max-w-2xl">
            <SearchBox />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="font-serif text-2xl font-bold">Telusuri menurut huruf</h2>
        <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-9 md:grid-cols-12">
          {ALPHABET.map((letter) => (
            <Link
              key={letter}
              to="/cari"
              search={{ q: letter.toLowerCase() }}
              className="grid aspect-square place-items-center rounded-lg border border-border bg-card font-serif text-lg font-bold transition hover:bg-primary hover:text-primary-foreground hover:shadow"
            >
              {letter}
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <AdSlot type="adsense" slot="inArticle" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="font-serif text-2xl font-bold">Daftar Kata (cuplikan)</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {entries.slice(0, 60).map((e) => (
            <Link
              key={e.id}
              to="/kata/$slug"
              params={{ slug: e.slug }}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-primary hover:shadow-sm"
            >
              <div>
                <div className="text-sm font-semibold">{e.indo}</div>
                {e.jenis && (
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {e.jenis}
                  </div>
                )}
              </div>
              <div
                className="text-sm text-ocean-deep group-hover:text-primary"
                style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}
              >
                {e.nias}
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Gunakan kotak pencarian di atas untuk menemukan kata lainnya dari total{" "}
          {entries.length.toLocaleString("id-ID")} kata.
        </p>
        <noscript className="mt-2 block text-center text-xs">
          Aktifkan JavaScript untuk menggunakan pencarian.
        </noscript>
        <p className="sr-only">{SITE.longName}</p>
      </section>
    </Layout>
  );
}
