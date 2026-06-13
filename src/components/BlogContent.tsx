import { Fragment, type ReactNode } from "react";

/**
 * Renderer markdown ringan untuk artikel blog dengan struktur SEO yang jelas:
 * - `## Judul`   → H2 (sub-judul utama, serif besar dengan garis bawah)
 * - `### Judul`  → H3 (sub-bagian, tebal)
 * - `#### Judul` → H4 (poin detail, kecil + warna aksen)
 * - `- item`     → bullet list
 * - `1. item`    → numbered list
 * - `| a | b |`  → tabel (baris pertama = header)
 * - `> kutipan`  → blockquote
 * - `**tebal**`, `*miring*`, `` `kode` `` → format inline
 */

function renderInline(text: string): ReactNode {
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      nodes.push(<strong key={i}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("`")) {
      nodes.push(
        <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(<em key={i}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

const isTableRow = (l: string) => /^\s*\|.*\|\s*$/.test(l);
const isTableSep = (l: string) => /^\s*\|[\s\-:|]+\|\s*$/.test(l);
const splitRow = (l: string) =>
  l
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

export function BlogContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Headings (H1 artikel adalah judul post — di konten mulai dari H2)
    const h = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (h) {
      const level = Math.max(h[1].length, 2);
      const text = h[2];
      if (level === 2) {
        blocks.push(
          <h2
            key={key++}
            className="mt-10 border-b border-border pb-2 font-serif text-2xl font-bold text-foreground md:text-[1.7rem]"
          >
            {renderInline(text)}
          </h2>,
        );
      } else if (level === 3) {
        blocks.push(
          <h3 key={key++} className="mt-7 text-lg font-bold text-foreground md:text-xl">
            {renderInline(text)}
          </h3>,
        );
      } else {
        blocks.push(
          <h4
            key={key++}
            className="mt-5 text-sm font-bold uppercase tracking-wide text-primary md:text-base"
          >
            {renderInline(text)}
          </h4>,
        );
      }
      i++;
      continue;
    }

    // Bullet list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="my-4 ml-6 list-disc space-y-1.5 marker:text-primary">
          {items.map((it, j) => (
            <li key={j} className="leading-relaxed">
              {renderInline(it)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Numbered list
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push(
        <ol
          key={key++}
          className="my-4 ml-6 list-decimal space-y-1.5 marker:font-semibold marker:text-primary"
        >
          {items.map((it, j) => (
            <li key={j} className="leading-relaxed">
              {renderInline(it)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Table
    if (isTableRow(trimmed)) {
      const rows: string[] = [];
      while (i < lines.length && isTableRow(lines[i].trim())) {
        rows.push(lines[i].trim());
        i++;
      }
      const header = splitRow(rows[0]);
      const body = rows
        .slice(1)
        .filter((r) => !isTableSep(r))
        .map(splitRow);
      blocks.push(
        <div key={key++} className="my-5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/70">
                {header.map((c, j) => (
                  <th key={j} className="border-b border-border px-3 py-2 text-left font-semibold">
                    {renderInline(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, r) => (
                <tr key={r} className="even:bg-muted/30">
                  {row.map((c, j) => (
                    <td
                      key={j}
                      className="border-b border-border px-3 py-2 align-top last:border-b-0"
                    >
                      {renderInline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      const parts: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        parts.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-5 border-l-4 border-primary bg-primary/5 px-4 py-3 italic text-foreground/85"
        >
          {parts.map((p, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {renderInline(p)}
            </Fragment>
          ))}
        </blockquote>,
      );
      continue;
    }

    // Paragraph (gabung baris berurutan sampai baris kosong / blok lain)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4})\s/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim()) &&
      !isTableRow(lines[i].trim()) &&
      !lines[i].trim().startsWith(">")
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push(
      <p key={key++} className="my-4 leading-relaxed">
        {renderInline(para.join(" "))}
      </p>,
    );
  }

  return (
    <div className="mt-6 max-w-none text-[0.95rem] text-foreground/90 md:text-base">{blocks}</div>
  );
}
