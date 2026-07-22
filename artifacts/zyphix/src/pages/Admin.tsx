import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShieldCheck, Package, Users, TrendingUp, IndianRupee, ShoppingBag, LogOut, Search } from 'lucide-react';
import { listOrders, type Order } from '@/context/CartContext';
import { products } from '@/data/mockData';

const G = '#0DA366';
const ADMIN_KEY = 'zyphix_admin_pass_v1';
const DEFAULT_PASS = 'zyphix2026';

type Tab = 'overview' | 'orders' | 'products' | 'customers';

export function Admin() {
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem(ADMIN_KEY) === '1'; } catch { return false; }
  });
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [, navigate] = useLocation();

  useEffect(() => { if (authed) setOrders(listOrders()); }, [authed]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const customers = new Set(orders.map(o => o.address.phone)).size;
    const aov = orders.length ? Math.round(revenue / orders.length) : 0;
    return { orders: orders.length, revenue, customers, aov, products: products.length };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.address.name.toLowerCase().includes(q) ||
      o.address.phone.includes(q)
    );
  }, [orders, search]);

  if (!authed) {
    return (
      <div style={{ padding: '60px 20px', maxWidth: 420, margin: '0 auto' }}>
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(13,163,102,0.1)', color: G, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <ShieldCheck size={30} />
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 22, color: '#111827', margin: 0 }}>Admin Access</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 6 }}>Sign in to manage orders, products and customers.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (pw === DEFAULT_PASS) { localStorage.setItem(ADMIN_KEY, '1'); setAuthed(true); } else setErr('Wrong password'); }}>
            <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(''); }} placeholder="Admin password"
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 14, outline: 'none', margin: '16px 0 8px', boxSizing: 'border-box' }} />
            {err && <div style={{ color: '#EF4444', fontSize: 12, marginBottom: 8 }}>{err}</div>}
            <button type="submit" style={{ width: '100%', padding: '12px', background: G, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
              Sign in
            </button>
          </form>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 12 }}>Default demo password: <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>{DEFAULT_PASS}</code></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 4px' }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 24, color: '#111827', margin: 0 }}>Admin Dashboard</h1>
          <div style={{ fontSize: 12, color: '#6B7280' }}>ZyphixNOW · Operations</div>
        </div>
        <button onClick={() => { localStorage.removeItem(ADMIN_KEY); setAuthed(false); }}
          style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '8px 12px', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, color: '#111827' }}>
          <LogOut size={13} /> Sign out
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
        {(['overview', 'orders', 'products', 'customers'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '9px 16px', background: tab === t ? G : '#fff', color: tab === t ? '#fff' : '#111827', border: `1px solid ${tab === t ? G : '#E5E7EB'}`, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 18 }}>
            <Kpi icon={<IndianRupee size={18} />} label="Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} />
            <Kpi icon={<ShoppingBag size={18} />} label="Orders" value={String(stats.orders)} />
            <Kpi icon={<Users size={18} />} label="Customers" value={String(stats.customers)} />
            <Kpi icon={<TrendingUp size={18} />} label="AOV" value={`₹${stats.aov}`} />
            <Kpi icon={<Package size={18} />} label="Catalog" value={String(stats.products)} />
          </div>
          <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', marginBottom: 10 }}>Recent orders</div>
            {orders.slice(0, 5).map(o => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed #F3F4F6' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>{o.address.name}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{o.id} · {new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ fontWeight: 800, color: '#111827' }}>₹{o.total}</div>
              </div>
            ))}
            {orders.length === 0 && <div style={{ color: '#6B7280', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>No orders yet.</div>}
          </div>
        </>
      )}

      {tab === 'orders' && (
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '8px 12px' }}>
            <Search size={16} color="#9CA3AF" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, name or phone" style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13 }} />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
                  {['Order', 'Customer', 'Items', 'Payment', 'Total', 'When'].map(h => (
                    <th key={h} style={{ padding: '10px', fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '10px' }}><Link href={`/now/order/${o.id}`}><a style={{ color: G, fontWeight: 700, textDecoration: 'none' }}>{o.id}</a></Link></td>
                    <td style={{ padding: '10px' }}>{o.address.name}<div style={{ fontSize: 11, color: '#6B7280' }}>{o.address.phone}</div></td>
                    <td style={{ padding: '10px' }}>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                    <td style={{ padding: '10px' }}><span style={{ padding: '3px 8px', background: o.paymentMode === 'COD' ? '#FEF3C7' : '#DBEAFE', color: o.paymentMode === 'COD' ? '#92400E' : '#1E40AF', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{o.paymentMode}</span></td>
                    <td style={{ padding: '10px', fontWeight: 800 }}>₹{o.total}</td>
                    <td style={{ padding: '10px', color: '#6B7280', fontSize: 12 }}>{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#9CA3AF' }}>No orders.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', marginBottom: 12 }}>Catalog ({products.length} products)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, maxHeight: 600, overflowY: 'auto' }}>
            {products.slice(0, 60).map(p => (
              <div key={p.id} style={{ border: '1px solid #F0F0F0', borderRadius: 10, padding: 8 }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 6 }}>{p.brand}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1F2937', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <div style={{ fontWeight: 900, color: '#111827', fontSize: 13 }}>₹{p.price}</div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>{p.category}</div>
                </div>
              </div>
            ))}
          </div>
          {products.length > 60 && <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 12 }}>Showing 60 of {products.length}.</div>}
        </div>
      )}

      {tab === 'customers' && (
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', marginBottom: 12 }}>Customers</div>
          {(() => {
            const byPhone = new Map<string, { name: string; phone: string; orders: number; spend: number }>();
            orders.forEach(o => {
              const k = o.address.phone;
              const cur = byPhone.get(k) || { name: o.address.name, phone: k, orders: 0, spend: 0 };
              cur.orders++; cur.spend += o.total;
              byPhone.set(k, cur);
            });
            const list = Array.from(byPhone.values()).sort((a, b) => b.spend - a.spend);
            if (list.length === 0) return <div style={{ textAlign: 'center', color: '#9CA3AF', padding: 30 }}>No customers yet.</div>;
            return (
              <div>
                {list.map(c => (
                  <div key={c.phone} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed #F3F4F6' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#111827', fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{c.phone}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#111827' }}>₹{c.spend.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: 11, color: G }}>{c.orders} order{c.orders > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: G, marginBottom: 6 }}>
        {icon}<span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 22, color: '#111827' }}>{value}</div>
    </div>
  );
}
