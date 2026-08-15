// Production build launcher for the Zyphix monorepo frontend.
// Runs the Vite build for @workspace/zyphix (pnpm workspace) and copies the
// static output into ./build so the runtime can serve it dependency-free.
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

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
const dest = path.join(__dirname, "build");
if (!fs.existsSync(src)) {
  throw new Error("Expected Vite build output at " + src + " but it was not found.");
}
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log("[build] Copied static build -> " + dest);
