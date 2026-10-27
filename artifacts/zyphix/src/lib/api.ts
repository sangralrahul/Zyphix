// Thin fetch wrapper that routes /api/* calls to Supabase Edge Functions.
// Fallbacks keep email (Brevo) flows working even if build-time env vars are missing.
const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  "https://awbccdtdszdxcxnsossy.supabase.co";
const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  "sb_publishable_YE-BT6c07paKhTvlCiItZw_Mm2k6z5A";

const ROUTE_MAP: Record<string, { fn: string; extra?: Record<string, unknown> }> = {
  "/api/notify": { fn: "notify" },
  "/api/send-email-otp": { fn: "email-otp", extra: { action: "send" } },
  "/api/verify-email-otp": { fn: "email-otp", extra: { action: "verify" } },
  "/api/partner-register": { fn: "partner-register" },
};

const WORKER_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';

/**
 * Partner registrations go to two places: the Worker's partner directory (so the
 * store / restaurant / professional / rider appears on now.|eats.|book.|partner.zyphix.in
 * immediately) and the Brevo email function (owner notification + confirmation).
 * The directory write is awaited but never blocks the email flow.
 */
async function mirrorToDirectory(init?: RequestInit): Promise<boolean> {
  try {
    const r = await fetch(`${WORKER_BASE}/api/partners`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: init?.body ?? '{}' });
    return r.ok;
  } catch { return false; }
}

const SAVED = () => new Response(JSON.stringify({ success: true, via: 'directory' }), { status: 200, headers: { 'content-type': 'application/json' } });

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const mapping = ROUTE_MAP[path];
  if (!mapping) return fetch(path, init);
  const isRegister = path === '/api/partner-register';
  const dirOk = isRegister ? await mirrorToDirectory(init) : false;

  let body: unknown = {};
  if (init?.body) {
    try { body = JSON.parse(init.body as string); } catch { body = {}; }
  }
  const merged = { ...(body as Record<string, unknown>), ...(mapping.extra ?? {}) };

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${mapping.fn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(merged),
    });
    // A registration is safe once either store has it (directory or email function).
    if (isRegister && !res.ok && dirOk) return SAVED();
    return res;
  } catch (e) {
    if (isRegister && dirOk) return SAVED();
    throw e;
  }
}
