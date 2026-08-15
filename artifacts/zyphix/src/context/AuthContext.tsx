import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  picture?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (u: AuthUser) => void;
  loginWithGoogle: () => void;
  logout: () => void;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null, login: () => {}, loginWithGoogle: () => {}, logout: () => {},
  showModal: false, openModal: () => {}, closeModal: () => {},
});

const STORAGE_KEY = 'zyphix_user';

function AuthCallbackScreen() {
  return (
    <div data-testid="auth-callback-screen" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A0F1A', color: '#fff', gap: 18 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(13,163,102,.25)', borderTopColor: '#0DA366', animation: 'spin .8s linear infinite' }} />
      <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15 }}>Signing you in…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [showModal, setShowModal] = useState(false);
  // true while exchanging a session_id returned from Google OAuth
  const [processingCallback, setProcessingCallback] = useState(
    () => typeof window !== 'undefined' && window.location.hash.includes('session_id=')
  );
  const processed = useRef(false);

  const persist = useCallback((u: AuthUser | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const clearHash = () => {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    const bootstrap = async () => {
      const hash = window.location.hash || '';
      if (hash.includes('session_id=')) {
        const sessionId = new URLSearchParams(hash.replace(/^#/, '')).get('session_id');
        // clear the fragment immediately so it is used only once
        clearHash();
        if (sessionId) {
          try {
            const res = await fetch('/api/auth/session', {
              method: 'POST',
              credentials: 'include',
              headers: { 'X-Session-ID': sessionId },
            });
            if (res.ok) {
              const d = await res.json();
              persist({ name: d.name, email: d.email, picture: d.picture, avatar: 'google' });
            }
          } catch {}
        }
        clearHash();
        setProcessingCallback(false);
        // defer one more clear in case the router restores the location on mount
        setTimeout(clearHash, 0);
        return;
      }

      // No callback in progress — verify an existing server session
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const d = await res.json();
          persist({ name: d.name, email: d.email, picture: d.picture, avatar: 'google' });
        }
      } catch {}
    };

    bootstrap();
  }, [persist]);

  const login = (u: AuthUser) => {
    persist(u);
    setShowModal(false);
  };

  const loginWithGoogle = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const logout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
    persist(null);
  };

  if (processingCallback) return <AuthCallbackScreen />;

  return (
    <Ctx.Provider value={{ user, login, loginWithGoogle, logout, showModal, openModal: () => setShowModal(true), closeModal: () => setShowModal(false) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
