// Cross-platform production build for Cloudflare (replaces `BASE_PATH=/ PORT=8080 vite build`).
import { spawnSync } from 'node:child_process';
const env = { ...process.env, BASE_PATH: '/', PORT: '8080', NODE_ENV: 'production' };
const r = spawnSync('pnpm', ['exec', 'vite', 'build', '--config', 'vite.config.ts'], { stdio: 'inherit', env, shell: true });
process.exit(r.status ?? 1);
