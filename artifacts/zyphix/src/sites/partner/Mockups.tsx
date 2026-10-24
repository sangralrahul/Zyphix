import React from 'react';
import {
  Store, Home, Bike, CheckCircle2, Circle, Clock, Wallet, Bell, Flame, Minus, Plus,
  BadgeCheck, ShieldCheck, Calendar, MapPin, ClipboardCheck, Wrench, Navigation, Phone as PhoneIcon,
} from 'lucide-react';
import { G, Chip, SampleTag, Sparkline } from '@/ui/kit';
import { BLUE, ORANGE, VIOLET } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Product UI mock-ups built in HTML/CSS. Rendered inside kit `Phone` / `Browser`
   frames. Sample data is labelled with SampleTag; no money figures.
──────────────────────────────────────────────────────────────────────────── */

const NUM = { fontVariantNumeric: 'tabular-nums' } as const;

function Toggle({ on, tint }: { on: boolean; tint: string }) {
  return (
    <span aria-hidden className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full" style={{ background: on ? tint : '#E5E7EB' }}>
      <span className={`absolute h-4 w-4 rounded-full bg-white shadow ${on ? 'left-[18px]' : 'left-[2px]'}`} />
    </span>
  );
}

function Progress({ value, tint, className = '' }: { value: number; tint: string; className?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}>
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: tint }} />
    </div>
  );
}

function MiniMap({ tint }: { tint: string }) {
  return (
    <div className="relative h-[112px] overflow-hidden bg-[#EEF3EE]">
      <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgba(11,15,25,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(11,15,25,.07) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div aria-hidden className="absolute left-0 right-0 top-[40px] h-[8px] bg-white" />
      <div aria-hidden className="absolute left-0 right-0 top-[84px] h-[6px] bg-white" />
      <div aria-hidden className="absolute bottom-0 top-0 left-[64px] w-[7px] bg-white" />
      <div aria-hidden className="absolute bottom-0 top-0 left-[188px] w-[6px] bg-white" />
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 280 112" fill="none">
        <path d="M36 92 L68 92 L68 44 L190 44 L190 18 L240 18" stroke={tint} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 7" />
        <path d="M36 92 L68 92 L68 44 L124 44" stroke={tint} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="absolute left-[112px] top-[32px] flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md" style={{ background: tint }}><Bike size={13} /></span>
      <span className="absolute left-[26px] top-[80px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-white shadow"><Store size={12} /></span>
      <span className="absolute left-[228px] top-[6px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white shadow" style={{ background: G }}><Home size={12} /></span>
      <div className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-gray-700 shadow-sm" style={NUM}>1.6 km · 7 min</div>
      <SampleTag className="absolute right-2 top-2" />
    </div>
  );
}

/* ── 1. Partner app — active order, payout line, weekly summary (Phone) ─── */
export function PartnerAppScreen() {
  const t = BLUE;
  const steps = [
    { icon: Store, done: true, label: 'Pickup · Sharma Kirana', sub: 'Lane 4, Sector 12 · packed' },
    { icon: Bike, active: true, label: 'On the way', sub: '1.6 km via Main Road' },
    { icon: Home, label: 'Drop · Flat 3B, Green Residency', sub: 'Leave at door · paid online' },
  ];
  return (
    <div className="text-gray-900">
      <div className="flex items-center justify-between px-4 pb-2 pt-1">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Active order</p>
          <p className="text-[14px] font-semibold" style={NUM}>#ZN-4821</p>
        </div>
        <Chip tone="blue"><Clock size={11} /> Pick up in 4 min</Chip>
      </div>

      <MiniMap tint={t} />

      <div className="px-4 pt-3">
        {steps.map((s, i) => (
          <div key={s.label} className="relative flex gap-3 pb-2.5">
            {i < steps.length - 1 && <span aria-hidden className="absolute left-[10px] top-5 h-[calc(100%-10px)] w-px" style={{ background: s.done ? t : '#E5E7EB' }} />}
            <span className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: s.done || s.active ? t : '#E5E7EB', background: s.done ? t : '#fff', color: s.done ? '#fff' : s.active ? t : '#9CA3AF' }}>
              {s.done ? <CheckCircle2 size={12} /> : <s.icon size={11} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-[12px] font-semibold ${s.active ? 'text-gray-900' : 'text-gray-700'}`}>{s.label}</p>
              <p className="truncate text-[10.5px] text-gray-500">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 flex items-center justify-between rounded-xl border border-gray-200 bg-[#FAFAFA] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200"><Wallet size={13} /></span>
          <div>
            <p className="text-[11px] font-semibold text-gray-700">This order pays</p>
            <p className="text-[10px] text-gray-400">Shown before you accept</p>
          </div>
        </div>
        <p className="text-[15px] font-semibold text-gray-900" style={NUM}>₹ —</p>
      </div>

      <div className="flex gap-2 px-4 pt-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700"><PhoneIcon size={14} /></span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700"><Navigation size={14} /></span>
        <span className="flex h-9 flex-1 items-center justify-center rounded-lg text-[12.5px] font-semibold text-white" style={{ background: t }}>Reached drop</span>
      </div>

      <div className="mt-3 border-t border-gray-100 px-4 pb-4 pt-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">This week</p>
          <span className="text-[10px] font-medium text-gray-500">Settles Monday</span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div className="grid flex-1 grid-cols-2 gap-2">
            {[['Orders', '42'], ['Online hrs', '31.5']].map(([l, v]) => (
              <div key={l} className="rounded-lg bg-[#FAFAFA] px-2.5 py-1.5 ring-1 ring-gray-100">
                <p className="text-[9.5px] font-medium text-gray-500">{l}</p>
                <p className="text-[13.5px] font-semibold text-gray-900" style={NUM}>{v}</p>
              </div>
            ))}
          </div>
          <Sparkline data={[4, 7, 5, 9, 8, 12, 6]} color={t} className="shrink-0" />
        </div>
      </div>
    </div>
  );
}

/* ── 2. Restaurant — today's orders dashboard with menu toggles (Browser) ─ */
export function RestaurantDashboard() {
  const t = ORANGE;
  const orders = [
    { id: '#ZE-1207', items: '2× Chicken Biryani, 1× Raita', time: '2 min', status: 'New', tone: 'orange' as const },
    { id: '#ZE-1206', items: '1× Paneer Thali, 2× Roti', time: '9 min', status: 'Preparing', tone: 'blue' as const },
    { id: '#ZE-1205', items: '3× Veg Momos, 1× Cold Coffee', time: '14 min', status: 'Ready', tone: 'green' as const },
    { id: '#ZE-1204', items: '1× Dal Makhani, 1× Jeera Rice', time: '26 min', status: 'Picked up', tone: 'gray' as const },
  ];
  const menu = [
    { name: 'Chicken Biryani', on: true, tag: 'Bestseller' },
    { name: 'Paneer Butter Masala', on: true, tag: 'Available' },
    { name: 'Gulab Jamun (2 pc)', on: false, tag: 'Sold out today' },
    { name: 'Masala Chai', on: true, tag: 'Available' },
  ];
  return (
    <div className="text-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: t }}><Flame size={15} /></span>
          <div>
            <p className="text-[13px] font-semibold">Biryani House · Sector 12</p>
            <p className="text-[11px] text-gray-500">Zyphix Eats partner dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600"><Bell size={14} /><span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white" style={{ background: t }}>1</span></span>
          <Chip tone="green" className="hidden sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Accepting orders</Chip>
          <SampleTag />
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-200">
        {[['Today', '27 orders'], ['Preparing', '2 live'], ['Prep time', '18 min']].map(([l, v]) => (
          <div key={l} className="px-4 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{l}</p>
            <p className="text-[14px] font-semibold" style={NUM}>{v}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1.15fr_1fr]">
        <div className="border-b border-gray-200 md:border-b-0 md:border-r">
          <p className="px-4 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Today's orders</p>
          <ul className="divide-y divide-gray-100">
            {orders.map(o => (
              <li key={o.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[12.5px] font-semibold" style={NUM}>{o.id}</p>
                    <span className="text-[10.5px] text-gray-400">{o.time} ago</span>
                  </div>
                  <p className="truncate text-[11.5px] text-gray-600">{o.items}</p>
                </div>
                <Chip tone={o.tone}>{o.status}</Chip>
              </li>
            ))}
          </ul>
          <div className="px-4 pb-4 pt-2">
            <span className="flex h-9 w-full items-center justify-center rounded-lg text-[12.5px] font-semibold text-white" style={{ background: t }}>Accept #ZE-1207</span>
          </div>
        </div>

        <div>
          <p className="px-4 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Menu availability</p>
          <ul className="divide-y divide-gray-100">
            {menu.map(m => (
              <li key={m.name} className="flex items-center gap-2 px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-[12.5px] font-semibold ${m.on ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{m.name}</p>
                  <p className="text-[10.5px] text-gray-400">{m.tag}</p>
                </div>
                <Toggle on={m.on} tint={t} />
              </li>
            ))}
          </ul>
          <div className="mx-4 mb-4 mt-2 rounded-xl border border-gray-200 bg-[#FAFAFA] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] font-semibold text-gray-700">Prep time</p>
              <span className="text-[10px] text-gray-400">Rider timed to match</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700"><Minus size={12} /></span>
              <span className="flex-1 text-center text-[16px] font-semibold" style={NUM}>18 <span className="text-[11px] font-medium text-gray-400">min</span></span>
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700"><Plus size={12} /></span>
            </div>
            <Progress value={60} tint={t} className="mt-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 3. Zyphix Book — booking request with verified-badge progress (Phone) */
export function BookingScreen() {
  const t = VIOLET;
  const verify = [
    { label: 'Government ID', done: true },
    { label: 'Address proof', done: true },
    { label: 'Background check', done: true },
    { label: 'Skill confirmation call', done: false },
  ];
  const pct = Math.round((verify.filter(v => v.done).length / verify.length) * 100);
  const checks = ['Inspect switchboard & MCB', 'Replace faulty 16A socket', 'Test earthing on 3 points'];
  return (
    <div className="text-gray-900">
      <div className="mx-4 mt-1 rounded-xl border border-gray-200 bg-[#FAFAFA] p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-700 ring-1 ring-violet-100"><BadgeCheck size={14} /></span>
            <div>
              <p className="text-[12px] font-semibold">Verified badge</p>
              <p className="text-[10px] text-gray-500">{pct}% complete</p>
            </div>
          </div>
          <SampleTag />
        </div>
        <Progress value={pct} tint={t} className="mt-2.5" />
        <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
          {verify.map(v => (
            <li key={v.label} className="flex items-center gap-1.5 text-[10.5px] font-medium text-gray-700">
              {v.done ? <ShieldCheck size={11} style={{ color: t }} /> : <Circle size={11} className="text-gray-300" />} <span className="truncate">{v.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: t }}><Wrench size={14} /></span>
          <div>
            <p className="text-[13px] font-semibold">New booking request</p>
            <p className="text-[10.5px] text-gray-500">Electrician · Zyphix Book</p>
          </div>
        </div>
        <Chip tone="violet">10 min</Chip>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4">
        <div className="rounded-xl border border-gray-200 p-2.5">
          <p className="flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wider text-gray-400"><Calendar size={10} /> Slot</p>
          <p className="mt-0.5 text-[12px] font-semibold">Tomorrow · 10–12</p>
          <p className="text-[10px] text-gray-500">Approx. 1.5 hrs</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-2.5">
          <p className="flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wider text-gray-400"><MapPin size={10} /> Area</p>
          <p className="mt-0.5 text-[12px] font-semibold">Sector 12, Block C</p>
          <p className="text-[10px] text-gray-500">2.1 km · flat on accept</p>
        </div>
      </div>

      <div className="px-4 pt-2.5">
        <div className="rounded-xl bg-[#FAFAFA] p-2.5 ring-1 ring-gray-100">
          <p className="text-[9.5px] font-semibold uppercase tracking-wider text-gray-400">Customer note</p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-gray-700">"Kitchen socket sparks when the mixer runs. MCB trips in the evening."</p>
        </div>
      </div>

      <div className="px-4 pt-3">
        <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-gray-500"><ClipboardCheck size={12} /> Job checklist</p>
        <ul className="mt-1.5 space-y-1">
          {checks.map((c, i) => (
            <li key={c} className="flex items-center gap-2 rounded-lg border border-gray-100 px-2.5 py-1.5 text-[11.5px] font-medium text-gray-800">
              {i === 0 ? <CheckCircle2 size={13} style={{ color: t }} /> : <Circle size={13} className="text-gray-300" />} {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 px-4 pb-4 pt-3">
        <span className="flex h-9 flex-1 items-center justify-center rounded-lg border border-gray-200 text-[12.5px] font-semibold text-gray-700">Decline</span>
        <span className="flex h-9 flex-[1.4] items-center justify-center rounded-lg text-[12.5px] font-semibold text-white" style={{ background: t }}>Accept booking</span>
      </div>
    </div>
  );
}
