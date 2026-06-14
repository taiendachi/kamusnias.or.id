import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SITE } from "@/lib/site-config";
import { Heart, Copy, Check, QrCode } from "lucide-react";

const title = `Dukung Kami — ${SITE.longName}`;
const desc = `Dukung ${SITE.longName} agar tetap gratis dan berkembang. Donasi sukarela via QRIS — satu QR untuk GoPay & DANA (${SITE.support.numberDisplay}).`;

export const Route = createFileRoute("/(landing)/support")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: "/support" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ],
    links: [{ rel: "canonical", href: "/support" }],
  }),
  component: SupportPage,
});

function SupportPage() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.support.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <Layout>
      <section className="border-b border-border nias-motif-bg">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-foreground ring-1 ring-gold/40">
            <Heart className="h-3 w-3" /> Saohagölö — Terima kasih
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold md:text-4xl">Dukung Kamus Nias</h1>
          <p className="mt-2 text-muted-foreground">{desc}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-4xl gap-6 px-4 py-10 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 text-center flex flex-col justify-center">
          <h2 className="font-serif text-xl font-bold">Transfer Melalui E-Wallet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Anda dapat menggunakan aplikasi GoPay atau DANA untuk melakukan transfer dukungan.
          </p>
          <div className="mt-6 flex justify-center items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 bg-[#00AED6] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                DANA
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 bg-[#00A5CF] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                GoPay
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Masukkan nomor yang tertera di samping pada aplikasi e-wallet Anda. Atas nama:{" "}
            <strong className="text-foreground">{SITE.support.accountName}</strong>.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-xl font-bold">Atau transfer manual</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                GoPay / DANA
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <div className="font-mono text-lg font-bold">{SITE.support.numberDisplay}</div>
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
                  aria-label="Salin nomor"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" /> Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Salin
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Atas Nama
              </div>
              <div className="mt-1 font-semibold">{SITE.support.accountName}</div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-primary/5 p-4 text-sm">
            <div className="font-semibold text-primary">Untuk apa donasi digunakan?</div>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-muted-foreground">
              <li>Biaya hosting & domain {SITE.longName}</li>
              <li>Pengembangan fitur baru (audio, contoh kalimat, dialek)</li>
              <li>Penambahan dan kurasi kosakata</li>
            </ul>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Setelah berdonasi, mohon konfirmasi ke{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-primary hover:underline">
              {SITE.contactEmail}
            </a>{" "}
            agar kami dapat mengucapkan terima kasih.
          </p>
        </div>
      </div>
    </Layout>
  );
}
