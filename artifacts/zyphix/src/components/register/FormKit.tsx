import React from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { AlertCircle, ArrowLeft, ArrowRight, Building2, Check, ChevronDown, Loader2, Map as MapIcon } from 'lucide-react';
import { INDIA_PLACES, STATE_NAMES, citiesOf } from '@/data/indiaPlaces';

/* ────────────────────────────────────────────────────────────────────────────
   Form kit for partner registrations. Accent comes from the --acc CSS variable
   set by RegisterShell, so every track (store / restaurant / delivery / service)
   gets its own colour without props.
──────────────────────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

export function StepIntro({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] text-gray-900 sm:text-[30px]">{title}</h2>
      {sub && <p className="mt-2 text-[15px] leading-[1.55] text-gray-500">{sub}</p>}
    </div>
  );
}

/** A titled group of fields, numbered like a checklist. */
export function Section({ n, title, desc, children, first = false }: { n: number; title: string; desc?: string; children: React.ReactNode; first?: boolean }) {
  return (
    <motion.section className={first ? '' : 'mt-9 border-t border-gray-100 pt-9'}
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.06 * n, ease: EASE }}>
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
          style={{ background: 'color-mix(in srgb, var(--acc) 12%, white)', color: 'var(--acc)' }}>{n}</span>
        <div>
          <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-gray-900">{title}</h3>
          {desc && <p className="mt-0.5 text-[13.5px] text-gray-500">{desc}</p>}
        </div>
      </div>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">{children}</div>
    </motion.section>
  );
}

export function Field({ label, optional, hint, error, full, children }: { label: string; optional?: boolean; hint?: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[13.5px] font-medium text-gray-800">{label}{optional && <span className="ml-1.5 text-[12.5px] font-normal text-gray-400">Optional</span>}</span>
        {hint && <span className="text-[12px] text-gray-400">{hint}</span>}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0, y: -4 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 overflow-hidden pt-2 text-[12.5px] font-medium text-red-600">
            <AlertCircle size={14} className="shrink-0" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function shell(invalid?: boolean) {
  return `group relative flex h-[52px] items-center rounded-2xl border-[1.5px] bg-white transition-[border-color,box-shadow] duration-200
    ${invalid ? 'border-red-400 shadow-[0_0_0_4px_rgba(239,68,68,.10)]' : 'border-gray-200 hover:border-gray-300'}
    focus-within:!border-[var(--acc)] focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--acc)_14%,transparent)]`;
}

function ValidTick({ show }: { show?: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="mr-3.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: 'var(--acc)' }}>
          <Check size={12} strokeWidth={3.2} />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  icon?: React.ReactNode; prefix?: string; invalid?: boolean; valid?: boolean; onValue: (v: string) => void;
};
export function TextInput({ icon, prefix, invalid, valid, onValue, className = '', ...rest }: InputProps) {
  return (
    <label className={shell(invalid)}>
      {icon && <span className="pointer-events-none ml-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-[var(--acc)]">{icon}</span>}
      {prefix && <span className="ml-4 shrink-0 border-r border-gray-200 pr-3 text-[15px] font-medium text-gray-700">{prefix}</span>}
      <input {...rest} onChange={e => onValue(e.target.value)} aria-invalid={invalid || undefined}
        className={`zx-kit h-full min-w-0 flex-1 bg-transparent px-3.5 text-[15px] text-gray-900 outline-none placeholder:text-gray-400 ${className}`} />
      <ValidTick show={valid} />
    </label>
  );
}

export function SelectInput({ icon, invalid, valid, value, onValue, placeholder, children }: {
  icon?: React.ReactNode; invalid?: boolean; valid?: boolean; value: string; onValue: (v: string) => void; placeholder: string; children: React.ReactNode;
}) {
  return (
    <label className={shell(invalid)}>
      {icon && <span className="pointer-events-none ml-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-[var(--acc)]">{icon}</span>}
      <select value={value} onChange={e => onValue(e.target.value)} aria-invalid={invalid || undefined}
        className={`zx-kit h-full min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pl-3.5 pr-2 text-[15px] outline-none ${value ? 'text-gray-900' : 'text-gray-400'}`}>
        <option value="">{placeholder}</option>
        {children}
      </select>
      {valid ? <ValidTick show /> : <ChevronDown size={17} className="pointer-events-none mr-4 shrink-0 text-gray-400" />}
    </label>
  );
}

export function TextArea({ invalid, value, onValue, placeholder, rows = 3 }: { invalid?: boolean; value: string; onValue: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={e => onValue(e.target.value)} placeholder={placeholder} rows={rows} aria-invalid={invalid || undefined}
      className={`zx-kit w-full resize-none rounded-2xl border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-gray-400 focus:!border-[var(--acc)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--acc)_14%,transparent)] ${invalid ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'}`} />
  );
}

/** Selectable tiles (store type, restaurant type…) with an animated radio + check. */
export function ChoiceTiles<T extends string>({ options, value, onChange, invalid, cols = 3 }: {
  options: { v: T; label: string; img?: string; icon?: React.ReactNode; desc?: string }[];
  value: T | ''; onChange: (v: T) => void; invalid?: boolean; cols?: 2 | 3 | 4;
}) {
  const grid = cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3';
  return (
    <div className={`grid grid-cols-2 gap-3 ${grid} ${invalid ? 'rounded-2xl ring-2 ring-red-200 ring-offset-4' : ''}`}>
      {options.map((o, i) => {
        const on = value === o.v;
        return (
          <motion.button key={o.v} type="button" onClick={() => onChange(o.v)} aria-pressed={on}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.03 * i, ease: EASE }}
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            className={`relative flex min-h-[64px] flex-col items-start gap-2.5 rounded-2xl border-[1.5px] p-3.5 pr-9 text-left sm:flex-row sm:items-center sm:gap-3 sm:py-3 transition-[border-color,background-color,box-shadow] duration-200 ${on ? 'border-[var(--acc)] shadow-[0_10px_30px_-14px_color-mix(in_srgb,var(--acc)_70%,transparent)]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            style={on ? { background: 'color-mix(in srgb, var(--acc) 6%, white)' } : undefined}>
            {o.img ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50" style={on ? { background: '#fff' } : undefined}>
                <img loading="lazy" decoding="async" src={o.img} alt="" draggable={false} className="h-7 w-7 object-contain" />
              </span>
            ) : o.icon}
            <span className="min-w-0 flex-1">
              <span className={`block text-[13.5px] font-semibold leading-tight ${on ? 'text-gray-900' : 'text-gray-700'}`}>{o.label}</span>
              {o.desc && <span className="mt-0.5 block text-[12px] leading-snug text-gray-500">{o.desc}</span>}
            </span>
            <span className={`absolute right-3 top-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors sm:top-1/2 sm:-translate-y-1/2 ${on ? 'border-transparent' : 'border-gray-300'}`} style={on ? { background: 'var(--acc)' } : undefined}>
              <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 24 }} className="text-white"><Check size={12} strokeWidth={3.2} /></motion.span>}</AnimatePresence>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/** Bottom action row: optional Back + a primary button with a light sweep on hover. */
export function Actions({ onBack, onNext, label, busy, note }: { onBack?: () => void; onNext: () => void; label: string; busy?: boolean; note?: string }) {
  return (
    <div className="mt-10 flex flex-col-reverse items-stretch gap-3 border-t border-gray-100 pt-7 sm:flex-row sm:items-center">
      {onBack ? (
        <button type="button" onClick={onBack} className="inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl px-5 text-[14.5px] font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
          <ArrowLeft size={16} /> Back
        </button>
      ) : note ? <p className="text-[13px] text-gray-500 sm:mr-auto">{note}</p> : null}
      <motion.button type="button" onClick={onNext} disabled={busy} whileTap={{ scale: 0.98 }}
        className="group relative inline-flex h-[54px] items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 text-[15.5px] font-semibold text-white shadow-[0_14px_34px_-14px_color-mix(in_srgb,var(--acc)_80%,transparent)] transition disabled:cursor-not-allowed disabled:opacity-75 sm:ml-auto sm:min-w-[240px]"
        style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--acc) 82%, white), var(--acc))' }}>
        <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[400%]" />
        {busy ? <><Loader2 size={18} className="animate-spin" /> Submitting…</> : <>{label} <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" /></>}
      </motion.button>
    </div>
  );
}

export const isPhone = (v: string) => /^[0-9]{10}$/.test(v);
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const digits10 = (v: string) => v.replace(/\D/g, '').slice(0, 10);

/* ── Searchable picker ─────────────────────────────────────────────────────── */
/** Type-to-filter dropdown with keyboard support. `allowCustom` lets people use a value that is not listed. */
export function Combobox({ icon, value, onChange, options, placeholder, invalid, valid, allowCustom, disabled, disabledHint, groups }: {
  icon?: React.ReactNode; value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
  invalid?: boolean; valid?: boolean; allowCustom?: boolean; disabled?: boolean; disabledHint?: string;
  /** optional section label per option (e.g. "Union territories") */
  groups?: Record<string, string>;
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [hi, setHi] = React.useState(0);
  const box = React.useRef<HTMLDivElement>(null);
  const list = React.useRef<HTMLUListElement>(null);
  const input = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const query = q.trim().toLowerCase();
  const shown = query ? options.filter(o => o.toLowerCase().includes(query)) : options;
  const exact = options.some(o => o.toLowerCase() === query);
  const custom = allowCustom && query && !exact ? q.trim() : '';
  const items = custom ? [...shown, `__custom__${custom}`] : shown;

  React.useEffect(() => { setHi(0); }, [q, open]);
  React.useEffect(() => { list.current?.querySelector<HTMLElement>(`[data-i="${hi}"]`)?.scrollIntoView({ block: 'nearest' }); }, [hi]);

  const pick = (v: string) => { onChange(v.startsWith('__custom__') ? v.slice(10) : v); setOpen(false); setQ(''); input.current?.blur(); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHi(h => Math.min(h + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { if (open && items[hi]) { e.preventDefault(); pick(items[hi]); } }
    else if (e.key === 'Escape') { setOpen(false); }
  };
  const mark = (o: string) => {
    if (!query) return o;
    const i = o.toLowerCase().indexOf(query);
    if (i < 0) return o;
    return <>{o.slice(0, i)}<span className="font-semibold text-gray-900">{o.slice(i, i + query.length)}</span>{o.slice(i + query.length)}</>;
  };

  return (
    <div ref={box} className="relative">
      <div className={`${shell(invalid)} ${disabled ? 'cursor-not-allowed bg-gray-50 opacity-70' : 'cursor-text'}`} onClick={() => { if (!disabled) { setOpen(true); input.current?.focus(); } }}>
        {icon && <span className="pointer-events-none ml-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-[var(--acc)]">{icon}</span>}
        <input ref={input} disabled={disabled} value={open ? q : value} onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} onKeyDown={onKey} role="combobox" aria-expanded={open} aria-invalid={invalid || undefined}
          placeholder={disabled ? (disabledHint || placeholder) : (open && value ? value : placeholder)}
          className={`zx-kit h-full min-w-0 flex-1 bg-transparent px-3.5 text-[15px] text-gray-900 outline-none ${open && value ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400'}`} />
        {valid && !open ? <ValidTick show /> : (
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="pointer-events-none mr-4 shrink-0 text-gray-400"><ChevronDown size={17} /></motion.span>
        )}
      </div>
      <AnimatePresence>
        {open && !disabled && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute inset-x-0 top-[calc(100%+8px)] z-30 origin-top overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_60px_-20px_rgba(16,24,40,.35)]">
            <ul ref={list} role="listbox" className="max-h-[288px] overflow-y-auto overscroll-contain p-1.5">
              {items.length === 0 && <li className="px-3.5 py-6 text-center text-[13.5px] text-gray-500">No matches for “{q}”</li>}
              {items.map((o, i) => {
                const isCustom = o.startsWith('__custom__');
                const label = isCustom ? o.slice(10) : o;
                const prev = i > 0 ? items[i - 1] : '';
                const head = groups && !isCustom && groups[o] && groups[o] !== (groups[prev] ?? '') ? groups[o] : '';
                return (
                  <React.Fragment key={o}>
                    {head && <li className="px-3.5 pb-1 pt-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-gray-400">{head}</li>}
                    <li data-i={i} role="option" aria-selected={value === label}
                      onMouseEnter={() => setHi(i)} onMouseDown={e => { e.preventDefault(); pick(o); }}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2.5 text-[14.5px] text-gray-700 ${hi === i ? 'bg-gray-100' : ''}`}>
                      {isCustom ? <span>Use “<span className="font-semibold text-gray-900">{label}</span>”</span> : <span className="flex-1">{mark(o)}</span>}
                      {value === label && <Check size={16} style={{ color: 'var(--acc)' }} />}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** State → City pickers (city list follows the state; any city can be typed). */
export function StateCityFields({ state, city, onState, onCity, errors }: {
  state: string; city: string; onState: (v: string) => void; onCity: (v: string) => void; errors?: { state?: string; city?: string };
}) {
  const groups = React.useMemo(() => Object.fromEntries(INDIA_PLACES.map(p => [p.state, p.ut ? 'Union territories' : 'States'])), []);
  return (
    <>
      <Field label="State / union territory" error={errors?.state}>
        <Combobox icon={<MapIcon size={18} />} value={state} onChange={v => { onState(v); if (v !== state) onCity(''); }} options={STATE_NAMES}
          groups={groups} placeholder="Search your state" invalid={!!errors?.state} valid={!!state} />
      </Field>
      <Field label="City" error={errors?.city}>
        <Combobox icon={<Building2 size={18} />} value={city} onChange={onCity} options={citiesOf(state)} allowCustom
          disabled={!state} disabledHint="Choose a state first" placeholder="Search or type your city" invalid={!!errors?.city} valid={!!city} />
      </Field>
    </>
  );
}
