import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, FileSearch, Loader2, Search, XCircle, EyeOff } from 'lucide-react';
import { Container } from '@/ui/kit';

/* partner.zyphix.in/status: applicants check their application with the mobile number and email they used. */
type App = { id: string; type: string; name: string; status: 'pending' | 'live' | 'rejected' | 'hidden'; createdAt: string; updatedAt: string };
const TRACK: Record<string, string> = { store: 'Store owner', restaurant: 'Restaurant & kitchen', service: 'Zyphix Book professional', delivery: 'Delivery partner' };
const STEPS = ['Received', 'Under review', 'Live on Zyphix'];
const stepOf = (s: App['status']) => (s === 'live' ? 2 : 1);
const when = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export function PartnerStatus() {
  React.useEffect(() => { document.title = 'Application status · Zyphix Partners'; window.scrollTo(0, 0); }, []);
  const [phone, setPhone] = useState(''); const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [apps, setApps] = useState<App[] | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (!/^\d{10}$/.test(phone)) return setErr('Enter the 10-digit mobile number you applied with.');
    if (!email.includes('@')) return setErr('Enter the email you applied with.');
    setBusy(true);
    try {
      const r = await fetch('/api/partner-status', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone, email }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Something went wrong.');
      setApps(d.applications);
    } catch (e2) { setErr((e2 as Error).message); }
    setBusy(false);
  };
  const input = 'h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100';
  return (
    <section className="bg-[#F6F7F9] py-14 md:py-20">
      <Container className="max-w-[720px]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Partner portal</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-[1.08] tracking-[-0.04em] text-gray-900 md:text-[44px]">Check your application</h1>
        <p className="mt-3 max-w-[52ch] text-[15.5px] leading-[1.6] text-gray-500">Use the mobile number and email from your application. You'll see where it is and what happens next.</p>

        <form onSubmit={submit} className="mt-8 grid gap-3 rounded-[24px] border border-gray-200 bg-white p-5 shadow-[0_20px_50px_-30px_rgba(16,24,40,.3)] sm:grid-cols-[1fr_1fr_auto] md:p-6">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 pl-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
            <span className="text-[15px] font-semibold text-gray-500">+91</span>
            <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="Mobile number" aria-label="Mobile number" className="h-12 min-w-0 flex-1 bg-transparent pr-3 text-[15px] outline-none" />
          </div>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" aria-label="Email" className={input} />
          <button type="submit" disabled={busy} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0DA366] px-5 text-[15px] font-semibold text-white disabled:opacity-60">
            {busy ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />} Check
          </button>
          {err && <p className="text-[13.5px] font-medium text-rose-600 sm:col-span-3">{err}</p>}
        </form>

        {apps && apps.length === 0 && (
          <div className="mt-6 rounded-[24px] border border-gray-200 bg-white p-6 text-center">
            <FileSearch size={28} className="mx-auto text-gray-300" />
            <p className="mt-3 text-[16px] font-semibold text-gray-900">No application found</p>
            <p className="mx-auto mt-1 max-w-[46ch] text-[14px] text-gray-500">Check the number and email, or apply now. It takes about ten minutes.</p>
            <a href="/#tracks" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-emerald-700">Pick a track <ArrowRight size={15} /></a>
          </div>
        )}

        {apps && apps.map(a => {
          const step = stepOf(a.status);
          const bad = a.status === 'rejected' || a.status === 'hidden';
          return (
            <article key={a.id} className="mt-6 rounded-[24px] border border-gray-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[12.5px] font-semibold text-emerald-700">{TRACK[a.type] ?? a.type}</p>
                  <p className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-gray-900">{a.name}</p>
                  <p className="mt-0.5 text-[13px] text-gray-500">Applied {when(a.createdAt)} · Ref {a.id}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-semibold ${a.status === 'live' ? 'bg-emerald-50 text-emerald-800' : bad ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'}`}>
                  {a.status === 'live' ? <CheckCircle2 size={14} /> : a.status === 'rejected' ? <XCircle size={14} /> : a.status === 'hidden' ? <EyeOff size={14} /> : <Clock size={14} />}
                  {a.status === 'live' ? 'Approved' : a.status === 'rejected' ? 'Not approved' : a.status === 'hidden' ? 'Paused' : 'Under review'}
                </span>
              </div>
              {!bad && (
                <ol className="mt-6 grid grid-cols-3 gap-2">
                  {STEPS.map((s, i) => (
                    <li key={s}>
                      <span className={`block h-1.5 rounded-full ${i <= step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      <span className={`mt-2 block text-[12.5px] font-semibold ${i <= step ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
                    </li>
                  ))}
                </ol>
              )}
              <p className="mt-5 rounded-2xl bg-gray-50 p-4 text-[14px] leading-[1.6] text-gray-600">
                {a.status === 'live' && 'You are live on Zyphix. Customers nearby can now find you. Your onboarding manager will help with anything you need.'}
                {a.status === 'pending' && 'Our team is reviewing your details. Your onboarding manager will call you within two working days of applying.'}
                {a.status === 'rejected' && 'We could not approve this application. Check your email for the reason; you can write to partnerships@zyphix.in to apply again.'}
                {a.status === 'hidden' && 'Your listing is paused. Write to partnerships@zyphix.in and we will help you go live again.'}
              </p>
            </article>
          );
        })}
      </Container>
    </section>
  );
}
