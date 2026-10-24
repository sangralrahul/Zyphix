import React from 'react';
import {
  MapPin, Navigation, Phone, Store, Home, CheckCircle2, Circle, Clock, Wallet, ChevronRight, Bell,
  Flame, Minus, Plus, BadgeCheck, ShieldCheck, Calendar, ClipboardCheck, Package, Search, Barcode, TrendingUp,
  AlertCircle, Bike, IndianRupee, Wrench,
} from 'lucide-react';
import { G } from '@/components/layout/SiteChrome';
import { BLUE, ORANGE, VIOLET, SampleTag, Pill, Progress } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Product UI mock-ups — built in HTML/CSS, no images. Sample data is labelled.
──────────────────────────────────────────────────────────────────────────── */

const MONO = { fontVariantNumeric: 'tabular-nums' } as const;

/* ── Toggle switch (static) ─────────────────────────────────────────────── */
function Toggle({ on, tint }: { on: boolean; tint: string }) {
  return (
    <span className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition" style={{ background: on ? tint : '#E5E7EB' }} aria-hidden>
      <span className={`absolute h-4 w-4 rounded-full bg-white shadow transition ${on ? 'left-[18px]' : 'left-[2px]'}`} />
    </span>
  );
}

/* ── Map placeholder ────────────────────────────────────────────────────── */
function MapPlaceholder({ tint }: { tint: string }) {
  return (
    <div className="relative h-[150px] overflow-hidden bg-[#EEF3EE]">
      {/* grid */}
      <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgba(11,18,32,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(11,18,32,.07) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      {/* roads */}
      <div aria-hidden className="absolute left-0 right-0 top-[48px] h-[9px] bg-white" />
      <div aria-hidden className="absolute left-0 right-0 top-[108px] h-[7px] bg-white" />
      <div aria-hidden className="absolute bottom-0 top-0 left-[72px] w-[8px] bg-white" />
      <div aria-hidden className="absolute bottom-0 top-0 left-[196px] w-[6px] bg-white" />
      {/* block tints */}
      <div aria-hidden className="absolute left-[88px] top-[62px] h-[40px] w-[92px] rounded-sm bg-emerald-100/70" />
      <div aria-hidden className="absolute left-[212px] top-[8px] h-[34px] w-[80px] rounded-sm bg-emerald-100/50" />
      {/* route */}
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 320 150" fill="none">
        <path d="M44 118 L76 118 L76 52 L200 52 L200 24 L262 24" stroke={tint} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 7" />
        <path d="M44 118 L76 118 L76 52 L140 52" stroke={tint} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* rider */}
      <span className="absolute left-[128px] top-[40px] flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md" style={{ background: tint }}><Bike size={13} /></span>
      {/* markers */}
      <span className="absolute left-[34px] top-[102px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-white shadow"><Store size={12} /></span>
      <span className="absolute left-[250px] top-[8px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white shadow" style={{ background: G }}><Home size={12} /></span>
      <div className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold text-gray-700 shadow-sm">1.6 km · 7 min</div>
      <SampleTag className="absolute right-2 top-2" />
    </div>
  );
}

/* ── 1. Delivery — phone frame ──────────────────────────────────────────── */
export function DeliveryPhone({ className = '' }: { className?: string }) {
  const t = BLUE;
  return (
    <div className={`relative mx-auto w-[300px] rounded-[40px] border-[6px] border-gray-900 bg-gray-900 shadow-[0_30px_80px_rgba(11,18,32,.28)] ${className}`}>
      <div aria-hidden className="absolute left-1/2 top-2 z-10 h-[22px] w-[96px] -translate-x-1/2 rounded-full bg-gray-900" />
      <div className="overflow-hidden rounded-[34px] bg-white">
        {/* status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-gray-900" style={MONO}>
          <span>9:41</span>
          <span className="flex items-center gap-1 text-[10px]"><span className="h-2 w-2 rounded-full" style={{ background: G }} /> Online</span>
        </div>
        {/* header */}
        <div className="flex items-center justify-between px-4 pb-2 pt-1">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Active order</p>
            <p className="text-[14px] font-extrabold text-gray-900">#ZN-4821</p>
          </div>
          <Pill tint={t} bg="#EFF6FF"><Clock size={10} /> Pick up in 4 min</Pill>
        </div>

        <MapPlaceholder tint={t} />

        {/* steps */}
        <div className="px-4 pt-3">
          {[
            { icon: Store, done: true, label: 'Pickup · Sharma Kirana Store', sub: 'Lane 4, Sector 12 · Order packed', right: 'Done' },
            { icon: Bike, done: false, active: true, label: 'On the way', sub: '1.6 km · 7 min via Main Road', right: 'Now' },
            { icon: Home, done: false, label: 'Drop · Flat 3B, Green Residency', sub: 'Leave at door · Paid online', right: '' },
          ].map((s, i, arr) => (
            <div key={s.label} className="relative flex gap-3 pb-3">
              {i < arr.length - 1 && <span aria-hidden className="absolute left-[11px] top-6 h-[calc(100%-14px)] w-px" style={{ background: s.done ? t : '#E5E7EB' }} />}
              <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-white" style={{ borderColor: s.done || s.active ? t : '#E5E7EB', color: s.done || s.active ? t : '#9CA3AF', background: s.done ? t : '#fff' }}>
                {s.done ? <CheckCircle2 size={14} className="text-white" /> : <s.icon size={12} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate text-[12.5px] font-bold ${s.active ? 'text-gray-900' : 'text-gray-700'}`}>{s.label}</p>
                  {s.right && <span className="shrink-0 text-[10.5px] font-bold" style={{ color: s.done ? G : t }}>{s.right}</span>}
                </div>
                <p className="truncate text-[11px] text-gray-500">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* payout line */}
        <div className="mx-4 flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm"><Wallet size={14} /></span>
            <div>
              <p className="text-[11px] font-semibold text-gray-500">This order pays</p>
              <p className="text-[10.5px] text-gray-400">Base + distance · shown before accept</p>
            </div>
          </div>
          <p className="text-[16px] font-black text-gray-900" style={MONO}>₹ —</p>
        </div>

        {/* actions */}
        <div className="flex gap-2 px-4 pt-3">
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700" aria-label="Call customer"><Phone size={15} /></button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700" aria-label="Navigate"><Navigation size={15} /></button>
          <button type="button" className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold text-white" style={{ background: t }}>Slide to reach drop <ChevronRight size={14} /></button>
        </div>

        {/* weekly summary */}
        <div className="mt-3 border-t border-gray-100 px-4 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">This week</p>
            <span className="text-[10.5px] font-semibold text-gray-500">Mon – Sun · settles Monday</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[['Orders', '42'], ['Online hrs', '31.5'], ['Payout', '₹ —']].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-gray-50 px-2.5 py-2">
                <p className="text-[10px] font-semibold text-gray-500">{l}</p>
                <p className="text-[14px] font-black text-gray-900" style={MONO}>{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-end gap-1" aria-hidden>
            {[38, 54, 46, 70, 62, 84, 40].map((h, i) => <span key={i} className="flex-1 rounded-sm" style={{ height: `${h * .4}px`, background: i === 5 ? t : '#DBEAFE' }} />)}
          </div>
          <div className="mt-1 flex justify-between text-[9.5px] font-semibold text-gray-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div>
        </div>
      </div>
    </div>
  );
}

/* ── 2. Restaurant — partner dashboard card ─────────────────────────────── */
export function RestaurantDashboard({ className = '' }: { className?: string }) {
  const t = ORANGE;
  const ORDERS = [
    { id: '#ZE-1207', items: '2× Chicken Biryani, 1× Raita', time: '2 min ago', status: 'New', tone: t, bg: '#FFF7ED' },
    { id: '#ZE-1206', items: '1× Paneer Thali, 2× Roti', time: '9 min ago', status: 'Preparing', tone: BLUE, bg: '#EFF6FF' },
    { id: '#ZE-1205', items: '3× Veg Momos, 1× Cold Coffee', time: '14 min ago', status: 'Ready', tone: G, bg: '#ECFDF5' },
    { id: '#ZE-1204', items: '1× Dal Makhani, 1× Jeera Rice', time: '26 min ago', status: 'Picked up', tone: '#6B7280', bg: '#F3F4F6' },
  ];
  const MENU = [
    { name: 'Chicken Biryani', on: true, price: '₹ —', tag: 'Bestseller' },
    { name: 'Paneer Butter Masala', on: true, price: '₹ —', tag: '' },
    { name: 'Gulab Jamun (2 pc)', on: false, price: '₹ —', tag: 'Sold out' },
    { name: 'Masala Chai', on: true, price: '₹ —', tag: '' },
  ];
  return (
    <div className={`relative w-full max-w-[560px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(11,18,32,.14)] ${className}`}>
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: t }}><Flame size={16} /></span>
          <div>
            <p className="text-[13.5px] font-extrabold text-gray-900">Biryani House · Sector 12</p>
            <p className="text-[11px] text-gray-500">Zyphix Eats partner dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600"><Bell size={14} /><span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white" style={{ background: t }}>3</span></span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Accepting orders</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-200">
        {[['Today', '27', 'orders'], ['Preparing', '2', 'live'], ['Avg prep', '18', 'min'], ['Settles', 'Mon', 'weekly']].map(([l, v, s]) => (
          <div key={l} className="px-4 py-3">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">{l}</p>
            <p className="text-[18px] font-black leading-tight text-gray-900" style={MONO}>{v} <span className="text-[11px] font-semibold text-gray-400">{s}</span></p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1.15fr_1fr]">
        {/* orders */}
        <div className="border-b border-gray-200 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <p className="text-[12px] font-bold uppercase tracking-wider text-gray-500">Today's orders</p>
            <SampleTag />
          </div>
          <ul className="divide-y divide-gray-100">
            {ORDERS.map(o => (
              <li key={o.id} className="flex items-center gap-3 px-5 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[12.5px] font-bold text-gray-900" style={MONO}>{o.id}</p>
                    <span className="text-[10.5px] text-gray-400">{o.time}</span>
                  </div>
                  <p className="truncate text-[11.5px] text-gray-600">{o.items}</p>
                </div>
                <Pill tint={o.tone} bg={o.bg}>{o.status}</Pill>
              </li>
            ))}
          </ul>
          <div className="px-5 pb-4 pt-2">
            <button type="button" className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-bold text-white" style={{ background: t }}>Accept #ZE-1207 <ChevronRight size={14} /></button>
          </div>
        </div>

        {/* menu + prep */}
        <div>
          <div className="px-5 pt-4 pb-2">
            <p className="text-[12px] font-bold uppercase tracking-wider text-gray-500">Menu availability</p>
          </div>
          <ul className="divide-y divide-gray-100">
            {MENU.map(m => (
              <li key={m.name} className="flex items-center gap-2 px-5 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-[12.5px] font-semibold ${m.on ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{m.name}</p>
                  <p className="text-[10.5px] text-gray-400">{m.tag || m.price}</p>
                </div>
                <Toggle on={m.on} tint={t} />
              </li>
            ))}
          </ul>
          <div className="mx-5 mt-2 mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] font-bold text-gray-700">Prep time</p>
              <span className="text-[10.5px] font-semibold text-gray-400">Rider dispatched to match</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button type="button" aria-label="Decrease" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700"><Minus size={13} /></button>
              <div className="flex-1 text-center text-[18px] font-black text-gray-900" style={MONO}>18 <span className="text-[11px] font-semibold text-gray-400">min</span></div>
              <button type="button" aria-label="Increase" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700"><Plus size={13} /></button>
            </div>
            <Progress value={60} tint={t} className="mt-2.5" />
            <div className="mt-1 flex justify-between text-[9.5px] font-semibold text-gray-400"><span>10</span><span>20</span><span>30</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 3. Services — booking request card ─────────────────────────────────── */
export function ServicesBooking({ className = '' }: { className?: string }) {
  const t = VIOLET;
  const CHECKS = [
    { label: 'Inspect switchboard & MCB', done: true },
    { label: 'Replace faulty 16A socket', done: true },
    { label: 'Test earthing on 3 points', done: false },
    { label: 'Share photo of finished work', done: false },
  ];
  const VERIFY = [
    { label: 'Government ID', done: true },
    { label: 'Address proof', done: true },
    { label: 'Background check', done: true },
    { label: 'Skill confirmation call', done: false },
  ];
  const pct = Math.round((VERIFY.filter(v => v.done).length / VERIFY.length) * 100);
  return (
    <div className={`relative w-full max-w-[520px] ${className}`}>
      {/* booking card */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(11,18,32,.14)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: t }}><Wrench size={16} /></span>
            <div>
              <p className="text-[13.5px] font-extrabold text-gray-900">New booking request</p>
              <p className="text-[11px] text-gray-500">Electrician · Zyphix Book</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill tint={t} bg="#F5F3FF">Respond in 10 min</Pill>
            <SampleTag />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5 pt-4">
          <div className="rounded-2xl border border-gray-200 p-3">
            <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400"><Calendar size={11} /> Slot</p>
            <p className="mt-1 text-[13px] font-bold text-gray-900">Tomorrow · 10:00 – 12:00</p>
            <p className="text-[11px] text-gray-500">Approx. 1.5 hrs on site</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-3">
            <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400"><MapPin size={11} /> Address area</p>
            <p className="mt-1 text-[13px] font-bold text-gray-900">Sector 12, Block C</p>
            <p className="text-[11px] text-gray-500">2.1 km · exact flat shared on accept</p>
          </div>
        </div>

        <div className="px-5 pt-3">
          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Customer note</p>
            <p className="mt-1 text-[12.5px] leading-snug text-gray-700">"Kitchen socket sparks when the mixer runs. Also want the MCB checked — it trips in the evening."</p>
          </div>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-gray-500"><ClipboardCheck size={13} /> Job checklist</p>
            <span className="text-[10.5px] font-semibold text-gray-400">2 of 4</span>
          </div>
          <ul className="mt-2 space-y-1.5">
            {CHECKS.map(c => (
              <li key={c.label} className="flex items-center gap-2.5 rounded-xl border border-gray-100 px-3 py-2">
                {c.done ? <CheckCircle2 size={15} style={{ color: t }} /> : <Circle size={15} className="text-gray-300" />}
                <span className={`text-[12.5px] font-medium ${c.done ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 pb-5 pt-4">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Your rate card</p>
            <p className="flex items-center text-[16px] font-black text-gray-900" style={MONO}><IndianRupee size={13} /> — <span className="ml-1 text-[11px] font-semibold text-gray-400">visit + parts</span></p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="rounded-xl border border-gray-200 px-3.5 py-2 text-[12.5px] font-bold text-gray-700">Decline</button>
            <button type="button" className="rounded-xl px-4 py-2 text-[12.5px] font-bold text-white" style={{ background: t }}>Accept booking</button>
          </div>
        </div>
      </div>

      {/* verified badge progress */}
      <div className="absolute -right-3 -top-6 hidden w-[218px] rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xl sm:block md:-right-10">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: '#F5F3FF', color: t }}><BadgeCheck size={16} /></span>
          <div>
            <p className="text-[12px] font-extrabold text-gray-900">Verified badge</p>
            <p className="text-[10.5px] text-gray-500">{pct}% complete</p>
          </div>
        </div>
        <Progress value={pct} tint={t} className="mt-2.5" />
        <ul className="mt-2.5 space-y-1">
          {VERIFY.map(v => (
            <li key={v.label} className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700">
              {v.done ? <ShieldCheck size={12} style={{ color: t }} /> : <Circle size={12} className="text-gray-300" />} {v.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── 4. Store — catalogue / inventory card ──────────────────────────────── */
export function StoreCatalogue({ className = '' }: { className?: string }) {
  const t = G;
  const ITEMS = [
    { name: 'Amul Taaza Milk 500 ml', cat: 'Dairy', stock: 18, low: false, on: true },
    { name: 'Aashirvaad Atta 5 kg', cat: 'Staples', stock: 4, low: true, on: true },
    { name: 'Tata Salt 1 kg', cat: 'Staples', stock: 31, low: false, on: true },
    { name: 'Parle-G 800 g', cat: 'Snacks', stock: 0, low: true, on: false },
    { name: 'Dettol Handwash 200 ml', cat: 'Household', stock: 9, low: false, on: true },
  ];
  return (
    <div className={`relative w-full max-w-[540px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(11,18,32,.14)] ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: t }}><Store size={16} /></span>
          <div>
            <p className="text-[13.5px] font-extrabold text-gray-900">Sharma Kirana Store</p>
            <p className="text-[11px] text-gray-500">Catalogue · 312 items listed</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Store open</span>
          <SampleTag />
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 pt-4">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-[12px] text-gray-400"><Search size={13} /> Search or scan a product</div>
        <button type="button" aria-label="Scan barcode" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-700"><Barcode size={15} /></button>
      </div>
      <div className="flex gap-1.5 overflow-hidden px-5 pt-3">
        {['All', 'Dairy', 'Staples', 'Snacks', 'Household', 'Pharmacy'].map((c, i) => (
          <span key={c} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${i === 0 ? 'text-white' : 'bg-gray-100 text-gray-600'}`} style={i === 0 ? { background: t } : undefined}>{c}</span>
        ))}
      </div>

      <ul className="mt-3 divide-y divide-gray-100 border-t border-gray-100">
        {ITEMS.map(it => (
          <li key={it.name} className="flex items-center gap-3 px-5 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500"><Package size={15} /></span>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-[12.5px] font-semibold ${it.on ? 'text-gray-900' : 'text-gray-400'}`}>{it.name}</p>
              <div className="flex items-center gap-2 text-[10.5px] text-gray-500">
                <span>{it.cat}</span><span className="text-gray-300">·</span>
                <span className="flex items-center gap-1" style={MONO}>{it.low && <AlertCircle size={10} className={it.stock === 0 ? 'text-red-500' : 'text-amber-500'} />}{it.stock === 0 ? 'Out of stock' : `${it.stock} in stock`}</span>
              </div>
            </div>
            <span className="hidden text-[12px] font-bold text-gray-700 sm:block" style={MONO}>₹ —</span>
            <Toggle on={it.on} tint={t} />
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-200">
        {[[TrendingUp, 'Orders today', '14'], [AlertCircle, 'Low stock', '2'], [Bike, 'Riders nearby', '3']].map(([Icon, l, v]) => {
          const I = Icon as React.ComponentType<{ size?: number; className?: string }>;
          return (
            <div key={l as string} className="flex items-center gap-2.5 px-4 py-3">
              <I size={14} className="text-gray-400" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{l as string}</p>
                <p className="text-[15px] font-black leading-tight text-gray-900" style={MONO}>{v as string}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Hero floating card: compact order card ─────────────────────────────── */
export function HeroOrderCard() {
  return (
    <div className="w-[300px] rounded-3xl border border-gray-200 bg-white p-4 text-gray-900 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> New order</span>
        <SampleTag />
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-extrabold">#ZN-4821 · 6 items</p>
          <p className="text-[11.5px] text-gray-500">Sharma Kirana → Green Residency</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-black text-emerald-700" style={MONO}>1.6 km</span>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2">
        <Wallet size={14} className="text-gray-500" />
        <p className="flex-1 text-[11.5px] font-semibold text-gray-600">Payout shown before you accept</p>
        <span className="text-[13px] font-black" style={MONO}>₹ —</span>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" className="flex-1 rounded-xl border border-gray-200 py-2 text-[12.5px] font-bold text-gray-700">Skip</button>
        <button type="button" className="flex-1 rounded-xl py-2 text-[12.5px] font-bold text-white" style={{ background: G }}>Accept · 0:28</button>
      </div>
      <Progress value={46} tint={G} className="mt-2.5" />
    </div>
  );
}
