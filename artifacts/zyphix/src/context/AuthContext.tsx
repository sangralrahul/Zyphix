import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { me as fetchMe, logout as apiLogout } from '@/lib/account';

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  picture?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  /** True until the server session has been checked once (localStorage mirror paints meanwhile). */
  ready: boolean;
  login: (u: AuthUser) => void;
  /** Google sign-in is not wired yet; opens the email/OTP modal instead. */
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  /** Re-read the session from the server (e.g. after returning from auth.zyphix.in). */
  refresh: () => Promise<AuthUser | null>;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null, ready: false, login: () => {}, loginWithGoogle: () => {}, logout: async () => {}, refresh: async () => null,
  showModal: false, openModal: () => {}, closeModal: () => {},
});

const STORAGE_KEY = 'zyphix_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [ready, setReady] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const persist = useCallback((u: AuthUser | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const refresh = useCallback(async () => {
    const u = await fetchMe();
    if (u) {
      const next: AuthUser = { id: u.id, name: u.name || u.email.split('@')[0], email: u.email, phone: u.phone || undefined };
      persist(next);
      return next;
    }
    return null;
  }, [persist]);

  // On mount: ask the Worker who the cookie belongs to. A server user wins over the
  // localStorage mirror; a 401 with a mirrored server user (has `id`) means the session
  // expired, so drop it. Mirrors without an id (legacy client-only logins) are kept.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = await fetchMe();
        if (!alive) return;
        if (u) persist({ id: u.id, name: u.name || u.email.split('@')[0], email: u.email, phone: u.phone || undefined });
        else if (user?.id) persist(null);
      } catch {}
      if (alive) setReady(true);
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (u: AuthUser) => {
    persist(u);
    setShowModal(false);
  };

  const loginWithGoogle = () => { setShowModal(true); };

  const logout = async () => {
    await apiLogout();
    persist(null);
  };

  return (
    <Ctx.Provider value={{ user, ready, login, loginWithGoogle, logout, refresh, showModal, openModal: () => setShowModal(true), closeModal: () => setShowModal(false) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
