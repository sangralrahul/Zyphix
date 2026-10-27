/* Keeps <title>, description, canonical, og:url and robots in sync with the
   shared page map (shared/seo.ts) during client-side navigation. The Worker
   writes the same tags into the first HTML response. */
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { detectSite } from '@/lib/site';

function setMeta(sel: string, attr: string, value: string) {
  const el = document.head.querySelector(sel);
  if (el) el.setAttribute(attr, value);
}

export function useSeoSync() {
  const [location] = useLocation();
  useEffect(() => {
    let cancelled = false;
    import('../../shared/seo').then(({ resolvePage, ORIGIN }) => {
      if (cancelled) return;
      const site = detectSite();
      const path = window.location.pathname.length > 1 ? window.location.pathname.replace(/\/+$/, '') : '/';
      const { page } = resolvePage(site, path);
      const prod = /(^|\.)zyphix\.in$/.test(window.location.hostname);
      const canonical = `${prod ? ORIGIN[site] : window.location.origin}${path === '/' ? '/' : path}`;
      setMeta('link[rel="canonical"]', 'href', canonical);
      setMeta('meta[property="og:url"]', 'content', canonical);
      if (!page) return;
      // dynamic pages (products, orders) set their own titles
      const dynamic = /\/(product|order)\//.test(path);
      if (!dynamic) {
        document.title = page.title;
        setMeta('meta[property="og:title"]', 'content', page.title);
      }
      setMeta('meta[name="description"]', 'content', page.description);
      setMeta('meta[property="og:description"]', 'content', page.description);
      let robots = document.head.querySelector('meta[name="robots"]');
      if (!robots) { robots = document.createElement('meta'); robots.setAttribute('name', 'robots'); document.head.appendChild(robots); }
      robots.setAttribute('content', page.noindex || ['auth', 'accounts', 'admin'].includes(site) ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    }).catch(() => { /* non-critical */ });
    return () => { cancelled = true; };
  }, [location]);
}
