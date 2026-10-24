import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Bell, Check, X, Package, Wallet as WalletIcon, Tag, Info } from 'lucide-react';
import { useNotifications } from '@/context/NotificationsContext';
import { Button, FONT } from '@/ui/kit';

const card = 'rounded-xl border border-[#E6E8EC] bg-white';

const ICONS: Record<string, React.ReactNode> = {
  order: <Package size={15} />,
  promo: <Tag size={15} />,
  wallet: <WalletIcon size={15} />,
  system: <Info size={15} />,
};

const fmt = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export function Notifications() {
  const { items, unread, markAllRead, markRead, remove, clear } = useNotifications();

  useEffect(() => {
    // Ask permission for native browser notifications once user opens this page
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      try { Notification.requestPermission(); } catch {}
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-[880px] pb-24 pt-4 text-gray-900 md:pb-8" style={{ fontFamily: FONT }}>
      <div className="flex items-center gap-3">
        <h1 className="text-[20px] font-semibold tracking-[-0.01em]">Notifications</h1>
        {unread > 0 && <p className="text-[13px] text-gray-500">{unread} unread</p>}
        <div className="ml-auto flex items-center gap-2">
          {unread > 0 && (
            <Button size="sm" variant="secondary" className="!h-8" onClick={markAllRead}><Check size={13} /> Mark all read</Button>
          )}
          {items.length > 0 && (
            <button type="button" onClick={clear} className="text-[13px] font-semibold text-gray-600 transition hover:text-red-600">Clear</button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className={`${card} mt-4 px-6 py-14 text-center`}>
          <span className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E8EC] bg-[#FAFAFA] text-gray-400"><Bell size={18} /></span>
          <p className="text-[15px] font-semibold">No notifications</p>
          <p className="mt-1 text-[13px] text-gray-500">Order updates, offers and wallet activity will show here.</p>
        </div>
      ) : (
        <div className={`${card} mt-4 divide-y divide-gray-100`}>
          {items.map(n => {
            const inner = (
              <div className={`flex items-start gap-3 px-3 py-3 transition hover:bg-gray-50 ${n.read ? '' : 'bg-emerald-50/40'}`}>
                <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${n.read ? 'border-[#E6E8EC] bg-[#FAFAFA] text-gray-500' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
                  {ICONS[n.kind] || <Info size={15} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={`truncate text-[13.5px] ${n.read ? 'font-medium' : 'font-semibold'} text-gray-900`}>{n.title}</p>
                    <span className="shrink-0 text-[11.5px] text-gray-400">{fmt(n.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-[1.45] text-gray-600">{n.body}</p>
                </div>
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(n.id); }} aria-label="Delete notification"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-white hover:text-gray-700">
                  <X size={14} />
                </button>
              </div>
            );
            return n.href
              ? <Link key={n.id} href={n.href} onClick={() => markRead(n.id)} className="block no-underline">{inner}</Link>
              : <div key={n.id} onClick={() => markRead(n.id)} className="cursor-pointer">{inner}</div>;
          })}
        </div>
      )}
    </div>
  );
}
