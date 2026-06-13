import { Facebook, Instagram, Linkedin } from "lucide-react";

const SOCIALS = [
  {
    name: "Facebook",
    url: "https://web.facebook.com/kamusnias",
    icon: Facebook,
    color: "hover:bg-[#1877F2]",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/kamusniasorid",
    icon: Instagram,
    color: "hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]",
  },
  { name: "X (Twitter)", url: "https://x.com/kamusniascom", icon: XIcon, color: "hover:bg-black" },
  {
    name: "Pinterest",
    url: "https://id.pinterest.com/kamusnias",
    icon: PinterestIcon,
    color: "hover:bg-[#E60023]",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/kamusnias/",
    icon: Linkedin,
    color: "hover:bg-[#0A66C2]",
  },
] as const;

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function PinterestIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 0a12 12 0 0 0-4.373 23.178c-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.137.893 2.739.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146A12 12 0 1 0 12 0z" />
    </svg>
  );
}

export function SocialFollow() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 text-center">
      <h2 className="font-serif text-2xl font-bold">Ikuti Kami di Media Sosial</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Dapatkan pembaruan kosakata dan artikel terbaru tentang Bahasa & Budaya Nias.
      </p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {SOCIALS.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.name}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ikuti ${s.name}`}
                title={s.name}
                className={`group grid h-12 w-12 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:scale-110 hover:text-white hover:shadow-md ${s.color}`}
              >
                <Icon className="h-5 w-5 transition group-hover:scale-110" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
