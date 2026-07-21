// Thin fetch wrapper that routes /api/* calls to Supabase Edge Functions.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const ROUTE_MAP: Record<string, { fn: string; extra?: Record<string, unknown> }> = {
  "/api/notify": { fn: "notify" },
  "/api/send-email-otp": { fn: "email-otp", extra: { action: "send" } },
  "/api/verify-email-otp": { fn: "email-otp", extra: { action: "verify" } },
  "/api/partner-register": { fn: "partner-register" },
};

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const mapping = ROUTE_MAP[path];
  if (!mapping) return fetch(path, init);

  let body: unknown = {};
  if (init?.body) {
    try { body = JSON.parse(init.body as string); } catch { body = {}; }
  }
  const merged = { ...(body as Record<string, unknown>), ...(mapping.extra ?? {}) };

  return fetch(`${SUPABASE_URL}/functions/v1/${mapping.fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(merged),
  });
}
