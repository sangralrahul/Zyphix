import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from '@/lib/motion';
import { joinWaitlist, sendRequest, OFFLINE_MSG } from '@/lib/requests';

const G = '#0DA366';
const input = 'h-12 w-full rounded-xl border-[1.5px] border-gray-200 bg-white px-4 text-[15px] text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-emerald-600 focus:shadow-[0_0_0_4px_rgba(13,163,102,.12)]';

function Done({ title, body }: { title: string; body: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white" style={{ background: G }}><Check size={20} strokeWidth={3} /></span>
      <div><p className="text-[15px] font-semibold text-emerald-900">{title}</p><p className="mt-0.5 text-[13.5px] leading-[1.5] text-emerald-800/80">{body}</p></div>
    </motion.div>
  );
}

function Phone({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex h-12 items-center rounded-xl border-[1.5px] border-gray-200 bg-white transition hover:border-gray-300 focus-within:border-emerald-600 focus-within:shadow-[0_0_0_4px_rgba(13,163,102,.12)]">
      <span className="border-r border-gray-200 px-3.5 text-[15px] font-medium text-gray-700">+91</span>
      <input value={value} onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" autoComplete="tel-national" placeholder="Mobile number" aria-label="Mobile number"
        className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-[15px] text-gray-900 outline-none placeholder:text-gray-400" />
    </label>
  );
}

/** "Tell me when it opens near me" */
export function WaitlistForm({ product, cta = 'Notify me' }: { product: 'now' | 'eats' | 'book'; cta?: string }) {
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [city, setCity] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle'); const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) { setErr('Enter a 10-digit mobile number.'); return; }
    if (!city.trim()) { setErr('Tell us your city or area.'); return; }
    setState('busy'); setErr('');
    try { await joinWaitlist(product, { name: name.trim(), phone, city: city.trim() }); setState('done'); }
    catch { setErr(OFFLINE_MSG); setState('idle'); }
  };
  if (state === 'done') return <Done title="You're on the list" body={`We'll message +91 ${phone} as soon as we open in ${city.trim()}.`} />;
  return (
    <form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-2">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" aria-label="Your name" className={input} />
      <Phone value={phone} onChange={setPhone} />
      <input value={city} onChange={e => setCity(e.target.value)} placeholder="City and area" aria-label="City and area" className={`${input} sm:col-span-2`} />
      <AnimatePresence>{err && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} role="alert" className="text-[13px] font-medium text-red-600 sm:col-span-2">{err}</motion.p>}</AnimatePresence>
      <button disabled={state === 'busy'} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold text-white disabled:opacity-70 sm:col-span-2" style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>
        {state === 'busy' && <Loader2 size={17} className="animate-spin" />}{cta}
      </button>
    </form>
  );
}

/** Order by request: the customer says what they want, the team calls to confirm. */
export function OrderRequestForm({ restaurant }: { restaurant: string }) {
  const [what, setWhat] = useState(''); const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [address, setAddress] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle'); const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (what.trim().length < 3) { setErr('Tell us what you would like to order.'); return; }
    if (!name.trim()) { setErr('Add your name.'); return; }
    if (!/^\d{10}$/.test(phone)) { setErr('Enter a 10-digit mobile number.'); return; }
    if (address.trim().length < 6) { setErr('Add your delivery address.'); return; }
    setState('busy'); setErr('');
    try { await sendRequest('eats', { name, phone, address }, [{ name: `${restaurant}: ${what.trim()}` }], { restaurant }); setState('done'); }
    catch { setErr(OFFLINE_MSG); setState('idle'); }
  };
  if (state === 'done') return <Done title="Order request sent" body={`${restaurant} has your request. We'll call +91 ${phone} to confirm the items, price and delivery time. Nothing is charged until then.`} />;
  return (
    <form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-2">
      <textarea value={what} onChange={e => setWhat(e.target.value)} rows={3} placeholder="What would you like? e.g. 2 butter naan, 1 paneer tikka" aria-label="Your order"
        className="w-full resize-none rounded-xl border-[1.5px] border-gray-200 bg-white px-4 py-3 text-[15px] text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-emerald-600 focus:shadow-[0_0_0_4px_rgba(13,163,102,.12)] sm:col-span-2" />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" aria-label="Your name" className={input} />
      <Phone value={phone} onChange={setPhone} />
      <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Delivery address" autoComplete="street-address" aria-label="Delivery address" className={`${input} sm:col-span-2`} />
      <AnimatePresence>{err && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} role="alert" className="text-[13px] font-medium text-red-600 sm:col-span-2">{err}</motion.p>}</AnimatePresence>
      <button disabled={state === 'busy'} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold text-white disabled:opacity-70 sm:col-span-2" style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>
        {state === 'busy' && <Loader2 size={17} className="animate-spin" />}Send order request
      </button>
      <p className="text-center text-[12.5px] text-gray-500 sm:col-span-2">No payment now. We confirm by phone before anything is cooked.</p>
    </form>
  );
}
