import { useSeo } from '@/lib/seo';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { useLocation, useSearch } from 'wouter';
import {
  User, MapPin, ShoppingBag, Settings, Plus, Edit2, Trash2,
  Home, Briefcase, Building2, Check, ChevronRight, Bell,
  Lock, LogOut, Phone, Mail, Camera, X, Clock,
  Package, AlertCircle, Heart, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { listOrders, type Order } from '@/context/CartContext';
import {
  listAddresses, addAddress, updateAddress, deleteAddress as deleteAddressRemote, setDefaultAddress,
  myOrders, toLocalOrder, updateProfile, authUrl, type SavedAddress, type AddressInput,
} from '@/lib/account';
import { Button, FONT } from '@/ui/kit';
import { BgVideo } from '@/ui/cinema';
import { VIDEOS } from '@/data/media';

/* ─── shared classes ─── */
const card = 'rounded-3xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(11,15,25,.04)]';
const label = 'mb-1.5 block text-[13px] font-medium text-gray-600';
const inputCls = (err?: string) => `h-11 w-full rounded-xl border bg-white px-3.5 text-[14.5px] text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-gray-400 hover:border-gray-300 focus:border-[#0DA366] focus:ring-4 focus:ring-[#0DA366]/15 ${err ? 'border-red-300' : 'border-gray-200'}`;
const errCls = 'mt-1 flex items-center gap-1 text-[12px] text-red-600';

/* ─── types ─── */
interface Address {
  id: string; type: 'home' | 'work' | 'other' | 'hotel';
  label: string; flat: string; floor: string; area: string;
  landmark: string; city: string; pincode: string; isDefault: boolean;
}
/** An order as shown in the list: the local `Order` shape plus the server status when known. */
type ShownOrder = Order & { rawStatus?: string };

/* ─── helpers ─── */
const LS_ADDR  = 'zyphix_addresses';
const LS_USER  = 'zyphix_user';
const LS_PREFS = 'zyphix_prefs';
const LS_ADDR_MIGRATED = 'zyphix_addresses_migrated';

function getLS<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}
function setLS(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const TYPE_META = {
  home:  { Icon: Home,      label: 'Home'  },
  work:  { Icon: Briefcase, label: 'Work'  },
  hotel: { Icon: Building2, label: 'Hotel' },
  other: { Icon: MapPin,    label: 'Other' },
};

/* ── local <-> server address mapping ──
   The server stores label / line1 / line2 / city / pincode. We keep the richer local form
   (type, flat, floor, area, landmark) by packing: label = "Home · Mom's place",
   line1 = "flat | floor", line2 = "area | landmark". Checkout flattens " | " to ", ". */
const SEP = ' | ';
function encodeLabel(type: Address['type'], label: string) {
  const t = TYPE_META[type].label;
  return !label || label.toLowerCase() === t.toLowerCase() ? t : `${t} · ${label}`;
}
function decodeLabel(label: string): { type: Address['type']; label: string } {
  const [head, ...rest] = label.split(' · ');
  const t = (Object.keys(TYPE_META) as Address['type'][]).find(k => TYPE_META[k].label.toLowerCase() === head.trim().toLowerCase());
  if (t) return { type: t, label: rest.join(' · ').trim() || TYPE_META[t].label };
  return { type: 'other', label: label || 'Other' };
}
const split2 = (s: string): [string, string] => { const i = s.indexOf(SEP); return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + SEP.length)]; };
function toServer(a: Omit<Address, 'id' | 'isDefault'>, isDefault?: boolean): AddressInput {
  return {
    label: encodeLabel(a.type, a.label), line1: [a.flat, a.floor].filter(Boolean).join(SEP), line2: [a.area, a.landmark].filter(Boolean).join(SEP),
    city: a.city, pincode: a.pincode, ...(isDefault !== undefined ? { isDefault } : {}),
  };
}
function fromServer(s: SavedAddress): Address {
  const { type, label } = decodeLabel(s.label);
  const [flat, floor] = split2(s.line1); const [area, landmark] = split2(s.line2);
  return { id: s.id, type, label, flat, floor, area, landmark, city: s.city, pincode: s.pincode, isDefault: s.isDefault };
}

/* ─── sub-components ─── */
function TabBtn({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count?: number }) {
  return (
    <button type="button" onClick={onClick} aria-current={active ? 'page' : undefined}
      className={`flex h-11 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full px-4 text-left text-[14px] tracking-[-0.01em] transition md:w-full md:rounded-2xl ${active ? 'bg-[#05080E] font-semibold text-white shadow-[0_8px_24px_-12px_rgba(5,8,14,.6)]' : 'font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
      <span className={active ? 'text-emerald-300' : 'text-gray-400'}>{icon}</span>
      <span className="min-w-0 flex-1">{label}</span>
      {count !== undefined && <span className={`rounded-full px-2 py-0.5 text-[11.5px] font-semibold tabular-nums ${active ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500'}`}>{count}</span>}
    </button>
  );
}

function SectionCard({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className={card}>
      {title && (
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 md:px-6">
          <p className="text-[15.5px] font-semibold tracking-[-0.02em] text-gray-900">{title}</p>
          {action}
        </div>
      )}
      <div className="p-5 md:p-6">{children}</div>
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

  return (
    <div className="flex flex-col gap-4">
      {/* Type picker */}
      <div>
        <span className={label}>Address type</span>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(TYPE_META) as Array<keyof typeof TYPE_META>).map(t => {
            const m = TYPE_META[t];
            const active = form.type === t;
            return (
              <button key={t} type="button" onClick={() => f('type')(t)} aria-pressed={active}
                className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-2.5 transition ${active ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                <m.Icon size={15} />
                <span className={`text-[11.5px] ${active ? 'font-semibold' : 'font-medium'}`}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Label */}
      <label className="block">
        <span className={label}>Save as (optional)</span>
        <input value={form.label} onChange={e => f('label')(e.target.value)} placeholder={`e.g. ${TYPE_META[form.type as keyof typeof TYPE_META].label}, Mom's place`} className={inputCls()} />
      </label>

      {/* Flat & Floor */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Flat / house no.</span>
          <input value={form.flat} onChange={e => f('flat')(e.target.value)} placeholder="F-12, Block B" className={inputCls(errors.flat)} />
          {errors.flat && <span className={errCls}>{errors.flat}</span>}
        </label>
        <label className="block">
          <span className={label}>Floor (optional)</span>
          <input value={form.floor} onChange={e => f('floor')(e.target.value)} placeholder="2nd floor" className={inputCls()} />
        </label>
      </div>

      {/* Area */}
      <label className="block">
        <span className={label}>Area / locality</span>
        <input value={form.area} onChange={e => f('area')(e.target.value)} placeholder="Street, neighbourhood" className={inputCls(errors.area)} />
        {errors.area && <span className={errCls}>{errors.area}</span>}
      </label>

      {/* Landmark */}
      <label className="block">
        <span className={label}>Landmark (optional)</span>
        <input value={form.landmark} onChange={e => f('landmark')(e.target.value)} placeholder="Near the park, opposite the school" className={inputCls()} />
      </label>

      {/* City & Pincode */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={label}>City</span>
          <select value={form.city} onChange={e => f('city')(e.target.value)} className={`${inputCls(errors.city)} cursor-pointer appearance-none`}>
            {['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Surat', 'Nagpur', 'Indore', 'Bhopal', 'Patna', 'Kochi', 'Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="block">
          <span className={label}>Pincode</span>
          <input value={form.pincode} onChange={e => f('pincode')(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit pincode" inputMode="numeric" className={inputCls(errors.pincode)} />
          {errors.pincode && <span className={errCls}>{errors.pincode}</span>}
        </label>
      </div>

      {/* Buttons */}
      <div className="mt-1 flex gap-2">
        <Button size="sm" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button size="sm" onClick={handleSave} className="flex-[2]">Save address</Button>
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
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const remote = !!user?.id; // server-backed account (session cookie) vs. legacy client-only login

  const f = (k: string) => (v: string) => { setForm(x => ({ ...x, [k]: v })); setErrors(x => ({ ...x, [k]: '' })); };

  const handleSave = async () => {
    const e: Record<string,string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (form.phone && !/^(\+91\s?)?[6-9]\d{9}$/.test(form.phone.replace(/\s/g,''))) e.phone = 'Invalid phone number';
    if (Object.keys(e).length) { setErrors(e); return; }
    let next = { id: user?.id, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), avatar: user?.avatar };
    if (remote) {
      setSaving(true);
      try {
        const u = await updateProfile({ name: next.name, phone: next.phone });
        next = { ...next, name: u.name || next.name, email: u.email, phone: u.phone };
      } catch (err) {
        setErrors({ name: err instanceof Error ? err.message : 'Could not save. Please try again.' });
        setSaving(false); return;
      }
      setSaving(false);
    }
    login(next);
    setLS(LS_USER, next);
    setForm({ name: next.name, email: next.email, phone: next.phone });
    setEdit(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const initial = (user?.name ?? 'U').charAt(0).toUpperCase();

  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(() => localStorage.getItem('zyphix_avatar'));
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { const url = ev.target?.result as string; setAvatar(url); localStorage.setItem('zyphix_avatar', url); };
    reader.readAsDataURL(file);
  };

  const ReadRow = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
    <div className="flex items-center gap-2.5">
      <span className="text-gray-400">{icon}</span>
      <p className={`text-[13.5px] ${value ? 'text-gray-900' : 'text-gray-400'}`}>{value || 'Not set'}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Avatar card */}
      <SectionCard>
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-[20px] font-semibold text-white">
              {avatar ? <img src={avatar} alt="avatar" className="h-full w-full object-cover" /> : initial}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <button type="button" onClick={() => fileRef.current?.click()} aria-label="Change photo"
              className="absolute -bottom-0.5 -right-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50">
              <Camera size={11} />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-gray-900">{user?.name}</p>
            <p className="truncate text-[13px] text-gray-500">{user?.email || user?.phone || 'Member'}</p>
          </div>
          <Button size="sm" variant="secondary" className="!h-8" onClick={() => { setEdit(!edit); if (edit) setErrors({}); }}>
            {edit ? <><X size={13} /> Cancel</> : <><Edit2 size={13} /> Edit</>}
          </Button>
        </div>
      </SectionCard>

      {/* Details */}
      <SectionCard title="Personal information">
        {saved && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-700">
            <Check size={14} /> Profile saved
          </motion.div>
        )}
        <div className="flex flex-col gap-4">
          <div>
            <span className={label}>Full name</span>
            {edit
              ? <><input value={form.name} onChange={e => f('name')(e.target.value)} placeholder="Your name" className={inputCls(errors.name)} />{errors.name && <p className={errCls}><AlertCircle size={11} />{errors.name}</p>}</>
              : <ReadRow icon={<User size={14} />} value={form.name} />
            }
          </div>
          <div>
            <span className={label}>Email</span>
            {edit && !remote
              ? <><input value={form.email} onChange={e => f('email')(e.target.value)} placeholder="you@example.com" type="email" className={inputCls(errors.email)} />{errors.email && <p className={errCls}><AlertCircle size={11} />{errors.email}</p>}</>
              : <div className="flex flex-wrap items-center gap-x-2"><ReadRow icon={<Mail size={14} />} value={form.email} />{edit && remote && <span className="text-[12px] text-gray-400">Sign-in email can't be changed</span>}</div>
            }
          </div>
          <div>
            <span className={label}>Phone</span>
            {edit
              ? <><input value={form.phone} onChange={e => f('phone')(e.target.value)} placeholder="Mobile number" type="tel" className={inputCls(errors.phone)} />{errors.phone && <p className={errCls}><AlertCircle size={11} />{errors.phone}</p>}</>
              : <ReadRow icon={<Phone size={14} />} value={form.phone} />
            }
          </div>
          {edit && (
            <div>
              <Button size="sm" onClick={handleSave} className={saving ? 'pointer-events-none opacity-60' : ''}>{saving ? 'Saving' : 'Save changes'}</Button>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Account */}
      <SectionCard title="Account">
        <button type="button" onClick={async () => { await logout(); setLoc('/'); }}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-[13.5px] font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50">
          <LogOut size={14} /> Sign out
        </button>
      </SectionCard>
    </div>
  );
}

/* ── ADDRESSES TAB ── */
function AddressesTab() {
  const { user } = useAuth();
  const remote = !!user?.id; // server-backed account → D1; otherwise localStorage
  const [addresses, setAddresses] = useState<Address[]>(() => getLS<Address[]>(LS_ADDR, []));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<string | null>(null);
  const [loading, setLoading] = useState(remote);
  const [error, setError] = useState('');

  const fail = (err: unknown) => setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');

  // Load from the server; on first sign-in, migrate any addresses saved locally (once).
  useEffect(() => {
    if (!remote) return;
    let alive = true;
    (async () => {
      try {
        let list = await listAddresses();
        const local = getLS<Address[]>(LS_ADDR, []);
        if (list.length === 0 && local.length > 0 && !getLS<boolean>(LS_ADDR_MIGRATED, false)) {
          for (const a of local.slice(0, 10)) { try { await addAddress(toServer(a, a.isDefault)); } catch {} }
          setLS(LS_ADDR_MIGRATED, true);
          list = await listAddresses();
        }
        if (alive) setAddresses(list.map(fromServer));
      } catch (err) { if (alive) fail(err); }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [remote]);

  const save = (updated: Address[]) => { setAddresses(updated); if (!remote) setLS(LS_ADDR, updated); };
  const reload = async () => { try { setAddresses((await listAddresses()).map(fromServer)); } catch (err) { fail(err); } };

  const addAddr = async (a: Omit<Address, 'id' | 'isDefault'>) => {
    setError('');
    if (remote) {
      try { await addAddress(toServer(a)); await reload(); } catch (err) { fail(err); return; }
    } else {
      save([...addresses, { ...a, id: Date.now().toString(), isDefault: addresses.length === 0 }]);
    }
    setShowForm(false);
  };

  const updateAddr = async (id: string, a: Omit<Address, 'id' | 'isDefault'>) => {
    setError('');
    if (remote) {
      try { await updateAddress(id, toServer(a)); await reload(); } catch (err) { fail(err); return; }
    } else {
      save(addresses.map(x => x.id === id ? { ...x, ...a } : x));
    }
    setEditId(null);
  };

  const deleteAddr = (id: string) => {
    setError(''); setDeleted(id);
    setTimeout(async () => {
      if (remote) {
        try { await deleteAddressRemote(id); await reload(); } catch (err) { fail(err); }
      } else {
        const updated = addresses.filter(x => x.id !== id);
        if (updated.length > 0 && !updated.some(x => x.isDefault)) updated[0].isDefault = true;
        save(updated);
      }
      setDeleted(null);
    }, 350);
  };

  const setDefault = async (id: string) => {
    setError('');
    if (remote) { try { setAddresses((await setDefaultAddress(id)).map(fromServer)); } catch (err) { fail(err); } }
    else save(addresses.map(x => ({ ...x, isDefault: x.id === id })));
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          <AlertCircle size={14} />{error}
        </div>
      )}
      {loading && (
        <div className={`${card} space-y-2 p-4`}>
          <div className="h-3.5 w-32 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-56 animate-pulse rounded bg-gray-100" />
        </div>
      )}

      {/* Add button */}
      {!showForm && !editId && !loading && (
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-500">{addresses.length} saved</p>
          <Button size="sm" variant="secondary" className="!h-8" onClick={() => setShowForm(true)}><Plus size={14} /> Add address</Button>
        </div>
      )}

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className={`${card} p-4`}>
            <p className="mb-3 text-[14px] font-semibold text-gray-900">New address</p>
            <AddressForm onSave={addAddr} onCancel={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address list */}
      {addresses.length === 0 && !showForm && !loading ? (
        <div className={`${card} px-6 py-12 text-center`}>
          <span className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-[#FAFAFA] text-gray-400"><MapPin size={18} /></span>
          <p className="text-[15px] font-semibold">No saved addresses</p>
          <p className="mt-1 text-[13px] text-gray-500">Save an address to check out faster.</p>
          <div className="mt-4"><Button size="sm" onClick={() => setShowForm(true)}>Add address</Button></div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <AnimatePresence>
            {addresses.map(addr => {
              const meta = TYPE_META[addr.type];
              if (editId === addr.id) {
                return (
                  <motion.div key={addr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`${card} p-4`}>
                    <p className="mb-3 text-[14px] font-semibold text-gray-900">Edit address</p>
                    <AddressForm initial={addr} onSave={a => updateAddr(addr.id, a)} onCancel={() => setEditId(null)} />
                  </motion.div>
                );
              }
              return (
                <motion.div key={addr.id}
                  animate={{ opacity: deleted === addr.id ? 0 : 1, x: deleted === addr.id ? 24 : 0 }}
                  className={`${card} p-3 ${addr.isDefault ? 'border-emerald-200' : ''}`}>
                  <div className="flex items-start gap-3">
                    <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${addr.isDefault ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-[#FAFAFA] text-gray-500'}`}>
                      <meta.Icon size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[13.5px] font-semibold text-gray-900">{addr.label || meta.label}</p>
                        {addr.isDefault && <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-emerald-700">Default</span>}
                      </div>
                      <p className="mt-0.5 text-[13px] leading-[1.45] text-gray-600">
                        {[addr.flat, addr.floor, addr.area, addr.landmark].filter(Boolean).join(', ')}
                      </p>
                      <p className="text-[12px] text-gray-500">{addr.city} – {addr.pincode}</p>
                      {!addr.isDefault && (
                        <button type="button" onClick={() => setDefault(addr.id)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-emerald-700 transition hover:text-emerald-800">
                          <Check size={12} /> Set as default
                        </button>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button type="button" onClick={() => setEditId(addr.id)} aria-label="Edit address"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-900">
                        <Edit2 size={13} />
                      </button>
                      <button type="button" onClick={() => deleteAddr(addr.id)} aria-label="Delete address"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
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
/** Server orders (signed-in) merged with orders placed on this device; deduped by id, newest first. */
function useMergedOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<ShownOrder[]>(() => listOrders());
  const [loading, setLoading] = useState(!!user?.id);
  useEffect(() => {
    if (!user?.id) { setOrders(listOrders()); setLoading(false); return; }
    let alive = true;
    myOrders().then(remote => {
      if (!alive) return;
      const seen = new Map<string, ShownOrder>();
      for (const r of remote) seen.set(r.id, { ...toLocalOrder(r), rawStatus: r.status });
      for (const o of listOrders()) if (!seen.has(o.id)) seen.set(o.id, o);
      setOrders([...seen.values()].sort((a, b) => (b.createdAt > a.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : 0)));
    }).catch(() => {}).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user?.id]);
  return { orders, loading };
}

const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  delivered:  { label: 'Delivered',  cls: 'bg-emerald-50 text-emerald-700' },
  placed:     { label: 'Confirmed',  cls: 'bg-amber-50 text-amber-700' },
  confirmed:  { label: 'Confirmed',  cls: 'bg-amber-50 text-amber-700' },
  processing: { label: 'Processing', cls: 'bg-amber-50 text-amber-700' },
  cancelled:  { label: 'Cancelled',  cls: 'bg-red-50 text-red-700' },
};
const fmtDate = (iso: string) => { const d = new Date(iso); return isNaN(d.getTime()) ? iso : d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }); };

function OrdersTab() {
  const [, nav] = useLocation();
  const { orders, loading } = useMergedOrders();

  return (
    <div className="flex flex-col gap-2.5">
      {loading && orders.length === 0 ? (
        [0, 1].map(i => (
          <div key={i} className={`${card} space-y-2 p-4`}>
            <div className="h-3.5 w-40 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-64 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
          </div>
        ))
      ) : orders.length === 0 ? (
        <div className={`${card} px-6 py-12 text-center`}>
          <span className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-[#FAFAFA] text-gray-400"><Package size={18} /></span>
          <p className="text-[15px] font-semibold">No orders yet</p>
          <p className="mt-1 text-[13px] text-gray-500">Orders you place will show up here.</p>
          <div className="mt-4"><Button size="sm" href="/now">Start shopping</Button></div>
        </div>
      ) : (
        orders.map(order => {
          const s = ORDER_STATUS[(order.rawStatus ?? order.status).toLowerCase()] ?? ORDER_STATUS.confirmed;
          const count = order.items.reduce((n, i) => n + i.qty, 0);
          return (
            <div key={order.id} className={card}>
              <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-gray-900">Zyphix Now · {order.id}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-gray-500"><Clock size={11} /> {fmtDate(order.createdAt)}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${s.cls}`}>{s.label}</span>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {order.items.slice(0, 6).map((item, i) => (
                    <img key={i} src={item.image} alt={item.name} className="h-10 w-10 shrink-0 rounded-lg border border-gray-200 bg-white object-contain p-0.5" />
                  ))}
                  {order.items.length > 6 && <span className="shrink-0 text-[12px] text-gray-500">+{order.items.length - 6}</span>}
                </div>
                <p className="mt-2 truncate text-[13px] text-gray-600">
                  {order.items.map(i => `${i.name}${i.qty > 1 ? ` ×${i.qty}` : ''}`).join(', ')}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-[13px] text-gray-500">{count} item{count > 1 ? 's' : ''} · <span className="font-semibold text-gray-900">₹{order.total}</span></p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" className="!h-8" onClick={() => nav(`/now/order/${order.id}`)}>Details</Button>
                    <Button size="sm" className="!h-8" onClick={() => nav('/now')}>Reorder</Button>
                  </div>
                </div>
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
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium text-gray-900">{label}</p>
        <p className="text-[12px] text-gray-500">{sub}</p>
      </div>
      <button type="button" role="switch" aria-checked={!!prefs[k]} onClick={() => toggle(k)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${prefs[k] ? 'bg-emerald-600' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${prefs[k] ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Notifications">
        <div className="-my-1 divide-y divide-gray-100">
          <Toggle k="orderUpdates" label="Order updates" sub="Status changes for your orders" />
          <Toggle k="promos" label="Offers and promotions" sub="Coupon codes and deals" />
          <Toggle k="newArrivals" label="New arrivals" sub="New stores and products near you" />
          <Toggle k="soundAlerts" label="Sound alerts" sub="Play a sound when an order is confirmed" />
        </div>
      </SectionCard>

      {otpMsg && (
        <div className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-3">
          <Lock size={14} className="mt-0.5 shrink-0 text-gray-500" />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-gray-900">Passwordless account</p>
            <p className="mt-0.5 text-[12.5px] leading-[1.5] text-gray-600">Zyphix uses email OTP for sign-in, so there is no password to change.</p>
          </div>
          <button type="button" onClick={() => setOtpMsg(false)} aria-label="Dismiss" className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <X size={13} />
          </button>
        </div>
      )}

      <SectionCard title="Privacy and security">
        <div className="-my-1 divide-y divide-gray-100">
          {([
            { icon: <Lock size={14} />, label: 'Password', sub: 'Passwordless OTP sign-in', action: () => setOtpMsg(true) },
            { icon: <Heart size={14} />, label: 'Saved items', sub: 'Products you have saved', action: () => nav('/wishlist') },
            { icon: <Bell size={14} />, label: 'Notification preferences', sub: 'Manage how we contact you', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
          ] as { icon: React.ReactNode; label: string; sub: string; action: () => void }[]).map(({ icon, label, sub, action }) => (
            <button key={label} type="button" onClick={action} className="flex w-full items-center gap-3 py-2.5 text-left transition hover:opacity-80">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-[#FAFAFA] text-gray-500">{icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-medium text-gray-900">{label}</span>
                <span className="block text-[12px] text-gray-500">{sub}</span>
              </span>
              <ChevronRight size={14} className="shrink-0 text-gray-400" />
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="About">
        <div className="-my-1 divide-y divide-gray-100">
          <div className="flex items-center justify-between py-2.5 text-[13.5px]">
            <p className="text-gray-900">App version</p>
            <p className="text-gray-500">1.0.0 (Beta)</p>
          </div>
          {([
            { label: 'Terms of service', href: '/terms' },
            { label: 'Privacy policy',   href: '/privacy' },
            { label: 'Contact support',  href: 'mailto:support@zyphix.in' },
          ] as { label: string; href: string }[]).map(({ label, href }) => (
            <a key={label} href={href} target={href.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer"
              className="flex items-center justify-between py-2.5 text-[13.5px] text-gray-900 no-underline transition hover:opacity-80">
              <span>{label}</span>
              <ExternalLink size={13} className="text-gray-400" />
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
  useSeo('Your account · Zyphix');
  const { user, ready, openModal } = useAuth();
  const [, nav] = useLocation();
  const search = useSearch();
  const paramTab = (new URLSearchParams(search)).get('tab') as TabId | null;
  const initTab: TabId = paramTab && VALID_TABS.includes(paramTab) ? paramTab : 'profile';
  const [tab, setTab] = useState<TabId>(initTab);
  const { orders } = useMergedOrders();
  const [addressCount, setAddressCount] = useState(() => getLS<Address[]>(LS_ADDR, []).length);
  const orderCount = orders.length;

  const goTab = (t: TabId) => { setTab(t); nav(`/account?tab=${t}`, { replace: true }); };

  useEffect(() => {
    const t = (new URLSearchParams(window.location.search)).get('tab') as TabId | null;
    if (t && VALID_TABS.includes(t)) setTab(t);
  }, [search]);

  useEffect(() => {
    if (!user?.id) { setAddressCount(getLS<Address[]>(LS_ADDR, []).length); return; }
    listAddresses().then(l => setAddressCount(l.length)).catch(() => {});
  }, [user?.id, tab]);

  if (!user) {
    if (!ready) {
      return (
        <div className="mx-auto w-full max-w-[1040px] pt-6" style={{ fontFamily: FONT }}>
          <div className={`${card} space-y-2 p-4`}>
            <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-64 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      );
    }
    return (
      <div className="mx-auto w-full max-w-[1040px] pt-6 text-gray-900" style={{ fontFamily: FONT }}>
        <div className={`${card} px-6 py-16 text-center`}>
          <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><User size={20} /></span>
          <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Sign in to view your account</h1>
          <p className="mt-2 text-[14.5px] text-gray-500">Orders, addresses and preferences are saved to your account.</p>
          <div className="mt-4 flex flex-col items-center gap-2">
            <Button size="sm" sameTab href={authUrl(typeof window !== 'undefined' ? window.location.href : undefined)}>Sign in</Button>
            <button type="button" onClick={openModal} className="text-[13px] font-medium text-gray-500 hover:text-gray-900">or sign in here</button>
          </div>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'profile'   as const, label: 'Profile',   icon: <User size={15} /> },
    { id: 'addresses' as const, label: 'Addresses', icon: <MapPin size={15} />, count: addressCount },
    { id: 'orders'    as const, label: 'Orders',    icon: <ShoppingBag size={15} />, count: orderCount },
    { id: 'settings'  as const, label: 'Settings',  icon: <Settings size={15} /> },
  ];

  return (
    <div className="mx-auto w-full max-w-[1040px] pb-24 pt-4 text-gray-900 md:pb-12 md:pt-6" style={{ fontFamily: FONT }}>
      {/* Header band */}
      <div className="relative isolate overflow-hidden rounded-3xl bg-[#05080E] text-white">
        <BgVideo clip={VIDEOS.nightCity} dim={0.62} />
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(5,8,14,.9) 0%, rgba(5,8,14,.55) 55%, rgba(5,8,14,.25) 100%), radial-gradient(600px 300px at 0% 100%, rgba(13,163,102,.35), transparent 70%)' }} />
        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[22px] font-semibold text-white ring-4 ring-white/10" style={{ background: 'linear-gradient(160deg, #19C27C, #0DA366)' }}>
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300">Your account</p>
              <h1 className="mt-1 truncate text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] md:text-[32px]">{user.name || 'Welcome'}</h1>
              <p className="mt-1 truncate text-[14px] text-white/60">{user.email || user.phone || 'Member'}</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2.5">
            <button type="button" onClick={() => goTab('orders')} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-left backdrop-blur-md transition hover:bg-white/15">
              <p className="text-[20px] font-semibold tabular-nums leading-none tracking-[-0.02em]">{orderCount}</p>
              <p className="mt-1 text-[12px] text-white/60">Orders</p>
            </button>
            <button type="button" onClick={() => goTab('addresses')} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-left backdrop-blur-md transition hover:bg-white/15">
              <p className="text-[20px] font-semibold tabular-nums leading-none tracking-[-0.02em]">{addressCount}</p>
              <p className="mt-1 text-[12px] text-white/60">Addresses</p>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid items-start gap-5 md:grid-cols-[220px_1fr] md:gap-6">
        {/* Sidebar (desktop) / tab row (mobile) */}
        <div className={`${card} flex gap-1 overflow-x-auto p-1.5 [scrollbar-width:none] md:sticky md:top-[88px] md:flex-col md:overflow-visible md:p-2 [&::-webkit-scrollbar]:hidden`}>
          {TABS.map(t => (
            <TabBtn key={t.id} active={tab === t.id} onClick={() => goTab(t.id)} icon={t.icon} label={t.label} count={t.count} />
          ))}
        </div>

        {/* Content */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .15 }}>
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
