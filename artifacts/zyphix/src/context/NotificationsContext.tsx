import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Notif = {
  id: string;
  createdAt: string;
  title: string;
  body: string;
  kind: 'order' | 'promo' | 'wallet' | 'system';
  read: boolean;
  href?: string;
};

interface NotifCtx {
  items: Notif[];
  unread: number;
  push: (n: Omit<Notif, 'id' | 'createdAt' | 'read'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<NotifCtx | null>(null);
const KEY = 'zyphix_notifs_v1';

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Notif[]>(() => {
    try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const push = useCallback((n: Omit<Notif, 'id' | 'createdAt' | 'read'>) => {
    setItems(prev => [{
      ...n,
      id: 'n_' + Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
      read: false,
    }, ...prev].slice(0, 100));
    // opportunistic native notification
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(n.title, { body: n.body, icon: '/favicon.svg' });
      }
    } catch {}
  }, []);

  const markAllRead = useCallback(() => setItems(prev => prev.map(i => ({ ...i, read: true }))), []);
  const markRead = useCallback((id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, read: true } : i)), []);
  const remove = useCallback((id: string) => setItems(prev => prev.filter(i => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<NotifCtx>(() => ({
    items, unread: items.filter(i => !i.read).length, push, markAllRead, markRead, remove, clear,
  }), [items, push, markAllRead, markRead, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNotifications() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return c;
}
