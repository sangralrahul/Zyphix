import React, { useState } from 'react';
import { ArrowRight, Mail, CheckCircle2, Clock, ShieldCheck, FileText } from 'lucide-react';
import { G, HEAD_FONT, btnPrimary } from '@/components/layout/SiteChrome';
import { apiFetch } from '@/lib/api';
import { CONTAINER, Eyebrow, H2, PARTNERSHIPS_EMAIL } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Inquiry form — light-green band. Submit contract is unchanged:
   POST /api/partner-register { name, email, phone, city, role:'advertiser',
   details:{ businessName, businessType, budgetRange, goal } }
──────────────────────────────────────────────────────────────────────────── */

const BUSINESS_TYPES = ['FMCG brand', 'Restaurant', 'Home services', 'D2C brand', 'Agency', 'Other'];
const BUDGETS = ['Under ₹25k', '₹25k–1L', '₹1L–5L', '₹5L+', 'Not sure'];

const inputCls = 'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100';
const labelCls = 'block text-[13px] font-bold text-gray-700 mb-1.5';

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
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
    <section id="contact" className="scroll-mt-20 border-y border-emerald-100" style={{ background: 'linear-gradient(180deg, #F0FDF4 0%, #ECFDF5 100%)' }}>
      <div className={`${CONTAINER} grid items-start gap-12 py-20 md:py-24 lg:grid-cols-[.8fr_1.2fr]`}>
        <div>
          <Eyebrow>Get in touch</Eyebrow>
          <H2>Tell us what you want to achieve.</H2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">Share a few details and the partnerships team will come back with placement ideas, the areas where Zyphix is live, and a flat-rate quote.</p>

          <ul className="mt-8 space-y-3">
            {[
              [<Clock size={16} />, 'Reply within 2 working days', 'A real person from partnerships, not an auto-responder.'],
              [<FileText size={16} />, 'A written plan and quote', 'Formats, areas, dates and one flat price — before you commit to anything.'],
              [<ShieldCheck size={16} />, 'Your details stay with us', 'Used only to reply to this inquiry. No lists, no resale.'],
            ].map(([ic, t, d]) => (
              <li key={t as string} className="flex gap-3 rounded-2xl border border-emerald-100 bg-white p-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">{ic}</span>
                <div><p className="text-[14px] font-bold text-gray-900">{t as string}</p><p className="mt-0.5 text-[13px] text-gray-600">{d as string}</p></div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-3xl border border-emerald-100 bg-white p-6">
            <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Prefer email?</p>
            <a href={`mailto:${PARTNERSHIPS_EMAIL}?subject=Advertising%20on%20Zyphix`} className="mt-2 inline-flex items-center gap-2 text-[15.5px] font-bold text-emerald-700 hover:text-emerald-800"><Mail size={17} /> {PARTNERSHIPS_EMAIL}</a>
            <p className="mt-3 text-[13.5px] leading-relaxed text-gray-600">Include your business name, the cities or neighbourhoods you serve and what you'd like to run.</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-emerald-100 bg-white p-6 shadow-[0_24px_60px_rgba(13,163,102,.10)] md:p-8">
          {state === 'done' ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><CheckCircle2 size={28} /></span>
              <h3 className="text-[24px] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>Thanks — partnerships will reply within 2 working days.</h3>
              <p className="text-[14.5px] leading-relaxed text-gray-600">We've received your inquiry for <span className="font-semibold text-gray-900">{form.businessName}</span>. Expect a short email with the areas where Zyphix is live near {form.city}, suggested formats and a flat quote. If anything is urgent, write to <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="font-semibold text-emerald-700">{PARTNERSHIPS_EMAIL}</a>.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['Business type: ' + form.businessType, 'Budget: ' + form.budgetRange].map(x => <span key={x} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[12.5px] font-semibold text-gray-700">{x}</span>)}
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Advertiser inquiry</p>
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
                <Field label="City"><input className={inputCls} value={form.city} onChange={set('city')} placeholder="Delhi" autoComplete="address-level2" required /></Field>
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
                <textarea rows={4} className={`${inputCls} resize-y`} value={form.goal} onChange={set('goal')} placeholder="e.g. Launch our new oats range in South Delhi and get it into first baskets; or get more weekend dinner orders for our restaurant in Indiranagar." />
              </Field>

              {state === 'error' && error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] font-semibold text-red-600">
                  {error} {error.includes('server') && <a href={mailto} className="underline">Send by email instead.</a>}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" disabled={state === 'loading'} className={`${btnPrimary} justify-center disabled:opacity-70`} style={{ background: G }}>
                  {state === 'loading' ? 'Sending…' : <>Send inquiry <ArrowRight size={16} /></>}
                </button>
                <a href={mailto} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-gray-900"><Mail size={14} /> Or send this by email</a>
              </div>
              <p className="text-[12.5px] text-gray-500">By sending, you agree to be contacted about advertising on Zyphix. We only use these details to reply to your inquiry.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
