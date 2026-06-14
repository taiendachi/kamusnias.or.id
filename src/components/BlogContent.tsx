import Markdown, { Components } from "react-markdown";

export function BlogContent({ content }: { content: string }) {
  const components: Components = {
    img: ({ node, ...props }) => <img {...props} loading="lazy" className="rounded-xl w-full h-auto my-6" />,
    a: ({ node, ...props }) => <a {...props} className="text-primary hover:underline hover:text-primary/80" />,
    h2: ({ node, ...props }) => <h2 {...props} className="mt-10 border-b border-border pb-2 font-serif text-2xl font-bold text-foreground md:text-[1.7rem]" />,
    h3: ({ node, ...props }) => <h3 {...props} className="mt-7 text-lg font-bold text-foreground md:text-xl" />,
    h4: ({ node, ...props }) => <h4 {...props} className="mt-5 text-sm font-bold uppercase tracking-wide text-primary md:text-base" />,
    p: ({ node, ...props }) => <p {...props} className="my-4 leading-relaxed" />,
    ul: ({ node, ...props }) => <ul {...props} className="my-4 ml-6 list-disc space-y-1.5 marker:text-primary" />,
    ol: ({ node, ...props }) => <ol {...props} className="my-4 ml-6 list-decimal space-y-1.5 marker:font-semibold marker:text-primary" />,
    li: ({ node, ...props }) => <li {...props} className="leading-relaxed" />,
    blockquote: ({ node, ...props }) => <blockquote {...props} className="my-5 border-l-4 border-primary bg-primary/5 px-4 py-3 italic text-foreground/85" />,
    table: ({ node, ...props }) => (
      <div className="my-5 overflow-x-auto rounded-lg border border-border">
        <table {...props} className="w-full border-collapse text-sm" />
      </div>
    ),
    th: ({ node, ...props }) => <th {...props} className="border-b border-border px-3 py-2 text-left font-semibold bg-muted/70" />,
    td: ({ node, ...props }) => <td {...props} className="border-b border-border px-3 py-2 align-top last:border-b-0" />,
    code: ({ node, ...props }) => <code {...props} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" />,
  };

  return (
    <div className="mt-6 max-w-none text-[0.95rem] text-foreground/90 md:text-base">
      <Markdown components={components}>{content}</Markdown>
    </div>
  );
}
