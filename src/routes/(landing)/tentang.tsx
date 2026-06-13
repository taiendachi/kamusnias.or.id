import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AdSlot } from "@/components/AdSlot";
import { SITE } from "@/lib/site-config";

const title = `Tentang Kami — ${SITE.longName}`;
const desc = `${SITE.longName} adalah proyek digital pelestarian Bahasa Nias (Li Niha) — kamus online gratis Indonesia ⇄ Nias untuk masyarakat luas.`;

export const Route = createFileRoute("/(landing)/tentang")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: "/tentang" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/tentang" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: title,
          description: desc,
          inLanguage: "id",
          publisher: { "@type": "Organization", name: SITE.organization, email: SITE.contactEmail },
        }),
      },
    ],
  }),
  component: TentangPage,
});

function TentangPage() {
  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-serif text-3xl font-bold md:text-4xl">Tentang {SITE.longName}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{desc}</p>

        <div className="prose prose-sm mt-6 max-w-none text-foreground/90 md:prose-base">
          <p>
            <strong>{SITE.longName}</strong> hadir sebagai upaya digital untuk mendokumentasikan,
            melestarikan, dan menyebarluaskan Bahasa Nias atau
            <em> Li Niha</em>. Kami percaya bahwa bahasa daerah adalah warisan yang harus tetap
            hidup di tengah modernisasi.
          </p>

          <h2 className="mt-8 font-serif text-2xl font-bold">Misi Kami</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Menyediakan kamus Indonesia ⇄ Nias yang mudah diakses oleh siapa saja.</li>
            <li>Mendukung pembelajaran Bahasa Nias bagi generasi muda dan perantau.</li>
            <li>
              Menjadi rujukan digital terbuka untuk peneliti, pelajar, dan pencinta budaya Nias.
            </li>
            <li>Mendorong kontribusi komunitas dalam memperkaya kosakata.</li>
          </ul>

          <h2 className="mt-8 font-serif text-2xl font-bold">Untuk Siapa Website Ini?</h2>
          <p>
            Untuk pelajar, mahasiswa, peneliti bahasa, perantau Nias yang ingin kembali ke akar
            bahasanya, serta siapa pun yang tertarik mengenal kekayaan Bahasa Nias (Li Niha).
          </p>

          <h2 className="mt-8 font-serif text-2xl font-bold">Sumber Data</h2>
          <p>
            Data kosakata dikelola melalui basis data terbuka yang terus diperbarui. Kami mengundang
            penutur asli dan kontributor untuk menambahkan, memperbaiki, atau mengusulkan kosakata
            baru melalui
            <a href="/saran" className="text-primary hover:underline">
              {" "}
              Form Saran
            </a>
            .
          </p>

          <h2 className="mt-8 font-serif text-2xl font-bold">Dukungan</h2>
          <p>
            {SITE.longName} dijalankan secara non-komersial. Dukungan Anda — melalui saran kata,
            berbagi tautan, atau donasi sukarela di halaman
            <a href="/support" className="text-primary hover:underline">
              {" "}
              Dukung Kami
            </a>{" "}
            — sangat membantu agar website ini terus berkembang.
          </p>

          <h2 className="mt-8 font-serif text-2xl font-bold">Kontak</h2>
          <p>
            Pertanyaan, kerja sama, atau koreksi data dapat dikirim ke{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-primary hover:underline">
              {SITE.contactEmail}
            </a>{" "}
            atau melalui halaman{" "}
            <a href="/kontak" className="text-primary hover:underline">
              Kontak
            </a>
            .
          </p>

          <p className="mt-10 italic text-muted-foreground">
            Ya'ahowu — Salam berkah dari Tano Niha.
          </p>
        </div>

        <AdSlot type="adsense" slot="inArticle" />
      </article>
    </Layout>
  );
}
