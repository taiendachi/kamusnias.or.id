import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import {
Outlet,
createRootRouteWithContext,
useRouter,
HeadContent,
Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE } from "@/lib/site-config";
import { I18nProvider, ThemeProvider } from "@/lib/i18n";

function NotFoundComponent() {
return (


404
Halaman tidak ditemukan

Kata atau halaman yang Anda cari tidak tersedia.



Kembali ke beranda




);
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
console.error(error);
const router = useRouter();
useEffect(() => {
reportLovableError(error, { boundary: "tanstack_root_error_component" });
}, [error]);
return (


Halaman gagal dimuat
Terjadi kesalahan. Silakan coba lagi.

<button
onClick={() => {
router.invalidate();
reset();
}}
className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
>
Coba lagi


Beranda




);
}

const orgJsonLd = {
"@context": "https://schema.org",
"@type": "WebSite",
name: SITE.longName,
alternateName: SITE.name,
url: "/",
inLanguage: ["id", "nia"],
potentialAction: {
"@type": "SearchAction",
target: "/cari?q={search_term_string}",
"query-input": "required name=search_term_string",
},
publisher: {
"@type": "Organization",
name: SITE.organization,
},
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
head: () => ({
meta: [
{ charSet: "utf-8" },
{ name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
{ name: "referrer", content: "no-referrer" },
{ title: ${SITE.longName} — ${SITE.tagline} },
{ name: "description", content: SITE.description },
{ name: "author", content: SITE.organization },
{ name: "theme-color", content: "#1e6091" },
{ name: "geo.placename", content: "Nias, Indonesia" },
{ name: "geo.region", content: "ID-SU" },
{ name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
{ property: "og:site_name", content: SITE.longName },
{ property: "og:type", content: "website" },
{ property: "og:locale", content: "id_ID" },
{ property: "og:locale:alternate", content: "nia_ID" },
{ name: "twitter:card", content: "summary_large_image" },
{ name: "twitter:site", content: SITE.twitter },
{ title: "Kamus Nias" },
{ property: "og:title", content: "Kamus Nias" },
{ name: "twitter:title", content: "Kamus Nias" },
{ name: "description", content: "Terjemahan Li Niha -  Kamus Bahasa Daerah Nias" },
{ property: "og:description", content: "Terjemahan Li Niha -  Kamus Bahasa Daerah Nias" },
{ name: "twitter:description", content: "Terjemahan Li Niha -  Kamus Bahasa Daerah Nias" },
{
property: "og:image",
content:
"https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/54269df7-9bdb-43dc-89fe-0e385090b6af/id-preview-97512654--5d2e5942-4ca0-40ff-bcb4-6052fd15b43c.lovable.app-1781235671212.png",
},
{
name: "twitter:image",
content:
"https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/54269df7-9bdb-43dc-89fe-0e385090b6af/id-preview-97512654--5d2e5942-4ca0-40ff-bcb4-6052fd15b43c.lovable.app-1781235671212.png",
},
],
links: [
{ rel: "stylesheet", href: appCss },
{ rel: "icon", href: "/favicon.ico" },
{ rel: "manifest", href: "/manifest.webmanifest" },
{ rel: "preconnect", href: "https://fonts.googleapis.com" },
{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
{ rel: "preconnect", href: "https://docs.google.com", crossOrigin: "anonymous" },
{ rel: "dns-prefetch", href: "https://docs.google.com" },
{
rel: "stylesheet",
href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,700;1,400&display=swap",
},
],
scripts: [
{ type: "application/ld+json", children: JSON.stringify(orgJsonLd) },
{
async: true,
src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4889687234142000",
crossOrigin: "anonymous"
}
],
}),
shellComponent: RootShell,
component: RootComponent,
notFoundComponent: NotFoundComponent,
errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
return (





{children}



);
}

function RootComponent() {
const { queryClient } = Route.useRouteContext();
return (









);
}
