import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchDictionary, type Entry } from "@/lib/dictionary";

type Dir = "id-ni" | "ni-id";

function searchByDir(entries: Entry[], q: string, dir: Dir, limit = 8): Entry[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const exact: Entry[] = [],
    starts: Entry[] = [],
    contains: Entry[] = [];
  for (const e of entries) {
    const src = (dir === "id-ni" ? e.indo : e.nias).toLowerCase();
    if (src === query) exact.push(e);
    else if (src.startsWith(query)) starts.push(e);
    else if (src.includes(query)) contains.push(e);
    if (exact.length + starts.length + contains.length >= limit * 3) break;
  }
  return [...exact, ...starts, ...contains].slice(0, limit);
}

export function TranslatorBox({ autoFocus = false }: { autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [dir, setDir] = useState<Dir>("id-ni");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  const { data: entries = [] } = useQuery({
    queryKey: ["dictionary"],
    queryFn: fetchDictionary,
    staleTime: 1000 * 60 * 60,
  });

  const results = useMemo(() => searchByDir(entries, q, dir, 8), [entries, q, dir]);
  const top = results[0];
  const translation = top ? (dir === "id-ni" ? top.nias : top.indo) : "";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const srcLabel = dir === "id-ni" ? "Indonesia" : "Nias";
  const tgtLabel = dir === "id-ni" ? "Nias" : "Indonesia";

  return (
    <div ref={boxRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (top) {
            navigate({ to: "/kata/$slug", params: { slug: top.slug } });
            setOpen(false);
          } else if (q.trim()) navigate({ to: "/cari", search: { q } });
        }}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring/40"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          {/* Source */}
          <div className="relative p-4 md:p-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              {srcLabel}
            </div>
            <div className="mt-3 flex items-start gap-2">
              <Search className="mt-3 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
              <textarea
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={autoFocus}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Masukkan teks"
                aria-label={`Teks ${srcLabel}`}
                rows={2}
                className="min-h-[64px] w-full resize-none bg-transparent text-2xl font-medium outline-none placeholder:text-muted-foreground/60 md:text-3xl"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setOpen(false);
                  }}
                  aria-label="Bersihkan"
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Swap */}
          <div className="flex items-center justify-center border-t border-border md:border-t-0 md:border-x">
            <button
              type="button"
              onClick={() => {
                setDir(dir === "id-ni" ? "ni-id" : "id-ni");
              }}
              aria-label="Tukar bahasa"
              className="m-2 grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-primary transition hover:rotate-180 hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* Target */}
          <div className="bg-muted/40 p-4 md:p-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              {tgtLabel}
            </div>
            <div
              className="mt-3 min-h-[64px] text-2xl leading-tight md:text-3xl"
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 900,
              }}
              aria-live="polite"
            >
              {translation ? (
                <span className="text-ocean-deep">{translation}</span>
              ) : (
                <span className="text-muted-foreground/50 font-medium">Terjemahan</span>
              )}
            </div>
            {top?.jenis && (
              <div className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                {top.jenis}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border bg-background/50 px-4 py-2">
          <div className="text-xs text-muted-foreground">
            {q ? `${results.length} saran` : "Ketik untuk menerjemahkan"}
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            {top ? "Buka kata" : "Cari"}
          </button>
        </div>
      </form>

      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-auto rounded-xl border border-border bg-popover shadow-xl"
        >
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  navigate({ to: "/kata/$slug", params: { slug: r.slug } });
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-accent/40"
              >
                <span className="text-base font-medium">{dir === "id-ni" ? r.indo : r.nias}</span>
                <span
                  className="text-base text-ocean-deep"
                  style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}
                >
                  {dir === "id-ni" ? r.nias : r.indo}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
