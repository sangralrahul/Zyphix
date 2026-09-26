import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [tsConfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "artifacts/zyphix/src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 8080,
    host: "0.0.0.0",
  },
});