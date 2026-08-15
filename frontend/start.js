const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

const child = spawn('pnpm', ['--filter', '@workspace/zyphix', 'run', 'dev'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, BASE_PATH: process.env.BASE_PATH || '/' },
});

child.on('exit', (code) => process.exit(code || 0));
