// Form + sign-in calls. Everything is served by the Zyphix Cloudflare Worker
// (the old Supabase edge functions are gone). Paths are kept for existing callers.
const WORKER_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';

const REWRITE: Record<string, string> = {
  '/api/send-email-otp': '/api/auth/send',
};

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${WORKER_BASE}${REWRITE[path] ?? path}`, { credentials: 'include', ...init });
}
