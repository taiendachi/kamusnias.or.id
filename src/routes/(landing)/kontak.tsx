import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SITE } from "@/lib/site-config";
import { Mail, Send } from "lucide-react";

const title = `Kontak — ${SITE.longName}`;
const desc = `Hubungi tim ${SITE.longName} di ${SITE.contactEmail} untuk pertanyaan, kerja sama, atau koreksi kosakata.`;

export const Route = createFileRoute("/(landing)/kontak")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: "/kontak" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/kontak" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: title,
          description: desc,
          mainEntity: {
            "@type": "Organization",
            name: SITE.organization,
            email: SITE.contactEmail,
          },
        }),
      },
    ],
  }),
  component: KontakPage,
});

function KontakPage() {
  const [form, setForm] = useState({ nama: "", email: "", subjek: "", pesan: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[Kontak] ${form.subjek || "Pesan dari pengunjung"}`;
    const body = `Nama: ${form.nama}\nEmail: ${form.email}\n\n${form.pesan}\n\n— Dikirim dari ${SITE.longName}`;
    const url = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <Layout>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="font-serif text-3xl font-bold md:text-4xl">Kontak Kami</h1>
          <p className="mt-2 text-muted-foreground">{desc}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-3xl gap-6 px-4 py-10 md:grid-cols-[1fr_280px]">
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <label className="text-sm font-medium" htmlFor="nama">
              Nama
            </label>
            <input
              id="nama"
              required
              maxLength={120}
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              maxLength={255}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="subjek">
              Subjek
            </label>
            <input
              id="subjek"
              maxLength={140}
              value={form.subjek}
              onChange={(e) => setForm({ ...form, subjek: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="pesan">
              Pesan
            </label>
            <textarea
              id="pesan"
              required
              rows={6}
              maxLength={4000}
              value={form.pesan}
              onChange={(e) => setForm({ ...form, pesan: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Send className="h-4 w-4" /> Kirim Pesan
          </button>
          <p className="text-xs text-muted-foreground">
            Tombol di atas akan membuka aplikasi email Anda dan mengisi pesan otomatis ke{" "}
            {SITE.contactEmail}.
          </p>
        </form>

        <aside className="rounded-xl border border-border bg-card p-6 text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <Mail className="h-4 w-4" /> Email
          </div>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="mt-1 block text-primary hover:underline"
          >
            {SITE.contactEmail}
          </a>
          <p className="mt-4 text-muted-foreground">
            Untuk usulan kosakata baru atau koreksi terjemahan, gunakan
            <a href="/saran" className="ml-1 text-primary hover:underline">
              Form Saran
            </a>
            .
          </p>
        </aside>
      </div>
    </Layout>
  );
}
