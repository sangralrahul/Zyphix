import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { imgFallback } from "./data/media";

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
      setTimeout(() => boot.remove(), 400);
    }));
  };
  const obs = new MutationObserver(() => { if (root.querySelector("h1")) finish(); });
  obs.observe(root, { childList: true, subtree: true });
  if (root.querySelector("h1")) finish();
}
