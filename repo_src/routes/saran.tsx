import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SITE } from "@/lib/site-config";
import { Lightbulb, Send } from "lucide-react";

const title = `Form Saran Kosakata — ${SITE.longName}`;
const desc = `Bantu lengkapi ${SITE.longName}. Sarankan kosakata baru, koreksi terjemahan, atau usulkan contoh kalimat yang lebih tepat.`;

const JENIS = [
  "Kata Kerja",
  "Kata Benda",
  "Kata Sifat",
  "Kata Bilangan",
  "Kata Tugas",
  "Lainnya",
] as const;

export const Route = createFileRoute("/saran")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: "/saran" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/saran" }],
  }),
  component: SaranPage,
});

function SaranPage() {
  const [form, setForm] = useState({
    jenisSaran: "Usulan kata baru",
    nama: "",
    email: "",
    katind: "",
    katNias: "",
    jenisKata: "Kata Benda",
    contoh: "",
    catatan: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[Saran] ${form.jenisSaran}: ${form.katind || form.katNias || "(tanpa kata)"}`;
    const body = `Jenis Saran : ${form.jenisSaran}
Nama        : ${form.nama || "-"}
Email       : ${form.email || "-"}

Kata Indonesia : ${form.katind || "-"}
Kata Nias      : ${form.katNias || "-"}
Jenis Kata     : ${form.jenisKata}

Contoh Kalimat:
${form.contoh || "-"}

Catatan Tambahan:
${form.catatan || "-"}

— Dikirim dari ${SITE.longName} (halaman /saran)`;
    window.location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Layout>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-foreground ring-1 ring-gold/40">
            <Lightbulb className="h-3 w-3" /> Kontribusi Komunitas
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold md:text-4xl">Form Saran Kosakata</h1>
          <p className="mt-2 text-muted-foreground">{desc}</p>
        </div>
      </section>

      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <div className="rounded-xl border border-border bg-card p-6">
          <label className="text-sm font-medium" htmlFor="jenisSaran">
            Jenis Saran
          </label>
          <select
            id="jenisSaran"
            value={form.jenisSaran}
            onChange={(e) => setForm({ ...form, jenisSaran: e.target.value })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option>Usulan kata baru</option>
            <option>Koreksi terjemahan</option>
            <option>Koreksi jenis kata</option>
            <option>Tambah contoh kalimat</option>
            <option>Lainnya</option>
          </select>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="nama">
                Nama (opsional)
              </label>
              <input
                id="nama"
                maxLength={120}
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email (opsional)
              </label>
              <input
                id="email"
                type="email"
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="katind">
                Kata Indonesia
              </label>
              <input
                id="katind"
                maxLength={120}
                value={form.katind}
                onChange={(e) => setForm({ ...form, katind: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="katNias">
                Kata Nias (Li Niha)
              </label>
              <input
                id="katNias"
                maxLength={120}
                value={form.katNias}
                onChange={(e) => setForm({ ...form, katNias: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium" htmlFor="jenisKata">
              Jenis Kata
            </label>
            <select
              id="jenisKata"
              value={form.jenisKata}
              onChange={(e) => setForm({ ...form, jenisKata: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {JENIS.map((j) => (
                <option key={j}>{j}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium" htmlFor="contoh">
              Contoh Kalimat (opsional)
            </label>
            <textarea
              id="contoh"
              rows={3}
              maxLength={1000}
              value={form.contoh}
              onChange={(e) => setForm({ ...form, contoh: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium" htmlFor="catatan">
              Catatan Tambahan
            </label>
            <textarea
              id="catatan"
              rows={4}
              maxLength={2000}
              value={form.catatan}
              onChange={(e) => setForm({ ...form, catatan: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Mis: kata ini umum dipakai di Nias Selatan, ejaan alternatif, dialek, dsb."
            />
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Send className="h-4 w-4" /> Kirim Saran
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            Saran akan dikirim ke {SITE.contactEmail} melalui aplikasi email Anda.
          </p>
        </div>
      </form>
    </Layout>
  );
}
