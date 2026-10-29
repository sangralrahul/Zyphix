import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { imgFallback } from "./data/media";
import { reloadOnce, reportClientError } from "@/components/AppErrorBoundary";
import { detectSite } from "@/lib/site";

document.documentElement.dataset.site = detectSite();

// Zyphix Now: fetch the catalogue while React is still booting (the HTML already
// preloaded it), so the first render of the store has products in it.
if (detectSite() === "now") import("@/lib/catalog").then(m => m.loadCatalog()).catch(() => {});

// Safety net: if any proxied /media image fails anywhere on the site, load it straight from Pexels.
window.addEventListener(
  "error",
  (e) => {
    const t = e.target as HTMLElement | null;
    if (t && t.tagName === "IMG" && (t.getAttribute("src") || "").startsWith("/media/")) {
      imgFallback({ currentTarget: t as HTMLImageElement });
    }
  },
  true,
);

createRoot(document.getElementById("root")!).render(<App />);

// Fade out the HTML boot screen (index.html) as soon as the real page has its headline on screen.
const boot = document.getElementById("zx-boot");
if (boot) {
  const root = document.getElementById("root")!;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    obs.disconnect();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      boot.classList.add("out");
      setTimeout(() => { boot.remove(); (window as any).__zxBootText = false; }, 400);
    }));
  };
  const obs = new MutationObserver(() => { if (root.querySelector("h1")) finish(); });
  obs.observe(root, { childList: true, subtree: true });
  if (root.querySelector("h1")) finish();
}

/* ── Image warm-up ─────────────────────────────────────────────────────────
   Native lazy-loading waits until an image is about to scroll into view, so fast scrolling
   (and the sideways galleries, whose cards move in via transforms) shows empty boxes.
   Once the first screen is done we quietly load every remaining image on the page, a few at a
   time at low priority, so by the time anyone scrolls to it, it is already there.
   Skipped for Data Saver / 2G users. */
function warmImages() {
  const conn = (navigator as any).connection;
  if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""))) return;
  const queue: HTMLImageElement[] = [];
  const seen = new WeakSet<HTMLImageElement>();
  let active = 0;
  const MAX = 4;
  // Only warm images within ~9 screens of where the visitor is (long product grids stay lazy further down).
  const near = (img: HTMLImageElement) => {
    const r = img.getBoundingClientRect();
    return r.top < innerHeight * 9 && r.bottom > -innerHeight * 4;
  };
  const pump = () => {
    let i = 0;
    while (active < MAX && i < queue.length) {
      const img = queue[i];
      if (!img.isConnected || img.complete) { queue.splice(i, 1); continue; }
      if (!near(img)) { i++; continue; }
      queue.splice(i, 1);
      active++;
      const done = () => { active--; pump(); };
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
      img.setAttribute("fetchpriority", "low");
      img.loading = "eager";
    }
  };
  let t = 0;
  window.addEventListener("scroll", () => { clearTimeout(t); t = window.setTimeout(pump, 150); }, { passive: true });
  const collect = (rootEl: ParentNode) => {
    rootEl.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach(img => {
      if (seen.has(img) || img.complete) return;
      seen.add(img);
      queue.push(img);
    });
    pump();
  };
  collect(document);
  new MutationObserver(muts => {
    for (const m of muts) m.addedNodes.forEach(n => { if (n.nodeType === 1) collect(n as Element); });
  }).observe(document.body, { childList: true, subtree: true });
}
const startWarm = () => {
  const idle = (window as any).requestIdleCallback || ((f: () => void) => setTimeout(f, 800));
  setTimeout(() => idle(warmImages, { timeout: 2500 }), 1200);
};
if (document.readyState === "complete") startWarm();
else window.addEventListener("load", startWarm, { once: true });

/* ── Instant return visits ─────────────────────────────────────────────────
   public/sw.js serves the page and its code from this device on the next visit.
   If a deploy removed a code chunk an old cached page still points at, drop the cached
   pages and reload once from the network. */
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  reloadOnce();
});
window.addEventListener("error", (e) => { if (e.error) reportClientError(e.message, e.error?.stack); });
window.addEventListener("unhandledrejection", (e) => { const r = e.reason as Error | undefined; if (r && /module|chunk/i.test(String(r.message))) reportClientError(String(r.message), r.stack); });
if ("serviceWorker" in navigator && /(^|\.)zyphix\.in$/.test(location.hostname)) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("/sw.js").catch(() => {}); }, { once: true });
}
