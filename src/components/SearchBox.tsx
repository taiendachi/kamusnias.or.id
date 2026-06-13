import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchDictionary, searchEntries } from "@/lib/dictionary";
import { useI18n } from "@/lib/i18n";

export function SearchBox({ autoFocus = false }: { autoFocus?: boolean }) {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  const { data: entries = [] } = useQuery({
    queryKey: ["dictionary"],
    queryFn: fetchDictionary,
    staleTime: 1000 * 60 * 60,
  });

  const results = q ? searchEntries(entries, q, 8) : [];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={boxRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) {
            navigate({ to: "/kata/$slug", params: { slug: results[0].slug } });
            setOpen(false);
          } else if (q.trim()) {
            navigate({ to: "/cari", search: { q } });
          }
        }}
        className="flex items-center gap-2 rounded-full border border-border bg-card pl-4 pr-2 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring"
      >
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
        <input
          type="search"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t.search}
          aria-label={t.search}
          className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {t.searchBtn}
        </button>
      </form>
      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-2 max-h-[70vh] w-full overflow-auto rounded-xl border border-border bg-popover shadow-xl"
        >
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  navigate({ to: "/kata/$slug", params: { slug: r.slug } });
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-accent/40"
              >
                <span className="font-medium">{r.indo}</span>
                <span
                  className="text-ocean-deep"
                  style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}
                >
                  {r.nias}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
