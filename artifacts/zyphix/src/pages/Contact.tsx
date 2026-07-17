import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Mail, Phone, MapPin, Send, Check, MessageCircle } from 'lucide-react';

import { motion } from 'framer-motion';
import { ZyphixLogo } from '../components/ZyphixLogo';

const T1 = '#111827'; const T2 = '#6B7280'; const T3 = '#9CA3AF';
const G = '#0DA366'; const G2 = '#0A8C58'; const BD = '#E5E7EB'; const BG = '#F8F9FA'; const W = '#FFFFFF'; const ERR = '#EF4444';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setSent(true);
  };

  const inputStyle = (err?: string) => ({
    width: '100%', padding: '12px 14px', borderRadius: 11, border: `1.5px solid ${err ? ERR + '80' : BD}`,
    background: err ? '#FFF5F5' : BG, fontSize: 14, color: T1, fontFamily: 'inherit',
    outline: 'none', transition: 'border-color .18s',
  });

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <div style={{ background: W, borderBottom: `1px solid ${BD}`, position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/">
            <ZyphixLogo size={30} wordmarkColor={T1} wordmarkHighlight={G} />
          </Link>
          <Link href="/"><button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: T2, padding: '7px 14px', borderRadius: 8, border: `1px solid ${BD}`, background: W }}><ArrowLeft size={13} /> Back</button></Link>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(13,163,102,.07)', border: '1px solid rgba(13,163,102,.18)', borderRadius: 999, padding: '4px 14px', marginBottom: 14 }}>
            <MessageCircle size={13} color={G} />
            <span style={{ fontSize: 11, fontWeight: 700, color: G, letterSpacing: '.07em', textTransform: 'uppercase' }}>Support</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(2rem,4vw,2.8rem)', color: T1, letterSpacing: '-.05em', marginBottom: 10 }}>We're here to help</h1>
          <p style={{ fontSize: 15, color: T2 }}>Average response time: under 2 hours · Available 7 days a week, 8am–10pm IST</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 28, alignItems: 'start' }}>
          {/* Left contact cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: <Phone size={18} color={G} />, title: 'Call Us', lines: ['+91 800 123 4567', 'Mon–Sun, 8am–10pm IST'], link: 'tel:+918001234567' },
              { icon: <Mail size={18} color={G} />, title: 'Email Support', lines: ['support@zyphix.in', 'Response within 2 hours'], link: 'mailto:support@zyphix.in' },
              { icon: <MapPin size={18} color={G} />, title: 'Head Office', lines: ['12th Floor, RMZ Infinity', 'Old Madras Road, Bengaluru 560016'], link: undefined },
            ].map(({ icon, title, lines, link }) => (
              <motion.div key={title} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <a href={link} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ background: W, border: `1px solid ${BD}`, borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(0,0,0,.06)', transition: 'all .2s', cursor: link ? 'pointer' : 'default' }}
                    onMouseEnter={e => { if (link) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,.06)'; }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(13,163,102,.08)', border: '1px solid rgba(13,163,102,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                    <div>
                      <p style={{ fontWeight: 700, color: T1, fontSize: 14, marginBottom: 4 }}>{title}</p>
                      {lines.map(l => <p key={l} style={{ fontSize: 13, color: T3, lineHeight: 1.5 }}>{l}</p>)}
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}

            <div style={{ background: W, border: `1px solid ${BD}`, borderRadius: 16, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <p style={{ fontWeight: 700, color: T1, fontSize: 14, marginBottom: 12 }}>For specific queries</p>
              {[
                ['Order issues', 'orders@zyphix.in'],
                ['Partner onboarding', 'partnerships@zyphix.in'],
                ['Press & media', 'press@zyphix.in'],
                ['Legal & compliance', 'legal@zyphix.in'],
              ].map(([label, email]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${BD}` }}>
                  <span style={{ fontSize: 12.5, color: T2 }}>{label}</span>
                  <a href={`mailto:${email}`} style={{ fontSize: 12.5, color: G, fontWeight: 600 }}>{email}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}>
            <div style={{ background: W, border: `1px solid ${BD}`, borderRadius: 22, padding: '36px 36px', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(13,163,102,.1)', border: '2px solid rgba(13,163,102,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={30} color={G} />
                  </div>
                  <h3 style={{ fontWeight: 900, color: T1, fontSize: '1.4rem', letterSpacing: '-.03em', marginBottom: 8 }}>Message received!</h3>
                  <p style={{ fontSize: 14.5, color: T2, marginBottom: 24, lineHeight: 1.65 }}>We'll get back to you at <strong>{form.email}</strong> within 2 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} style={{ background: BG, color: T1, fontSize: 13.5, fontWeight: 700, padding: '10px 22px', borderRadius: 10, border: `1px solid ${BD}` }}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <h2 style={{ fontWeight: 800, color: T1, fontSize: '1.25rem', letterSpacing: '-.025em', marginBottom: 4 }}>Send us a message</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12.5, fontWeight: 600, color: T2, display: 'block', marginBottom: 6 }}>Name *</label>
                      <input value={form.name} onChange={set('name')} placeholder="Your name" style={inputStyle(errors.name)}
                        onFocus={e => e.target.style.borderColor = G + '80'} onBlur={e => e.target.style.borderColor = errors.name ? ERR + '80' : BD} />
                      {errors.name && <p style={{ fontSize: 11, color: ERR, marginTop: 3 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: 12.5, fontWeight: 600, color: T2, display: 'block', marginBottom: 6 }}>Email *</label>
                      <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" style={inputStyle(errors.email)}
                        onFocus={e => e.target.style.borderColor = G + '80'} onBlur={e => e.target.style.borderColor = errors.email ? ERR + '80' : BD} />
                      {errors.email && <p style={{ fontSize: 11, color: ERR, marginTop: 3 }}>{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: T2, display: 'block', marginBottom: 6 }}>Topic *</label>
                    <select value={form.subject} onChange={set('subject')} style={{ ...inputStyle(errors.subject), cursor: 'pointer' }}
                      onFocus={e => e.target.style.borderColor = G + '80'} onBlur={e => e.target.style.borderColor = errors.subject ? ERR + '80' : BD}>
                      <option value="">Select a topic…</option>
                      <option value="order">Order issue or refund</option>
                      <option value="account">Account or login</option>
                      <option value="delivery">Delivery complaint</option>
                      <option value="partner">Partner onboarding</option>
                      <option value="payment">Payment problem</option>
                      <option value="press">Press & media</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <p style={{ fontSize: 11, color: ERR, marginTop: 3 }}>{errors.subject}</p>}
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: T2, display: 'block', marginBottom: 6 }}>Message *</label>
                    <textarea value={form.message} onChange={set('message')} rows={5} placeholder="Describe your issue or question in detail…"
                      style={{ ...inputStyle(errors.message), resize: 'vertical', minHeight: 120 }}
                      onFocus={e => e.target.style.borderColor = G + '80'} onBlur={e => e.target.style.borderColor = errors.message ? ERR + '80' : BD} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      {errors.message ? <p style={{ fontSize: 11, color: ERR }}>{errors.message}</p> : <span />}
                      <p style={{ fontSize: 11, color: T3 }}>{form.message.length} chars</p>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ padding: '14px', borderRadius: 12, background: loading ? G + 'CC' : G, color: '#fff', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: loading ? 'wait' : 'pointer', transition: 'background .15s' }}
                    onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = G2; }}
                    onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = G; }}>
                    {loading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />Sending…</> : <><Send size={15} />Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
