// Drives the Worker's /admin/images/sync endpoint until no products are pending.
// Usage:  ADMIN_TOKEN=... node scripts/images/sync.mjs [--base https://zyphix.in] [--kind produce|packaged] [--limit 20]
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1]] : []).filter(Boolean));
const base = (args.base ?? process.env.WORKER_URL ?? 'https://zyphix.in').replace(/\/$/, '');
const token = process.env.ADMIN_TOKEN;
if (!token) { console.error('ADMIN_TOKEN env var is required (same value as `wrangler secret put ADMIN_TOKEN`)'); process.exit(1); }

const headers = { authorization: `Bearer ${token}` };
const limit = args.limit ?? '20';
const kind = args.kind ? `&kind=${args.kind}` : '';

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
  if (data.processed === 0 || data.remaining === 0) break;
  await new Promise(r => setTimeout(r, 1500)); // be polite to Open Food Facts
}
console.log('done', totals);
const status = await fetch(`${base}/admin/images/status`, { headers }).then(r => r.json());
console.table(status);
