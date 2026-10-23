import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, MapPin, ShoppingCart, User, ChevronDown, Menu, X, LogOut, Settings, Package, Users, Heart, Bell } from 'lucide-react';
import { ZyphixLogo } from '../ZyphixLogo';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useNotifications } from '@/context/NotificationsContext';
import { motion, AnimatePresence } from 'framer-motion';

const G = '#0DA366';
const HEAD_FONT = "'Outfit', sans-serif";

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

  const { user, logout, openModal } = useAuth();
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

  const iconBtn = 'relative flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:border-gray-300 hover:bg-gray-50';

  return (
    <div className={`sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md transition-all duration-300 ${scrolled ? 'border-gray-200 shadow-[0_4px_24px_rgba(11,18,32,.06)]' : 'border-gray-100'}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-16">

          {/* ── Logo ── */}
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <ZyphixLogo key={location} size={34} ixColor="#000000" />
          </Link>

          {/* ── Location ── */}
          <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50 shrink-0">
            <MapPin size={14} style={{ color: G }} />
            <div className="text-left">
              <p className="text-[9px] font-semibold uppercase tracking-wide leading-none text-gray-400">Deliver to</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="font-bold text-sm leading-none text-gray-900">Select Location</span>
                <ChevronDown size={12} className="text-gray-400" />
              </div>
            </div>
          </button>

          {/* ── Search bar ── */}
          <div className="flex-1 relative" style={{ minWidth: 0, maxWidth: 480 }}>
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors z-10 ${focused ? 'text-emerald-600' : 'text-gray-400'}`} size={16} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search groceries, food, services… (press Enter)"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none border transition-all duration-200 ${focused ? 'bg-white border-emerald-400 ring-[3px] ring-emerald-500/10' : 'bg-gray-100 border-gray-200'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* ── Become a Partner (desktop) ── */}
          <Link href="/partner"
            className="hidden md:flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-[7px] text-[13px] font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100">
            <Users size={14} />
            <span className="hidden lg:inline">Become a Partner</span>
          </Link>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Auth button / Avatar */}
            {user ? (
              /* ── Avatar + dropdown ── */
              <div ref={dropRef} className="relative">
                <button onClick={() => setDropdown(d => !d)}
                  className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition ${dropdown ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                  <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white" style={{ background: `linear-gradient(135deg, ${G}, #0A8C58)`, fontFamily: HEAD_FONT }}>
                    {initial}
                  </div>
                  <span className="hidden lg:inline max-w-[90px] truncate text-[13.5px] font-bold text-gray-900">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={13} className="text-gray-400 transition-transform" style={{ transform: dropdown ? 'rotate(180deg)' : 'none' }} />
                </button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: .95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: .95, y: -6 }}
                      transition={{ duration: .15, ease: 'easeOut' }}
                      className="absolute right-0 top-[calc(100%+8px)] z-[100] w-[230px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(11,18,32,.14)]">

                      {/* User info header */}
                      <div className="border-b border-gray-200 bg-emerald-50/60 px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px] font-black text-white" style={{ background: `linear-gradient(135deg, ${G}, #0A8C58)`, fontFamily: HEAD_FONT }}>
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="m-0 truncate text-[14px] font-extrabold text-gray-900">{user.name}</p>
                            <p className="m-0 mt-px truncate text-[11.5px] text-gray-500">{user.email || user.phone || 'Zyphix Member'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        {[
                          { icon: <User size={14} />, label: 'My Profile',    href: '/account?tab=profile' },
                          { icon: <MapPin size={14} />, label: 'My Addresses', href: '/account?tab=addresses' },
                          { icon: <Package size={14} />, label: 'My Orders',   href: '/account?tab=orders' },
                          { icon: <Settings size={14} />, label: 'Settings',   href: '/account?tab=settings' },
                        ].map(({ icon, label, href }) => (
                          <Link key={label} href={href}
                            className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2.5 text-[13.5px] font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900">
                            <span className="text-gray-400">{icon}</span>{label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 p-2">
                        <button onClick={() => { logout(); setDropdown(false); }}
                          className="flex w-full items-center gap-2.5 rounded-[10px] border-0 bg-transparent px-2.5 py-2.5 text-[13.5px] font-semibold text-red-600 transition hover:bg-red-50">
                          <LogOut size={14} />Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Login button ── */
              <button onClick={openModal}
                className="hidden sm:flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900">
                <User size={15} />
                <span className="hidden lg:inline">Login</span>
              </button>
            )}

            {/* Wishlist */}
            <Link href="/wishlist" aria-label="Wishlist" className={iconBtn}>
              <Heart size={17} />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white">{wishCount}</span>
              )}
            </Link>

            {/* Notifications */}
            <Link href="/notifications" aria-label="Notifications" className={iconBtn}>
              <Bell size={17} />
              {notifUnread > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-extrabold text-white" style={{ background: G }}>{notifUnread}</span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={() => nav('/now')}
              className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold text-white transition hover:opacity-90" style={{ background: G }}>
              <ShoppingCart size={16} />
              <span className="hidden sm:inline font-black">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 rounded-xl text-gray-600 transition-colors hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-200 bg-white">
            <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-1">

              {/* Logged-in user strip */}
              {user && (
                <div className="mb-2 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                  <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[14px] font-black text-white" style={{ background: `linear-gradient(135deg, ${G}, #0A8C58)` }}>
                    {initial}
                  </div>
                  <div>
                    <p className="m-0 text-[14px] font-bold text-gray-900">{user.name}</p>
                    <p className="m-0 text-[12px] text-gray-500">{user.email || user.phone || 'Member'}</p>
                  </div>
                </div>
              )}

              {[
                { icon: '⚡', label: 'Zyphix Now',    href: '/now' },
                { icon: '🍱', label: 'Zyphix Eats',   href: '/eats' },
                { icon: '📅', label: 'Zyphix Book',   href: '/book' },
                { icon: '🗺️', label: 'Kirana Near Me', href: '/kirana-map' },
                { icon: '🏷️', label: 'Offers',        href: '/offers' },
                { icon: '❤️', label: `Wishlist${wishCount ? ` (${wishCount})` : ''}`, href: '/wishlist' },
                { icon: '🔔', label: `Notifications${notifUnread ? ` (${notifUnread})` : ''}`, href: '/notifications' },
                { icon: '💰', label: 'Wallet', href: '/wallet' },
              ].map(({ icon, label, href }) => (
                <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer font-medium">
                  <span>{icon}</span>{label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link href="/account" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer font-medium">
                    <User size={16} style={{ color: G }} />My Account
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 py-3 px-3 rounded-xl border-0 bg-transparent text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium">
                    <LogOut size={16} />Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => { openModal(); setMobileOpen(false); }}
                  className="w-full mt-3 py-3 rounded-xl font-black text-sm text-white transition hover:opacity-90" style={{ background: G }}>
                  Sign In / Get Started
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
