import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "id" | "ni";

const STRINGS = {
  id: {
    search: "Cari kata dalam Bahasa Indonesia atau Nias…",
    searchBtn: "Cari",
    home: "Beranda",
    culture: "Budaya",
    about: "Tentang",
    randomWord: "Kata acak",
    meaning: "Arti",
    type: "Jenis kata",
    example: "Contoh kalimat",
    faq: "Pertanyaan Umum",
    relatedWords: "Kata terkait",
    noResults: "Tidak ada hasil. Coba kata lain.",
    loading: "Memuat kamus…",
    totalWords: "kosakata",
    backHome: "Kembali ke beranda",
    heroTitle: "Kamus Bahasa Nias",
    heroSub: "Temukan terjemahan, jenis kata, dan makna budaya — Indonesia ⇄ Nias.",
    pickLetter: "Telusuri menurut huruf",
    indonesianLabel: "Indonesia",
    niasLabel: "Bahasa Nias",
    copy: "Salin",
    copied: "Tersalin",
    share: "Bagikan",
    listen: "Dengar",
    toggleLang: "Bahasa",
    toggleTheme: "Mode tampilan",
    darkOn: "Mode gelap",
    darkOff: "Mode terang",
  },
  ni: {
    search: "Alui li ba li Indonesia ma li Niha…",
    searchBtn: "Alui",
    home: "Fondrege",
    culture: "Hada",
    about: "Sanandrösa",
    randomWord: "Li solohe",
    meaning: "Eluahania",
    type: "Ngawalö li",
    example: "Famaedo wehede",
    faq: "Famuli li",
    relatedWords: "Li solohe",
    noResults: "Lö hadöi li. Alui zui.",
    loading: "Ifa'anö kamus…",
    totalWords: "li",
    backHome: "Mangawuli ba mbörö",
    heroTitle: "Kamus Li Niha",
    heroSub: "Alui eluaha, ngawalö li, hada Niha — Indonesia ⇄ Niha.",
    pickLetter: "Alui moroi ba hurufo",
    indonesianLabel: "Indonesia",
    niasLabel: "Li Niha",
    copy: "Sura",
    copied: "No",
    share: "Be'e",
    listen: "Fondrongo",
    toggleLang: "Li",
    toggleTheme: "Mbörö",
    darkOn: "Mbörö ogömi",
    darkOff: "Mbörö haga",
  },
} as const;

type Strings = (typeof STRINGS)["id"];
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Strings };

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");
  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" &&
      localStorage.getItem("kn:lang")) as Lang | null;
    if (saved === "id" || saved === "ni") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("kn:lang", l);
    } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = l === "ni" ? "nia" : "id";
  };
  return (
    <I18nCtx.Provider value={{ lang, setLang, t: STRINGS[lang] as Strings }}>
      {children}
    </I18nCtx.Provider>
  );
}

export const useI18n = () => {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n must be inside I18nProvider");
  return c;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem("kn:theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
  }, []);
  return <>{children}</>;
}

export function toggleTheme() {
  const el = document.documentElement;
  const isDark = el.classList.toggle("dark");
  try {
    localStorage.setItem("kn:theme", isDark ? "dark" : "light");
  } catch {}
}
