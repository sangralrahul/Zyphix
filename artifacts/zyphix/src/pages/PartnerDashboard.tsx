import React, { useMemo, useState } from 'react';
import { Store, Bike, ChefHat, Package, IndianRupee, TrendingUp } from 'lucide-react';
import { listOrders } from '@/context/CartContext';
import { Button, FONT, IconTile } from '@/ui/kit';

const card = 'rounded-xl border border-[#E6E8EC] bg-white';

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
    };
  }, [orders]);

  const roleMeta: Record<Role, { icon: React.ReactNode; title: string; short: string; sub: string }> = {
    store:      { icon: <Store size={15} />,   title: 'Kirana partner',     short: 'Store',      sub: 'Inventory, orders and earnings' },
    rider:      { icon: <Bike size={15} />,    title: 'Delivery partner',   short: 'Rider',      sub: 'Deliveries, earnings and ratings' },
    restaurant: { icon: <ChefHat size={15} />, title: 'Restaurant partner', short: 'Restaurant', sub: 'Menu, orders and payouts' },
  };

  const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-24 pt-4 text-gray-900 md:pb-8" style={{ fontFamily: FONT }}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-baseline gap-3">
          <h1 className="text-[20px] font-semibold tracking-[-0.01em]">Partner dashboard</h1>
          <p className="text-[13px] text-gray-500">{roleMeta[role].sub}</p>
        </div>
        {/* Role switcher */}
        <div className="ml-auto flex items-center gap-1.5">
          {(['store', 'rider', 'restaurant'] as Role[]).map(r => {
            const active = role === r;
            return (
              <button key={r} type="button" onClick={() => setRole(r)} aria-pressed={active}
                className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition ${active ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-[#E6E8EC] bg-white text-gray-700 hover:border-gray-300'}`}>
                {roleMeta[r].icon}{roleMeta[r].short}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-4 grid grid-cols-3 gap-2.5 lg:gap-3">
        <Kpi icon={<Package size={15} />} label="Today's orders" value={String(stats.todayOrders)} />
        <Kpi icon={<TrendingUp size={15} />} label="Total orders" value={String(stats.totalOrders)} />
        <Kpi icon={<IndianRupee size={15} />} label="Earnings" value={`₹${stats.earnings.toLocaleString('en-IN')}`} />
      </div>

      <div className="mt-4 grid items-start gap-4 md:grid-cols-[1fr_320px]">
        {/* Orders */}
        <div className={`${card} p-4`}>
          <p className="text-[14px] font-semibold">{role === 'rider' ? 'Active deliveries' : 'Active orders'}</p>
          {orders.length === 0 ? (
            <p className="mt-3 rounded-lg bg-[#FAFAFA] px-3 py-6 text-center text-[13px] text-gray-500">No active orders yet.</p>
          ) : (
            <div className="mt-2 divide-y divide-gray-100">
              {orders.slice(0, 6).map(o => (
                <div key={o.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{o.id}</p>
                    <p className="truncate text-[12px] text-gray-500">{o.address.name} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13.5px] font-semibold tabular-nums">₹{o.total}</p>
                    <p className="text-[11.5px] font-medium text-emerald-700">{statusLabel(o.status)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payout */}
        <div className={`${card} p-4`}>
          <p className="text-[14px] font-semibold">Payout</p>
          <p className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.01em] tabular-nums">₹{Math.round(stats.earnings * 0.6).toLocaleString('en-IN')}</p>
          <p className="mt-0.5 text-[12px] text-gray-500">Pending payout</p>
          <Button size="sm" className="mt-3 w-full">Request payout</Button>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className={`${card} flex items-center gap-3 p-3`}>
      <IconTile className="hidden h-9 w-9 rounded-lg sm:inline-flex">{icon}</IconTile>
      <div className="min-w-0">
        <p className="truncate text-[12px] text-gray-500">{label}</p>
        <p className="text-[17px] font-semibold leading-tight tabular-nums">{value}</p>
      </div>
    </div>
  );
}
