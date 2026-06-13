import { csvUrl } from "./site-config";

export interface Entry {
  id: string;
  slug: string;
  indo: string;
  nias: string;
  jenis: string; // jenis kata (kk, kb, ks, etc.)
}

const JENIS_LABEL: Record<string, string> = {
  kk: "Kata Kerja",
  kb: "Kata Benda",
  ks: "Kata Sifat",
  kt: "Kata Tugas",
  ktw: "Kata Tunjuk/Tanya",
  kwt: "Kata Bilangan",
  kp: "Kata Penghubung",
  ki: "Kata Imbuhan",
};

export const jenisLabel = (j: string) => {
  if (!j) return "";
  const key = j.replace(/[.\s]/g, "").toLowerCase();
  return JENIS_LABEL[key] ?? j.replace(/\.$/, "").toUpperCase();
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’"`]/g, "")
    .replace(/[()/]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Minimal CSV parser handling quoted fields with commas/newlines.
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c === "\r") {
        /* skip */
      } else field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export async function fetchDictionary(): Promise<Entry[]> {
  const res = await fetch(csvUrl(), { cache: "force-cache" });
  if (!res.ok) throw new Error("Gagal memuat data kamus");
  const text = await res.text();
  const rows = parseCSV(text);
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idxIndo = header.findIndex((h) => h.includes("indonesia") || h === "kata");
  const idxNias = header.findIndex((h) => h.includes("nias"));
  const idxJenis = header.findIndex((h) => h.includes("jenis"));

  const seen = new Map<string, number>();
  const entries: Entry[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const indo = (r[idxIndo] ?? "").trim();
    const nias = (r[idxNias] ?? "").trim();
    const jenis = (idxJenis >= 0 ? r[idxJenis] : "")?.trim() ?? "";
    if (!indo || !nias) continue; // skip alphabet headers / empty
    let slug = slugify(indo);
    if (!slug) continue;
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count + 1}`;
    entries.push({ id: String(i), slug, indo, nias, jenis });
  }
  return entries;
}

export function searchEntries(entries: Entry[], q: string, limit = 50): Entry[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const exact: Entry[] = [];
  const starts: Entry[] = [];
  const contains: Entry[] = [];
  for (const e of entries) {
    const indo = e.indo.toLowerCase();
    const nias = e.nias.toLowerCase();
    if (indo === query || nias === query) exact.push(e);
    else if (indo.startsWith(query) || nias.startsWith(query)) starts.push(e);
    else if (indo.includes(query) || nias.includes(query)) contains.push(e);
    if (exact.length + starts.length + contains.length >= limit * 3) break;
  }
  return [...exact, ...starts, ...contains].slice(0, limit);
}
