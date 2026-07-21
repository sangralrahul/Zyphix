import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, MapPin, ShoppingCart, User, ChevronDown, Menu, X, LogOut, Settings, Package, Users } from 'lucide-react';
import { ZyphixLogo } from '../ZyphixLogo';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const G = '#0DA366';

export function Navbar() {
  const [location, nav] = useLocation();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [focused, setFocused]       = useState(false);
  const [dropdown, setDropdown]     = useState(false);
  const [query, setQuery]           = useState('');
  const dropRef = useRef<HTMLDivElement>(null);
  const cartCount = 3;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      nav(`/now?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const { user, logout, openModal } = useAuth();

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

  const isLight = location === '/now' || location === '/eats';

  return (
    <div className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: isLight
          ? (scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)')
          : (scrolled ? 'rgba(9,9,14,0.97)' : 'rgba(16,18,24,0.95)'),
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: isLight
          ? (scrolled ? '1px solid #E5E7EB' : '1px solid #F3F4F6')
          : (scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(255,255,255,0.04)'),
        boxShadow: scrolled ? (isLight ? '0 4px 32px rgba(0,0,0,0.08)' : '0 4px 32px rgba(0,0,0,0.5)') : 'none',
      }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-16">

          {/* ── Logo ── */}
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <ZyphixLogo key={location} size={34} ixColor="#000000" />
          </Link>

          {/* ── Location ── */}
          <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0"
            style={{ border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255,255,255,0.07)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = isLight ? '#F3F4F6' : 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            <MapPin style={{ height: 14, width: 14, color: 'var(--z-green)' }} />
            <div className="text-left">
              <p className="text-[9px] font-semibold uppercase tracking-wide leading-none" style={{ color: isLight ? '#9CA3AF' : 'var(--z-muted)' }}>Deliver to</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="font-bold text-sm leading-none" style={{ color: isLight ? '#111827' : '#ffffff' }}>Select Location</span>
                <ChevronDown style={{ height: 12, width: 12, color: isLight ? '#9CA3AF' : 'var(--z-muted)' }} />
              </div>
            </div>
          </button>

          {/* ── Search bar ── */}
          <div className="flex-1 relative" style={{ minWidth: 0, maxWidth: 480 }}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors z-10"
              style={{ height: 16, width: 16, color: focused ? 'var(--z-green)' : 'var(--z-muted)' }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search groceries, food, services… (press Enter)"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: isLight
                  ? (focused ? '#FFFFFF' : '#F3F4F6')
                  : (focused ? 'rgba(22,24,31,0.95)' : 'rgba(22,24,31,0.7)'),
                border: focused
                  ? '1px solid rgba(0,217,126,0.4)'
                  : (isLight ? '1px solid #E5E7EB' : '1px solid rgba(255,255,255,0.07)'),
                boxShadow: focused ? '0 0 0 3px rgba(0,217,126,0.06)' : 'none',
                fontFamily: "'Inter', sans-serif",
                color: isLight ? '#111827' : '#ffffff',
              }}
            />
          </div>

          {/* ── Become a Partner (desktop) ── */}
          <Link href="/partner"
            className="hidden md:flex"
            style={{ flexShrink: 0, alignItems: 'center', gap: 6, borderRadius: 12, padding: '7px 14px', fontSize: 13, fontWeight: 700, color: '#0DA366', border: '1px solid rgba(13,163,102,0.3)', background: 'rgba(13,163,102,0.07)', textDecoration: 'none', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(13,163,102,0.15)'; el.style.borderColor = 'rgba(13,163,102,0.5)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(13,163,102,0.07)'; el.style.borderColor = 'rgba(13,163,102,0.3)'; }}>
            <Users style={{ height: 14, width: 14 }} />
            <span className="hidden lg:inline">Become a Partner</span>
          </Link>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Auth button / Avatar */}
            {user ? (
              /* ── Avatar + dropdown ── */
              <div ref={dropRef} style={{ position: 'relative' }}>
                <button onClick={() => setDropdown(d => !d)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 12, background: dropdown ? 'rgba(13,163,102,.12)' : 'rgba(255,255,255,.05)', border: `1px solid ${dropdown ? G + '40' : 'rgba(255,255,255,.08)'}`, cursor: 'pointer', transition: 'all .18s' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${G}, #0A8C58)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', fontFamily: "'Outfit',sans-serif", flexShrink: 0 }}>
                    {initial}
                  </div>
                  <span className="hidden lg:inline" style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown style={{ height: 13, width: 13, color: 'rgba(255,255,255,.45)', transform: dropdown ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: .95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: .95, y: -6 }}
                      transition={{ duration: .15, ease: 'easeOut' }}
                      style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 230, borderRadius: 16, background: 'rgba(14,16,22,0.98)', border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 20px 60px rgba(0,0,0,.6)', overflow: 'hidden', zIndex: 100 }}>

                      {/* User info header */}
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.07)', background: 'rgba(13,163,102,.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${G}, #0A8C58)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#fff', fontFamily: "'Outfit',sans-serif", flexShrink: 0 }}>
                            {initial}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                            <p style={{ margin: '1px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email || user.phone || 'Zyphix Member'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div style={{ padding: '8px' }}>
                        {[
                          { icon: <User size={14} />, label: 'My Profile',    href: '/account?tab=profile' },
                          { icon: <MapPin size={14} />, label: 'My Addresses', href: '/account?tab=addresses' },
                          { icon: <Package size={14} />, label: 'My Orders',   href: '/account?tab=orders' },
                          { icon: <Settings size={14} />, label: 'Settings',   href: '/account?tab=settings' },
                        ].map(({ icon, label, href }) => (
                          <Link key={label} href={href}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 10, color: 'rgba(255,255,255,.8)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', transition: 'background .15s' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.06)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                            <span style={{ color: 'rgba(255,255,255,.4)' }}>{icon}</span>{label}
                          </Link>
                        ))}
                      </div>

                      <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
                        <button onClick={() => { logout(); setDropdown(false); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 10, color: '#F87171', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', width: '100%', border: 'none', background: 'transparent', transition: 'background .15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,.08)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
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
                className="hidden sm:flex items-center gap-1.5 btn-ghost rounded-xl px-3.5 py-2 text-sm">
                <User style={{ height: 15, width: 15 }} />
                <span className="hidden lg:inline">Login</span>
              </button>
            )}

            {/* Cart */}
            <button onClick={() => nav('/now')}
              className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm btn-primary">
              <ShoppingCart style={{ height: 16, width: 16 }} />
              <span className="hidden sm:inline font-black">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full text-[10px] font-black flex items-center justify-center text-white"
                  style={{ background: 'var(--z-orange)', width: 18, height: 18 }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 rounded-xl transition-colors"
              style={{ color: isLight ? '#6B7280' : 'var(--z-muted)' }}
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X style={{ height: 20, width: 20 }} /> : <Menu style={{ height: 20, width: 20 }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ background: isLight ? 'rgba(255,255,255,0.99)' : 'rgba(9,9,14,0.99)', borderTop: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-1">

              {/* Logged-in user strip */}
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(13,163,102,.08)', borderRadius: 12, marginBottom: 8, border: '1px solid rgba(13,163,102,.15)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${G}, #0A8C58)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                    {initial}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff' }}>{user.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{user.email || user.phone || 'Member'}</p>
                  </div>
                </div>
              )}

              {[
                { icon: '⚡', label: 'Zyphix Now',    href: '/now' },
                { icon: '🍱', label: 'Zyphix Eats',   href: '/eats' },
                { icon: '📅', label: 'Zyphix Book',   href: '/book' },
                { icon: '🗺️', label: 'Kirana Near Me', href: '/kirana-map' },
                { icon: '🏷️', label: 'Offers',        href: '/offers' },
              ].map(({ icon, label, href }) => (
                <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                  style={{ color: isLight ? '#374151' : 'rgba(255,255,255,0.8)' }}
                  className="flex items-center gap-3 py-3 px-3 rounded-xl transition-colors cursor-pointer font-medium">
                  <span>{icon}</span>{label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link href="/account" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer font-medium text-white/80">
                    <User style={{ height: 16, width: 16, color: G }} />My Account
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer font-medium"
                    style={{ color: '#F87171', background: 'transparent', border: 'none' }}>
                    <LogOut style={{ height: 16, width: 16 }} />Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => { openModal(); setMobileOpen(false); }}
                  className="w-full mt-3 py-3 rounded-xl font-black text-sm btn-primary">
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
