// Production build launcher for the Zyphix monorepo frontend.
// If a prebuilt static ./build already exists (shipped in the repo), this is a
// no-op so the cloud build step needs no pnpm/network. Otherwise it runs the
// Vite build for @workspace/zyphix and copies output into ./build.
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const dest = path.join(__dirname, "build");

if (fs.existsSync(path.join(dest, "index.html"))) {
  console.log("[build] Prebuilt static output found at " + dest + " — skipping build.");
  process.exit(0);
}

const root = path.resolve(__dirname, "..");
const env = {
  ...process.env,
  PORT: process.env.PORT || "3000",
  BASE_PATH: process.env.BASE_PATH || "/",
};
const run = (cmd) => {
  console.log("[build] $ " + cmd);
  execSync(cmd, { cwd: root, stdio: "inherit", env });
};

// Ensure pnpm is available (workspace uses catalog: refs that yarn can't resolve).
try {
  execSync("pnpm --version", { stdio: "ignore", env });
  console.log("[build] pnpm already available");
} catch (_) {
  try {
    run("corepack enable");
    run("corepack prepare pnpm@9 --activate");
    execSync("pnpm --version", { stdio: "ignore", env });
  } catch (e) {
    console.log("[build] corepack unavailable, installing pnpm via npm");
    run("npm install -g pnpm@9");
  }
}

run("pnpm install --no-frozen-lockfile");
run("pnpm --filter @workspace/zyphix run build");

const src = path.join(root, "artifacts", "zyphix", "dist", "public");
if (!fs.existsSync(src)) {
  throw new Error("Expected Vite build output at " + src + " but it was not found.");
}
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log("[build] Copied static build -> " + dest);
