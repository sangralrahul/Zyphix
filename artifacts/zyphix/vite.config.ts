import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { copyFile, mkdir } from "node:fs/promises";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT || "5173";

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

const directRoutes = [
  "launch", "light", "terms", "service-setup", "advertise", "delivery", "restaurant", "services", "store", "about", "contact", "blog", "investors",
  "merchant-setup", "delivery-setup", "restaurant-setup", "now", "wallet",
  "wishlist", "notifications", "partner-dashboard", "eats", "book",
  "offers", "kirana-map", "partner", "app", "account",
];

function directRouteEntries() {
  return {
    name: "direct-route-entries",
    apply: "build" as const,
    async closeBundle() {
      const outputDirectory = path.resolve(import.meta.dirname, "dist/public");
      const appEntry = path.join(outputDirectory, "index.html");

      await Promise.all(directRoutes.map(async (route) => {
        const routeDirectory = path.join(outputDirectory, route);
        await mkdir(routeDirectory, { recursive: true });
        await copyFile(appEntry, path.join(routeDirectory, "index.html"));
      }));
    },
  };
}


/**
 * Each subdomain renders one lazily-loaded page. Without help the browser only discovers that chunk
 * after the main bundle has downloaded and run — a second round trip on every first visit.
 * This injects a tiny inline script that modulepreloads the right page chunk (and its imports)
 * for the current hostname, so both download in parallel.
 */
const SITE_PAGES: Record<string, string> = {
  now: "src/pages/ZyphixNow.tsx", eats: "src/pages/ZyphixEats.tsx", book: "src/pages/ZyphixBook.tsx",
  partner: "src/sites/PartnerSite.tsx", advertise: "src/sites/AdvertiseSite.tsx",
  auth: "src/sites/AuthSite.tsx", accounts: "src/sites/AccountsSite.tsx", support: "src/sites/SupportSite.tsx",
  main: "src/pages/Landing.tsx", zyphix: "src/pages/Landing.tsx", www: "src/pages/Landing.tsx",
};
function sitePreload() {
  return {
    name: "site-chunk-preload",
    apply: "build" as const,
    transformIndexHtml: {
      order: "post" as const,
      handler(html: string, ctx: any) {
        const bundle = ctx.bundle;
        if (!bundle || !html.includes('id="root"')) return html;
        const chunks = Object.values(bundle).filter((c: any) => c.type === "chunk") as any[];
        const entry = chunks.find(c => c.isEntry && c.name === "main");
        const already = new Set<string>(entry ? [entry.fileName, ...entry.imports] : []);
        const map: Record<string, string[]> = {};
        for (const [site, file] of Object.entries(SITE_PAGES)) {
          const abs = path.resolve(import.meta.dirname, file);
          const chunk = chunks.find(c => c.facadeModuleId === abs);
          if (!chunk) continue;
          const files = new Set<string>();
          const walk = (c: any) => { if (already.has(c.fileName) || files.has(c.fileName)) return; files.add(c.fileName); for (const i of c.imports) { const d = bundle[i]; if (d) walk(d); } };
          walk(chunk);
          map[site] = [...files];
        }
        const script = `<script>(function(M){var h=location.hostname.toLowerCase(),q=new URLSearchParams(location.search).get('site'),A={account:'accounts',help:'support',partners:'partner',ads:'advertise',shop:'now',food:'eats',services:'book'},s=q||h.split('.')[0];s=A[s]||s;(M[s]||[]).forEach(function(f){var l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href='${basePath}'+f;document.head.appendChild(l);});})(${JSON.stringify(map)});</script>`;
        return html.replace("</head>", `    ${script}\n  </head>`);
      },
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    directRouteEntries(),
    sitePreload(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  // Load VITE_* env vars from the repo root .env (Supabase URL/key live there)
  envDir: path.resolve(import.meta.dirname, "..", ".."),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "index.html"),
        privacy: path.resolve(import.meta.dirname, "privacy/index.html"),
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
