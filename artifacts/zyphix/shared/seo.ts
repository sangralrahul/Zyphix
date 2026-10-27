/* ────────────────────────────────────────────────────────────────────────────
   One page map for every Zyphix host. Used by:
   - the Worker: per-page <title>, meta description, canonical, Open Graph, JSON-LD
     (rendered into the HTML before it leaves the edge), sitemaps, robots.txt,
     301 redirects and real 404 status codes;
   - the browser: keeps the same tags in sync during client-side navigation.
   Plain TypeScript, no React or DOM imports.
──────────────────────────────────────────────────────────────────────────── */
import { ARTICLES, TOPICS } from '../src/sites/support/articles';

export type SiteKey = 'main' | 'now' | 'eats' | 'book' | 'partner' | 'advertise' | 'support' | 'auth' | 'accounts' | 'admin';

export const ORIGIN: Record<SiteKey, string> = {
  main: 'https://zyphix.in', now: 'https://now.zyphix.in', eats: 'https://eats.zyphix.in', book: 'https://book.zyphix.in',
  partner: 'https://partner.zyphix.in', advertise: 'https://advertise.zyphix.in', support: 'https://support.zyphix.in',
  auth: 'https://auth.zyphix.in', accounts: 'https://accounts.zyphix.in', admin: 'https://admin.zyphix.in',
};

/** Old / alternate hostnames → their one canonical host (served as 301s by the Worker). */
export const HOST_ALIASES: Record<string, SiteKey> = {
  'www.zyphix.in': 'main', 'shop.zyphix.in': 'now', 'food.zyphix.in': 'eats', 'services.zyphix.in': 'book',
  'partners.zyphix.in': 'partner', 'ads.zyphix.in': 'advertise', 'help.zyphix.in': 'support', 'account.zyphix.in': 'accounts',
};

export function siteForHost(host: string): SiteKey | null {
  const h = host.toLowerCase();
  if (h === 'zyphix.in') return 'main';
  for (const [k, v] of Object.entries(ORIGIN)) if (new URL(v).hostname === h) return k as SiteKey;
  return null;
}

export const SITE_NAME: Record<SiteKey, string> = {
  main: 'Zyphix', now: 'Zyphix Now', eats: 'Zyphix Eats', book: 'Zyphix Book', partner: 'Zyphix Partners',
  advertise: 'Zyphix Advertise', support: 'Zyphix Support', auth: 'Zyphix', accounts: 'Zyphix', admin: 'Zyphix',
};

export type Page = {
  path: string;
  title: string;
  description: string;
  /** Excluded from sitemaps and marked noindex. */
  noindex?: boolean;
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
  /** Breadcrumb trail after the site home, e.g. [['Help', '/'], ['Refunds', '/refunds']]. */
  crumbs?: [string, string][];
  lastmod?: string;
};

const P = (path: string, title: string, description: string, extra: Partial<Page> = {}): Page => ({ path, title, description, ...extra });
const NOINDEX = { noindex: true } as const;

const DESC = {
  main: 'Zyphix is the SuperLocal app: groceries in minutes, food from local kitchens and verified home services, from the businesses already in your neighbourhood.',
  now: 'Fresh produce, dairy, snacks and daily staples from stores near you, delivered in about 30 minutes at shelf prices.',
  eats: 'Restaurants, cafés, dhabas and home kitchens near you, cooked to order at menu prices and tracked to your door.',
  book: 'Plumbers, electricians, cleaners and more from your neighbourhood. ID-verified pros, price shown before you confirm.',
};

const STATIC: Record<SiteKey, Page[]> = {
  main: [
    P('/', 'Zyphix — The SuperLocal App for groceries, food and home services', DESC.main, { changefreq: 'weekly', priority: 1 }),
    P('/about', 'About Zyphix', 'Why we are building Zyphix: one app that connects you with the stores, kitchens and professionals already in your neighbourhood.', { changefreq: 'monthly', priority: 0.7, crumbs: [['About', '/about']] }),
    P('/contact', 'Contact Zyphix', 'Talk to the Zyphix team about orders, partnerships, press or anything else. We reply within one working day.', { changefreq: 'monthly', priority: 0.6, crumbs: [['Contact', '/contact']] }),
    P('/blog', 'Zyphix Blog', 'Notes from the Zyphix team on local commerce, the businesses we work with and what we are building next.', { changefreq: 'weekly', priority: 0.6, crumbs: [['Blog', '/blog']] }),
    P('/investors', 'Investors · Zyphix', 'Zyphix for investors: the SuperLocal commerce layer for groceries, food and home services, built city by city.', { changefreq: 'monthly', priority: 0.5, crumbs: [['Investors', '/investors']] }),
    P('/app', 'The Zyphix app', 'Get notified when the Zyphix app for Android and iOS is available in your area.', { changefreq: 'monthly', priority: 0.5, crumbs: [['App', '/app']] }),
    P('/offers', 'Offers and coupons · Zyphix', 'Current coupons and deals on Zyphix Now, Eats and Book.', { changefreq: 'weekly', priority: 0.5, crumbs: [['Offers', '/offers']] }),
    P('/kirana-map', 'Store map · Zyphix', 'Find Zyphix partner stores near you on a live map: kiranas, pharmacies and speciality shops that deliver with Zyphix.', { changefreq: 'weekly', priority: 0.4, crumbs: [['Store map', '/kirana-map']] }),
    P('/privacy', 'Privacy Policy · Zyphix', 'How Zyphix collects, uses and protects your information, and the choices you have.', { changefreq: 'yearly', priority: 0.3, crumbs: [['Privacy Policy', '/privacy']] }),
    P('/terms', 'Terms of Service · Zyphix', 'The terms that apply when you use Zyphix Now, Eats and Book.', { changefreq: 'yearly', priority: 0.3, crumbs: [['Terms of Service', '/terms']] }),
    P('/wallet', 'Wallet · Zyphix', 'Your Zyphix wallet balance and refunds.', NOINDEX),
    P('/wishlist', 'Wishlist · Zyphix', 'Products you saved on Zyphix.', NOINDEX),
    P('/notifications', 'Notifications · Zyphix', 'Your Zyphix notifications.', NOINDEX),
    P('/partner-dashboard', 'Partner dashboard · Zyphix', 'Manage your Zyphix partner listing.', NOINDEX),
    P('/admin', 'Admin · Zyphix', 'Zyphix operations console.', NOINDEX),
    P('/cart', 'Your cart · Zyphix Now', 'Your Zyphix Now cart.', NOINDEX),
    P('/checkout', 'Checkout · Zyphix Now', 'Check out your Zyphix Now order.', NOINDEX),
  ],
  now: [
    P('/', 'Zyphix Now — Groceries delivered in 30 minutes', DESC.now, { changefreq: 'daily', priority: 0.9 }),
    P('/cart', 'Your cart · Zyphix Now', 'Your Zyphix Now cart.', NOINDEX),
    P('/checkout', 'Checkout · Zyphix Now', 'Check out your Zyphix Now order.', NOINDEX),
    P('/wallet', 'Wallet · Zyphix', 'Your Zyphix wallet balance and refunds.', NOINDEX),
    P('/wishlist', 'Wishlist · Zyphix', 'Products you saved on Zyphix.', NOINDEX),
    P('/notifications', 'Notifications · Zyphix', 'Your Zyphix notifications.', NOINDEX),
  ],
  eats: [P('/', 'Zyphix Eats — Food from your favourite local kitchens', DESC.eats, { changefreq: 'daily', priority: 0.9 })],
  book: [P('/', 'Zyphix Book — Home services by verified pros', DESC.book, { changefreq: 'weekly', priority: 0.9 })],
  partner: [
    P('/', 'Partner with Zyphix · Zyphix Partners', 'List your store, restaurant or skill on Zyphix, or deliver in your own area. Free to apply, weekly payouts.', { changefreq: 'monthly', priority: 0.8 }),
    P('/store', 'Register your store · Zyphix Partners', 'Put your kirana, pharmacy or speciality store on Zyphix Now. Your prices, your stock, riders from your area.', { changefreq: 'monthly', priority: 0.7, crumbs: [['Store partners', '/store']] }),
    P('/restaurant', 'Register your restaurant · Zyphix Partners', 'Restaurants, cafés, dhabas and home kitchens list their own menus at their own prices on Zyphix Eats.', { changefreq: 'monthly', priority: 0.7, crumbs: [['Restaurant partners', '/restaurant']] }),
    P('/delivery', 'Become a delivery partner · Zyphix Partners', 'Deliver in your own neighbourhood with Zyphix: short runs, payouts shown before you accept, hours you choose.', { changefreq: 'monthly', priority: 0.7, crumbs: [['Delivery partners', '/delivery']] }),
    P('/services', 'Join Zyphix Book · Zyphix Partners', 'Electricians, plumbers, cleaners, cooks and more: get bookings from neighbours with fixed quotes and a verified profile.', { changefreq: 'monthly', priority: 0.7, crumbs: [['Service professionals', '/services']] }),
  ],
  advertise: [P('/', 'Advertise on Zyphix · Zyphix Advertise', 'Placements inside a shopping app, shown to buyers in the delivery areas you choose and always labelled Sponsored.', { changefreq: 'monthly', priority: 0.7 })],
  support: [
    P('/', 'Help centre · Zyphix Support', 'Answers for Zyphix Now, Eats and Book orders, refunds, sign-in and partners.', { changefreq: 'weekly', priority: 0.7 }),
    P('/contact', 'Contact support · Zyphix Support', 'Send the Zyphix support team a message about an order, a booking or your account.', { changefreq: 'monthly', priority: 0.5, crumbs: [['Contact support', '/contact']] }),
  ],
  auth: [P('/', 'Sign in · Zyphix', 'One account for Zyphix Now, Eats and Book. Sign in with a one-time code, no password.', NOINDEX)],
  accounts: [P('/', 'Your account · Zyphix', 'Your Zyphix profile, saved addresses and orders across Now, Eats and Book.', NOINDEX)],
  admin: [P('/', 'Admin · Zyphix', 'Zyphix operations console.', NOINDEX)],
};

const topicPage = (t: (typeof TOPICS)[number]) => P(`/${t.id}`, `${t.title} · Zyphix Support`, t.blurb, { changefreq: 'monthly', priority: 0.5, crumbs: [[t.short, `/${t.id}`]] });
const articlePage = (a: (typeof ARTICLES)[number]) => {
  const t = TOPICS.find(x => x.id === a.topic);
  return P(`/${a.slug}`, `${a.title} · Zyphix Support`, a.summary, { changefreq: 'monthly', priority: 0.5, lastmod: a.updated, crumbs: [...(t ? [[t.short, `/${t.id}`] as [string, string]] : []), [a.title, `/${a.slug}`]] });
};

/** Every listable page for a host (used for sitemaps). */
export function pagesFor(site: SiteKey): Page[] {
  const base = STATIC[site] ?? [];
  if (site !== 'support') return base;
  return [...base, ...TOPICS.map(topicPage), ...ARTICLES.map(articlePage)];
}

/** Resolve a path on a host: the page (if known), or a dynamic match, or not found. */
export function resolvePage(site: SiteKey, rawPath: string): { page: Page | null; found: boolean } {
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : '/';
  if (site === 'admin' || site === 'accounts' || site === 'auth') {
    // single-page apps: everything resolves to the root page
    return { page: { ...STATIC[site][0], path }, found: true };
  }
  const exact = pagesFor(site).find(p => p.path === path);
  if (exact) return { page: exact, found: true };
  if ((site === 'eats' || site === 'book') && ['/wallet', '/wishlist', '/notifications', '/cart', '/checkout'].includes(path)) {
    const p = STATIC.now.find(x => x.path === path)!; return { page: p, found: true };
  }
  if (site === 'now' || site === 'main') {
    if (/^\/(now\/)?product\/[^/]+$/.test(path)) return { page: P(path, 'Product · Zyphix Now', DESC.now, { crumbs: [['Product', path]] }), found: true };
    if (/^\/(now\/)?order\/[^/]+$/.test(path)) return { page: P(path, 'Your order · Zyphix', 'Your Zyphix order.', NOINDEX), found: true };
  }
  return { page: null, found: false };
}

/** 301s within the network: duplicate paths on zyphix.in that belong to a subdomain. */
export function redirectFor(site: SiteKey, path: string, search: string): string | null {
  const p = path.length > 1 ? path.replace(/\/+$/, '') : '/';
  if (site === 'main') {
    const map: Record<string, string> = {
      '/now': `${ORIGIN.now}/`, '/now/cart': `${ORIGIN.now}/cart`, '/now/checkout': `${ORIGIN.now}/checkout`,
      '/eats': `${ORIGIN.eats}/`, '/book': `${ORIGIN.book}/`,
      '/partner': `${ORIGIN.partner}/`, '/merchant-setup': `${ORIGIN.partner}/store`, '/restaurant-setup': `${ORIGIN.partner}/restaurant`,
      '/delivery-setup': `${ORIGIN.partner}/delivery`, '/service-setup': `${ORIGIN.partner}/services`,
      '/advertise': `${ORIGIN.advertise}/`, '/support': `${ORIGIN.support}/`, '/auth': `${ORIGIN.auth}/`,
      '/account': `${ORIGIN.accounts}/`, '/launch': `${ORIGIN.main}/`, '/light': `${ORIGIN.main}/`, '/splash-video': `${ORIGIN.main}/`,
    };
    if (map[p]) return map[p] + (p === '/account' || p === '/auth' ? search : '');
    let m = p.match(/^\/now\/product\/([^/]+)$/); if (m) return `${ORIGIN.now}/product/${m[1]}`;
    m = p.match(/^\/now\/order\/([^/]+)$/); if (m) return `${ORIGIN.now}/order/${m[1]}${search}`;
    m = p.match(/^\/support\/(.+)$/); if (m) return `${ORIGIN.support}/${m[1]}`;
  }
  if (site === 'now' || site === 'eats' || site === 'book') {
    if (p === '/account') return `${ORIGIN.accounts}/${search}`;
    if (['/about', '/contact', '/blog', '/investors', '/privacy', '/terms', '/app', '/offers', '/kirana-map'].includes(p)) return `${ORIGIN.main}${p}`;
    if (p === '/now' || p === '/eats' || p === '/book') return `${ORIGIN[p.slice(1) as SiteKey]}/`;
    const m = p.match(/^\/now\/(product|order)\/([^/]+)$/); if (m) return `${ORIGIN.now}/${m[1]}/${m[2]}${m[1] === 'order' ? search : ''}`;
    if (p === '/now/cart' || p === '/now/checkout') return `${ORIGIN.now}/${p.split('/')[2]}`;
    if (['/partner', '/merchant-setup', '/restaurant-setup', '/delivery-setup', '/service-setup', '/advertise', '/support', '/auth'].includes(p)) return redirectFor('main', p, search);
  }
  if (path.length > 1 && path.endsWith('/')) return `${path.replace(/\/+$/, '')}${search}`; // drop trailing slash
  return null;
}

/* ── structured data ── */

export const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://zyphix.in/#organization',
  name: 'Zyphix',
  legalName: 'Zyphix Technologies Private Limited',
  url: 'https://zyphix.in/',
  logo: 'https://zyphix.in/favicon.svg',
  email: 'support@zyphix.in',
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'customer support', email: 'support@zyphix.in', url: 'https://support.zyphix.in/contact', availableLanguage: ['en', 'hi'] },
    { '@type': 'ContactPoint', contactType: 'partnerships', email: 'partners@zyphix.in' },
  ],
};

export function pageJsonLd(site: SiteKey, page: Page): object[] {
  const origin = ORIGIN[site];
  const out: object[] = [ORG_JSONLD];
  if (page.path === '/') {
    out.push({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${origin}/#website`, name: SITE_NAME[site], url: `${origin}/`, publisher: { '@id': 'https://zyphix.in/#organization' } });
  }
  if (page.crumbs?.length) {
    const items: [string, string][] = [[SITE_NAME[site], '/'], ...page.crumbs];
    out.push({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${origin}${p === '/' ? '/' : p}` })),
    });
  }
  return out;
}

export const OG_IMAGE: Record<SiteKey, string> = {
  main: '/og/main.jpg', now: '/og/now.jpg', eats: '/og/eats.jpg', book: '/og/book.jpg', partner: '/og/partner.jpg',
  advertise: '/og/advertise.jpg', support: '/og/support.jpg', auth: '/og/main.jpg', accounts: '/og/main.jpg', admin: '/og/main.jpg',
};
