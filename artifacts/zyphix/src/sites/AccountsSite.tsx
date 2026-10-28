import React, { useEffect } from 'react';
import { LogOut, ShoppingBag, UtensilsCrossed, Wrench, LifeBuoy, Loader2 } from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { FONT } from '@/ui/kit';
import { useAuth } from '@/context/AuthContext';
import { authUrl } from '@/lib/account';
import { Account } from '@/pages/Account';

/* ────────────────────────────────────────────────────────────────────────────
   accounts.zyphix.in — the signed-in home for every Zyphix customer:
   profile, saved addresses, orders across Now / Eats / Book, and settings.
   Not signed in → straight to auth.zyphix.in, which sends them back here.
──────────────────────────────────────────────────────────────────────────── */

const APPS = [
  { href: 'https://now.zyphix.in', label: 'Now', icon: ShoppingBag },
  { href: 'https://eats.zyphix.in', label: 'Eats', icon: UtensilsCrossed },
  { href: 'https://book.zyphix.in', label: 'Book', icon: Wrench },
];

export default function AccountsSite() {
  const { user, ready, logout } = useAuth();

  useEffect(() => {
    if (ready && !user?.id) window.location.replace(authUrl(window.location.href));
  }, [ready, user?.id]);

  const signOut = async () => {
    await logout();
    window.location.replace(authUrl('https://accounts.zyphix.in/'));
  };

  if (!ready || !user?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9]" style={{ fontFamily: FONT }}>
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <ZyphixLogo size={30} />
          <p className="flex items-center gap-2 text-[14px]"><Loader2 size={16} className="animate-spin" /> {ready ? 'Taking you to sign in…' : 'Opening your account…'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-gray-900" style={{ fontFamily: FONT }}>
      <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/[.94] backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center gap-3 px-4 sm:px-6">
          <a href="https://zyphix.in" className="flex shrink-0 items-center gap-2.5" aria-label="Zyphix home">
            <ZyphixLogo size={26} />
            <span className="hidden rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600 ring-1 ring-gray-200 sm:inline">Account</span>
          </a>
          <nav className="ml-auto flex items-center gap-1">
            {APPS.map(a => { const I = a.icon; return (
              <a key={a.label} href={a.href} className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13.5px] font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 sm:inline-flex"><I size={15} />{a.label}</a>
            ); })}
            <a href="https://support.zyphix.in" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13.5px] font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 md:inline-flex"><LifeBuoy size={15} />Help</a>
            <button onClick={signOut} className="ml-1 inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 text-[13px] font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"><LogOut size={15} />Sign out</button>
          </nav>
        </div>
        <div className="flex gap-1 overflow-x-auto px-4 pb-2.5 sm:hidden [scrollbar-width:none]">
          {APPS.map(a => { const I = a.icon; return (
            <a key={a.label} href={a.href} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[13px] font-medium text-gray-700"><I size={14} />{a.label}</a>
          ); })}
        </div>
      </header>
      <main className="px-4 sm:px-6">
        <Account />
      </main>
      <footer className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-8 text-[12.5px] text-gray-500 sm:px-6">
        <span>© {new Date().getFullYear()} Zyphix</span>
        <span className="flex gap-4"><a href="https://zyphix.in/privacy" className="hover:text-gray-900">Privacy</a><a href="https://zyphix.in/terms" className="hover:text-gray-900">Terms</a><a href="https://support.zyphix.in" className="hover:text-gray-900">Help</a></span>
      </footer>
    </div>
  );
}
