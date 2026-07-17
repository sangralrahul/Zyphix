import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useSearch } from 'wouter';
import {
  User, MapPin, ShoppingBag, Settings, Plus, Edit2, Trash2,
  Home, Briefcase, Building2, Check, ChevronRight, Bell, Moon,
  Lock, LogOut, Phone, Mail, Camera, Save, X, Star, Clock,
  Package, AlertCircle, Heart, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ─── colours ─── */
const G   = '#0DA366';
const G2  = '#0A8C58';
const T1  = '#111827';
const T2  = '#6B7280';
const T3  = '#9CA3AF';
const BD  = '#E5E7EB';
const BG  = '#F8FAFB';
const W   = '#FFFFFF';
const ERR = '#EF4444';

/* ─── types ─── */
interface Address {
  id: string; type: 'home' | 'work' | 'other' | 'hotel';
  label: string; flat: string; floor: string; area: string;
  landmark: string; city: string; pincode: string; isDefault: boolean;
}
interface MockOrder {
  id: string; date: string; status: 'delivered' | 'processing' | 'cancelled';
  items: string[]; total: number; store: string; icon: string;
}

/* ─── helpers ─── */
const LS_ADDR  = 'zyphix_addresses';
const LS_USER  = 'zyphix_user';
const LS_PREFS = 'zyphix_prefs';

function getLS<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}
function setLS(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const MOCK_ORDERS: MockOrder[] = [
  { id: 'ZYP001', date: 'Apr 10, 2025 · 3:42 PM', status: 'delivered', items: ['Amul Butter 500g', 'Tata Salt 1kg', 'Aashirvaad Atta 5kg'], total: 348, store: 'Fresh Mart Kirana', icon: '🛒' },
  { id: 'ZYP002', date: 'Apr 7, 2025 · 7:15 PM',  status: 'delivered', items: ['Butter Chicken', 'Garlic Naan ×2', 'Mango Lassi'],            total: 425, store: 'Haveli Restaurant', icon: '🍱' },
  { id: 'ZYP003', date: 'Apr 3, 2025 · 11:00 AM', status: 'cancelled', items: ['Home Cleaning – 3hr session'],                                total: 799, store: 'CleanPro Services', icon: '🧹' },
];

const TYPE_META = {
  home:  { Icon: Home,      label: 'Home',   bg: '#F0FDF4', bd: '#BBF7D0', tc: '#065F46', ac: G },
  work:  { Icon: Briefcase, label: 'Work',   bg: '#EFF6FF', bd: '#BFDBFE', tc: '#1E40AF', ac: '#3B82F6' },
  hotel: { Icon: Building2, label: 'Hotel',  bg: '#FFF7ED', bd: '#FED7AA', tc: '#9A3412', ac: '#F97316' },
  other: { Icon: MapPin,    label: 'Other',  bg: '#F5F3FF', bd: '#DDD6FE', tc: '#5B21B6', ac: '#8B5CF6' },
};

/* ─── sub-components ─── */
function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px',
        borderRadius: 12, background: active ? `${G}0F` : 'transparent',
        border: `1.5px solid ${active ? G + '40' : 'transparent'}`,
        color: active ? G : T2, fontWeight: active ? 700 : 500, fontSize: 14,
        cursor: 'pointer', transition: 'all .18s', textAlign: 'left',
      }}>
      {icon}<span>{label}</span>
      {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: .6 }} />}
    </button>
  );
}

function SectionCard({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: W, borderRadius: 16, border: `1px solid ${BD}`, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,.05)' }}>
      {title && (
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T1 }}>{title}</p>
          {action}
        </div>
      )}
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

/* ── Address Form ── */
function AddressForm({ initial, onSave, onCancel }: {
  initial?: Partial<Address>;
  onSave: (a: Omit<Address, 'id' | 'isDefault'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    type: initial?.type ?? 'home',
    label: initial?.label ?? '',
    flat: initial?.flat ?? '',
    floor: initial?.floor ?? '',
    area: initial?.area ?? '',
    landmark: initial?.landmark ?? '',
    city: initial?.city ?? 'Delhi',
    pincode: initial?.pincode ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const f = (k: string) => (v: string) => { setForm(x => ({ ...x, [k]: v })); setErrors(x => ({ ...x, [k]: '' })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.flat.trim())    e.flat    = 'Required';
    if (!form.area.trim())    e.area    = 'Required';
    if (!form.city.trim())    e.city    = 'Required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = '6-digit pincode';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const label = form.label.trim() || TYPE_META[form.type as keyof typeof TYPE_META].label;
    onSave({ ...form, label, type: form.type as Address['type'] });
  };

  const inp = (err?: string): React.CSSProperties => ({
    width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13.5,
    border: `1.5px solid ${err ? ERR + '88' : BD}`, background: err ? '#FFF5F5' : W,
    color: T1, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color .15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Type picker */}
      <div>
        <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>Address Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {(Object.keys(TYPE_META) as Array<keyof typeof TYPE_META>).map(t => {
            const m = TYPE_META[t];
            const active = form.type === t;
            return (
              <button key={t} onClick={() => f('type')(t)}
                style={{ padding: '10px 6px', borderRadius: 12, border: `1.5px solid ${active ? m.ac : BD}`, background: active ? m.bg : W, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, transition: 'all .15s' }}>
                <m.Icon size={16} color={active ? m.ac : T3} />
                <span style={{ fontSize: 11, fontWeight: 700, color: active ? m.tc : T3 }}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Label */}
      <div>
        <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Save As (optional)</label>
        <input value={form.label} onChange={e => f('label')(e.target.value)} placeholder={`e.g. ${TYPE_META[form.type as keyof typeof TYPE_META].label}, Mom's Place`} style={inp()} />
      </div>

      {/* Flat & Floor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Flat / House No. *</label>
          <input value={form.flat} onChange={e => f('flat')(e.target.value)} placeholder="F-12, Block B" style={inp(errors.flat)} />
          {errors.flat && <p style={{ fontSize: 11, color: ERR, marginTop: 3 }}>{errors.flat}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Floor (optional)</label>
          <input value={form.floor} onChange={e => f('floor')(e.target.value)} placeholder="2nd Floor" style={inp()} />
        </div>
      </div>

      {/* Area */}
      <div>
        <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Area / Locality *</label>
        <input value={form.area} onChange={e => f('area')(e.target.value)} placeholder="Gandhi Nagar, Trikuta Nagar…" style={inp(errors.area)} />
        {errors.area && <p style={{ fontSize: 11, color: ERR, marginTop: 3 }}>{errors.area}</p>}
      </div>

      {/* Landmark */}
      <div>
        <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Landmark (optional)</label>
        <input value={form.landmark} onChange={e => f('landmark')(e.target.value)} placeholder="Near petrol pump, opp. hospital…" style={inp()} />
      </div>

      {/* City & Pincode */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>City *</label>
          <select value={form.city} onChange={e => f('city')(e.target.value)} style={{ ...inp(errors.city), appearance: 'none', cursor: 'pointer' }}>
            {['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Surat', 'Nagpur', 'Indore', 'Bhopal', 'Patna', 'Kochi', 'Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Pincode *</label>
          <input value={form.pincode} onChange={e => f('pincode')(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="180001" inputMode="numeric" style={inp(errors.pincode)} />
          {errors.pincode && <p style={{ fontSize: 11, color: ERR, marginTop: 3 }}>{errors.pincode}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button onClick={onCancel}
          style={{ flex: 1, padding: '11px', borderRadius: 12, border: `1.5px solid ${BD}`, background: W, fontSize: 14, fontWeight: 700, color: T2, cursor: 'pointer' }}>
          Cancel
        </button>
        <button onClick={handleSave}
          style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${G}, ${G2})`, fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer', boxShadow: `0 3px 14px ${G}40` }}>
          Save Address
        </button>
      </div>
    </div>
  );
}

/* ── PROFILE TAB ── */
function ProfileTab() {
  const { user, login, logout } = useAuth();
  const [, setLoc] = useLocation();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const f = (k: string) => (v: string) => { setForm(x => ({ ...x, [k]: v })); setErrors(x => ({ ...x, [k]: '' })); };

  const handleSave = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (form.phone && !/^(\+91\s?)?[6-9]\d{9}$/.test(form.phone.replace(/\s/g,''))) e.phone = 'Invalid phone number';
    if (Object.keys(e).length) { setErrors(e); return; }
    login({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), avatar: user?.avatar });
    setLS(LS_USER, { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), avatar: user?.avatar });
    setEdit(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const initial = (user?.name ?? 'U').charAt(0).toUpperCase();
  const inp = (err?: string): React.CSSProperties => ({
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, border: `1.5px solid ${err ? ERR + '88' : BD}`,
    background: err ? '#FFF5F5' : W, color: T1, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color .15s',
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(() => localStorage.getItem('zyphix_avatar'));
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { const url = ev.target?.result as string; setAvatar(url); localStorage.setItem('zyphix_avatar', url); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Avatar card */}
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: avatar ? 'transparent' : `linear-gradient(135deg, ${G}, ${G2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: "'Outfit',sans-serif", overflow: 'hidden' }}>
              {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            <div onClick={() => fileRef.current?.click()}
              style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: W, border: `2px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Camera size={11} color={T2} />
            </div>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: T1, fontFamily: "'Outfit',sans-serif" }}>{user?.name}</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: T2 }}>{user?.email || user?.phone || 'Zyphix Member'}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, background: `${G}12`, borderRadius: 20, padding: '3px 10px' }}>
              <Star size={10} fill={G} color={G} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: G }}>Early Member</span>
            </div>
          </div>
          <button onClick={() => { setEdit(!edit); if (edit) setErrors({}); }}
            style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${edit ? ERR + '60' : BD}`, background: edit ? '#FFF5F5' : W, fontSize: 13, fontWeight: 700, color: edit ? ERR : T2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {edit ? <><X size={13} />Cancel</> : <><Edit2 size={13} />Edit</>}
          </button>
        </div>
      </SectionCard>

      {/* Details */}
      <SectionCard title="Personal Information">
        {saved && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, marginBottom: 16, fontSize: 13, fontWeight: 600, color: '#065F46' }}>
            <Check size={14} color={G} />Profile saved successfully!
          </motion.div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Full Name</label>
            {edit
              ? <><input value={form.name} onChange={e => f('name')(e.target.value)} placeholder="Your name" style={inp(errors.name)} />{errors.name && <p style={{ fontSize: 11, color: ERR, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={10} />{errors.name}</p>}</>
              : <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><User size={15} color={T3} /><p style={{ margin: 0, fontSize: 14, color: form.name ? T1 : T3 }}>{form.name || 'Not set'}</p></div>
            }
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Email Address</label>
            {edit
              ? <><input value={form.email} onChange={e => f('email')(e.target.value)} placeholder="you@example.com" type="email" style={inp(errors.email)} />{errors.email && <p style={{ fontSize: 11, color: ERR, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={10} />{errors.email}</p>}</>
              : <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Mail size={15} color={T3} /><p style={{ margin: 0, fontSize: 14, color: form.email ? T1 : T3 }}>{form.email || 'Not set'}</p></div>
            }
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: T2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>Phone Number</label>
            {edit
              ? <><input value={form.phone} onChange={e => f('phone')(e.target.value)} placeholder="+91 98765 43210" type="tel" style={inp(errors.phone)} />{errors.phone && <p style={{ fontSize: 11, color: ERR, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={10} />{errors.phone}</p>}</>
              : <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Phone size={15} color={T3} /><p style={{ margin: 0, fontSize: 14, color: form.phone ? T1 : T3 }}>{form.phone || 'Not set'}</p></div>
            }
          </div>
          {edit && (
            <motion.button onClick={handleSave} whileTap={{ scale: .97 }}
              style={{ padding: '12px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${G}, ${G2})`, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 3px 14px ${G}40` }}>
              <Save size={15} />Save Changes
            </motion.button>
          )}
        </div>
      </SectionCard>

      {/* Danger zone */}
      <SectionCard title="Account">
        <button onClick={() => { logout(); setLoc('/'); }}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${ERR}30`, background: '#FFF5F5', fontSize: 14, fontWeight: 700, color: ERR, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogOut size={15} />Sign Out
        </button>
      </SectionCard>
    </div>
  );
}

/* ── ADDRESSES TAB ── */
function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>(() => getLS<Address[]>(LS_ADDR, []));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<string | null>(null);

  const save = (updated: Address[]) => { setAddresses(updated); setLS(LS_ADDR, updated); };

  const addAddress = (a: Omit<Address, 'id' | 'isDefault'>) => {
    const newAddr: Address = { ...a, id: Date.now().toString(), isDefault: addresses.length === 0 };
    save([...addresses, newAddr]);
    setShowForm(false);
  };

  const updateAddress = (id: string, a: Omit<Address, 'id' | 'isDefault'>) => {
    save(addresses.map(x => x.id === id ? { ...x, ...a } : x));
    setEditId(null);
  };

  const deleteAddress = (id: string) => {
    setDeleted(id);
    setTimeout(() => {
      const updated = addresses.filter(x => x.id !== id);
      if (updated.length > 0 && !updated.some(x => x.isDefault)) updated[0].isDefault = true;
      save(updated); setDeleted(null);
    }, 350);
  };

  const setDefault = (id: string) => save(addresses.map(x => ({ ...x, isDefault: x.id === id })));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Add button */}
      {!showForm && !editId && (
        <button onClick={() => setShowForm(true)}
          style={{ width: '100%', padding: '13px', borderRadius: 14, border: `1.5px dashed ${G}60`, background: `${G}06`, fontSize: 14, fontWeight: 700, color: G, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${G}10`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${G}06`; }}>
          <Plus size={16} />Add New Address
        </button>
      )}

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ background: W, borderRadius: 16, border: `1.5px solid ${G}40`, padding: 20, boxShadow: `0 0 0 4px ${G}08` }}>
            <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: T1 }}>📍 Add New Address</p>
            <AddressForm onSave={addAddress} onCancel={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: W, borderRadius: 16, border: `1px solid ${BD}` }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
          <p style={{ fontSize: 16, fontWeight: 800, color: T1, marginBottom: 6 }}>No saved addresses</p>
          <p style={{ fontSize: 13.5, color: T2, marginBottom: 18, lineHeight: 1.6 }}>Add your home, work, or any address so we can deliver right to your door.</p>
          <button onClick={() => setShowForm(true)}
            style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: G, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Add First Address
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence>
            {addresses.map(addr => {
              const meta = TYPE_META[addr.type];
              if (editId === addr.id) {
                return (
                  <motion.div key={addr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ background: W, borderRadius: 16, border: `1.5px solid ${meta.ac}50`, padding: 20 }}>
                    <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: T1 }}>✏️ Edit Address</p>
                    <AddressForm initial={addr} onSave={a => updateAddress(addr.id, a)} onCancel={() => setEditId(null)} />
                  </motion.div>
                );
              }
              return (
                <motion.div key={addr.id}
                  animate={{ opacity: deleted === addr.id ? 0 : 1, x: deleted === addr.id ? 40 : 0 }}
                  style={{ background: W, borderRadius: 14, border: `1.5px solid ${addr.isDefault ? meta.ac + '50' : BD}`, padding: '14px 16px', boxShadow: addr.isDefault ? `0 0 0 3px ${meta.ac}10` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: meta.bg, border: `1px solid ${meta.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <meta.Icon size={16} color={meta.ac} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: T1 }}>{addr.label || meta.label}</p>
                        {addr.isDefault && (
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: meta.ac, background: meta.bg, border: `1px solid ${meta.bd}`, borderRadius: 20, padding: '1px 8px' }}>Default</span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: T2, lineHeight: 1.5 }}>
                        {[addr.flat, addr.floor, addr.area, addr.landmark].filter(Boolean).join(', ')}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 12.5, color: T3 }}>{addr.city} – {addr.pincode}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => setEditId(addr.id)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${BD}`, background: W, fontSize: 12, fontWeight: 600, color: T2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Edit2 size={11} />Edit
                      </button>
                      <button onClick={() => deleteAddress(addr.id)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${ERR}30`, background: '#FFF5F5', fontSize: 12, fontWeight: 600, color: ERR, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Trash2 size={11} />Delete
                      </button>
                    </div>
                  </div>
                  {!addr.isDefault && (
                    <button onClick={() => setDefault(addr.id)}
                      style={{ marginTop: 10, marginLeft: 50, fontSize: 12.5, fontWeight: 600, color: G, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Check size={12} />Set as default
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ── ORDERS TAB ── */
function OrdersTab() {
  const [, nav] = useLocation();
  const statusMeta = {
    delivered:  { label: 'Delivered',  color: '#065F46', bg: '#F0FDF4', dot: G },
    processing: { label: 'Processing', color: '#92400E', bg: '#FFFBEB', dot: '#F59E0B' },
    cancelled:  { label: 'Cancelled',  color: '#991B1B', bg: '#FEF2F2', dot: ERR },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {MOCK_ORDERS.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: W, borderRadius: 16, border: `1px solid ${BD}` }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>📦</div>
          <p style={{ fontSize: 16, fontWeight: 800, color: T1, marginBottom: 6 }}>No orders yet</p>
          <p style={{ fontSize: 13.5, color: T2, lineHeight: 1.6 }}>Your order history will appear here once you place your first order.</p>
        </div>
      ) : (
        MOCK_ORDERS.map(order => {
          const s = statusMeta[order.status];
          return (
            <div key={order.id} style={{ background: W, borderRadius: 14, border: `1px solid ${BD}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{order.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: T1 }}>{order.store}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <Clock size={11} color={T3} />
                      <p style={{ margin: 0, fontSize: 11.5, color: T3 }}>{order.date}</p>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: s.bg }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: s.color }}>{s.label}</span>
                </div>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: T3, textTransform: 'uppercase', letterSpacing: '.04em' }}>Items</p>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                    <Package size={12} color={T3} />
                    <p style={{ margin: 0, fontSize: 13.5, color: T1 }}>{item}</p>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BD}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ margin: 0, fontSize: 12, color: T3 }}>Order ID: <span style={{ fontWeight: 700, color: T2 }}>{order.id}</span></p>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: T1, fontFamily: "'Outfit',sans-serif" }}>₹{order.total}</p>
                </div>
                {order.status === 'delivered' && (
                  <button onClick={() => {
                    const dest = order.icon === '🍱' ? '/eats' : order.icon === '🧹' ? '/book' : '/now';
                    nav(dest);
                  }}
                    style={{ marginTop: 10, width: '100%', padding: '9px', borderRadius: 10, border: `1.5px solid ${G}40`, background: `${G}08`, fontSize: 13, fontWeight: 700, color: G, cursor: 'pointer', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${G}18`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${G}08`)}>
                    🔁 Reorder
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/* ── SETTINGS TAB ── */
function SettingsTab() {
  const [, nav] = useLocation();
  const [otpMsg, setOtpMsg] = useState(false);
  const [prefs, setPrefs] = useState(() => getLS(LS_PREFS, {
    orderUpdates: true, promos: true, newArrivals: false, soundAlerts: true,
  }) as Record<string, boolean>);

  const toggle = (k: string) => {
    const next = { ...prefs, [k]: !prefs[k] };
    setPrefs(next); setLS(LS_PREFS, next);
  };

  const Toggle = ({ k, label, sub }: { k: string; label: string; sub: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${BD}` }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T1 }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 12.5, color: T3 }}>{sub}</p>
      </div>
      <button onClick={() => toggle(k)}
        style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: prefs[k] ? G : '#D1D5DB', cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: W, position: 'absolute', top: 3, left: prefs[k] ? 23 : 3, transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.25)' }} />
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionCard title="Notifications">
        <div>
          <Toggle k="orderUpdates" label="Order Updates" sub="Get notified about your order status" />
          <Toggle k="promos" label="Offers & Promotions" sub="Discount codes, flash sales and deals" />
          <Toggle k="newArrivals" label="New Arrivals" sub="New stores and products near you" />
          <div style={{ padding: '12px 0' }}>
            <Toggle k="soundAlerts" label="Sound Alerts" sub="Play sound when an order is confirmed" />
          </div>
        </div>
      </SectionCard>

      {otpMsg && (
        <div style={{ padding: '12px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Lock size={15} color="#3B82F6" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: '#1E40AF' }}>Passwordless Account</p>
            <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#3B82F6', lineHeight: 1.5 }}>
              ZYPHIX uses email OTP for secure sign-in — no password needed. Your account is already protected by one-time codes.
            </p>
          </div>
          <button onClick={() => setOtpMsg(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93C5FD', flexShrink: 0, padding: 0 }}>
            <X size={14} />
          </button>
        </div>
      )}

      <SectionCard title="Privacy & Security">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {([
            { icon: <Lock size={15} />, label: 'Change Password', sub: 'Passwordless OTP — learn more', action: () => setOtpMsg(true) },
            { icon: <Heart size={15} />, label: 'Saved Items', sub: 'Products you\'ve favourited', action: () => nav('/now') },
            { icon: <Bell size={15} />, label: 'Notification Preferences', sub: 'Manage how we contact you', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
          ] as { icon: React.ReactNode; label: string; sub: string; action: () => void }[]).map(({ icon, label, sub, action }) => (
            <button key={label} onClick={action}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: `1px solid ${BD}`, transition: 'opacity .15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: BG, border: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T2, flexShrink: 0 }}>
                {icon}
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T1 }}>{label}</p>
                <p style={{ margin: '1px 0 0', fontSize: 12, color: T3 }}>{sub}</p>
              </div>
              <ChevronRight size={14} color={T3} />
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="About">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BD}` }}>
            <p style={{ margin: 0, fontSize: 13.5, color: T1 }}>App Version</p>
            <p style={{ margin: 0, fontSize: 13.5, color: T3 }}>1.0.0 (Beta)</p>
          </div>
          {([
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Privacy Policy',   href: '/privacy' },
            { label: 'Contact Support',  href: 'mailto:support@zyphix.in' },
          ] as { label: string; href: string }[]).map(({ label, href }) => (
            <a key={label} href={href} target={href.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BD}`, textDecoration: 'none', cursor: 'pointer', transition: 'opacity .15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <p style={{ margin: 0, fontSize: 13.5, color: T1 }}>{label}</p>
              <ExternalLink size={13} color={T3} />
            </a>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

type TabId = 'profile' | 'addresses' | 'orders' | 'settings';
const VALID_TABS: TabId[] = ['profile', 'addresses', 'orders', 'settings'];

/* ─── ROOT EXPORT ─── */
export function Account() {
  const { user, openModal } = useAuth();
  const [, nav] = useLocation();
  const search = useSearch();
  const paramTab = (new URLSearchParams(search)).get('tab') as TabId | null;
  const initTab: TabId = paramTab && VALID_TABS.includes(paramTab) ? paramTab : 'profile';
  const [tab, setTab] = useState<TabId>(initTab);

  const goTab = (t: TabId) => { setTab(t); nav(`/account?tab=${t}`, { replace: true }); };

  useEffect(() => {
    const t = (new URLSearchParams(window.location.search)).get('tab') as TabId | null;
    if (t && VALID_TABS.includes(t)) setTab(t);
  }, [search]);

  useEffect(() => { if (!user) openModal(); }, []);

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 }}>
        <div style={{ fontSize: 44 }}>🔐</div>
        <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}>Sign in to view your account</p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', margin: 0 }}>Your orders, addresses and preferences are waiting.</p>
        <button onClick={openModal}
          style={{ padding: '12px 28px', borderRadius: 14, border: 'none', background: G, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 20px ${G}50` }}>
          Sign In to Continue
        </button>
      </div>
    );
  }

  const TABS = [
    { id: 'profile'   as const, label: 'My Profile',  icon: <User size={16} /> },
    { id: 'addresses' as const, label: 'Addresses',   icon: <MapPin size={16} /> },
    { id: 'orders'    as const, label: 'My Orders',   icon: <ShoppingBag size={16} /> },
    { id: 'settings'  as const, label: 'Settings',    icon: <Settings size={16} /> },
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#fff', letterSpacing: '-.04em', margin: 0 }}>
          My Account
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>
          Manage your profile, addresses, orders and settings
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,220px) 1fr', gap: 20, alignItems: 'start' }}>

        {/* ── Sidebar ── */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 12, display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 80 }}>
          {TABS.map(t => (
            <TabBtn key={t.id} active={tab === t.id} onClick={() => goTab(t.id)} icon={t.icon} label={t.label} />
          ))}

          {/* Quick stats */}
          <div style={{ marginTop: 12, padding: '12px', borderRadius: 12, background: 'rgba(13,163,102,.08)', border: '1px solid rgba(13,163,102,.15)' }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Quick Stats</p>
            {[
              { v: MOCK_ORDERS.filter(o => o.status === 'delivered').length, l: 'Orders Delivered' },
              { v: getLS<Address[]>(LS_ADDR, []).length, l: 'Saved Addresses' },
            ].map(({ v, l }) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0' }}>
                <p style={{ margin: 0, fontSize: 12.5, color: 'rgba(255,255,255,.55)' }}>{l}</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: G, fontFamily: "'Outfit',sans-serif" }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .18 }}>
              {tab === 'profile'   && <ProfileTab />}
              {tab === 'addresses' && <AddressesTab />}
              {tab === 'orders'    && <OrdersTab />}
              {tab === 'settings'  && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
