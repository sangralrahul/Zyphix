import { useNoIndex, useNoIndexIf } from '@/lib/seo';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, Route, Router, Switch, useLocation } from 'wouter';
import { ArrowRight, ArrowUpRight, ChevronRight, Clock, Mail, Search, X, CheckCircle2, AlertCircle, LifeBuoy, Package, Wallet, UserRound, Activity } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { Container, Accordion, FONT, Chip } from '@/ui/kit';
import { Reveal, Stagger, Kicker, Headline, Sub, Glow, Grain, GhostButton, PhotoTile, Dark, Light, VideoHero, isStatic, G } from '@/ui/cinema';
import { Accent, Magnetic, Spotlight, LiveOrder, GiantMarquee, SplitHeadline } from '@/ui/motion2';
import { VIDEOS, landscape, type Clip } from '@/data/media';
import { apiFetch } from '@/lib/api';
import { ARTICLES, TOPICS, POPULAR, HOURS, SUPPORT_EMAIL, PARTNERS_EMAIL, articleBySlug, articlesForTopic, searchArticles, topicById, type Article, type Block, type Topic } from './support/articles';

/* ────────────────────────────────────────────────────────────────────────────
   support.zyphix.in — help centre. Also mounted at zyphix.in/support, so all
   routes are relative to a wouter base of '' or '/support' (detected below).
   Content lives in ./support/articles.ts.
──────────────────────────────────────────────────────────────────────────── */

const QUICK = [
  { icon: Package, label: 'Track or manage an order', href: 'https://accounts.zyphix.in/?tab=orders' },
  { icon: Wallet, label: 'Wallet & refunds', href: 'https://now.zyphix.in/wallet' },
  { icon: UserRound, label: 'Account & addresses', href: 'https://accounts.zyphix.in/?tab=addresses' },
  { icon: LifeBuoy, label: 'Partner portal', href: 'https://partner.zyphix.in' },
];

function useTitle(t: string) {
  useEffect(() => { document.title = `${t} · Zyphix Support`; }, [t]);
}
function useScrollTop() {
  const [loc] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [loc]);
}

/* ── Chrome ──────────────────────────────────────────────────────────────── */
function Page({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`min-h-screen antialiased ${dark ? 'bg-[#05080E]' : 'bg-white'} text-gray-900`} style={{ fontFamily: FONT }}>
      <SiteHeader variant={dark ? 'transparent' : 'solid'} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

function Crumbs({ items, light = false }: { items: Array<[string, string?]>; light?: boolean }) {
  const hover = light ? 'hover:text-white' : 'hover:text-gray-900';
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-[13px] ${light ? 'text-white/60' : 'text-gray-500'}`}>
      <Link href="/" className={hover}>Help centre</Link>
      {items.map(([label, href]) => (
        <React.Fragment key={label}>
          <ChevronRight size={13} className={light ? 'text-white/30' : 'text-gray-300'} />
          {href ? <Link href={href} className={hover}>{label}</Link> : <span className={light ? 'text-white' : 'text-gray-900'}>{label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ── Search box (shared) ─────────────────────────────────────────────────── */
function SearchBox({ value, onChange, big = false, autoFocus = false }: { value: string; onChange: (v: string) => void; big?: boolean; autoFocus?: boolean }) {
  return (
    <form role="search" onSubmit={e => e.preventDefault()}
      className={`flex items-center gap-2 rounded-2xl bg-white pl-4 pr-2 text-gray-900 shadow-[0_24px_60px_-15px_rgba(0,0,0,.5)] ${big ? 'h-14 md:h-16' : 'h-12 border border-gray-200 shadow-none'}`}>
      <Search size={big ? 20 : 17} className="shrink-0 text-gray-400" />
      <input value={value} onChange={e => onChange(e.target.value)} autoFocus={autoFocus}
        placeholder={big ? 'Search help, e.g. “refund”, “late order”, “OTP”' : 'Search help articles'} aria-label="Search help articles"
        className={`h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400 ${big ? 'text-[16px] md:text-[17px]' : 'text-[14.5px]'}`} />
      {value && <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X size={16} /></button>}
    </form>
  );
}

function ArticleRow({ a, showTopic = false }: { a: Article; showTopic?: boolean }) {
  const t = topicById(a.topic);
  return (
    <Link href={`/${a.slug}`} className="group flex items-start justify-between gap-4 py-4 transition hover:bg-gray-50/80 md:px-3 md:-mx-3 md:rounded-xl">
      <div className="min-w-0">
        {showTopic && t && <p className="mb-1 text-[12px] font-semibold text-emerald-700">{t.short}</p>}
        <p className="text-[15.5px] font-semibold tracking-[-0.01em] text-gray-900 group-hover:text-emerald-800">{a.title}</p>
        <p className="mt-0.5 text-[13.5px] leading-[1.55] text-gray-500">{a.summary}</p>
      </div>
      <ArrowRight size={16} className="mt-1 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-700" />
    </Link>
  );
}

function SearchResults({ q }: { q: string }) {
  const results = useMemo(() => searchArticles(q), [q]);
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 md:p-6">
      <p className="text-[13px] text-gray-500">{results.length} result{results.length === 1 ? '' : 's'} for “{q}”</p>
      {results.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-gray-50 p-5 text-[14.5px] text-gray-600">
          Nothing matched. Try a shorter word like “refund”, “late” or “OTP”, or <Link href="/contact" className="font-semibold text-emerald-700">contact us</Link> and we will answer directly.
        </div>
      ) : (
        <div className="mt-2 divide-y divide-gray-100">{results.slice(0, 10).map(a => <ArticleRow key={a.slug} a={a} showTopic />)}</div>
      )}
    </div>
  );
}

/* ── Home ────────────────────────────────────────────────────────────────── */
function TopicTile({ t, i }: { t: Topic; i: number }) {
  const photo = landscape(t.photo, i % 2);
  const count = articlesForTopic(t.id).length;
  return (
    <Link href={`/${t.id}`} className="block h-full">
      <Spotlight dark={false} className="h-full p-2 transition-transform duration-300 hover:-translate-y-1">
        <PhotoTile photo={photo} ratio="16/10" rounded="rounded-[18px]" className="!bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080E]/50 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">{count} article{count === 1 ? '' : 's'}</span>
        </PhotoTile>
        <div className="flex items-start justify-between gap-4 px-4 pb-4 pt-5">
          <div className="min-w-0">
            <p className="text-[20px] font-semibold leading-[1.15] tracking-[-0.03em] text-gray-900">{t.title}</p>
            <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.55] text-gray-500">{t.blurb}</p>
          </div>
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white"><ArrowUpRight size={15} /></span>
        </div>
      </Spotlight>
    </Link>
  );
}

function Home() {
  useTitle('Help centre');
  const [q, setQ] = useState('');
  const searching = q.trim().length > 1;
  const popular = POPULAR.map(articleBySlug).filter((a): a is Article => !!a);
  const [track, ...rest] = QUICK;

  return (
    <Page dark>
      {/* Hero */}
      <VideoHero clip={VIDEOS.phoneOrder} height="min-h-[640px] md:min-h-[82svh]" dim={0.5} position="center 40%">
        <Container className="pb-14 pt-32 md:pb-20 md:pt-44">
          <Kicker light>Zyphix Support</Kicker>
          <SplitHeadline parts={['How can we', { accent: 'help?', green: true }]} className="max-w-[14ch] text-balance text-[48px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[68px] md:text-[84px]" />
          <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-white/75 md:text-[19px]">Answers for Zyphix Now, Eats and Book, plus partners and payouts. Most questions take less than a minute.</p>
          <div className="mt-8 max-w-[720px]"><SearchBox value={q} onChange={setQ} big /></div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-white/70">
            <span className="mr-1">Popular:</span>
            {['refund', 'late order', 'OTP', 'cancel', 'payout'].map(w => (
              <button key={w} type="button" onClick={() => setQ(w)} className="min-h-[36px] rounded-full border border-white/15 bg-white/10 px-3.5 font-medium text-white/90 backdrop-blur hover:bg-white/20">{w}</button>
            ))}
          </div>
        </Container>
      </VideoHero>

      <Light className="pb-24 pt-12 md:pb-36 md:pt-16">
        <Container>
          {searching && <div className="mb-14"><SearchResults q={q} /></div>}

          {/* Quick actions: track an order (with live card) + three shortcuts */}
          <div className="grid gap-4 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <a href={track.href} target="_blank" rel="noopener noreferrer" className="group relative flex h-full flex-col gap-8 overflow-hidden rounded-3xl bg-[#05080E] p-6 text-white ring-1 ring-white/10 sm:p-8 md:flex-row md:items-center md:justify-between">
                <Glow x="10%" y="0%" size={600} alpha={0.3} />
                <div className="relative max-w-[34ch]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-emerald-300 ring-1 ring-white/10"><Package size={20} /></span>
                  <p className="mt-6 text-[28px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[34px]">Track an order</p>
                  <p className="mt-3 text-[15px] leading-[1.6] text-white/65">Live status, rider location and the fastest way to report a problem are all on the order page.</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-emerald-300">Open my orders <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                </div>
                <div className="relative w-full md:w-auto">
                  <LiveOrder dark items={["Fresh milk 1 L", "Whole-wheat flour 5 kg", "Bananas · 6"]} />
                  <p className="mt-2 text-[11.5px] text-white/40">Illustrative order</p>
                </div>
              </a>
            </Reveal>
            <div className="grid gap-4 lg:col-span-4">
              {rest.map(({ icon: Icon, label, href }, i) => (
                <Reveal key={label} delay={0.06 * (i + 1)}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="group flex h-full min-h-[76px] items-center gap-4 rounded-3xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_14px_40px_-20px_rgba(11,15,25,.25)]">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><Icon size={19} /></span>
                    <span className="min-w-0 text-[15.5px] font-semibold tracking-[-0.02em] text-gray-900">{label}</span>
                    <ArrowUpRight size={16} className="ml-auto shrink-0 text-gray-300 transition group-hover:text-gray-800" />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="mt-24 md:mt-32">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
              <div className="lg:col-span-7">
                <Reveal><Kicker>Browse by topic</Kicker></Reveal>
                <Reveal delay={0.05}><h2 className="max-w-[18ch] text-balance text-[34px] font-semibold leading-[1.04] tracking-[-0.04em] text-gray-900 sm:text-[46px] md:text-[56px]">Pick a <Accent green>topic</Accent>.</h2></Reveal>
              </div>
              <Reveal delay={0.1} className="lg:col-span-5"><Sub className="max-w-[44ch]">Six topics cover every order, booking and payout. Each article is short, specific and kept up to date.</Sub></Reveal>
            </div>
            <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.07}>
              {TOPICS.map((t, i) => <TopicTile key={t.id} t={t} i={i} />)}
            </Stagger>
          </div>
        </Container>

        <div className="mt-20 border-y border-gray-100 py-8 md:mt-28 md:py-12" aria-hidden>
          <GiantMarquee words={['Refunds', 'Tracking', 'Payouts', 'Sign-in', 'Bookings']} light={false} baseSpeed={1.6} className="pb-[2.4vw]" />
        </div>

        <Container>
          {/* Popular + status */}
          <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal><Kicker>Most read</Kicker></Reveal>
              <Reveal delay={0.05}><h2 className="text-[28px] font-semibold tracking-[-0.035em] text-gray-900 sm:text-[34px]">Popular articles</h2></Reveal>
              <Reveal delay={0.1} className="mt-6 rounded-3xl border border-gray-200 bg-white px-5 md:px-6">
                <div className="divide-y divide-gray-100">{popular.map(a => <ArticleRow key={a.slug} a={a} showTopic />)}</div>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal><Kicker>Service status</Kicker></Reveal>
              <Reveal delay={0.05}><h2 className="text-[28px] font-semibold tracking-[-0.035em] text-gray-900 sm:text-[34px]">Is something down?</h2></Reveal>
              <Reveal delay={0.1}>
                <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white">
                  <PhotoTile photo={landscape('rider', 1)} ratio="16/7" rounded="rounded-none" className="!bg-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05080E]/80 to-transparent" />
                    <div className="absolute bottom-4 left-5 flex items-center gap-3">
                      <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: G }} /><span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: G }} /></span>
                      <p className="text-[15px] font-semibold text-white">No incidents reported</p>
                    </div>
                  </PhotoTile>
                  <div className="p-5 md:p-6">
                    <ul className="divide-y divide-gray-100 text-[14px]">
                      {[['Zyphix Now', 'now.zyphix.in'], ['Zyphix Eats', 'eats.zyphix.in'], ['Zyphix Book', 'book.zyphix.in'], ['Partner portal', 'partner.zyphix.in'], ['Sign-in codes', 'auth.zyphix.in']].map(([n, d]) => (
                        <li key={n} className="flex items-center justify-between gap-3 py-2.5">
                          <span className="min-w-0 truncate text-gray-900">{n} <span className="text-gray-400">· {d}</span></span>
                          <Chip tone="green"><Activity size={11} /> Operational</Chip>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[13px] leading-[1.6] text-gray-500">Incidents are posted here and on <a href="https://x.com/zyphix_in" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-700">@zyphix_in</a>. Seeing a problem we have not posted? <Link href="/contact" className="font-semibold text-emerald-700">Tell us</Link>.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Light>

      <ContactBand />
    </Page>
  );
}

/* ── Contact band (bottom of every page) ────────────────────────────────── */
function ContactBand() {
  return (
    <Dark className="py-24 md:py-32">
      <Glow x="15%" y="20%" alpha={0.3} />
      <Grain />
      <Container className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal><Kicker light>Still stuck?</Kicker></Reveal>
          <Reveal delay={0.05}><h2 className="max-w-[16ch] text-balance text-[36px] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-[48px] md:text-[60px]">Talk to a <Accent green>person</Accent>.</h2></Reveal>
          <Reveal delay={0.1}><Sub light className="mt-5 max-w-[48ch]">Support replies by email {HOURS}. Order issues get the fastest answers when you report them from the order page first.</Sub></Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Magnetic><Link href="/contact" className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full px-7 text-[15.5px] font-semibold tracking-[-0.01em] text-white shadow-[0_0_0_1px_rgba(255,255,255,.08),0_12px_40px_rgba(13,163,102,.45)] transition-all duration-200 hover:-translate-y-0.5 sm:w-auto" style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>Contact support <ArrowRight size={16} /></Link></Magnetic>
              <GhostButton href={`mailto:${SUPPORT_EMAIL}`}><Mail size={16} /> {SUPPORT_EMAIL}</GhostButton>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.04]">
            <PhotoTile photo={landscape('teamOffice', 1)} ratio="16/8" rounded="rounded-none" className="!bg-[#0B1220]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#05080E] to-transparent" />
            </PhotoTile>
            <div className="p-6">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300">Hours</p>
              <p className="mt-2 flex items-center gap-2 text-[16px] font-semibold text-white"><Clock size={16} className="text-white/60" /> {HOURS}</p>
              <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-[14px] text-white/75">
                <p><span className="font-semibold text-white">Customers:</span> <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-300">{SUPPORT_EMAIL}</a></p>
                <p><span className="font-semibold text-white">Partners &amp; payouts:</span> <a href={`mailto:${PARTNERS_EMAIL}`} className="text-emerald-300">{PARTNERS_EMAIL}</a></p>
                <p><span className="font-semibold text-white">Advertising:</span> <a href="https://advertise.zyphix.in" target="_blank" rel="noopener noreferrer" className="text-emerald-300">advertise.zyphix.in</a></p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Dark>
  );
}

/* ── Topic page ──────────────────────────────────────────────────────────── */
const TOPIC_CLIP: Record<string, Clip> = {
  now: VIDEOS.packing, eats: VIDEOS.cooking, book: VIDEOS.plumber,
  partners: VIDEOS.merchant, account: VIDEOS.phoneOrder, refunds: VIDEOS.doorHandoff,
};

function ArticleCard({ a, n }: { a: Article; n: number }) {
  const words = a.body.reduce((c, b) => c + ('text' in b ? b.text : b.items.join(' ')).split(/\s+/).length, 0);
  const mins = Math.max(1, Math.round(words / 200));
  return (
    <Link href={`/${a.slug}`} className="block h-full">
      <Spotlight dark={false} className="flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold tabular-nums text-emerald-700">{String(n).padStart(2, '0')}</span>
          <span className="text-[12.5px] text-gray-400">{mins} min read</span>
        </div>
        <p className="mt-6 text-balance text-[21px] font-semibold leading-[1.2] tracking-[-0.03em] text-gray-900">{a.title}</p>
        <p className="mt-3 text-[14.5px] leading-[1.6] text-gray-500">{a.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-semibold text-gray-900">Read article <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></span>
      </Spotlight>
    </Link>
  );
}

function TopicPage({ id }: { id: string }) {
  const t = topicById(id);
  useTitle(t ? t.title : 'Page not found');
  const [q, setQ] = useState('');
  if (!t) return <NotFound />;
  const list = articlesForTopic(t.id);
  const searching = q.trim().length > 1;
  return (
    <Page dark>
      <VideoHero clip={TOPIC_CLIP[t.id] ?? VIDEOS.phoneOrder} height="min-h-[520px] md:min-h-[60svh]" dim={0.5}>
        <Container className="pb-12 pt-28 md:pb-16 md:pt-36">
          <Crumbs light items={[[t.title]]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SplitHeadline parts={[t.title]} className="max-w-[18ch] text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-[56px] md:text-[72px]" />
              <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-white/75 md:text-[19px]">{t.blurb}</p>
            </div>
            <div className="lg:col-span-5">
              <SearchBox value={q} onChange={setQ} big />
              <p className="mt-3 text-[13px] text-white/60">{list.length} article{list.length === 1 ? '' : 's'} in this topic</p>
            </div>
          </div>
        </Container>
      </VideoHero>

      <Light className="py-24 md:py-32">
        <Container>
          {searching ? <SearchResults q={q} /> : (
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                <Stagger className="grid gap-4 sm:grid-cols-2" step={0.06}>
                  {list.map((a, i) => <ArticleCard key={a.slug} a={a} n={i + 1} />)}
                </Stagger>
              </div>
              <aside className="space-y-4 lg:col-span-4">
                {t.product && (
                  <Reveal className="relative overflow-hidden rounded-3xl bg-[#05080E] p-6 text-white">
                    <Glow x="0%" y="0%" size={420} alpha={0.35} />
                    <p className="relative text-[16px] font-semibold tracking-[-0.02em]">Fix it in the app</p>
                    <p className="relative mt-1.5 text-[14px] leading-[1.6] text-white/60">Most issues are fastest to fix from inside the product, where we can already see your order.</p>
                    <a href={t.product.href} target="_blank" rel="noopener noreferrer" className="relative mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[14.5px] font-semibold text-white" style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>{t.product.label} <ArrowUpRight size={15} /></a>
                  </Reveal>
                )}
                <Reveal delay={0.05} className="rounded-3xl border border-gray-200 bg-white p-6">
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gray-400">Other topics</p>
                  <ul className="mt-3 divide-y divide-gray-100">
                    {TOPICS.filter(x => x.id !== t.id).map(x => (
                      <li key={x.id}><Link href={`/${x.id}`} className="flex items-center justify-between py-3 text-[14.5px] font-medium text-gray-700 hover:text-gray-900">{x.title} <ChevronRight size={15} className="text-gray-300" /></Link></li>
                    ))}
                  </ul>
                </Reveal>
              </aside>
            </div>
          )}
        </Container>
      </Light>
      <ContactBand />
    </Page>
  );
}

/* ── Article page ────────────────────────────────────────────────────────── */
const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function Blocks({ body }: { body: Block[] }) {
  return (
    <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
      {body.map((b, i) => {
        if (b.type === 'p') return <p key={i}>{b.text}</p>;
        if (b.type === 'h') return <h2 key={i} id={slugify(b.text)} className="scroll-mt-28 pt-6 text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-gray-900">{b.text}</h2>;
        if (b.type === 'note') return <div key={i} className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-[15.5px] leading-[1.65] text-emerald-900"><AlertCircle size={18} className="mt-1 shrink-0 text-emerald-700" /><p>{b.text}</p></div>;
        if (b.type === 'steps') return (
          <ol key={i} className="space-y-4">
            {b.items.map((it, j) => (
              <li key={j} className="flex gap-4"><span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[13px] font-semibold tabular-nums text-white">{j + 1}</span><span className="pt-0.5">{it}</span></li>
            ))}
          </ol>
        );
        return (
          <ul key={i} className="space-y-2.5">
            {b.items.map((it, j) => <li key={j} className="flex gap-3.5"><span className="mt-[12px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: G }} />{it}</li>)}
          </ul>
        );
      })}
    </div>
  );
}

/** Sticky "On this page" list built from the article's h-blocks; highlights the section in view. */
function Toc({ heads }: { heads: string[] }) {
  const [active, setActive] = useState(heads[0] ? slugify(heads[0]) : '');
  useEffect(() => {
    if (isStatic() || !heads.length || typeof IntersectionObserver === 'undefined') return;
    const els = heads.map(h => document.getElementById(slugify(h))).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(es => { const v = es.filter(e => e.isIntersecting)[0]; if (v) setActive(v.target.id); }, { rootMargin: '0px 0px -70% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [heads]);
  if (!heads.length) return null;
  return (
    <nav aria-label="On this page" className="text-[13.5px]">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-400">On this page</p>
      <ul className="space-y-1 border-l border-gray-200">
        {heads.map(h => {
          const id = slugify(h);
          return <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActive(id); }} className={`-ml-px block border-l py-1.5 pl-4 leading-[1.4] transition ${active === id ? 'border-emerald-600 font-medium text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>{h}</a></li>;
        })}
      </ul>
    </nav>
  );
}

function ArticlePage({ slug }: { slug: string }) {
  const a = articleBySlug(slug);
  useTitle(a ? a.title : 'Page not found');
  useNoIndexIf(!a);
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  if (!a) return <NotFound />;
  const t = topicById(a.topic)!;
  const related = (a.related || []).map(articleBySlug).filter((x): x is Article => !!x);
  const more = articlesForTopic(a.topic).filter(x => x.slug !== a.slug && !related.includes(x)).slice(0, 4 - related.length);
  const updated = new Date(a.updated + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const heads = a.body.filter((b): b is Extract<Block, { type: 'h' }> => b.type === 'h').map(b => b.text);
  const words = a.body.reduce((n, b) => n + ('text' in b ? b.text : b.items.join(' ')).split(/\s+/).length, 0);
  const mins = Math.max(1, Math.round(words / 200));
  const photo = landscape(t.photo, 1);
  return (
    <Page>
      <section className="border-b border-gray-100 bg-[#F6F7F9]">
        <Container className="grid items-end gap-10 pb-12 pt-10 md:grid-cols-[minmax(0,1fr)_300px] md:pb-16 md:pt-14 lg:gap-16">
          <div>
            <Crumbs items={[[t.title, `/${t.id}`], [a.title]]} />
            <div className="mt-8"><Kicker>{t.title}</Kicker></div>
            <h1 className="max-w-[22ch] text-balance text-[34px] font-semibold leading-[1.04] tracking-[-0.04em] text-gray-900 sm:text-[44px] md:text-[52px]">{a.title}</h1>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-gray-600 md:text-[19px]">{a.summary}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500"><span>Updated {updated}</span><span className="h-1 w-1 rounded-full bg-gray-300" /><span>{mins} min read</span></p>
          </div>
          <PhotoTile photo={photo} ratio="4/3" rounded="rounded-3xl" className="hidden !bg-gray-200 md:block">
            <div className="absolute inset-0 bg-gradient-to-t from-[#05080E]/40 to-transparent" />
          </PhotoTile>
        </Container>
      </section>

      {/* plain section: overflow-hidden on <Light> would break the sticky ToC */}
      <section className="bg-white pb-24 pt-12 text-gray-900 md:pb-32 md:pt-16">
        <Container>
          <div className={`grid gap-12 lg:gap-14 ${heads.length ? 'lg:grid-cols-[200px_minmax(0,1fr)_280px]' : 'lg:grid-cols-[minmax(0,1fr)_300px] xl:pl-[120px]'}`}>
            {heads.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-28"><Toc heads={heads} /></div>
              </aside>
            )}

            <article className="min-w-0">
              <div className="max-w-[68ch]"><Blocks body={a.body} /></div>

              <div className="mt-14 max-w-[68ch] rounded-3xl border border-gray-200 bg-[#F6F7F9] p-5 md:p-6">
                {vote ? (
                  <p className="flex items-center gap-2 text-[14.5px] font-medium text-gray-900"><CheckCircle2 size={18} className="text-emerald-600" /> Thanks for the feedback.{vote === 'no' && <> Need more help? <Link href="/contact" className="font-semibold text-emerald-700">Contact us</Link>.</>}</p>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-[14.5px] font-medium text-gray-900">Did this answer your question?</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setVote('yes')} className="h-10 rounded-full border border-gray-200 bg-white px-5 text-[13.5px] font-semibold text-gray-900 hover:border-gray-300">Yes</button>
                      <button type="button" onClick={() => setVote('no')} className="h-10 rounded-full border border-gray-200 bg-white px-5 text-[13.5px] font-semibold text-gray-900 hover:border-gray-300">No</button>
                    </div>
                  </div>
                )}
              </div>
            </article>

            <aside>
              <div className="space-y-4 lg:sticky lg:top-28">
                {t.product && (
                  <div className="rounded-3xl bg-[#05080E] p-5 text-white">
                    <p className="text-[14px] font-semibold">Fix it in the app</p>
                    <p className="mt-1 text-[13px] leading-[1.55] text-white/60">Report order issues from the order page for the fastest refund.</p>
                    <a href={t.product.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold text-white" style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>{t.product.label} <ArrowUpRight size={15} /></a>
                  </div>
                )}
                {(related.length > 0 || more.length > 0) && (
                  <div className="rounded-3xl border border-gray-200 bg-white p-5">
                    <p className="text-[13px] font-semibold text-gray-900">Related articles</p>
                    <ul className="mt-3 divide-y divide-gray-100">
                      {[...related, ...more].map(x => (
                        <li key={x.slug}><Link href={`/${x.slug}`} className="flex items-start justify-between gap-3 py-2.5 text-[14px] leading-[1.45] text-gray-600 hover:text-gray-900">{x.title} <ChevronRight size={14} className="mt-1 shrink-0 text-gray-300" /></Link></li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="rounded-3xl border border-gray-200 bg-white p-5">
                  <p className="text-[13px] font-semibold text-gray-900">Need a person?</p>
                  <p className="mt-1 text-[13px] leading-[1.6] text-gray-500">{HOURS}.</p>
                  <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-emerald-700">Contact support <ArrowRight size={14} /></Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
      <ContactBand />
    </Page>
  );
}

/* ── Contact page ────────────────────────────────────────────────────────── */
const CONTACT_FAQ = [
  { q: 'How quickly will I hear back?', a: `Email replies go out ${HOURS}. Order issues reported from the order page are reviewed within 2 hours during store hours.` },
  { q: 'Is there a phone number?', a: 'Not yet. Email keeps a written record of every case, and order issues are fastest from the order page. A callback option for open cases is on the way.' },
  { q: 'I am a partner. Where do I write?', a: `Stores, restaurants, professionals and delivery partners: ${PARTNERS_EMAIL}. Include your partner ID from the portal.` },
  { q: 'What should I include?', a: 'The order or booking ID, the email on your account and a short description. A photo helps for damaged or wrong items.' },
];

const PRODUCTS = ['Zyphix Now (groceries)', 'Zyphix Eats (food)', 'Zyphix Book (home services)', 'Partner / payouts', 'Account & payments', 'Something else'];
const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[14.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100';

function ContactPage() {
  useTitle('Contact us');
  const [form, setForm] = useState({ name: '', email: '', product: '', orderId: '', message: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (state === 'error') { setState('idle'); setError(''); }
  };
  const isPartner = form.product === 'Partner / payouts';
  const to = isPartner ? PARTNERS_EMAIL : SUPPORT_EMAIL;
  const mailto = `mailto:${to}?subject=${encodeURIComponent(`[${form.product || 'Support'}] ${form.orderId ? `Order ${form.orderId}` : 'Help request'}`)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nProduct: ${form.product}\nOrder / booking ID: ${form.orderId || '-'}\n\n${form.message}`)}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.product || form.message.trim().length < 10) { setState('error'); setError('Please add your name, choose a product and describe the issue in a sentence or two.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setState('error'); setError('Please enter a valid email address so we can reply.'); return; }
    setState('loading');
    try {
      const res = await apiFetch('/api/support', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), product: form.product, orderId: form.orderId.trim(), message: form.message.trim(), source: 'support-site' }),
      });
      let data: { success?: boolean; error?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON */ }
      if (res.ok && data.success !== false && !data.error) setState('done');
      else { setState('error'); setError('We could not send this automatically. Use the email button below; your message is pre-filled.'); }
    } catch {
      setState('error'); setError('We could not reach our server. Use the email button below; your message is pre-filled.');
    }
  };

  return (
    <Page>
      <section className="relative overflow-hidden border-b border-gray-100 bg-[#F6F7F9]">
        <Container className="grid items-end gap-10 pb-12 pt-10 md:grid-cols-[minmax(0,1fr)_420px] md:pb-16 md:pt-14 lg:gap-16">
          <div>
            <Crumbs items={[['Contact us']]} />
            <div className="mt-8"><Kicker>Contact support</Kicker></div>
            <SplitHeadline parts={['Tell us what', { accent: 'happened.', green: true }]} className="text-balance text-[38px] sm:max-w-[16ch] font-semibold leading-[1.02] tracking-[-0.04em] text-gray-900 sm:text-[52px] md:text-[58px]" />
            <Sub className="mt-5 max-w-[52ch]">We reply by email {HOURS}. Order issues are fastest from the order page, where support can already see the order.</Sub>
          </div>
          <PhotoTile photo={landscape('teamOffice', 0)} ratio="4/3" rounded="rounded-3xl" className="!bg-gray-200">
            <div className="absolute inset-0 bg-gradient-to-t from-[#05080E]/70 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20 backdrop-blur-md"><Mail size={16} /></span>
              <div><p className="text-[14px] font-semibold">The Zyphix support team</p><p className="text-[12.5px] text-white/70">Real people, written answers</p></div>
            </div>
          </PhotoTile>
        </Container>
      </section>
      <Light className="pb-24 pt-10 md:pb-32 md:pt-14">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(11,15,25,.18)] md:p-9">
              {state !== 'done' && <div className="mb-7 border-b border-gray-100 pb-6"><p className="text-[20px] font-semibold tracking-[-0.03em] text-gray-900">Send us a message</p><p className="mt-1 text-[14px] text-gray-500">All fields except the order ID are required.</p></div>}
              {state === 'done' ? (
                <div className="flex flex-col items-start gap-4 py-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><CheckCircle2 size={24} /></span>
                  <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-gray-900">Got it. We will reply to {form.email}.</h2>
                  <p className="text-[14.5px] leading-[1.6] text-gray-600">Replies go out {HOURS}. If it is about an order, we may ask for a photo.</p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block"><span className="mb-1.5 block text-[13px] font-medium text-gray-700">Your name</span><input className={inputCls} value={form.name} onChange={set('name')} placeholder="Full name" autoComplete="name" required /></label>
                    <label className="block"><span className="mb-1.5 block text-[13px] font-medium text-gray-700">Email on your account</span><input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" required /></label>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block"><span className="mb-1.5 block text-[13px] font-medium text-gray-700">What is it about?</span>
                      <select className={inputCls} value={form.product} onChange={set('product')} required>
                        <option value="">Select…</option>
                        {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </label>
                    <label className="block"><span className="mb-1.5 block text-[13px] font-medium text-gray-700">Order or booking ID <span className="font-normal text-gray-400">(optional)</span></span><input className={inputCls} value={form.orderId} onChange={set('orderId')} placeholder="e.g. ZN-48213" /></label>
                  </div>
                  <label className="block"><span className="mb-1.5 block text-[13px] font-medium text-gray-700">What happened?</span><textarea className={`${inputCls} min-h-[140px] resize-y`} value={form.message} onChange={set('message')} placeholder="A few sentences. Include what you expected and what you got." required /></label>
                  {state === 'error' && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[14px] leading-[1.6] text-amber-900">
                      <p className="flex items-start gap-2"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</p>
                      {error.includes('email button') && <a href={mailto} className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-gray-900 px-4 text-[13.5px] font-semibold text-white"><Mail size={15} /> Email {to}</a>}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-4">
                    <Magnetic strength={0.25}><button type="submit" disabled={state === 'loading'} className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(13,163,102,.6)] transition hover:-translate-y-px disabled:opacity-60" style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>
                      {state === 'loading' ? 'Sending…' : 'Send message'} <ArrowRight size={16} />
                    </button></Magnetic>
                    <p className="text-[12.5px] text-gray-500">Your details are used only to reply to this request.</p>
                  </div>
                </form>
              )}
            </div>
          </div>
          <aside className="space-y-4 lg:col-span-5">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 md:p-6">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Email</p>
              <ul className="mt-3 space-y-3 text-[14.5px]">
                <li><p className="text-gray-500">Customers</p><a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-emerald-800"><Mail size={15} /> {SUPPORT_EMAIL}</a></li>
                <li><p className="text-gray-500">Partners &amp; payouts</p><a href={`mailto:${PARTNERS_EMAIL}`} className="inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-emerald-800"><Mail size={15} /> {PARTNERS_EMAIL}</a></li>
              </ul>
              <p className="mt-5 flex items-center gap-2 text-[13.5px] text-gray-600"><Clock size={15} className="text-gray-400" /> {HOURS}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 md:p-6">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Faster than email</p>
              <ul className="mt-3 space-y-2">
                {QUICK.map(({ icon: Icon, label, href }) => (
                  <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-2 py-2 text-[14px] font-medium text-gray-800 hover:bg-gray-50"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><Icon size={15} /></span>{label}<ArrowUpRight size={14} className="ml-auto text-gray-300" /></a></li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white px-5 md:px-6">
              <Accordion items={CONTACT_FAQ} />
            </div>
          </aside>
        </Container>
      </Light>
    </Page>
  );
}

/* ── 404 ─────────────────────────────────────────────────────────────────── */
function NotFound() {
  useNoIndex();
  useTitle('Page not found');
  return (
    <Page>
      <Light className="py-24 md:py-36">
        <Container narrow className="text-center">
          <Kicker className="justify-center">Error 404</Kicker>
          <Headline size="lg" as="h1">We could not find that page.</Headline>
          <Sub className="mx-auto mt-4 max-w-[460px]">The article may have moved. Search the help centre or start from the home page.</Sub>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white" style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>Help centre home <ArrowRight size={16} /></Link>
            <Link href="/contact" className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-[15px] font-semibold text-gray-900">Contact us</Link>
          </div>
        </Container>
      </Light>
    </Page>
  );
}

/* ── Routes (relative to '' on support.zyphix.in, or '/support' on zyphix.in) ── */
function Routes() {
  useScrollTop();
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contact" component={ContactPage} />
      {/* Single-segment URLs so the help centre also works under zyphix.in/support (App.tsx matches one segment after /support). */}
      <Route path="/:slug">{p => topicById(p.slug) ? <TopicPage id={p.slug} /> : <ArticlePage slug={p.slug} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function SupportSite() {
  const [loc] = useLocation();
  const base = loc === '/support' || loc.startsWith('/support/') ? '/support' : '';
  return (
    <Router base={base}>
      <Routes />
    </Router>
  );
}

export { ARTICLES as SUPPORT_ARTICLES };
