import { Link, useLocation } from "@tanstack/react-router";
import { Moon, Sun, Languages, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { SITE } from "@/lib/site-config";
import { useI18n, toggleTheme } from "@/lib/i18n";
import { SearchBox } from "./SearchBox";
import { StickyMobileAd } from "./AdSlot";
import { LOGO_URL } from "@/assets/logo";
import menuData from "../../data/menu.json";

export function Header() {
  const { lang, setLang } = useI18n();
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(false);

  const pathname = useLocation({ select: (s) => s.pathname });
  const showSearch = pathname.startsWith("/blog");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label={SITE.longName}>
          <img
            src={LOGO_URL}
            alt={`${SITE.longName} — Li Ono Niha`}
            width={160}
            height={48}
            className="h-8 w-auto md:h-10"
            loading="eager"
            decoding="async"
          />
          <span className="sr-only">{SITE.longName}</span>
        </Link>
        <div className="hidden flex-1 md:block">{showSearch && <SearchBox />}</div>
        <nav className="ml-auto hidden items-center gap-0.5 text-sm font-medium lg:flex">
          {menuData.mainNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-1.5 hover:bg-muted"
              activeProps={{ className: "rounded-md px-3 py-1.5 bg-primary/10 text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/support"
            className="ml-1 inline-flex items-center gap-1 rounded-full bg-[#e11d2a] px-3 py-1.5 font-semibold text-white shadow-sm transition hover:bg-[#c41722] hover:shadow-md animate-wiggle"
          >
            <span className="inline-block animate-heart">❤</span> Dukung
          </Link>
        </nav>
        <button
          onClick={() => setLang(lang === "id" ? "ni" : "id")}
          aria-label="Ganti bahasa antarmuka"
          className="hidden items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs font-semibold hover:bg-muted md:inline-flex"
        >
          <Languages className="h-3.5 w-3.5" />
          {lang.toUpperCase()}
        </button>
        <button
          onClick={() => {
            toggleTheme();
            setIsDark((d) => !d);
          }}
          aria-label="Mode tampilan"
          className="rounded-md border border-border p-1.5 hover:bg-muted"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Buka menu"
          aria-expanded={open}
          className="rounded-md border border-border p-1.5 hover:bg-muted lg:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {showSearch && (
        <div className="border-t border-border px-4 py-2 md:hidden">
          <SearchBox />
        </div>
      )}
      {open && (
        <nav className="border-t border-border bg-background px-4 py-2 lg:hidden">
          <ul className="flex flex-col text-sm font-medium">
            {menuData.mainNav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 hover:bg-muted"
                  activeProps={{
                    className: "block rounded-md px-3 py-2 bg-primary/10 text-primary",
                  }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/saran"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 hover:bg-muted"
              >
                Form Saran
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-gold-foreground hover:bg-muted"
              >
                ❤ Dukung Kami
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 grid-cols-2 md:grid-cols-5">
        <div className="col-span-2 md:col-span-2">
          <img src={LOGO_URL} alt={SITE.longName} className="h-10 w-auto" loading="lazy" />
          <p className="mt-3 max-w-md text-sm text-muted-foreground">{SITE.description}</p>
        </div>
        <div className="col-span-1">
          <div className="text-sm font-semibold">Navigasi</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {menuData.footerLinks.navigasi.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1">
          <div className="text-sm font-semibold">Halaman</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {menuData.footerLinks.halaman.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="text-sm font-semibold">Kontribusi</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {menuData.footerLinks.kontribusi.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.longName}. Ya'ahowu!
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Footer />
      <StickyMobileAd />
    </div>
  );
}
