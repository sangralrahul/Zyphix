import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Api, ApiError, getToken, sendOtp, setToken, type User } from './api';

type AuthCtx = {
  user: User | null;
  ready: boolean;
  /** Step 1: email → returns a verification token to pass to `verify`. */
  requestCode: (email: string) => Promise<string>;
  /** Step 2: check the 6-digit code; stores the session in the device keychain. */
  verify: (email: string, code: string, verification: string, name?: string) => Promise<User>;
  updateProfile: (patch: { name?: string; phone?: string }) => Promise<User>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      if (t) {
        try { setUser(await Api.me()); }
        catch (e) { if (e instanceof ApiError && e.status === 401) await setToken(null); }
      }
      setReady(true);
    })();
  }, []);

  const requestCode = useCallback((email: string) => sendOtp(email.trim().toLowerCase()), []);

  const verify = useCallback(async (email: string, code: string, verification: string, name?: string) => {
    const r = await Api.verify(email.trim().toLowerCase(), code, verification, name);
    await setToken(r.token);
    setUser(r.user);
    return r.user;
  }, []);

  const updateProfile = useCallback(async (patch: { name?: string; phone?: string }) => {
    const u = await Api.updateMe(patch);
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    await Api.logout();
    await setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, ready, requestCode, verify, updateProfile, signOut }), [user, ready, requestCode, verify, updateProfile, signOut]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
}
