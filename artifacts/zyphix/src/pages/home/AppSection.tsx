import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, CheckCircle2, Smartphone, Share, PlusSquare } from 'lucide-react';
import { Section, Container, Eyebrow, Display, Lead, Card, Chip, Button, fade, INK } from '@/ui/kit';
import { apiFetch } from '@/lib/api';

/* ────────────────────────────────────────────────────────────────────────────
   App section — early-access form (same /api/notify contract) + coming-soon
   store badges + add-to-home-screen hint.
──────────────────────────────────────────────────────────────────────────── */

export function EarlyAccessForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('error'); return; }
    setState('loading');
    try {
      await apiFetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'landing' }) });
      try {
        const stored = JSON.parse(localStorage.getItem('zyphix_waitlist') || '[]') as object[];
        stored.push({ email, source: 'landing', ts: Date.now() });
        localStorage.setItem('zyphix_waitlist', JSON.stringify(stored));
      } catch { /* ignore */ }
      setState('done');
    } catch { setState('error'); }
  };

  if (state === 'done') {
    return (
      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2.5 text-[14px] font-semibold text-emerald-800 ring-1 ring-emerald-100">
        <CheckCircle2 size={17} /> You're on the list. See you at launch.
      </div>
    );
  }
  return (
    <>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <label className="relative flex-1">
          <Mail size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email" required value={email} onChange={e => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
            placeholder="you@email.com" aria-label="Email address"
            className="h-12 w-full rounded-full border bg-white pl-11 pr-4 text-[14.5px] text-gray-900 outline-none transition focus:ring-4 focus:ring-emerald-100"
            style={{ borderColor: state === 'error' ? '#EF4444' : '#E6E8EC' }}
          />
        </label>
        <Button type="submit" size="lg" className={state === 'loading' ? 'pointer-events-none opacity-70' : ''}>
          {state === 'loading' ? 'Joining…' : <>Notify me <ArrowRight size={15} /></>}
        </Button>
      </form>
      {state === 'error' && <p className="mt-2 text-[13px] font-medium text-red-500">Please enter a valid email address.</p>}
      <p className="mt-3 text-[12.5px] text-gray-500">No spam. One email when we launch in your area.</p>
    </>
  );
}

export function AppSection() {
  return (
    <Section id="app" tone="soft" className="scroll-mt-16">
      <Container>
        <Card hover={false} className="grid overflow-hidden lg:grid-cols-[1.1fr_.9fr]">
          <motion.div {...fade(0)} className="p-8 md:p-12">
            <Eyebrow className="mb-4">Early access</Eyebrow>
            <Display as="h2" size="md" className="text-gray-900">Be first in your neighbourhood.</Display>
            <Lead className="mt-4">We launch area by area. Leave your email and we'll tell you the moment Zyphix goes live near you.</Lead>
            <EarlyAccessForm />
          </motion.div>

          <motion.div {...fade(0.1)} className="border-t border-gray-200 bg-[#FAFAFA] p-8 md:p-12 lg:border-l lg:border-t-0">
            <p className="flex items-center gap-2 text-[14.5px] font-semibold tracking-[-0.01em] text-gray-900"><Smartphone size={15} className="text-emerald-700" /> The Zyphix app</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {[['/images/appstore.webp', 'App Store'], ['/images/googleplay.webp', 'Google Play']].map(([src, big]) => (
                <Link key={big} href="/app" className="inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-white transition hover:opacity-90" style={{ background: INK }}>
                  <img src={src} alt="" className="h-5 w-5 object-contain" loading="lazy" />
                  <span className="leading-tight"><span className="block text-[9.5px] font-medium text-white/60">Coming soon on</span><span className="block text-[13px] font-semibold">{big}</span></span>
                </Link>
              ))}
              <Chip tone="green" className="self-center">iOS &amp; Android · coming soon</Chip>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-[13.5px] font-semibold tracking-[-0.01em] text-gray-900">Use it today</p>
              <p className="mt-1 text-[13.5px] leading-[1.6] text-gray-600">Everything works in your browser. Add zyphix.in to your home screen for a full-screen experience.</p>
              <ul className="mt-4 space-y-2 text-[13px] text-gray-700">
                <li className="flex items-center gap-2.5"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 ring-1 ring-gray-200"><Share size={12} /></span>iPhone: Safari → Share → <b className="font-semibold">Add to Home Screen</b></li>
                <li className="flex items-center gap-2.5"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 ring-1 ring-gray-200"><PlusSquare size={12} /></span>Android: Chrome → Menu → <b className="font-semibold">Install app</b></li>
              </ul>
            </div>
          </motion.div>
        </Card>
      </Container>
    </Section>
  );
}
