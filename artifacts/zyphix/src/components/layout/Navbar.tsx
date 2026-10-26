import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, MapPin, ShoppingCart, User, ChevronDown, Menu, X, LogOut, Settings, Package, Heart, Bell, Zap, Utensils, CalendarCheck, Store, Tag, Wallet } from 'lucide-react';
import { ZyphixLogo } from '../ZyphixLogo';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useNotifications } from '@/context/NotificationsContext';
import { authUrl } from '@/lib/account';
import { motion, AnimatePresence } from '@/lib/motion';
import { Button, FONT, G } from '@/ui/kit';

export function Navbar() {
  const [location, nav] = useLocation();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [focused, setFocused]       = useState(false);
  const [dropdown, setDropdown]     = useState(false);
  const [query, setQuery]           = useState('');
  const dropRef = useRef<HTMLDivElement>(null);
  const { totalItems: cartCount } = useCart();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      nav(`/now?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const { user, logout } = useAuth();
  // Sign-in lives on auth.zyphix.in (shared session for every sub-site); come back to this page after.
  const signInHref = typeof window !== 'undefined' ? authUrl(window.location.href) : '/auth';
  const { count: wishCount } = useWishlist();
  const { unread: notifUnread } = useNotifications();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on navigation
  useEffect(() => { setDropdown(false); setMobileOpen(false); }, [location]);

  const initial = user ? user.name.charAt(0).toUpperCase() : 'U';

  const iconBtn = 'relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900';
  const badge = 'absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white';
  const avatar = 'flex shrink-0 items-center justify-center rounded-full bg-gray-900 font-semibold text-white';

  return (
    <div className={`sticky top-0 z-50 w-full border-b border-[#E6E8EC] bg-white/90 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-[0_1px_2px_rgba(11,15,25,.04)]' : ''}`} style={{ fontFamily: FONT }}>
      <div className="mx-auto max-w-[1180px] px-4">
        <div className="flex h-[60px] items-center gap-2 sm:gap-3">

          {/* ── Logo ── */}
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <ZyphixLogo key={location} size={30} ixColor="#000000" />
          </Link>

          {/* ── Location ── */}
          <button type="button" className="hidden md:flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-2.5 text-[13px] font-medium text-gray-900 transition hover:bg-gray-100">
            <MapPin size={16} style={{ color: G }} />
            <span>Select location</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {/* ── Search bar ── */}
          <div className="relative min-w-0 flex-1" style={{ maxWidth: 520 }}>
            <Search className={`pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 ${focused ? 'text-gray-600' : 'text-gray-400'}`} size={16} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search groceries, food, services"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`h-10 w-full rounded-xl border pl-9 pr-3 text-[14px] text-gray-900 outline-none transition placeholder:text-gray-400 ${focused ? 'border-gray-300 bg-white ring-[3px] ring-gray-900/5' : 'border-transparent bg-gray-100'}`}
              style={{ fontFamily: FONT }}
            />
          </div>

          {/* ── Become a partner (desktop) ── */}
          <a href="https://partner.zyphix.in" target="_blank" rel="noopener noreferrer"
            className="hidden lg:inline-flex h-9 shrink-0 items-center whitespace-nowrap px-2 text-[13px] font-medium text-gray-600 transition hover:text-gray-900">
            Become a partner
          </a>

          {/* ── Actions ── */}
          <div className="ml-auto flex shrink-0 items-center gap-1">

            {/* Wishlist */}
            <Link href="/wishlist" aria-label="Wishlist" className={iconBtn}>
              <Heart size={20} strokeWidth={1.75} />
              {wishCount > 0 && <span className={`${badge} bg-red-600`}>{wishCount}</span>}
            </Link>

            {/* Notifications */}
            <Link href="/notifications" aria-label="Notifications" className={iconBtn}>
              <Bell size={20} strokeWidth={1.75} />
              {notifUnread > 0 && <span className={badge} style={{ background: G }}>{notifUnread}</span>}
            </Link>

            {/* Cart */}
            <button type="button" onClick={() => nav('/now')} aria-label="Cart" className={iconBtn}>
              <ShoppingCart size={20} strokeWidth={1.75} />
              {cartCount > 0 && <span className={badge} style={{ background: G }}>{cartCount}</span>}
            </button>

            {/* Auth button / Avatar */}
            {user ? (
              /* ── Avatar + dropdown ── */
              <div ref={dropRef} className="relative ml-1">
                <button type="button" onClick={() => setDropdown(d => !d)}
                  className={`flex h-9 items-center gap-1.5 rounded-xl pl-1 pr-2 transition ${dropdown ? 'bg-gray-100' : 'hover:bg-gray-100'}`}>
                  <span className={`${avatar} h-7 w-7 text-[12px]`}>{initial}</span>
                  <span className="hidden max-w-[90px] truncate text-[13px] font-medium text-gray-900 lg:inline">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-gray-400 transition-transform" style={{ transform: dropdown ? 'rotate(180deg)' : 'none' }} />
                </button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: .12, ease: 'easeOut' }}
                      className="absolute right-0 top-[calc(100%+6px)] z-[100] w-[232px] overflow-hidden rounded-xl border border-[#E6E8EC] bg-white shadow-[0_8px_24px_rgba(11,15,25,.08)]">

                      {/* User info header */}
                      <div className="flex items-center gap-2.5 border-b border-[#E6E8EC] px-3 py-3">
                        <span className={`${avatar} h-8 w-8 text-[13px]`}>{initial}</span>
                        <div className="min-w-0">
                          <p className="m-0 truncate text-[13px] font-semibold text-gray-900">{user.name}</p>
                          <p className="m-0 truncate text-[12px] text-gray-600">{user.email || user.phone || 'Member'}</p>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5">
                        {[
                          { icon: <User size={16} />, label: 'Profile',    href: '/account?tab=profile' },
                          { icon: <MapPin size={16} />, label: 'Addresses', href: '/account?tab=addresses' },
                          { icon: <Package size={16} />, label: 'Orders',   href: '/account?tab=orders' },
                          { icon: <Settings size={16} />, label: 'Settings', href: '/account?tab=settings' },
                        ].map(({ icon, label, href }) => (
                          <Link key={label} href={href}
                            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900">
                            <span className="text-gray-400">{icon}</span>{label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-[#E6E8EC] p-1.5">
                        <button type="button" onClick={() => { logout(); setDropdown(false); }}
                          className="flex w-full items-center gap-2.5 rounded-lg border-0 bg-transparent px-2.5 py-2 text-[13px] font-medium text-red-600 transition hover:bg-red-50">
                          <LogOut size={16} />Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Sign in ── */
              <div className="hidden sm:block ml-1">
                <Button href={signInHref} sameTab variant="secondary" size="sm" className="!h-9 !rounded-xl !px-3.5">Sign in</Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button type="button" className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100"
              aria-label="Menu" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[#E6E8EC] bg-white">
            <div className="mx-auto max-w-[1180px] space-y-0.5 px-3 py-3">

              {/* Logged-in user strip */}
              {user && (
                <div className="mb-2 flex items-center gap-2.5 rounded-xl border border-[#E6E8EC] bg-[#FAFAFA] px-3 py-2.5">
                  <span className={`${avatar} h-8 w-8 text-[13px]`}>{initial}</span>
                  <div className="min-w-0">
                    <p className="m-0 truncate text-[13px] font-semibold text-gray-900">{user.name}</p>
                    <p className="m-0 truncate text-[12px] text-gray-600">{user.email || user.phone || 'Member'}</p>
                  </div>
                </div>
              )}

              {[
                { icon: <Zap size={18} />, label: 'Zyphix Now',    href: '/now' },
                { icon: <Utensils size={18} />, label: 'Zyphix Eats',   href: '/eats' },
                { icon: <CalendarCheck size={18} />, label: 'Zyphix Book',   href: '/book' },
                { icon: <Store size={18} />, label: 'Kirana near me', href: '/kirana-map' },
                { icon: <Tag size={18} />, label: 'Offers',        href: '/offers' },
                { icon: <Heart size={18} />, label: `Wishlist${wishCount ? ` (${wishCount})` : ''}`, href: '/wishlist' },
                { icon: <Bell size={18} />, label: `Notifications${notifUnread ? ` (${notifUnread})` : ''}`, href: '/notifications' },
                { icon: <Wallet size={18} />, label: 'Wallet', href: '/wallet' },
              ].map(({ icon, label, href }) => (
                <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900">
                  <span className="text-gray-400">{icon}</span>{label}
                </Link>
              ))}

              <a href="https://partner.zyphix.in" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900">
                <span className="text-gray-400"><User size={18} /></span>Become a partner
              </a>

              {user ? (
                <>
                  <Link href="/account" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900">
                    <span className="text-gray-400"><User size={18} /></span>My account
                  </Link>
                  <button type="button" onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex w-full items-center gap-3 rounded-xl border-0 bg-transparent px-3 py-2.5 text-[14px] font-medium text-red-600 transition-colors hover:bg-red-50">
                    <LogOut size={18} />Sign out
                  </button>
                </>
              ) : (
                <a href={signInHref} onClick={() => setMobileOpen(false)}
                  className="mt-2 block w-full rounded-xl border border-[#E6E8EC] bg-white py-2.5 text-center text-[14px] font-semibold text-gray-900 transition hover:bg-gray-50">
                  Sign in
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
