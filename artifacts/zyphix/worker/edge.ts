/* ────────────────────────────────────────────────────────────────────────────
   Edge layer in front of every Zyphix host:
   - 301s: alias hosts (www., shop., food. …) → canonical host, http → https,
     duplicate paths on zyphix.in → their subdomain, trailing slashes dropped
   - per-host robots.txt, sitemap.xml and /.well-known/security.txt
   - HTML pages: unique <title>, meta description, canonical, Open Graph / Twitter
     tags, robots and JSON-LD (Organization, WebSite, BreadcrumbList) written into
     the HTML at the edge, so crawlers get them without running JavaScript
   - unknown paths answer with a real 404 status (the app still renders its 404 page)
   - security headers on every response
──────────────────────────────────────────────────────────────────────────── */
import { ORIGIN, HOST_ALIASES, siteForHost, pagesFor, resolvePage, redirectFor, pageJsonLd, OG_IMAGE, SITE_NAME, type SiteKey, type Page } from '../shared/seo';

type Inner = (request: Request) => Promise<Response>;
type AssetsEnv = { ASSETS: Fetcher };

const PRIVATE: SiteKey[] = ['auth', 'accounts', 'admin'];

export const SECURITY_HEADERS: Record<string, string> = {
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(self), microphone=(), geolocation=(self), payment=(self), usb=(), interest-cohort=()',
  'cross-origin-opener-policy': 'same-origin-allow-popups',
  // Safe baseline CSP: blocks plugins, <base> hijacking, framing by other sites and mixed content.
  'content-security-policy': "object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self' https://*.zyphix.in; upgrade-insecure-requests",
  'x-frame-options': 'SAMEORIGIN',
};

let LOCAL = false; // wrangler dev on a port: no https upgrades
function withHeaders(res: Response, extra: Record<string, string> = {}): Response {
  const h = new Headers(res.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) h.set(k, LOCAL && k === 'content-security-policy' ? v.replace('; upgrade-insecure-requests', '') : v);
  for (const [k, v] of Object.entries(extra)) h.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

const redirect = (to: string, status = 301) => new Response(null, { status, headers: { location: to, 'cache-control': 'public, max-age=3600', ...SECURITY_HEADERS } });
const text = (body: string, type: string, maxAge = 3600) => new Response(body, { headers: { 'content-type': `${type}; charset=utf-8`, 'cache-control': `public, max-age=${maxAge}`, ...SECURITY_HEADERS } });

function robots(site: SiteKey): string {
  if (PRIVATE.includes(site)) return 'User-agent: *\nDisallow: /\n';
  const extra = site === 'main' ? ['/admin', '/partner-dashboard', '/wallet', '/wishlist', '/notifications', '/cart', '/checkout', '/order/'] : site === 'now' ? ['/cart', '/checkout', '/order/', '/wallet', '/wishlist', '/notifications'] : [];
  const maps = site === 'main' ? (['main', 'now', 'eats', 'book', 'partner', 'advertise', 'support'] as SiteKey[]).map(s => `Sitemap: ${ORIGIN[s]}/sitemap.xml`) : [`Sitemap: ${ORIGIN[site]}/sitemap.xml`];
  return ['User-agent: *', 'Allow: /', 'Disallow: /api/', ...extra.map(p => `Disallow: ${p}`), '', ...maps, ''].join('\n');
}

function sitemap(site: SiteKey): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pagesFor(site).filter(p => !p.noindex).map(p =>
    `  <url><loc>${ORIGIN[site]}${p.path === '/' ? '/' : p.path}</loc><lastmod>${p.lastmod ?? today}</lastmod>${p.changefreq ? `<changefreq>${p.changefreq}</changefreq>` : ''}${p.priority != null ? `<priority>${p.priority.toFixed(1)}</priority>` : ''}</url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

/** zyphix.in/sitemap.xml also links every subdomain's sitemap (a sitemap index is a separate file). */
function sitemapIndex(): string {
  const sites: SiteKey[] = ['main', 'now', 'eats', 'book', 'partner', 'advertise', 'support'];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sites.map(s => `  <sitemap><loc>${ORIGIN[s]}/sitemap.xml</loc></sitemap>`).join('\n')}\n</sitemapindex>\n`;
}

const SECURITY_TXT = `Contact: mailto:security@zyphix.in
Contact: mailto:support@zyphix.in
Expires: ${new Date(Date.now() + 300 * 86400_000).toISOString().slice(0, 10)}T00:00:00.000Z
Preferred-Languages: en, hi
Canonical: https://zyphix.in/.well-known/security.txt
Policy: https://zyphix.in/privacy
`;

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

class SetAttr { constructor(private name: string, private value: string) {} element(el: Element) { el.setAttribute(this.name, this.value); } }
class SetText { constructor(private value: string) {} element(el: Element) { el.setInnerContent(this.value); } }
class Remove { element(el: Element) { el.remove(); } }
class HeadAppend { constructor(private html: string) {} element(el: Element) { el.append(this.html, { html: true }); } }

function seoHtml(res: Response, site: SiteKey, page: Page | null, url: URL, status: number): Response {
  const origin = ORIGIN[site];
  const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : '/';
  const canonical = `${origin}${path === '/' ? '/' : path}`;
  const title = page?.title ?? `Page not found · ${SITE_NAME[site]}`;
  const description = page?.description ?? 'The page you were looking for does not exist or has moved.';
  const noindex = !page || page.noindex || PRIVATE.includes(site);
  const og = `${ORIGIN.main}${OG_IMAGE[site]}`;
  const ld = page ? pageJsonLd(site, page) : [];
  const head = [
    noindex ? '<meta name="robots" content="noindex, nofollow" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />',
    `<meta property="og:site_name" content="${attr(SITE_NAME[site])}" />`,
    ...ld.map(o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`),
  ].join('\n    ');
  const h = new Headers(res.headers);
  h.set('content-type', 'text/html; charset=utf-8');
  h.set('cache-control', 'public, max-age=0, must-revalidate');
  if (noindex) h.set('x-robots-tag', 'noindex, nofollow');
  const rewritten = new HTMLRewriter()
    .on('title', new SetText(title))
    .on('meta[name="description"]', new SetAttr('content', description))
    .on('link[rel="canonical"]', new SetAttr('href', canonical))
    .on('meta[property="og:title"]', new SetAttr('content', title))
    .on('meta[property="og:description"]', new SetAttr('content', description))
    .on('meta[property="og:url"]', new SetAttr('content', canonical))
    .on('meta[property="og:image"]', new SetAttr('content', og))
    .on('meta[property="og:image:width"]', new SetAttr('content', '1200'))
    .on('meta[property="og:image:height"]', new SetAttr('content', '630'))
    .on('meta[name="twitter:title"]', new SetAttr('content', title))
    .on('meta[name="twitter:description"]', new SetAttr('content', description))
    .on('meta[name="twitter:image"]', new SetAttr('content', og))
    .on('meta[name="robots"]', new Remove())
    .on('head', new HeadAppend(head))
    .transform(new Response(res.body, { status, headers: h }));
  return withHeaders(rewritten);
}

const isPageRequest = (req: Request, path: string) =>
  (req.method === 'GET' || req.method === 'HEAD') && !/\.[a-z0-9]{2,5}$/i.test(path)
  && !path.startsWith('/api/') && !path.startsWith('/img/') && !path.startsWith('/media/') && !path.startsWith('/mobile')
  && !(path.startsWith('/admin/') && path !== '/admin/' );

export async function edge(request: Request, env: AssetsEnv, inner: Inner): Promise<Response> {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const isProd = host === 'zyphix.in' || host.endsWith('.zyphix.in');
  LOCAL = !!url.port;

  if (isProd) {
    const alias = HOST_ALIASES[host];
    if (alias) return redirect(`${ORIGIN[alias]}${url.pathname}${url.search}`);
    if (url.protocol === 'http:' && !url.port) return redirect(`https://${host}${url.pathname}${url.search}`);
  }
  // local dev / previews: ?site= or a mapped host; default to main
  const site: SiteKey = siteForHost(host) ?? ((url.searchParams.get('site') as SiteKey) || 'main');
  const path = url.pathname;

  if (path === '/robots.txt') return text(robots(site), 'text/plain');
  if (path === '/sitemap.xml') return text(sitemap(site), 'application/xml');
  if (path === '/sitemap-index.xml' && site === 'main') return text(sitemapIndex(), 'application/xml');
  if (path === '/.well-known/security.txt' || path === '/security.txt') return text(SECURITY_TXT, 'text/plain', 86400);

  if (isPageRequest(request, path)) {
    const to = redirectFor(site, path, url.search);
    if (to) return redirect(to.startsWith('http') ? to : `${url.origin}${to}`);
    // the SPA handles every page; the worker only decides status + tags
    const { page, found } = resolvePage(site, path);
    const shell = await env.ASSETS.fetch(new Request(new URL('/', url).toString(), { headers: request.headers }));
    if (!shell.ok) return withHeaders(shell);
    return seoHtml(shell, site, page, url, found ? 200 : 404);
  }

  return withHeaders(await inner(request));
}
