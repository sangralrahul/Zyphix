import React from 'react';

/* Catches render errors and failed lazy-chunk loads anywhere in the app.
   - A chunk that fails to load right after a deploy → one automatic reload.
   - Anything else → a friendly "Something went wrong" screen instead of a blank page,
     and the error is reported to /api/client-error so it can be fixed.            */

const CHUNK = /dynamically imported module|Importing a module script failed|Failed to fetch|error loading dynamically|ChunkLoadError|Unable to preload CSS/i;

export function reportClientError(message: string, stack?: string) {
  try {
    const body = JSON.stringify({ message: String(message).slice(0, 500), stack: String(stack || '').slice(0, 2000), url: location.href, ua: navigator.userAgent });
    if (navigator.sendBeacon) navigator.sendBeacon('/api/client-error', new Blob([body], { type: 'application/json' }));
    else fetch('/api/client-error', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch { /* ignore */ }
}

/** Reload at most once every 30 s (so a stale page recovers, but we never loop). */
export function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem('zx-reload-at') || 0);
    if (Date.now() - last < 30_000) return false;
    sessionStorage.setItem('zx-reload-at', String(Date.now()));
  } catch { /* ignore */ }
  const go = () => location.reload();
  if ('caches' in window) caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('zx-html')).map(k => caches.delete(k)))).then(go, go); else go();
  return true;
}

export class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) {
    if (CHUNK.test(error?.message || '') && reloadOnce()) return;
    reportClientError(error?.message || String(error), error?.stack);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F7F9', fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif", padding: 24 }}>
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#0DA366', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>//</div>
          <h1 style={{ margin: '18px 0 6px', fontSize: 24, letterSpacing: '-0.03em', color: '#0B0F12' }}>Something went wrong</h1>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: '#6B7280' }}>This page didn't load properly. Reloading usually fixes it.</p>
          <button onClick={() => { try { sessionStorage.removeItem('zx-reload-at'); } catch { /* ignore */ } reloadOnce() || location.reload(); }}
            style={{ marginTop: 20, height: 46, padding: '0 22px', borderRadius: 999, border: 0, background: '#0B0F12', color: '#fff', fontSize: 14.5, fontWeight: 600, cursor: 'pointer' }}>Reload page</button>
          <p style={{ marginTop: 14, fontSize: 12, color: '#9CA3AF', wordBreak: 'break-word' }}>{this.state.error.message}</p>
        </div>
      </div>
    );
  }
}
