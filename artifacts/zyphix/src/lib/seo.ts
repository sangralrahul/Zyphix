import { useEffect } from 'react';

/** Sets title, description, canonical and Open Graph tags for the current page. */
export function setSeo({ title, description, path }: { title: string; description?: string; path?: string }) {
  if (typeof document === 'undefined') return;
  document.title = title;
  const url = location.origin.replace(/^http:/, 'https:').replace(/:\d+$/, '') + (path ?? location.pathname);
  const set = (sel: string, attr: string, value: string, make: () => HTMLElement) => {
    let el = document.head.querySelector(sel) as HTMLElement | null;
    if (!el) { el = make(); document.head.appendChild(el); }
    el.setAttribute(attr, value);
  };
  const meta = (key: string, prop = false) => () => { const m = document.createElement('meta'); m.setAttribute(prop ? 'property' : 'name', key); return m; };
  if (description) {
    set('meta[name="description"]', 'content', description, meta('description'));
    set('meta[property="og:description"]', 'content', description, meta('og:description', true));
    set('meta[name="twitter:description"]', 'content', description, meta('twitter:description'));
  }
  set('meta[property="og:title"]', 'content', title, meta('og:title', true));
  set('meta[name="twitter:title"]', 'content', title, meta('twitter:title'));
  set('meta[property="og:url"]', 'content', url, meta('og:url', true));
  set('link[rel="canonical"]', 'href', url, () => { const l = document.createElement('link'); l.rel = 'canonical'; return l; });
}

export function useSeo(title: string, description?: string, path?: string) {
  useEffect(() => { setSeo({ title, description, path }); }, [title, description, path]);
}

/** Marks the current page "noindex" while it is mounted (404s, private pages). */
export function useNoIndex() {
  useEffect(() => {
    const m = document.createElement('meta');
    m.name = 'robots'; m.content = 'noindex, follow';
    document.head.appendChild(m);
    return () => { m.remove(); };
  }, []);
}

export function useNoIndexIf(on: boolean) {
  useEffect(() => {
    if (!on) return;
    const m = document.createElement('meta');
    m.name = 'robots'; m.content = 'noindex, follow';
    document.head.appendChild(m);
    return () => { m.remove(); };
  }, [on]);
}
