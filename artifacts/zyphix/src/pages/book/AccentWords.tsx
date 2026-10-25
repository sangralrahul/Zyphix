import React from 'react';
import { motion } from 'framer-motion';
import { isStatic, EASE } from '@/ui/cinema';
import { Accent } from '@/ui/motion2';

/* ────────────────────────────────────────────────────────────────────────────
   Word-by-word headline reveal with ONE serif-italic accent word.
   `parts` is a list of plain strings and a single { accent } entry, e.g.
   ['Home services, done by', { accent: 'verified' }, 'pros.'].
   Static (screenshots / ?noanim / reduced motion): plain heading, no motion.
   Also used by partner.zyphix.in and advertise.zyphix.in heroes.
──────────────────────────────────────────────────────────────────────────── */

export type Part = string | { accent: string; green?: boolean };

export function AccentWords({ parts, className = '', delay = 0, as: Tag = 'h1' }: { parts: Part[]; className?: string; delay?: number; as?: 'h1' | 'h2' }) {
  const label = parts.map(p => (typeof p === 'string' ? p : p.accent)).join(' ');
  // flatten into word tokens, remembering which one is the accent
  const tokens: { w: string; accent?: boolean; green?: boolean }[] = [];
  parts.forEach(p => {
    if (typeof p === 'string') p.split(' ').filter(Boolean).forEach(w => tokens.push({ w }));
    else tokens.push({ w: p.accent, accent: true, green: p.green });
  });
  const render = (t: typeof tokens[number]) => (t.accent ? <Accent green={t.green} className="pr-[0.04em]">{t.w}</Accent> : t.w);

  if (isStatic()) {
    return (
      <Tag className={className}>
        {tokens.map((t, i) => <React.Fragment key={i}>{render(t)}{i < tokens.length - 1 ? ' ' : ''}</React.Fragment>)}
      </Tag>
    );
  }
  return (
    <Tag className={className} aria-label={label}>
      {tokens.map((t, i) => (
        <React.Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.06em] align-bottom">
            <motion.span className="inline-block" initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: EASE, delay: delay + i * 0.05 }}>
              {render(t)}
            </motion.span>
          </span>
          {i < tokens.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}
