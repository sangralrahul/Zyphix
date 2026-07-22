import React, { useMemo, useState } from 'react';
import { Store, Bike, ChefHat, Package, IndianRupee, TrendingUp, Clock, Star } from 'lucide-react';
import { listOrders } from '@/context/CartContext';

const G = '#0DA366';

type Role = 'store' | 'rider' | 'restaurant';

export function PartnerDashboard() {
  const [role, setRole] = useState<Role>('store');
  const orders = useMemo(() => listOrders(), []);
  const stats = useMemo(() => {
    const today = orders.filter(o => {
      const d = new Date(o.createdAt); const n = new Date();
      return d.toDateString() === n.toDateString();
    });
    const earnings = orders.reduce((s, o) => s + Math.round(o.total * 0.15), 0);
    return {
      todayOrders: today.length,
      totalOrders: orders.length,
      earnings,
      rating: 4.7,
      avgTime: 28,
    };
  }, [orders]);

  const roleMeta: Record<Role, { icon: React.ReactNode; title: string; sub: string }> = {
    store:      { icon: <Store size={22} />,   title: 'Kirana Partner',    sub: 'Manage inventory, orders and earnings' },
    rider:      { icon: <Bike size={22} />,    title: 'Delivery Partner',  sub: 'View deliveries, earnings and ratings' },
    restaurant: { icon: <ChefHat size={22} />, title: 'Restaurant Partner', sub: 'Manage menu, orders and payouts' },
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: 80 }}>
      <div style={{ padding: '18px 4px' }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 24, color: '#111827', margin: 0 }}>Partner Dashboard</h1>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{roleMeta[role].sub}</div>
      </div>

      {/* Role switcher */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        {(['store', 'rider', 'restaurant'] as Role[]).map(r => (
          <button key={r} onClick={() => setRole(r)}
            style={{ padding: 12, background: role === r ? G : '#fff', color: role === r ? '#fff' : '#111827', border: `1px solid ${role === r ? G : '#E5E7EB'}`, borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {roleMeta[r].icon}
            <div style={{ fontSize: 12, fontWeight: 800 }}>{roleMeta[r].title.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
        <Card icon={<Package size={16} />} label="Today's orders" value={String(stats.todayOrders)} />
        <Card icon={<TrendingUp size={16} />} label="Lifetime orders" value={String(stats.totalOrders)} />
        <Card icon={<IndianRupee size={16} />} label="Earnings" value={`₹${stats.earnings.toLocaleString('en-IN')}`} />
        <Card icon={<Star size={16} />} label="Rating" value={`${stats.rating}★`} />
        <Card icon={<Clock size={16} />} label="Avg time" value={`${stats.avgTime} min`} />
      </div>

      {/* Live orders */}
      <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16, marginBottom: 14 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', marginBottom: 10 }}>
          {role === 'rider' ? 'Active deliveries' : 'Active orders'}
        </div>
        {orders.slice(0, 6).map(o => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px dashed #F3F4F6' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#111827', fontSize: 13 }}>{o.id}</div>
              <div style={{ fontSize: 11.5, color: '#6B7280' }}>{o.address.name} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, color: '#111827' }}>₹{o.total}</div>
              <div style={{ fontSize: 10, color: G, fontWeight: 700 }}>{role === 'rider' ? '~15 min away' : 'PREPARING'}</div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div style={{ padding: 30, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
            No active orders. New orders will appear here in real-time.
          </div>
        )}
      </div>

      {/* Payouts */}
      <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', marginBottom: 8 }}>Next payout</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 26, color: '#111827' }}>
              ₹{Math.round(stats.earnings * 0.6).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Next Monday · via UPI</div>
          </div>
          <button style={{ padding: '10px 18px', background: G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
            Request payout
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 12, padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: G, marginBottom: 4 }}>
        {icon}<span style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 18, color: '#111827' }}>{value}</div>
    </div>
  );
}
