import React, { useState } from 'react';
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Container, Chip } from '@/ui/kit';
import { Dark, Glow, Grain, Kicker, Headline, Sub, Reveal } from '@/ui/cinema';
import { PARTNERSHIPS_EMAIL } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Inquiry form — white card on a dark Glow band. Submit contract is unchanged:
   POST /api/partner-register { name, email, phone, city, role:'advertiser',
   details:{ businessName, businessType, budgetRange, goal } }
──────────────────────────────────────────────────────────────────────────── */

const BUSINESS_TYPES = ['FMCG brand', 'Restaurant', 'Home services', 'D2C brand', 'Agency', 'Other'];
const BUDGETS = ['Under ₹25k', '₹25k–1L', '₹1L–5L', '₹5L+', 'Not sure'];

const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[14.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100';

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-gray-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-gray-500">{hint}</span>}
    </label>
  );
}

export function InquiryForm() {
  const [form, setForm] = useState({ businessName: '', contactName: '', email: '', phone: '', city: '', businessType: '', budgetRange: '', goal: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (state === 'error') { setState('idle'); setError(''); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = form.phone.replace(/\D/g, '');
    if (!form.businessName.trim() || !form.contactName.trim() || !form.city.trim()) { setState('error'); setError('Please fill in all required fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setState('error'); setError('Please enter a valid email address.'); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { setState('error'); setError('Please enter a valid 10-digit Indian mobile number.'); return; }
    if (!form.businessType || !form.budgetRange) { setState('error'); setError('Please choose a business type and a budget range.'); return; }

    setState('loading');
    try {
      const res = await apiFetch('/api/partner-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.contactName.trim(),
          email: form.email.trim(),
          phone,
          city: form.city.trim(),
          role: 'advertiser',
          details: { businessName: form.businessName.trim(), businessType: form.businessType, budgetRange: form.budgetRange, goal: form.goal.trim() },
        }),
      });
      let data: { success?: boolean; error?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON */ }
      if (res.ok && data.success !== false && !data.error) { setState('done'); }
      else { setState('error'); setError(data.error || 'Something went wrong. Please try again or email us directly.'); }
    } catch {
      setState('error'); setError('Could not reach our server. Please try again or email us directly.');
    }
  };

  const mailto = `mailto:${PARTNERSHIPS_EMAIL}?subject=${encodeURIComponent('Advertising on Zyphix')}&body=${encodeURIComponent(`Business: ${form.businessName}\nContact: ${form.contactName}\nPhone: ${form.phone}\nCity: ${form.city}\nType: ${form.businessType}\nBudget: ${form.budgetRange}\n\nGoal:\n${form.goal}`)}`;

  return (
    <Dark id="contact" className="scroll-mt-16 py-24 md:py-36">
      <Glow x="20%" y="20%" size={900} alpha={0.3} />
      <Glow x="90%" y="95%" size={700} alpha={0.18} />
      <Grain />
      <Container className="relative grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal><Kicker light>Get in touch</Kicker></Reveal>
          <Reveal delay={0.05}><Headline size="lg" light>Tell us what you want to achieve.</Headline></Reveal>
          <Reveal delay={0.1}><Sub light className="mt-5 max-w-[460px]">Share a few details and partnerships will reply with placement ideas, the areas where Zyphix is live, and a flat quote.</Sub></Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.05] p-6 backdrop-blur">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-white/45">Prefer email?</p>
              <a href={`mailto:${PARTNERSHIPS_EMAIL}?subject=Advertising%20on%20Zyphix`} className="mt-2 inline-flex items-center gap-2 break-all text-[16px] font-semibold text-emerald-300 hover:text-emerald-200"><Mail size={16} className="shrink-0" /> {PARTNERSHIPS_EMAIL}</a>
              <p className="mt-3 text-[14px] leading-[1.6] text-white/60">Include your business name, the areas you serve and what you'd like to run. Your details are used only to reply to this inquiry.</p>
            </div>
          </Reveal>
        </div>

        <Reveal y={32} delay={0.1} className="lg:col-span-7"><div className="rounded-3xl bg-white p-6 text-gray-900 shadow-[0_40px_120px_rgba(0,0,0,.45),0_0_0_1px_rgba(255,255,255,.06)] sm:p-8 md:p-10">
          {state === 'done' ? (
            <div className="flex flex-col items-start gap-4 py-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><CheckCircle2 size={24} /></span>
              <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-gray-900">Thanks — partnerships will be in touch.</h3>
              <p className="text-[14.5px] leading-[1.6] text-gray-600">We've received your inquiry for <span className="font-medium text-gray-900">{form.businessName}</span>. Expect an email with the areas live near {form.city}, suggested formats and a flat quote. Anything urgent: <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="font-medium text-emerald-700">{PARTNERSHIPS_EMAIL}</a>.</p>
              <div className="flex flex-wrap gap-2"><Chip>{form.businessType}</Chip><Chip>{form.budgetRange}</Chip></div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-gray-900">Advertiser inquiry</p>
                <p className="text-[12px] text-gray-400">All fields required except goal</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Business name"><input className={inputCls} value={form.businessName} onChange={set('businessName')} placeholder="Acme Foods Pvt. Ltd." autoComplete="organization" required /></Field>
                <Field label="Contact name"><input className={inputCls} value={form.contactName} onChange={set('contactName')} placeholder="Your full name" autoComplete="name" required /></Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Work email"><input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="you@company.com" autoComplete="email" required /></Field>
                <Field label="Phone (10 digits)" hint="Indian mobile number, no country code"><input type="tel" inputMode="numeric" maxLength={10} className={inputCls} value={form.phone} onChange={set('phone')} placeholder="98765 43210" autoComplete="tel-national" required /></Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="City"><input className={inputCls} value={form.city} onChange={set('city')} placeholder="Your city" autoComplete="address-level2" required /></Field>
                <Field label="Business type">
                  <select className={inputCls} value={form.businessType} onChange={set('businessType')} required>
                    <option value="">Select…</option>
                    {BUSINESS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
                <Field label="Monthly budget range">
                  <select className={inputCls} value={form.budgetRange} onChange={set('budgetRange')} required>
                    <option value="">Select…</option>
                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="What do you want to achieve?">
                <textarea rows={4} className={`${inputCls} resize-y`} value={form.goal} onChange={set('goal')} placeholder="e.g. Launch our new oats range in Gandhi Nagar; or get more weekend dinner orders for our restaurant." />
              </Field>

              {state === 'error' && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] font-medium text-red-600">
                  {error} {error.includes('server') && <a href={mailto} className="underline">Send by email instead.</a>}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" disabled={state === 'loading'} className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[14.5px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.2)] transition hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(13,163,102,.35)] disabled:opacity-70" style={{ background: 'linear-gradient(180deg, #13B874 0%, #0DA366 100%)' }}>
                  {state === 'loading' ? 'Sending…' : <>Send inquiry <ArrowRight size={15} /></>}
                </button>
                <a href={mailto} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-600 hover:text-gray-900"><Mail size={14} /> Or send this by email</a>
              </div>
              <p className="text-[12.5px] text-gray-500">By sending, you agree to be contacted about advertising on Zyphix. We only use these details to reply to your inquiry.</p>
            </form>
          )}
        </div></Reveal>
      </Container>
    </Dark>
  );
}
