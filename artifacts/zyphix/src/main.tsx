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
