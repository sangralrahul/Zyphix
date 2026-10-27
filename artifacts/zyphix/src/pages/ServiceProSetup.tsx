import React, { useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { useLocation } from 'wouter';
import {
  ArrowLeft, ArrowRight, Check, User, Briefcase, ShieldCheck, Sparkles, Zap, Wrench, Snowflake,
  Paintbrush, Hammer, Droplets, ChefHat, Truck, Bug, Users, MapPin, Clock, type LucideIcon,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { RegisterShell } from '@/components/register/RegisterShell';
import { exportApplicationPDF } from '@/components/register/applicationPdf';
import { FileDown } from 'lucide-react';
import { StepIntro, Section, Field as KitField, TextInput, Actions, StateCityFields, isPhone, isEmail, digits10 } from '@/components/register/FormKit';
import { Mail, Building2 } from 'lucide-react';
import { RegisterSuccess, SuccessButton } from '@/components/register/RegisterSuccess';
import { G, HEAD_FONT } from '@/components/layout/SiteChrome';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Book — service professional signup (3 steps + success)
   Light surfaces, gray-200 borders, green accent, violet tint for the category.
──────────────────────────────────────────────────────────────────────────── */

const V = '#7C3AED';

export const SERVICE_CATEGORIES: Array<{ id: string; label: string; icon: LucideIcon }> = [
  { id: 'house_cleaning', label: 'House cleaning',   icon: Sparkles },
  { id: 'electrician',    label: 'Electrician',      icon: Zap },
  { id: 'plumber',        label: 'Plumber',          icon: Wrench },
  { id: 'ac_service',     label: 'AC service',       icon: Snowflake },
  { id: 'painter',        label: 'Painter',          icon: Paintbrush },
  { id: 'carpenter',      label: 'Carpenter',        icon: Hammer },
  { id: 'water_purifier', label: 'Water purifier',   icon: Droplets },
  { id: 'home_cook',      label: 'Home cook',        icon: ChefHat },
  { id: 'packers_movers', label: 'Packers & movers', icon: Truck },
  { id: 'pest_control',   label: 'Pest control',     icon: Bug },
];

const EXPERIENCE = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', 'More than 10 years'];
const RADIUS = ['3', '5', '10', '15', '20+'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = [
  { v: 'morning',   l: 'Morning',   t: '8 AM – 12 PM' },
  { v: 'afternoon', l: 'Afternoon', t: '12 PM – 4 PM' },
  { v: 'evening',   l: 'Evening',   t: '4 PM – 8 PM' },
  { v: 'flexible',  l: 'Flexible',  t: 'Any time' },
];
const ID_TYPES = ['Aadhaar', 'PAN', 'Driving licence', 'Voter ID'];

const STEPS = [
  { label: 'Personal',     icon: <User size={14} /> },
  { label: 'Profession',   icon: <Briefcase size={14} /> },
  { label: 'Verification', icon: <ShieldCheck size={14} /> },
  { label: 'Done',         icon: <Check size={14} /> },
];

type Personal = { name: string; phone: string; email: string; state: string; city: string; locality: string };
type Profession = {
  primaryCategory: string; additionalSkills: string[]; experience: string;
  workMode: 'solo' | 'team' | ''; teamSize: string; serviceRadiusKm: string;
  days: string[]; slots: string[];
};
type Verification = { idType: string; idLast4: string; bgConsent: boolean; terms: boolean };

type Errors = Record<string, string>;

/* ── Small UI atoms ──────────────────────────────────────────────────────── */
const labelCls = 'mb-2 block text-[13.5px] font-medium text-gray-800';
const inputCls = (err?: string) =>
  `zx-kit h-[52px] w-full rounded-2xl border-[1.5px] bg-white px-4 text-[15px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:!border-[var(--acc)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--acc)_14%,transparent)] ${
    err ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
  }`;

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return <KitField label={label} hint={hint} error={error}>{children}</KitField>;
}

function StepHead({ title, sub }: { title: string; sub: string }) {
  return <StepIntro title={title} sub={sub} />;
}

function NavButtons({ onBack, onNext, nextLabel, busy }: { onBack?: () => void; onNext: () => void; nextLabel: string; busy?: boolean }) {
  return <Actions onBack={onBack} onNext={onNext} label={nextLabel} busy={busy} note={onBack ? undefined : 'Free to apply. No joining fee.'} />;
}

const slide = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: .3, ease: 'easeOut' as const },
};

function StepBar({ step }: { step: number }) {
  return (
    <div className="border-b border-gray-200 bg-white px-5">
      <div className="mx-auto flex max-w-[900px] items-center py-4">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div className="flex min-w-[64px] flex-col items-center">
              <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-colors"
                style={{ background: i <= step ? G : '#E5E7EB', color: i <= step ? '#fff' : '#9CA3AF' }}>
                {i < step ? <Check size={15} /> : i === step ? s.icon : i + 1}
              </div>
              <span className={`whitespace-nowrap text-[10.5px] ${i <= step ? 'font-bold text-gray-900' : 'font-medium text-gray-400'}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="mx-1 mb-[18px] h-0.5 flex-1 transition-colors" style={{ background: i < step ? G : '#E5E7EB' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step 1: Personal ────────────────────────────────────────────────────── */
function PersonalStep({ initial, onNext }: { initial: Personal; onNext: (d: Personal) => void }) {
  const [form, setForm] = useState<Personal>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const f = (k: keyof Personal, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const next = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.state) e.state = 'Choose your state';
    if (!form.city.trim()) e.city = 'Choose or type your city';
    if (!form.locality.trim()) e.locality = 'Area / locality is required';
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext({ ...form, name: form.name.trim(), email: form.email.trim(), city: form.city.trim(), locality: form.locality.trim() });
  };

  return (
    <motion.div {...slide}>
      <StepHead title="Let's start with you" sub="Takes about two minutes. We use this to reach you during onboarding." />
      <Section n={1} first title="About you" desc="Use the name on your government ID.">
        <KitField label="Full name" error={errors.name} full>
          <TextInput icon={<User size={18} />} value={form.name} onValue={v => f('name', v)} placeholder="As on your government ID" autoComplete="name" invalid={!!errors.name} valid={form.name.trim().length > 2} />
        </KitField>
        <KitField label="Mobile number" error={errors.phone}>
          <TextInput prefix="+91" value={form.phone} onValue={v => f('phone', digits10(v))} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" invalid={!!errors.phone} valid={isPhone(form.phone)} />
        </KitField>
        <KitField label="Email" error={errors.email}>
          <TextInput icon={<Mail size={18} />} value={form.email} onValue={v => f('email', v)} type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} valid={isEmail(form.email)} />
        </KitField>
      </Section>
      <Section n={2} title="Where you work" desc="Customers near this area will see your profile.">
        <StateCityFields state={form.state} city={form.city} onState={v => f('state', v)} onCity={v => f('city', v)} errors={{ state: errors.state, city: errors.city }} />
        <KitField label="Area / locality" error={errors.locality} full>
          <TextInput icon={<MapPin size={18} />} value={form.locality} onValue={v => f('locality', v)} placeholder="e.g. Rajpur Road" invalid={!!errors.locality} valid={form.locality.trim().length > 1} />
        </KitField>
      </Section>
      <NavButtons onNext={next} nextLabel="Continue to profession" />
    </motion.div>
  );
}

/* ── Step 2: Profession ──────────────────────────────────────────────────── */
function ProfessionStep({ initial, onNext, onBack }: { initial: Profession; onNext: (d: Profession) => void; onBack: () => void }) {
  const [form, setForm] = useState<Profession>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const set = <K extends keyof Profession>(k: K, v: Profession[K]) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const toggleSkill = (id: string) => {
    if (id === form.primaryCategory) return;
    const has = form.additionalSkills.includes(id);
    if (!has && form.additionalSkills.length >= 3) { setErrors(p => ({ ...p, additionalSkills: 'You can add up to 3 additional skills' })); return; }
    set('additionalSkills', has ? form.additionalSkills.filter(s => s !== id) : [...form.additionalSkills, id]);
  };
  const toggleIn = (k: 'days' | 'slots', v: string) =>
    set(k, form[k].includes(v) ? form[k].filter(x => x !== v) : [...form[k], v]);

  const next = () => {
    const e: Errors = {};
    if (!form.primaryCategory) e.primaryCategory = 'Choose your primary service';
    if (!form.experience) e.experience = 'Select your experience';
    if (!form.workMode) e.workMode = 'Tell us whether you work solo or with a team';
    if (form.workMode === 'team') {
      const n = parseInt(form.teamSize, 10);
      if (!form.teamSize || isNaN(n) || n < 2 || n > 500) e.teamSize = 'Enter your team size (2–500)';
    }
    if (!form.serviceRadiusKm) e.serviceRadiusKm = 'Select how far you travel';
    if (form.days.length === 0) e.days = 'Pick at least one day';
    if (form.slots.length === 0) e.slots = 'Pick at least one time slot';
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext({ ...form, teamSize: form.workMode === 'team' ? form.teamSize : '1' });
  };

  return (
    <motion.div {...slide}>
      <StepHead title="Your profession" sub="What you do and when you are available" />

      {/* Primary category */}
      <div className="mb-6">
        <label className={labelCls}>Primary service <span className="font-normal normal-case tracking-normal text-gray-400">(choose one)</span></label>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
          {SERVICE_CATEGORIES.map(c => {
            const on = form.primaryCategory === c.id;
            return (
              <button key={c.id} type="button"
                onClick={() => { set('primaryCategory', c.id); set('additionalSkills', form.additionalSkills.filter(s => s !== c.id)); }}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-center transition ${on ? 'border-violet-600 bg-violet-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: on ? V : '#F5F3FF', color: on ? '#fff' : V }}><c.icon size={19} /></span>
                <span className={`text-[12.5px] font-bold leading-tight ${on ? 'text-violet-900' : 'text-gray-700'}`}>{c.label}</span>
              </button>
            );
          })}
        </div>
        {errors.primaryCategory && <p className="mt-2 text-[11.5px] text-red-600">{errors.primaryCategory}</p>}
      </div>

      {/* Additional skills */}
      <div className="mb-6">
        <label className={labelCls}>Additional skills <span className="font-normal normal-case tracking-normal text-gray-400">(optional, up to 3)</span></label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_CATEGORIES.filter(c => c.id !== form.primaryCategory).map(c => {
            const on = form.additionalSkills.includes(c.id);
            return (
              <button key={c.id} type="button" onClick={() => toggleSkill(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition ${on ? 'border-violet-600 bg-violet-600 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                {on && <Check size={13} />} {c.label}
              </button>
            );
          })}
        </div>
        {errors.additionalSkills && <p className="mt-2 text-[11.5px] text-red-600">{errors.additionalSkills}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Years of experience" error={errors.experience}>
          <select value={form.experience} onChange={e => set('experience', e.target.value)} className={`${inputCls(errors.experience)} appearance-none ${form.experience ? '' : 'text-gray-400'}`}>
            <option value="">Select experience</option>
            {EXPERIENCE.map(x => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Service radius" error={errors.serviceRadiusKm}>
          <select value={form.serviceRadiusKm} onChange={e => set('serviceRadiusKm', e.target.value)} className={`${inputCls(errors.serviceRadiusKm)} appearance-none ${form.serviceRadiusKm ? '' : 'text-gray-400'}`}>
            <option value="">How far will you travel?</option>
            {RADIUS.map(r => <option key={r} value={r}>Up to {r} km from my area</option>)}
          </select>
        </Field>
      </div>

      {/* Solo / team */}
      <div className="mt-6">
        <label className={labelCls}>How do you work?</label>
        <div className="grid grid-cols-2 gap-3">
          {([
            { v: 'solo', icon: User,  t: 'I work solo',   s: 'Just me, taking jobs myself' },
            { v: 'team', icon: Users, t: 'I run a team',  s: 'I bring helpers or staff' },
          ] as const).map(o => {
            const on = form.workMode === o.v;
            return (
              <button key={o.v} type="button" onClick={() => set('workMode', o.v)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${on ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: on ? G : '#ECFDF5', color: on ? '#fff' : G }}><o.icon size={17} /></span>
                <span>
                  <span className="block text-[14px] font-bold text-gray-900">{o.t}</span>
                  <span className="block text-[12.5px] text-gray-500">{o.s}</span>
                </span>
              </button>
            );
          })}
        </div>
        {errors.workMode && <p className="mt-2 text-[11.5px] text-red-600">{errors.workMode}</p>}
        <AnimatePresence>
          {form.workMode === 'team' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-3 max-w-[260px]">
                <Field label="Team size" error={errors.teamSize} hint="including you">
                  <input value={form.teamSize} onChange={e => set('teamSize', e.target.value.replace(/\D/g, '').slice(0, 3))} inputMode="numeric" placeholder="e.g. 4" className={inputCls(errors.teamSize)} />
                </Field>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Availability */}
      <div className="mt-6">
        <label className={labelCls}>Available days</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map(d => {
            const on = form.days.includes(d);
            return (
              <button key={d} type="button" onClick={() => toggleIn('days', d)}
                className={`rounded-full border px-4 py-2 text-[13px] font-bold transition ${on ? 'border-emerald-600 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                style={on ? { background: G } : undefined}>{d}</button>
            );
          })}
        </div>
        {errors.days && <p className="mt-2 text-[11.5px] text-red-600">{errors.days}</p>}
      </div>
      <div className="mt-5">
        <label className={labelCls}>Time slots</label>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {SLOTS.map(s => {
            const on = form.slots.includes(s.v);
            return (
              <button key={s.v} type="button" onClick={() => toggleIn('slots', s.v)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-3.5 transition ${on ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <Clock size={16} style={{ color: on ? G : '#9CA3AF' }} />
                <span className={`text-[13.5px] font-bold ${on ? 'text-emerald-900' : 'text-gray-900'}`}>{s.l}</span>
                <span className="text-[11.5px] text-gray-500">{s.t}</span>
              </button>
            );
          })}
        </div>
        {errors.slots && <p className="mt-2 text-[11.5px] text-red-600">{errors.slots}</p>}
      </div>

      <NavButtons onBack={onBack} onNext={next} nextLabel="Continue to verification" />
    </motion.div>
  );
}

/* ── Step 3: Verification & review ──────────────────────────────────────── */
function VerificationStep({ personal, profession, initial, onSubmit, onBack, submitting, submitError }: {
  personal: Personal; profession: Profession; initial: Verification;
  onSubmit: (d: Verification) => void; onBack: () => void; submitting: boolean; submitError: string;
}) {
  const [form, setForm] = useState<Verification>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const set = <K extends keyof Verification>(k: K, v: Verification[K]) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const next = () => {
    const e: Errors = {};
    if (!form.idType) e.idType = 'Select your ID type';
    if (!/^[0-9A-Za-z]{4}$/.test(form.idLast4)) e.idLast4 = 'Enter the last 4 characters of your ID';
    if (!form.bgConsent) e.bgConsent = 'Background check consent is required to join';
    if (!form.terms) e.terms = 'Please accept the partner terms';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit(form);
  };

  const catLabel = (id: string) => SERVICE_CATEGORIES.find(c => c.id === id)?.label ?? id;
  const review: Array<[string, string]> = [
    ['Name', personal.name],
    ['Mobile', personal.phone],
    ['Email', personal.email],
    ['Location', `${personal.locality}, ${personal.city}`],
    ['Primary service', catLabel(profession.primaryCategory)],
    ['Additional skills', profession.additionalSkills.length ? profession.additionalSkills.map(catLabel).join(', ') : '—'],
    ['Experience', profession.experience],
    ['Team', profession.workMode === 'team' ? `Team of ${profession.teamSize}` : 'Solo'],
    ['Service radius', `Up to ${profession.serviceRadiusKm} km`],
    ['Availability', `${profession.days.join(', ')} · ${profession.slots.map(s => SLOTS.find(x => x.v === s)?.l ?? s).join(', ')}`],
  ];

  return (
    <motion.div {...slide}>
      <StepHead title="Verification & review" sub="We only ask for the last 4 characters of your ID at this stage" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Government ID type" error={errors.idType}>
          <select value={form.idType} onChange={e => set('idType', e.target.value)} className={`${inputCls(errors.idType)} appearance-none ${form.idType ? '' : 'text-gray-400'}`}>
            <option value="">Select ID</option>
            {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Last 4 characters of ID" error={errors.idLast4} hint="never the full number">
          <input value={form.idLast4} onChange={e => set('idLast4', e.target.value.replace(/[^0-9A-Za-z]/g, '').slice(0, 4).toUpperCase())} maxLength={4} placeholder="e.g. 4321" className={inputCls(errors.idLast4)} />
        </Field>
      </div>
      <p className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-[12.5px] leading-relaxed text-gray-600">
        <ShieldCheck size={14} className="mr-1.5 inline -mt-0.5 text-emerald-700" />
        Full ID verification happens in person or over a verified call with our onboarding team. Please do not share full ID numbers or photos here.
      </p>

      {/* Declarations */}
      <div className="mt-6 space-y-3">
        {([
          { k: 'bgConsent', t: 'I consent to a background and identity check', s: 'Required for every Zyphix Book professional before going live.' },
          { k: 'terms', t: 'I accept the Zyphix partner terms and privacy policy', s: <>See <a href="https://zyphix.in/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 underline">terms</a> and <a href="https://zyphix.in/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 underline">privacy policy</a>.</> },
        ] as const).map(d => {
          const on = form[d.k];
          return (
            <div key={d.k}>
              <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${on ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <input type="checkbox" checked={on} onChange={e => set(d.k, e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-emerald-600" />
                <span>
                  <span className="block text-[14px] font-bold text-gray-900">{d.t}</span>
                  <span className="block text-[12.5px] text-gray-500">{d.s}</span>
                </span>
              </label>
              {errors[d.k] && <p className="mt-1.5 text-[11.5px] text-red-600">{errors[d.k]}</p>}
            </div>
          );
        })}
      </div>

      {/* Review */}
      <div className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-wider text-gray-500">Review your application</div>
        <dl className="divide-y divide-gray-100">
          {review.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-2.5 text-[13.5px] sm:grid-cols-[160px_1fr]">
              <dt className="font-semibold text-gray-500">{k}</dt>
              <dd className="text-gray-900">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {submitError && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700">{submitError}</div>
      )}

      <NavButtons onBack={onBack} onNext={next} nextLabel="Submit application" busy={submitting} />
    </motion.div>
  );
}

/* ── Success ─────────────────────────────────────────────────────────────── */
function SuccessStep({ personal, profession }: { personal: Personal; profession: Profession }) {
  const [, setLoc] = useLocation();
  const cat = SERVICE_CATEGORIES.find(c => c.id === profession.primaryCategory);
  return (
    <RegisterSuccess
      track="service"
      name={personal.name}
      message={<>We have your application to join Zyphix Book as a {cat?.label.toLowerCase() ?? 'service'} professional{personal.city ? ` in ${personal.city}` : ''}. Our onboarding team will call <strong className="text-white">{personal.phone}</strong> within 2 working days.</>}
      nextSteps={['A call from our onboarding team to confirm your details', 'Identity and background verification', 'A short briefing on bookings and payouts', 'Your profile goes live for customers in your area']}
      actions={<>
        <SuccessButton onClick={() => exportApplicationPDF({
          track: 'service',
          title: personal.name || 'Service professional',
          sections: [
            { heading: 'About you', rows: [['Full name', personal.name], ['City', [personal.city, personal.state].filter(Boolean).join(', ')], ['Area / locality', personal.locality]] },
            { heading: 'Contact', rows: [['Mobile', personal.phone ? `+91 ${personal.phone}` : undefined], ['Email', personal.email]] },
            { heading: 'Work', rows: [['Main service', cat?.label], ['Experience', profession.experience], ['Works', profession.workMode === 'team' ? `With a team${profession.teamSize ? ` of ${profession.teamSize}` : ''}` : profession.workMode ? 'Solo' : undefined], ['Travels up to', profession.serviceRadiusKm ? `${profession.serviceRadiusKm} km` : undefined], ['Days', profession.days.join(', ')], ['Time slots', profession.slots.join(', ')]] },
          ],
          tags: { heading: 'Other skills', items: profession.additionalSkills.map(id => SERVICE_CATEGORIES.find(c => c.id === id)?.label || id) },
          nextSteps: ['A call from our onboarding team to confirm your details', 'Identity and background verification', 'A short briefing on bookings and payouts', 'Your profile goes live for customers in your area'],
        })}><FileDown size={17} /> Save as PDF</SuccessButton>
        <SuccessButton primary accent={V} onClick={() => setLoc('/')}>Back to partner home</SuccessButton>
      </>}
    />
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export function ServiceProSetup() {
  const [, setLoc] = useLocation();
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState<Personal>(() => {
    const q = new URLSearchParams(window.location.search);
    return { name: q.get('name') || '', email: q.get('email') || '', phone: q.get('phone') || '', state: '', city: q.get('city') || '', locality: '' };
  });
  const [profession, setProfession] = useState<Profession>({ primaryCategory: '', additionalSkills: [], experience: '', workMode: '', teamSize: '', serviceRadiusKm: '', days: [...DAYS], slots: [] });
  const [verification, setVerification] = useState<Verification>({ idType: '', idLast4: '', bgConsent: false, terms: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  React.useEffect(() => { document.title = 'Join Zyphix Book · Zyphix Partners'; }, []);
  const go = (s: number) => { setStep(s); window.scrollTo(0, 0); };

  const submit = async (v: Verification) => {
    setVerification(v);
    setSubmitting(true); setSubmitError('');
    try {
      const res = await apiFetch('/api/partner-register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: personal.name, email: personal.email, phone: personal.phone, city: personal.city, role: 'service',
          details: {
            primaryCategory: profession.primaryCategory,
            additionalSkills: profession.additionalSkills.join(', '),
            experience: profession.experience,
            teamSize: profession.teamSize,
            serviceRadiusKm: profession.serviceRadiusKm,
            availability: `${profession.days.join(', ')} | ${profession.slots.join(', ')}`,
            locality: personal.locality,
            state: personal.state,
            idType: v.idType,
            idLast4: v.idLast4,
            backgroundCheckConsent: 'yes',
          },
        }),
      });
      let data: { success?: boolean; error?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON response */ }
      if (data.error) { setSubmitError(data.error); setSubmitting(false); return; }
    } catch { /* network failure — non-blocking, like the other setup pages */ }
    setSubmitting(false);
    go(3);
  };

  return (
    <RegisterShell track="service" steps={['Personal', 'Profession', 'Verification']} step={step} done={step === 3}>
      <div>
        <div>
          <AnimatePresence mode="wait">
            {step === 0 && <PersonalStep key="s0" initial={personal} onNext={d => { setPersonal(d); go(1); }} />}
            {step === 1 && <ProfessionStep key="s1" initial={profession} onNext={d => { setProfession(d); go(2); }} onBack={() => go(0)} />}
            {step === 2 && <VerificationStep key="s2" personal={personal} profession={profession} initial={verification} onSubmit={submit} onBack={() => go(1)} submitting={submitting} submitError={submitError} />}
            {step === 3 && <SuccessStep key="s3" personal={personal} profession={profession} />}
          </AnimatePresence>
        </div>
      </div>
    </RegisterShell>
  );
}

export default ServiceProSetup;
