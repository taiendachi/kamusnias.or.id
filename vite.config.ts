// ... existing code ...
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Tambahkan blok plugins kosong ini agar bot Cloudflare (Wrangler) bisa membacanya
  // dan menyuntikkan adapternya tanpa merusak konfigurasi bawaan dari Lovable.
  plugins: [],
  vite: {
    plugins: [],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
