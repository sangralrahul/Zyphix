import React, { useState } from 'react';
import { motion } from '@/lib/motion';
import { Mail, Send, Check, ArrowRight, LifeBuoy, Handshake, Newspaper, Scale, MessageCircle } from 'lucide-react';
import { btnSecondary, G } from '@/components/layout/SiteChrome';
import { Reveal } from '@/ui/cinema';
import { landscape } from '@/data/media';
import { InnerPage, InnerHero, SectionIntro, Band, panel, iconChip } from './home/Inner';

/* ────────────────────────────────────────────────────────────────────────────
   Contact — message form (saved to the admin inbox + emailed to the team), email cards, quick links.
──────────────────────────────────────────────────────────────────────────── */

const EMAILS = [
  { icon: <MessageCircle size={18} />, title: 'General enquiries', email: 'hello@zyphix.in', note: 'Anything that doesn\'t fit below.' },
  { icon: <LifeBuoy size={18} />, title: 'Customer support', email: 'support@zyphix.in', note: 'Orders, refunds, accounts and delivery issues.' },
  { icon: <Handshake size={18} />, title: 'Partnerships', email: 'partnerships@zyphix.in', note: 'Stores, restaurants, delivery and business partners.' },
  { icon: <Newspaper size={18} />, title: 'Press & media', email: 'press@zyphix.in', note: 'Interviews, quotes and media assets.' },
  { icon: <Scale size={18} />, title: 'Legal & compliance', email: 'legal@zyphix.in', note: 'Privacy, terms and legal notices.' },
];

const QUICK: Array<{ q: string; a: string; href: string; cta: string }> = [
  { q: 'Where is Zyphix available?', a: 'We are rolling out neighbourhood by neighbourhood. Enter your location at now.zyphix.in to check if we deliver to you and see live partners nearby.', href: 'https://now.zyphix.in/', cta: 'Open the app' },
  { q: 'How do I list my store or restaurant?', a: 'Onboarding is free. Register from the partner page and our team will verify your business and help you go live.', href: 'https://partner.zyphix.in/', cta: 'Partner overview' },
  { q: 'How do I become a delivery partner?', a: 'Sign up with your vehicle details and documents. Short, local runs in your own area, on your own schedule.', href: 'https://partner.zyphix.in/delivery', cta: 'Start delivering' },
  { q: 'Where can I read your policies?', a: 'Our privacy policy and terms of service explain how we handle your data and what you can expect from us.', href: '/privacy', cta: 'Privacy policy' },
];

const inputCls = (err?: string) =>
  `w-full rounded-2xl border px-4 py-3 text-[14.5px] text-gray-900 outline-none transition focus:ring-4 focus:ring-emerald-100 ${err ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-emerald-400'}`;

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState('');
  const [trap, setTrap] = useState(''); // honeypot: hidden from people, bots fill it

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.subject) e.subject = 'Please select a topic';
    if (!form.message.trim() || form.message.length < 20) e.message = 'Please provide more detail (min 20 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setApiError('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, website: trap, source: 'zyphix.in/contact' }) });
      const data = await res.json().catch(() => ({})) as { error?: string };
      if (!res.ok) { setApiError(data.error || 'We could not send your message. Please try again or email us directly.'); setLoading(false); return; }
      setSent(true);
    } catch {
      setApiError('We could not reach our server. Check your connection, or email hello@zyphix.in.');
    }
    setLoading(false);
  };

  return (
    <InnerPage title="Contact">
      <InnerHero
        photo={landscape('people', 0)}
        position="center 35%"
        height="min-h-[60svh] md:min-h-[64svh]"
        kicker="Contact"
        parts={["We're here to", { accent: 'help.', green: true }]}
        sub="Questions about an order, a partnership or the company. Send us a message, or write to the right inbox below."
      />

      <Band>
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-10">
          {/* Email cards */}
          <div className="grid gap-4">
            {EMAILS.map((c, i) => (
              <motion.a key={c.email} href={`mailto:${c.email}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05, duration: .4 }}
                className={`${panel} flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(11,18,32,.08)]`}>
                <span className={iconChip}>{c.icon}</span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">{c.title}</p>
                  <p className="mt-0.5 truncate text-[14px] font-semibold" style={{ color: G }}>{c.email}</p>
                  <p className="mt-1 text-[13px] text-gray-500">{c.note}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .45 }} className={`${panel} p-7 shadow-[0_24px_60px_-30px_rgba(11,15,25,.25)] md:p-10`}>
            {sent ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Check size={30} /></div>
                <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-gray-900">Message received</h3>
                <p className="mx-auto mt-2 max-w-[400px] text-[14.5px] leading-relaxed text-gray-600">Thanks, {form.name.trim() || 'there'}. We'll reply to <strong className="text-gray-900">{form.email}</strong> as soon as we can.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className={`${btnSecondary} mt-6`}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-gray-900">Send us a message</h2>
                  <p className="mt-1 text-[14px] text-gray-500">Fields marked * are required.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">Name *</label>
                    <input value={form.name} onChange={set('name')} placeholder="Your name" className={inputCls(errors.name)} />
                    {errors.name && <p className="mt-1 text-[12px] font-semibold text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">Email *</label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={inputCls(errors.email)} />
                    {errors.email && <p className="mt-1 text-[12px] font-semibold text-red-500">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">Topic *</label>
                  <select value={form.subject} onChange={set('subject')} className={`${inputCls(errors.subject)} cursor-pointer`}>
                    <option value="">Select a topic…</option>
                    <option value="order">Order issue or refund</option>
                    <option value="account">Account or login</option>
                    <option value="delivery">Delivery complaint</option>
                    <option value="partner">Partner onboarding</option>
                    <option value="payment">Payment problem</option>
                    <option value="press">Press & media</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && <p className="mt-1 text-[12px] font-semibold text-red-500">{errors.subject}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">Message *</label>
                  <textarea value={form.message} onChange={set('message')} rows={5} placeholder="Describe your issue or question in detail…" className={`${inputCls(errors.message)} min-h-[130px] resize-y`} />
                  <div className="mt-1 flex items-center justify-between">
                    {errors.message ? <p className="text-[12px] font-semibold text-red-500">{errors.message}</p> : <span />}
                    <p className="text-[12px] text-gray-400">{form.message.length} chars</p>
                  </div>
                </div>
                <input type="text" name="website" value={trap} onChange={e => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                {apiError && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] font-medium text-red-700">{apiError}</p>}
                <button type="submit" disabled={loading}
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full px-7 text-[15.5px] font-semibold text-white transition hover:opacity-95 disabled:cursor-wait disabled:opacity-70"
                  style={{ background: G }}>
                  {loading ? <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Sending…</> : <><Send size={15} />Send message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </Band>

      {/* Quick links */}
      <Band tone="soft">
          <SectionIntro kicker="Quick answers" title="Common questions, answered." />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {QUICK.map((q, i) => (
              <Reveal key={q.q} delay={i * 0.05} y={20} className={`${panel} flex flex-col p-7`}>
                <h3 className="text-[20px] font-semibold tracking-[-0.025em] text-gray-900">{q.q}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-gray-600">{q.a}</p>
                <a href={q.href} className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold" style={{ color: G }}>{q.cta} <ArrowRight size={15} /></a>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-[13.5px] text-gray-500">
            Prefer email? Write to <a href="mailto:hello@zyphix.in" className="inline-flex items-center gap-1 font-semibold text-gray-800"><Mail size={14} /> hello@zyphix.in</a>
          </p>
      </Band>
    </InnerPage>
  );
}

export default Contact;
