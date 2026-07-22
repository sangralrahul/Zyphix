import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Bell, BellRing, Check, Trash2, Package, Wallet as WalletIcon, Tag, Info } from 'lucide-react';
import { useNotifications } from '@/context/NotificationsContext';

const G = '#0DA366';

const ICONS: Record<string, React.ReactNode> = {
  order: <Package size={16} />,
  promo: <Tag size={16} />,
  wallet: <WalletIcon size={16} />,
  system: <Info size={16} />,
};

export function Notifications() {
  const { items, unread, markAllRead, markRead, remove, clear } = useNotifications();

  useEffect(() => {
    // Ask permission for native browser notifications once user opens this page
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      try { Notification.requestPermission(); } catch {}
    }
  }, []);

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: 80 }}>
      <div style={{ padding: '20px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 22, color: '#111827', margin: 0, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <BellRing size={22} color={G} /> Notifications
          {unread > 0 && <span style={{ background: '#EF4444', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 20 }}>{unread}</span>}
        </h1>
        <div style={{ display: 'flex', gap: 6 }}>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ background: G, color: '#fff', border: 'none', borderRadius: 10, padding: '8px 12px', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Check size={13} /> Mark read
            </button>
          )}
          {items.length > 0 && (
            <button onClick={clear} style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: 10, padding: '8px 12px', color: '#EF4444', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16 }}>
          <Bell size={56} color="#E5E7EB" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 18, color: '#111827' }}>You're all caught up</div>
          <p style={{ color: '#6B7280', fontSize: 13 }}>Order updates, offers and cashback alerts will show here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(n => {
            const inner = (
              <div style={{ display: 'flex', gap: 10, padding: 14, background: n.read ? '#fff' : 'rgba(13,163,102,0.05)', border: `1px solid ${n.read ? '#EAEAEA' : 'rgba(13,163,102,0.25)'}`, borderRadius: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(13,163,102,0.1)', color: G, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {ICONS[n.kind] || <Info size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontWeight: 800, color: '#111827', fontSize: 14 }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ color: '#4B5563', fontSize: 13, marginTop: 3 }}>{n.body}</div>
                </div>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(n.id); }}
                  style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#9CA3AF', alignSelf: 'flex-start' }} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            );
            return n.href
              ? <Link key={n.id} href={n.href}><a onClick={() => markRead(n.id)} style={{ textDecoration: 'none' }}>{inner}</a></Link>
              : <div key={n.id} onClick={() => markRead(n.id)} style={{ cursor: 'pointer' }}>{inner}</div>;
          })}
        </div>
      )}
    </div>
  );
}
