import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (u: AuthUser) => void;
  logout: () => void;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null, login: () => {}, logout: () => {},
  showModal: false, openModal: () => {}, closeModal: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { const s = localStorage.getItem('zyphix_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [showModal, setShowModal] = useState(false);

  const login = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem('zyphix_user', JSON.stringify(u));
    setShowModal(false);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('zyphix_user');
  };

  return (
    <Ctx.Provider value={{ user, login, logout, showModal, openModal: () => setShowModal(true), closeModal: () => setShowModal(false) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
