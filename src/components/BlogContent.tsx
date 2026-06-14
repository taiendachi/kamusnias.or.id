// ... existing code ...
    blockquote: ({ node, ...props }) => <blockquote {...props} className="my-5 border-l-4 border-primary bg-primary/5 px-4 py-3 italic text-foreground/85 break-words" />,
    table: ({ node, ...props }) => (
      <div className="w-full overflow-x-auto my-6">
        <table {...props} className="w-full border-collapse border border-border text-sm" />
      </div>
    ),
    th: ({ node, ...props }) => <th {...props} className="border border-border bg-muted/70 px-4 py-3 font-semibold text-foreground text-center first:w-[5%] first:min-w-[50px]" />,
    td: ({ node, ...props }) => <td {...props} className="border border-border px-4 py-3 align-top first:text-center text-foreground/90" />,
    code: ({ node, ...props }) => <code {...props} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] break-all" />,
  };

  return (
// ... existing code ...
