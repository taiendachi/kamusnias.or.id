import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { TranslatorBox } from "@/components/TranslatorBox";
import { AdSlot } from "@/components/AdSlot";
import { SocialFollow } from "@/components/SocialFollow";
import { SITE } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import { BLOG_POSTS } from "@/lib/blog";
import { Sparkles, CalendarDays, ArrowRight } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Apa itu Kamus Bahasa Nias?",
    a: "Kamus Bahasa Nias adalah layanan kamus online yang menyediakan arti dan terjemahan kosakata Bahasa Nias ke Bahasa Indonesia maupun sebaliknya untuk membantu pembelajaran bahasa daerah.",
  },
  {
    q: "Apakah Kamus Bahasa Nias Online gratis?",
    a: "Ya, seluruh fitur pencarian kata, kosakata, dan terjemahan bahasa dapat digunakan secara gratis.",
  },
  {
    q: "Apakah bisa translate Bahasa Indonesia ke Bahasa Nias?",
    a: "Ya, pengguna dapat mencari padanan kata dari Bahasa Indonesia ke Bahasa Nias melalui fitur terjemahan bahasa yang tersedia.",
  },
  {
    q: "Apakah kamus ini cocok untuk pelajar?",
    a: "Sangat cocok karena membantu proses belajar Bahasa Nias, memahami kosakata, dan mengenal budaya Nias secara praktis dan mudah dipahami.",
  },
  {
    q: "Mengapa belajar Bahasa Nias penting?",
    a: "Belajar Bahasa Nias membantu melestarikan bahasa daerah, menjaga warisan budaya Suku Nias, memahami peribahasa Nias, serta memperkenalkan kekayaan budaya Indonesia kepada generasi mendatang.",
  },
  {
    q: "Apa nama Bahasa Nias dalam bahasa aslinya?",
    a: "Bahasa Nias disebut Li Niha oleh penutur aslinya dan termasuk rumpun bahasa Austronesia.",
  },
];

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `${SITE.longName} — ${SITE.tagline}`,
  description: SITE.description,
  inLanguage: "id",
  isPartOf: { "@type": "WebSite", name: SITE.longName, url: "/" },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".hero-sub"] },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.longName} — ${SITE.tagline}` },
      { name: "description", content: SITE.description },
      {
        name: "keywords",
        content:
          "kamus nias, kamus bahasa nias, li niha, bahasa daerah nias, terjemahan nias indonesia, kamus bahasa daerah nias online",
      },
      { property: "og:title", content: `${SITE.longName} — ${SITE.tagline}` },
      { property: "og:description", content: SITE.description },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: SITE.longName },
      { name: "twitter:description", content: SITE.description },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(homeJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd) },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();
  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-border nias-motif-bg">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center md:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-foreground ring-1 ring-gold/40">
            <Sparkles className="h-3 w-3" /> Ya'ahowu — Selamat datang
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">
            {t.heroTitle}
          </h1>
          <div className="mx-auto mt-8 max-w-3xl">
            <TranslatorBox autoFocus />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <AdSlot type="adsense" slot="header" label="Header banner" height={90} />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-bold">Artikel Terbaru</h2>
            <p className="text-sm text-muted-foreground">Wawasan seputar Bahasa & Budaya Nias.</p>
          </div>
          <Link to="/blog" className="text-sm font-medium text-primary hover:underline">
            Semua artikel →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.slice(0, 6).map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition hover:border-primary hover:shadow"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                {new Date(p.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <h3 className="mt-2 font-serif text-lg font-bold leading-snug group-hover:text-primary">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
              <span className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Baca selengkapnya <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <AdSlot type="mgid" slot="inArticle" label="MGID widget" height={250} />
      </div>

      {/* SEO Article */}
      <article className="mx-auto max-w-3xl px-4 py-10 prose-content">
        <h2 className="font-serif text-3xl font-bold">Tentang Kamus Bahasa Daerah Nias Online</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
          <strong>Kamus Bahasa Daerah Nias Online</strong> adalah platform digital yang dirancang
          untuk memudahkan masyarakat dalam mencari arti kata, menerjemahkan kosakata, dan
          mempelajari Bahasa Nias secara praktis melalui internet. Website ini hadir sebagai
          referensi bahasa daerah yang dapat diakses kapan saja oleh pelajar, mahasiswa, guru,
          peneliti, wisatawan, maupun masyarakat umum yang ingin mengenal dan melestarikan bahasa
          serta budaya Nias.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
          Sebagai kamus online yang berfokus pada pelestarian bahasa daerah, platform ini membantu
          pengguna memahami berbagai kosakata yang digunakan oleh Suku Nias di berbagai wilayah
          seperti Gunungsitoli, Nias Selatan, Nias Barat, Nias Utara, dan Nias Timur. Dengan
          demikian, pengguna dapat mempelajari variasi penggunaan Bahasa Nias yang berkembang di
          berbagai daerah di Pulau Nias.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
          Melalui sistem pencarian yang cepat dan mudah digunakan, pengguna dapat menemukan arti
          kata Bahasa Nias ke Bahasa Indonesia maupun sebaliknya dalam hitungan detik. Fitur
          terjemahan bahasa ini terus dikembangkan dengan menambahkan ribuan kosakata baru agar
          semakin lengkap dan relevan dengan penggunaan Bahasa Nias modern maupun tradisional.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
          Selain sebagai kamus online, platform ini juga berfungsi sebagai pusat edukasi bahasa dan
          budaya Nias dengan menghadirkan berbagai konten pendukung seperti peribahasa Nias,
          ungkapan tradisional, kosakata sehari-hari, nama-nama adat, sejarah budaya, hingga
          pembelajaran tata bahasa dasar. Kehadiran platform ini diharapkan dapat memperkuat
          pelestarian bahasa daerah sebagai bagian dari kekayaan budaya Indonesia.
        </p>

        <h3 className="mt-8 font-serif text-2xl font-bold">Mengapa Kamus Bahasa Nias Penting?</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
          Bahasa Nias merupakan salah satu bahasa daerah yang menjadi identitas masyarakat di Pulau
          Nias dan bagian dari kekayaan budaya Indonesia. Bahasa ini telah digunakan secara
          turun-temurun oleh Suku Nias dan menjadi sarana komunikasi utama dalam kehidupan sosial,
          adat, serta budaya masyarakat Nias.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
          Seiring perkembangan zaman, penggunaan bahasa daerah menghadapi berbagai tantangan
          sehingga diperlukan upaya digitalisasi untuk menjaga keberlangsungan bahasa tersebut. Oleh
          karena itu, kehadiran Kamus Bahasa Daerah Nias Online menjadi salah satu solusi untuk
          memperkenalkan Bahasa Nias kepada generasi muda sekaligus memperluas akses pembelajaran
          bagi masyarakat Indonesia.
        </p>
        <p className="mt-3 text-[15px] font-semibold">Kamus Bahasa Daerah Nias hadir untuk:</p>
        <ul className="mt-2 ml-6 list-disc space-y-1 text-[15px] text-foreground/90">
          <li>Melestarikan Bahasa Nias dan budaya Nias.</li>
          <li>Mempermudah generasi muda belajar bahasa daerah.</li>
          <li>Menjadi referensi akademik bagi peneliti dan mahasiswa.</li>
          <li>Membantu wisatawan memahami bahasa lokal di Pulau Nias.</li>
          <li>Mendukung pendidikan muatan lokal di sekolah.</li>
          <li>Menyediakan akses informasi Bahasa Nias secara gratis.</li>
          <li>Mendokumentasikan kosakata dan peribahasa Nias dalam format digital.</li>
        </ul>

        <h3 className="mt-8 font-serif text-2xl font-bold">
          Fitur Kamus Bahasa Daerah Nias Online
        </h3>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-foreground/90">
          <div>
            <h4 className="font-semibold">Pencarian Kata Bahasa Nias yang Cepat</h4>
            <p>
              Pengguna dapat mencari satu atau beberapa kata sekaligus tanpa perlu membuka banyak
              halaman. Sistem pencarian dirancang agar hasil dapat ditemukan dengan cepat dan akurat
              sehingga memudahkan proses belajar Bahasa Nias.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Terjemahan Bahasa Nias ke Indonesia</h4>
            <p>
              Menyediakan arti kata Bahasa Nias dalam Bahasa Indonesia sehingga memudahkan pengguna
              memahami makna kosakata yang dicari. Fitur terjemahan bahasa ini sangat membantu
              pelajar, mahasiswa, maupun masyarakat umum.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Terjemahan Bahasa Indonesia ke Nias</h4>
            <p>
              Selain menerjemahkan Bahasa Nias, pengguna juga dapat mencari padanan kata Bahasa
              Indonesia ke Bahasa Nias untuk kebutuhan belajar, penelitian, maupun komunikasi
              sehari-hari.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Database Kosakata yang Terus Bertambah</h4>
            <p>
              Koleksi kosakata akan diperbarui secara berkala berdasarkan referensi bahasa Nias dari
              berbagai sumber terpercaya yang berasal dari wilayah Gunungsitoli, Nias Selatan, Nias
              Barat, Nias Utara, dan Nias Timur.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Peribahasa Nias dan Ungkapan Tradisional</h4>
            <p>
              Selain kosakata umum, pengguna juga dapat menemukan berbagai peribahasa Nias, ungkapan
              adat, dan istilah budaya yang menjadi bagian penting dari warisan budaya masyarakat
              Nias.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Tampilan Ramah Mobile</h4>
            <p>
              Website menggunakan teknologi responsif sehingga nyaman diakses melalui smartphone
              Android, iPhone, tablet, laptop, dan komputer desktop.
            </p>
          </div>
        </div>

        <h3 className="mt-8 font-serif text-2xl font-bold">Keunggulan Kamus Bahasa Nias Online</h3>
        <ul className="mt-3 ml-6 list-disc space-y-2 text-[15px] text-foreground/90">
          <li>
            <strong>Gratis Digunakan</strong> — Seluruh fitur dapat diakses tanpa biaya sehingga
            siapa saja dapat belajar Bahasa Nias dengan mudah.
          </li>
          <li>
            <strong>Mudah Digunakan</strong> — Antarmuka sederhana sehingga cocok untuk semua usia,
            mulai dari pelajar hingga peneliti bahasa daerah.
          </li>
          <li>
            <strong>Cepat dan Ringan</strong> — Website dirancang agar tetap cepat meskipun
            menggunakan koneksi internet yang terbatas.
          </li>
          <li>
            <strong>Referensi Pembelajaran</strong> — Dapat digunakan sebagai bahan belajar Bahasa
            Nias dan bahasa daerah lainnya di sekolah maupun perguruan tinggi.
          </li>
          <li>
            <strong>Mendukung Pelestarian Budaya</strong> — Setiap pencarian membantu meningkatkan
            pemanfaatan Bahasa Nias dan budaya Nias di era digital sehingga warisan budaya lokal
            tetap terjaga untuk generasi mendatang.
          </li>
        </ul>

        <h3 className="mt-8 font-serif text-2xl font-bold">Cara Menggunakan Kamus Bahasa Nias</h3>
        <ol className="mt-3 ml-6 list-decimal space-y-1 text-[15px] text-foreground/90">
          <li>Ketik kata yang ingin dicari pada kolom pencarian.</li>
          <li>Klik tombol cari.</li>
          <li>Sistem akan menampilkan arti dan informasi terkait kata tersebut.</li>
          <li>Jika tersedia, akan muncul kata turunan, sinonim, maupun contoh penggunaan.</li>
          <li>Bagikan hasil pencarian melalui tautan permanen yang tersedia.</li>
        </ol>

        <h3 className="mt-8 font-serif text-2xl font-bold">Informasi Tambahan</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
          Kamus Bahasa Daerah Nias Online terus dikembangkan untuk menghadirkan kosakata yang lebih
          lengkap dan akurat. Apabila terdapat kata yang belum tersedia atau ditemukan kesalahan
          dalam arti kata, pengguna dapat mengirimkan masukan melalui{" "}
          <Link to="/kontak" className="text-primary hover:underline">
            halaman kontak
          </Link>
          .
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
          Sebagai media pembelajaran Bahasa Nias, platform ini tidak hanya berfungsi sebagai kamus
          online dan sarana terjemahan bahasa, tetapi juga menjadi pusat dokumentasi bahasa daerah
          yang digunakan oleh masyarakat di Gunungsitoli, Nias Selatan, Nias Barat, Nias Utara, dan
          Nias Timur. Kami berharap platform ini dapat menjadi salah satu sarana pelestarian bahasa
          daerah sekaligus membantu masyarakat dalam mempelajari dan menggunakan Bahasa Nias secara
          lebih luas, baik di Pulau Nias maupun di seluruh Indonesia.
        </p>
      </article>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="font-serif text-2xl font-bold">{t.faq}</h2>
        <dl className="mt-4 space-y-3">
          {FAQ_ITEMS.map((qa) => (
            <details
              key={qa.q}
              className="group rounded-lg border border-border bg-card p-4 open:shadow-sm"
            >
              <summary className="cursor-pointer font-semibold">{qa.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{qa.a}</p>
            </details>
          ))}
        </dl>
      </section>

      <SocialFollow />
    </Layout>
  );
}
