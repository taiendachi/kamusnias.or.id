import { Link } from "@tanstack/react-router";
import { BLOG_POSTS } from "@/lib/blog";

export function BlogSidebar() {
  const latestPosts = BLOG_POSTS.slice(0, 5);

  return (
    <aside className="space-y-8 w-full">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-serif text-lg font-bold">Artikel Terbaru</h3>
        <ul className="mt-4 space-y-4">
          {latestPosts.map((post) => (
            <li key={post.slug}>
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="group">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <time className="text-[10px] text-muted-foreground uppercase tracking-wider block mt-1">
                  {new Date(post.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
