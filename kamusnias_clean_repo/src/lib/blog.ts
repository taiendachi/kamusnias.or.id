// Statis-blog data. Tambah artikel baru di sini — otomatis muncul di /blog
// dan sitemap.
//
// ===== CARA MENULIS ARTIKEL (struktur SEO) =====
// Judul artikel (title) otomatis menjadi H1 — JANGAN tulis `#` di konten.
// Di dalam `content` gunakan sintaks markdown ringan berikut:
//
//   ## Sub-judul utama        → H2
//   ### Sub-bagian            → H3
//   #### Poin detail          → H4
//   - item                    → bullet point
//   1. item                   → numbered list
//   | Kolom A | Kolom B |     → tabel (baris pertama = header,
//   | ------- | ------- |       baris kedua = pemisah, sisanya isi)
//   | isi     | isi     |
//   > kutipan                 → blockquote
//   **tebal**  *miring*  `kode` → format inline
//
// Pisahkan setiap blok dengan satu baris kosong.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO YYYY-MM-DD
  author?: string;
  cover?: string;
  tags?: string[];
  content: string; // markdown ringan — lihat panduan di atas
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "mengenal-bahasa-nias-li-niha",
    title: "Mengenal Bahasa Nias (Li Niha): Sejarah, Dialek, dan Keunikan",
    description:
      "Pengantar Bahasa Nias atau Li Niha — sejarah singkat, dialek utara/tengah/selatan, dan ciri khas fonologi yang membuatnya unik di rumpun Austronesia.",
    date: "2026-06-01",
    author: "Tim Kamus Nias",
    tags: ["bahasa", "nias", "li niha"],
    content: `Bahasa Nias atau **Li Niha** adalah bahasa daerah yang dituturkan oleh masyarakat Pulau Nias di lepas pantai barat Sumatera Utara. Bahasa ini termasuk dalam rumpun Austronesia, sub-keluarga Melayu-Polinesia Barat.

## Keunikan Fonologi Li Niha

Salah satu ciri paling khas Li Niha adalah seluruh kata berakhir dengan vokal — tidak pernah konsonan. Hal ini membuat tuturan Bahasa Nias terdengar mengalir dan musikal.

### Ciri-ciri utama

- Semua kata berakhir dengan huruf vokal (a, e, i, o, u, ö)
- Memiliki vokal khas **ö** yang tidak ada dalam Bahasa Indonesia
- Intonasi cenderung musikal dan berirama

## Pembagian Dialek

Secara dialek, Li Niha umumnya dibagi menjadi tiga wilayah. Perbedaan terletak pada kosakata tertentu dan beberapa pola pelafalan, namun penutur dari ketiga wilayah umumnya tetap dapat saling memahami.

| Dialek | Wilayah | Ciri Khas |
| ------ | ------- | --------- |
| Utara | Gunungsitoli dan sekitarnya | Dianggap dialek standar |
| Tengah | Nias bagian tengah | Peralihan utara–selatan |
| Selatan | Teluk Dalam dan sekitarnya | Kosakata dan lafal tersendiri |

## Pentingnya Pelestarian

Pelestarian Bahasa Nias menjadi penting di era modern karena penggunaannya di kalangan generasi muda menurun. **Kamus Nias** hadir sebagai salah satu upaya digital untuk mendokumentasikan kosakata dan memudahkan siapa pun mempelajari Li Niha.`,
  },
  {
    slug: "panduan-belajar-kosakata-nias-untuk-pemula",
    title: "Panduan Belajar Kosakata Nias untuk Pemula",
    description:
      "Langkah praktis memulai belajar kosakata Bahasa Nias: mulai dari sapaan harian, angka, hingga tips menghafal kata dengan cepat.",
    date: "2026-06-05",
    author: "Tim Kamus Nias",
    tags: ["belajar", "pemula", "kosakata"],
    content: `Belajar Bahasa Nias bisa dimulai dari hal paling sederhana — sapaan harian. Kata **"Ya'ahowu"** misalnya, adalah sapaan universal masyarakat Nias yang berarti salam berkah.

## Langkah-Langkah Belajar

1. Kuasai sapaan harian terlebih dahulu seperti *Ya'ahowu*
2. Lanjutkan ke kosakata dasar: anggota keluarga, angka, dan anggota tubuh
3. Pelajari kata kerja sehari-hari yang sering digunakan
4. Pilih 5–10 kata baru per hari dan ulangi sepanjang minggu

## Contoh Kosakata Dasar

| Bahasa Indonesia | Bahasa Nias |
| ---------------- | ----------- |
| Salam / berkah | Ya'ahowu |
| Terima kasih | Saohagölö |
| Saya | Ya'o |

## Tips Menghafal dengan Cepat

### Gunakan fitur Kamus Nias

Manfaatkan fitur pencarian di Kamus Nias untuk menemukan padanan kata Indonesia ⇄ Nias dengan cepat.

### Praktikkan setiap hari

- Gunakan kata-kata baru dalam kalimat sederhana
- Ucapkan dengan suara keras agar terbiasa dengan pelafalannya
- Ajak teman atau keluarga berlatih bersama

> Bahasa hidup ketika digunakan, bukan hanya dihafal.`,
  },
];

export const getPost = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);
