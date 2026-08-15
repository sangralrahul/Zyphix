// Runtime launcher.
// - Production: if ./build exists (created by build.js), serve it as a static
//   SPA using only Node built-ins (no runtime dependencies, no pnpm needed).
// - Preview/dev: otherwise, spawn the Vite dev server with HMR.
const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "build");
const indexHtml = path.join(buildDir, "index.html");

if (fs.existsSync(indexHtml)) {
  serveStatic();
} else {
  runDev();
}

function runDev() {
  const { spawn } = require("child_process");
  const root = path.resolve(__dirname, "..");
  const child = spawn("pnpm", ["--filter", "@workspace/zyphix", "run", "dev"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, BASE_PATH: process.env.BASE_PATH || "/" },
  });
  child.on("exit", (code) => process.exit(code || 0));
}

function serveStatic() {
  const http = require("http");
  const port = Number(process.env.PORT) || 3000;
  const TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webmanifest": "application/manifest+json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".txt": "text/plain; charset=utf-8",
    ".map": "application/json",
  };

  const server = http.createServer((req, res) => {
    try {
      let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      if (urlPath.endsWith("/")) urlPath += "index.html";
      let filePath = path.join(buildDir, urlPath);

      // Prevent path traversal outside the build directory.
      if (!filePath.startsWith(buildDir)) {
        res.writeHead(403);
        return res.end("Forbidden");
      }

      // SPA fallback for client-side routes.
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = indexHtml;
      }

      const ext = path.extname(filePath).toLowerCase();
      const headers = { "Content-Type": TYPES[ext] || "application/octet-stream" };
      if (filePath.includes(path.sep + "assets" + path.sep)) {
        headers["Cache-Control"] = "public, max-age=31536000, immutable";
      }
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    } catch (e) {
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  });

  server.listen(port, "0.0.0.0", () => {
    console.log("[start] Serving static Zyphix build on http://0.0.0.0:" + port);
  });
}
