// Drives the Worker's /admin/images/sync endpoint until no products are pending.
// Usage:  ADMIN_TOKEN=... node scripts/images/sync.mjs [--base https://zyphix.in] [--kind produce|packaged] [--limit N] [--pause ms] [--reset not_found|failed]
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1]] : []).filter(Boolean));
const base = (args.base ?? process.env.WORKER_URL ?? 'https://zyphix.in').replace(/\/$/, '');
const token = process.env.ADMIN_TOKEN;
if (!token) { console.error('ADMIN_TOKEN env var is required (same value as `wrangler secret put ADMIN_TOKEN`)'); process.exit(1); }

const headers = { authorization: `Bearer ${token}` };
// Open Food Facts allows 10 search requests/minute. Produce (Workers AI) has no such limit.
const isProduce = args.kind === 'produce';
const limit = args.limit ?? (isProduce ? '20' : '8');
const pauseMs = Number(args.pause ?? (isProduce ? 1500 : 60000));
const kind = args.kind ? `&kind=${args.kind}` : '';

if (args.reset) { // --reset not_found  (or failed)
  const r = await fetch(`${base}/admin/images/reset?status=${args.reset}`, { method: 'POST', headers }).then(r => r.json());
  console.log(`reset ${r.reset} rows from ${args.reset} -> pending`);
}

let totals = { ready: 0, not_found: 0, failed: 0 };
for (let round = 1; ; round++) {
  const res = await fetch(`${base}/admin/images/sync?limit=${limit}${kind}`, { method: 'POST', headers });
  if (!res.ok) { console.error('sync failed', res.status, await res.text()); process.exit(1); }
  const data = await res.json();
  for (const r of data.report) {
    totals[r.status] = (totals[r.status] ?? 0) + 1;
    const extra = r.source ? ` (${r.source}${r.barcode ? ' ' + r.barcode : ''})` : r.error ? ` – ${r.error}` : '';
    console.log(`${r.status.padEnd(9)} ${r.product}${extra}`);
  }
  console.log(`-- round ${round}: ${data.processed} processed, ${data.remaining} unique products remaining`);
  if (data.remaining === 0) break;
  const limited = data.report.some(r => r.status === 'rate_limited');
  const wait = limited ? 120000 : pauseMs;
  console.log(`   waiting ${Math.round(wait / 1000)}s${limited ? ' (rate limited, backing off)' : ''}…`);
  await new Promise(r => setTimeout(r, wait));
}
console.log('done', totals);
const status = await fetch(`${base}/admin/images/status`, { headers }).then(r => r.json());
console.table(status);
