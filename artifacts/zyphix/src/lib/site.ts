/** Which Zyphix site this page is serving (hostname based; ?site= overrides for previews). */
export function detectSite(): "main" | "partner" | "advertise" | "now" | "eats" | "book" | "auth" | "support" {
  if (typeof window === "undefined") return "main";
  const override = new URLSearchParams(window.location.search).get("site");
  if (override === "partner" || override === "advertise" || override === "now" || override === "eats" || override === "book" || override === "auth" || override === "support") return override;
  const host = window.location.hostname.toLowerCase();
  if (host.startsWith("auth.") || host.startsWith("account.")) return "auth";
  if (host.startsWith("support.") || host.startsWith("help.")) return "support";
  if (host.startsWith("partner.") || host.startsWith("partners.")) return "partner";
  if (host.startsWith("advertise.") || host.startsWith("ads.")) return "advertise";
  if (host.startsWith("now.") || host.startsWith("shop.")) return "now";
  if (host.startsWith("eats.") || host.startsWith("food.")) return "eats";
  if (host.startsWith("book.") || host.startsWith("services.")) return "book";
  return "main";
}

/** Absolute URL on the main site when we are on a subdomain; unchanged on zyphix.in itself. */
export function mainHref(href: string): string {
  if (!href.startsWith('/')) return href;
  if (detectSite() === 'main') return href;
  return `https://zyphix.in${href}`;
}
