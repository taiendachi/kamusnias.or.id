import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { BLOG_POSTS } from "@/lib/blog";

export function SearchBox({ autoFocus = false }: { autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return BLOG_POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query)),
    ).slice(0, 5);
  }, [q]);

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
            navigate({ to: "/blog/$slug", params: { slug: results[0].slug } });
            setOpen(false);
          }
        }}
        className="flex items-center gap-2 rounded-full border border-border bg-card pl-4 pr-2 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring"
      >
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
        <input
          type="search"
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Cari Artikel..."
          aria-label="Cari Artikel"
          className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Cari
        </button>
      </form>
      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-2 max-h-[70vh] w-full overflow-auto rounded-xl border border-border bg-popover shadow-xl"
        >
          {results.map((r) => (
            <li key={r.slug}>
              <button
                type="button"
                onClick={() => {
                  navigate({ to: "/blog/$slug", params: { slug: r.slug } });
                  setOpen(false);
                }}
                className="flex w-full flex-col items-start gap-1 px-4 py-2.5 text-left text-sm hover:bg-accent/40"
              >
                <span className="font-semibold line-clamp-1">{r.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">{r.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
