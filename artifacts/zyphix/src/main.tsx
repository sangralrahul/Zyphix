import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if (window.location.hostname.endsWith('.replit.app')) {
  window.location.replace(
    'https://www.zyphix.in' + window.location.pathname + window.location.search + window.location.hash
  );
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
