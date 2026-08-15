import { apiFetch } from '@/lib/api';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, ChevronDown, ShoppingCart, User, LogOut,
  Plus, Minus, Star, Clock, ChevronRight, ChevronLeft,
  Shield, Package, Truck, Zap, Check, Copy, ArrowRight,
  Phone, Instagram, Twitter, Linkedin,
  Gift, Crown, BadgeCheck, Users, TrendingUp,
  LocateFixed, X, Utensils, Store, Bike, Tag
} from 'lucide-react';
import { products, categories, restaurants, foodCategories, promoCodes, stores, menuItems } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ZyphixLogo } from '../components/ZyphixLogo';


type TabId = 'now' | 'eats' | 'map' | 'offers';

/* ─── Tokens ─── */
const G   = '#0DA366';   // primary green
const G2  = '#0A8C58';   // green hover
const BG  = '#F8F9FA';
const W   = '#FFFFFF';
const T1  = '#111827';
const T2  = '#6B7280';
const T3  = '#9CA3AF';
const BD  = '#E5E7EB';
const SH  = '0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)';
const SH2 = '0 4px 12px rgba(0,0,0,.1), 0 16px 40px rgba(0,0,0,.1)';
const DARK = '#0A0F1A';

/* ═══════════════ LOGO ═══════════════ */
function LogoMark({ size = 32, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <ZyphixLogo
      size={size}
      wordmarkColor={dark ? '#ffffff' : T1}
      wordmarkHighlight={dark ? '#34D399' : G}
      ixColor={dark ? 'rgba(255,255,255,.82)' : '#0A0F1A'}
    />
  );
}

/* ─── Helpers ─── */
function useCountdown(n: number) {
  const [s, setS] = useState(n);
  useEffect(() => { const t = setInterval(() => setS(x => x > 0 ? x - 1 : 0), 1000); return () => clearInterval(t); }, []);
  const p = (v: number) => String(v).padStart(2, '0');
  return { h: p(Math.floor(s / 3600)), m: p(Math.floor((s % 3600) / 60)), s: p(s % 60) };
}
function Scroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const sc = (d: 1 | -1) => ref.current?.scrollBy({ left: d * 320, behavior: 'smooth' });
  return (
    <div className="relative group/s">
      <button onClick={() => sc(-1)} className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full items-center justify-center opacity-0 group-hover/s:opacity-100 transition-all" style={{ background: W, border: `1px solid ${BD}`, boxShadow: SH2 }}>
        <ChevronLeft size={14} color={T1} />
      </button>
      <div ref={ref} className="carousel">{children}</div>
      <button onClick={() => sc(1)} className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full items-center justify-center opacity-0 group-hover/s:opacity-100 transition-all" style={{ background: W, border: `1px solid ${BD}`, boxShadow: SH2 }}>
        <ChevronRight size={14} color={T1} />
      </button>
    </div>
  );
}
function Row({ title, sub, action }: { title: string; sub?: string; action?: string }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: T1, letterSpacing: '-.025em' }}>{title}</h2>
        {sub && <p style={{ fontSize: 12, color: T3, marginTop: 3 }}>{sub}</p>}
      </div>
      {action && (
        <button style={{ fontSize: 12, fontWeight: 700, color: G, display: 'flex', alignItems: 'center', gap: 2 }}>
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}
function Rat({ r }: { r: number }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 700, color: '#B45309' }}>
    <Star size={10} fill="#D97706" stroke="none" />{r}
  </span>;
}

/* ═══════════════ ANNOUNCEMENT ═══════════════ */
const ANNO_MSGS = [
  { Icon: Tag,       color: '#FCD34D', text: <>Use code <strong style={{color:'#fff'}}>ZYPHIX50</strong> — 50% off your first order</> },
  { Icon: Zap,       color: '#6EE7B7', text: <>Zyphix is now live <strong style={{color:'#fff'}}>across India</strong> — Join the waitlist</> },
  { Icon: Store,     color: '#93C5FD', text: <><strong style={{color:'#fff'}}>Kirana store owner?</strong> List your shop for free</> },
] as const;
function AnnoBar() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % ANNO_MSGS.length), 3500); return () => clearInterval(t); }, []);
  const { Icon, color, text } = ANNO_MSGS[i];
  const scrollToWaitlist = () => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <div style={{ background: DARK, padding: '8px 16px', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: .28 }}
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <div style={{ width:18, height:18, borderRadius:5, background:`${color}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Icon size={11} color={color} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(255,255,255,.8)', letterSpacing: '.01em' }}>
            {text}{i === 2 && <>{' '}<span onClick={scrollToWaitlist} style={{ color:'#6EE7B7', textDecoration:'underline', cursor:'pointer', fontWeight:700, marginLeft:4 }}>Register now →</span></>}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════ NAVBAR ═══════════════ */
const LOC_AREAS: Record<string, string[]> = {
  Delhi: ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Saket', 'Vasant Kunj', 'Dwarka', 'Rohini', 'Noida', 'Gurgaon'],
  Mumbai: ['Andheri', 'Bandra', 'Juhu', 'Dadar', 'Kurla', 'Thane', 'Borivali', 'Malad', 'Powai'],
  Bengaluru: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Marathahalli', 'Electronic City'],
  Hyderabad: ['Banjara Hills', 'Jubilee Hills', 'Madhapur', 'Gachibowli', 'Secunderabad', 'Kukatpally'],
  Chennai: ['Anna Nagar', 'T Nagar', 'Adyar', 'Velachery', 'OMR', 'Porur', 'Tambaram'],
  Kolkata: ['Salt Lake', 'Park Street', 'New Town', 'Howrah', 'Jadavpur', 'Ballygunge'],
  Pune: ['Kothrud', 'Hinjewadi', 'Viman Nagar', 'Koregaon Park', 'Baner', 'Hadapsar'],
  Ahmedabad: ['SG Highway', 'Navrangpura', 'Satellite', 'Vastrapur', 'Prahlad Nagar', 'Bopal'],
  Jaipur: ['Malviya Nagar', 'Vaishali Nagar', 'Civil Lines', 'Mansarovar', 'C-Scheme', 'Tonk Road'],
  Chandigarh: ['Sector 17', 'Sector 22', 'Sector 35', 'Mohali', 'Panchkula', 'Zirakpur'],
  Lucknow: ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Aliganj', 'Indira Nagar', 'Mahanagar'],
  Surat: ['Vesu', 'Adajan', 'Athwa Lines', 'Katargam', 'Varachha', 'Piplod'],
  Nagpur: ['Dharampeth', 'Sadar', 'Sitabuldi', 'Ambazari', 'Hingna Road', 'Wardha Road'],
  Indore: ['Vijay Nagar', 'AB Road', 'MG Road', 'Rajwada', 'Palasia', 'Scheme 54'],
  Bhopal: ['Arera Colony', 'MP Nagar', 'Kolar Road', 'Shahpura', 'Habibganj', 'Tulsi Nagar'],
  Patna: ['Bailey Road', 'Boring Road', 'Kankarbagh', 'Rajendra Nagar', 'Fraser Road'],
  Kochi: ['Ernakulam', 'Kakkanad', 'Edapally', 'Vyttila', 'Aluva', 'Fort Kochi'],
};

const SVCS = [
  { id: 'now' as TabId, name: 'Zyphix Now', tag: 'Grocery · 30 min', color: G, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=64&h=64&fit=crop&q=80' },
  { id: 'eats' as TabId, name: 'Zyphix Eats', tag: 'Food delivery', color: '#EA580C', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=64&h=64&fit=crop&q=80' },
];

function Navbar({ tab = 'now', setTab }: { tab?: TabId; setTab?: (t: TabId) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [locVal, setLocVal] = useState<string>(() => {
    try { return localStorage.getItem('zyphix_loc') || ''; } catch { return ''; }
  });
  const [locSearch, setLocSearch] = useState('');
  const [locating, setLocating] = useState(false);
  const locRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, logout, openModal } = useAuth();
  const cart = useCart();
  const [, navigate] = useLocation();

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setFocus(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const query = q.trim().toLowerCase();
  const groceryResults = query
    ? products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      ).slice(0, 6)
    : [];
  const dishResults = query
    ? menuItems.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.desc.toLowerCase().includes(query)
      ).slice(0, 5)
    : [];
  const restaurantResults = query
    ? restaurants.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query)
      ).slice(0, 4)
    : [];
  const hasResults = groceryResults.length + dishResults.length + restaurantResults.length > 0;
  const showSearch = focus && query.length > 0;

  const addGrocery = (p: typeof products[0]) => {
    cart.add({
      id: p.id, name: p.name, brand: p.brand, price: p.price,
      origPrice: p.origPrice ?? null, image: p.image, weight: p.weight,
    });
  };

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) {
        setLocOpen(false); setLocSearch('');
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const saveLocation = (val: string) => {
    try { localStorage.setItem('zyphix_loc', val); } catch {}
    setLocVal(val); setLocOpen(false); setLocSearch('');
  };

  const detectGPS = () => {
    if (!navigator.geolocation) { saveLocation('India'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
            { headers: { 'Accept-Language': 'en-US,en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const area =
            addr.suburb || addr.neighbourhood || addr.quarter ||
            addr.village || addr.town || addr.city_district || '';
          const city =
            addr.city || addr.town || addr.county ||
            addr.state_district || addr.state || '';
          const label = area
            ? `${area}${city ? ', ' + city : ''}`
            : city || 'Current Location';
          setLocating(false);
          saveLocation(label);
        } catch {
          setLocating(false);
          saveLocation('Current Location');
        }
      },
      (err) => {
        setLocating(false);
        const msg =
          err.code === 1 ? 'Location access denied. Pick manually.' : 'Could not detect location.';
        alert(msg);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const allAreas = Object.values(LOC_AREAS).flat();
  const active = SVCS.find(s => s.id === tab);

  const delivMins = locVal ? '30 mins' : null;
  const areaLabel = locVal
    ? locVal.length > 20 ? locVal.slice(0, 19) + '…' : locVal
    : 'Select Location';

  return (
    <div className="sticky top-0 z-50" style={{ background: W, borderBottom: `1px solid ${BD}`, boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,.06)' : 'none', transition: 'box-shadow .2s' }}>
      <style>{`
        @media (max-width: 640px) {
          .nav-location { display: none !important; }
          .nav-login { display: none !important; }
          .nav-cart-text { display: none !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: 60, display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <LogoMark size={28} />
        </a>

        {/* ── Location picker ── */}
        <div ref={locRef} className="nav-location" style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => { setLocOpen(o => !o); setLocSearch(''); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px 6px 8px', borderRadius: 10, transition: 'background .12s' }}
            onMouseEnter={e => (e.currentTarget.style.background = BG)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <MapPin size={17} color={locVal ? G : T3} strokeWidth={2.2} />
              {locVal && (
                <span style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, borderRadius: '50%', background: G, border: `1.5px solid ${W}` }} />
              )}
            </div>
            <div style={{ textAlign: 'left', minWidth: 0, maxWidth: 148 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: T3, lineHeight: 1, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                {locVal ? (delivMins ? `In ${delivMins}` : 'Delivering to') : 'Deliver to'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: T1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {locVal ? areaLabel : 'Select Location'}
                </span>
                <motion.span animate={{ rotate: locOpen ? 180 : 0 }} transition={{ duration: .18 }} style={{ flexShrink: 0 }}>
                  <ChevronDown size={12} color={T3} />
                </motion.span>
              </div>
            </div>
          </button>

          {/* Location dropdown */}
          <AnimatePresence>
            {locOpen && (
              <motion.div initial={{ opacity: 0, y: 6, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: .97 }} transition={{ duration: .14 }}
                style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: 316, background: W, border: `1px solid ${BD}`, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,.1)', zIndex: 400, overflow: 'hidden' }}>
                <button onClick={detectGPS} disabled={locating}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: 'none', borderBottom: `1px solid ${BD}`, background: 'rgba(13,163,102,.1)', cursor: 'pointer', transition: 'background .12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,163,102,.18)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(13,163,102,.1)')}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: locating ? T3 : G, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <LocateFixed size={15} color="#fff" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T1 }}>{locating ? 'Detecting…' : 'Use current location'}</p>
                    <p style={{ fontSize: 11, color: T3, marginTop: 1 }}>GPS · Accurate delivery</p>
                  </div>
                </button>
                <div style={{ padding: '8px 12px', borderBottom: `1px solid ${BD}` }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T3 }} />
                    <input value={locSearch} onChange={e => setLocSearch(e.target.value)} placeholder="Search area or colony…" autoFocus
                      style={{ width: '100%', paddingLeft: 30, paddingRight: locSearch ? 28 : 10, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: `1.5px solid ${BD}`, fontSize: 13, color: T1, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: BG }}
                      onFocus={e => { e.target.style.borderColor = G; e.target.style.background = W; }}
                      onBlur={e => { e.target.style.borderColor = BD; e.target.style.background = BG; }} />
                    {locSearch && (
                      <button onClick={() => setLocSearch('')} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: T3, display: 'flex', padding: 2 }}>
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ maxHeight: 240, overflowY: 'auto', padding: '8px 12px 12px' }}>
                  {Object.entries(LOC_AREAS).map(([city, areas]) => {
                    const filtered = locSearch ? areas.filter(a => a.toLowerCase().includes(locSearch.toLowerCase())) : areas;
                    if (!filtered.length) return null;
                    return (
                      <div key={city} style={{ marginBottom: 10 }}>
                        <p style={{ fontSize: 9.5, fontWeight: 800, color: T3, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6, paddingLeft: 2 }}>{city}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {filtered.map(area => {
                            const fullName = `${area}, ${city}`;
                            const isActive = locVal === fullName;
                            return (
                              <button key={area} onClick={() => saveLocation(fullName)}
                                style={{ padding: '4px 11px', borderRadius: 20, border: `1.5px solid ${isActive ? G : BD}`, background: isActive ? `${G}12` : W, fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? G : T2, cursor: 'pointer', transition: 'all .1s' }}
                                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = `${G}66`; e.currentTarget.style.color = G; e.currentTarget.style.background = `${G}08`; } }}
                                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = BD; e.currentTarget.style.color = T2; e.currentTarget.style.background = W; } }}>
                                {area}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {locSearch && !allAreas.some(a => a.toLowerCase().includes(locSearch.toLowerCase())) && (
                    <button onClick={() => saveLocation(locSearch)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: `1.5px dashed ${G}66`, background: `${G}06`, fontSize: 12.5, fontWeight: 600, color: G, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <MapPin size={12} /> Set "{locSearch}" as location
                    </button>
                  )}
                  {locVal && !locSearch && (
                    <button onClick={() => { try { localStorage.removeItem('zyphix_loc'); } catch {} setLocVal(''); setLocOpen(false); }}
                      style={{ width: '100%', marginTop: 4, padding: '7px 12px', borderRadius: 8, border: `1px solid ${BD}`, background: W, fontSize: 12, fontWeight: 500, color: T3, cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = BG)}
                      onMouseLeave={e => (e.currentTarget.style.background = W)}>
                      Clear saved location
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Search bar (Zepto-style pill, dominant center) ── */}
        <div ref={searchRef} style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <Search size={16} style={{ position: 'absolute', left: 16, top: 22, transform: 'translateY(-50%)', color: focus ? G : '#9CA3AF', transition: 'color .15s', pointerEvents: 'none', zIndex: 2 }} />
          <input
            data-testid="global-search-input"
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setFocus(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && query) { setFocus(false); navigate(dishResults.length || restaurantResults.length ? '/eats' : '/now'); }
              if (e.key === 'Escape') { setFocus(false); (e.target as HTMLInputElement).blur(); }
            }}
            placeholder={`Search for ${tab === 'now' ? 'groceries, brands and more' : tab === 'eats' ? 'dishes, restaurants and more' : 'stores, offers and more'}`}
            style={{
              width: '100%',
              paddingLeft: 46,
              paddingRight: q ? 40 : 20,
              paddingTop: 11,
              paddingBottom: 11,
              borderRadius: showSearch ? '22px 22px 0 0' : 999,
              background: focus ? '#1E2A3B' : '#1A2332',
              border: `1.5px solid ${focus ? G + '55' : BD}`,
              fontSize: 13.5,
              color: '#fff',
              fontFamily: 'inherit',
              fontWeight: 500,
              outline: 'none',
              transition: 'background .18s, border-color .18s',
              boxShadow: focus ? `0 0 0 3px ${G}14` : 'none',
              boxSizing: 'border-box',
            }}
          />
          {q && (
            <button data-testid="global-search-clear" onClick={() => { setQ(''); }} aria-label="Clear search"
              style={{ position: 'absolute', right: 14, top: 22, transform: 'translateY(-50%)', background: 'rgba(255,255,255,.12)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
              <X size={12} color="#fff" />
            </button>
          )}

          {/* ── Live search results dropdown ── */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                data-testid="global-search-results"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: .12 }}
                onMouseDown={e => e.preventDefault()}
                style={{ position: 'absolute', top: 'calc(100% - 1px)', left: 0, right: 0, background: '#111827', border: `1.5px solid ${G}55`, borderTop: 'none', borderRadius: '0 0 18px 18px', boxShadow: '0 18px 40px rgba(0,0,0,.4)', zIndex: 500, maxHeight: 460, overflowY: 'auto', padding: '6px 0 10px' }}>
                {!hasResults && (
                  <div style={{ padding: '26px 18px', textAlign: 'center' }}>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>No matches for “{q}”</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 4 }}>Try “tomatoes”, “biryani”, “pizza” or a brand name.</p>
                  </div>
                )}

                {groceryResults.length > 0 && (
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#34D399', padding: '10px 18px 6px' }}>Groceries · Zyphix Now</p>
                    {groceryResults.map(p => (
                      <div key={p.id} data-testid={`search-grocery-${p.id}`}
                        onClick={() => { setFocus(false); navigate(`/now/product/${p.id}`); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px', cursor: 'pointer', transition: 'background .1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: '#1A2332', flexShrink: 0 }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{p.weight} · ₹{p.price}</p>
                        </div>
                        <button data-testid={`search-add-${p.id}`}
                          onClick={e => { e.stopPropagation(); addGrocery(p); }}
                          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, background: G, color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = G2)}
                          onMouseLeave={e => (e.currentTarget.style.background = G)}>
                          <Plus size={13} /> Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {dishResults.length > 0 && (
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#FB923C', padding: '12px 18px 6px' }}>Dishes · Zyphix Eats</p>
                    {dishResults.map(m => (
                      <div key={m.id} data-testid={`search-dish-${m.id}`}
                        onClick={() => { setFocus(false); navigate('/eats'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px', cursor: 'pointer', transition: 'background .1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <img src={m.image} alt={m.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: '#1A2332', flexShrink: 0 }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</p>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.desc}</p>
                        </div>
                        <span style={{ flexShrink: 0, fontSize: 12.5, fontWeight: 800, color: '#fff' }}>₹{m.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {restaurantResults.length > 0 && (
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#FB923C', padding: '12px 18px 6px' }}>Restaurants</p>
                    {restaurantResults.map(r => (
                      <div key={r.id} data-testid={`search-restaurant-${r.id}`}
                        onClick={() => { setFocus(false); navigate('/eats'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px', cursor: 'pointer', transition: 'background .1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <img src={r.image} alt={r.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: '#1A2332', flexShrink: 0 }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</p>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.cuisine}</p>
                        </div>
                        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: '#34D399' }}>
                          <Star size={12} fill="#34D399" color="#34D399" /> {r.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${BD}`, fontSize: 13, fontWeight: 600, color: T1, background: W, cursor: 'pointer', transition: 'all .13s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = G + '44'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BD; }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: G, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 900 }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown size={11} color={T3} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 6, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: .96 }} transition={{ duration: .13 }}
                    style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: W, border: `1px solid ${BD}`, borderRadius: 14, width: 196, boxShadow: '0 8px 28px rgba(0,0,0,.09)', zIndex: 400, overflow: 'hidden' }}
                    onMouseLeave={() => setUserMenuOpen(false)}>
                    <div style={{ padding: '11px 14px', borderBottom: `1px solid ${BD}`, background: BG }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: T1 }}>{user.name}</p>
                      <p style={{ fontSize: 11, color: T3, marginTop: 1 }}>{user.email}</p>
                    </div>
                    {[{ l: 'My Orders', href: '#' }, { l: 'Account Settings', href: '#' }, { l: 'Saved Addresses', href: '#' }].map(({ l, href }) => (
                      <a key={l} href={href} style={{ display: 'block', padding: '9px 14px', fontSize: 13, color: T2, fontWeight: 500, transition: 'background .1s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = BG}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = W}>{l}</a>
                    ))}
                    <div style={{ borderTop: `1px solid ${BD}` }}>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', fontSize: 13, color: '#EF4444', fontWeight: 600, transition: 'background .1s', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FFF5F5'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <LogOut size={13} /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button className="nav-login" onClick={openModal}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, border: `1.5px solid ${BD}`, fontSize: 13, fontWeight: 700, color: T1, background: W, cursor: 'pointer', transition: 'all .13s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = G; (e.currentTarget as HTMLElement).style.color = G; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BD; (e.currentTarget as HTMLElement).style.color = T1; }}>
              <User size={14} /> Login
            </button>
          )}
          {/* Become a Partner CTA */}
          <Link href="/partner"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, background: G, fontSize: 13, fontWeight: 800, color: '#fff', border: 'none', cursor: 'pointer', transition: 'background .13s', whiteSpace: 'nowrap', boxShadow: `0 2px 12px ${G}40`, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = G2}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = G}>
            Become a Partner →
          </Link>
          <button
            data-testid="navbar-cart-button"
            onClick={() => navigate('/now/cart')}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, background: G, fontSize: 13.5, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', transition: 'background .13s', boxShadow: `0 2px 10px rgba(13,163,102,.28)`, whiteSpace: 'nowrap' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = G2}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = G}>
            <ShoppingCart size={15} />
            <span className="nav-cart-text">Cart</span>
            {cart.totalItems > 0 && (
              <span data-testid="navbar-cart-count" style={{ position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, padding: '0 4px', borderRadius: 9, background: '#EF4444', color: '#fff', fontSize: 9.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{cart.totalItems}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════ HERO ═══════════════ */

const HERO_DATA: Record<string, { name: string; headline: string; sub: string; cta: string; color: string; dark: string; img: string; badge: string; tags: string[] }> = {
  now:    { name: 'Zyphix Now',      headline: 'Groceries delivered\nin 30 minutes.',        sub: 'Kirana stores · Pharmacy · Supermarket · 200+ partner stores near you', cta: 'Order Groceries', color: G,         dark: '#065F46', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=600&fit=crop&q=90', badge: '⚡ Fastest delivery in India',   tags: ['Vegetables','Dairy','Snacks','Pharmacy','Beverages','Household'] },
  eats:   { name: 'Zyphix Eats',     headline: 'Food from your\nfavourite places.',         sub: 'Restaurants · Dhabas · Cloud kitchens · Local gems near you',               cta: 'Order Food',      color: '#EA580C', dark: '#9A3412', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&h=600&fit=crop&q=90', badge: '🍱 Local restaurants near you',  tags: ['Biryani','Pizza','Burgers','Thali','Desserts','Drinks'] },
  map:    { name: 'Stores Near Me',  headline: 'Find local stores\nnear you.',               sub: 'Kirana · Medical · Supermarkets — all on the map',                          cta: 'Explore Map',     color: G,         dark: '#065F46', img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1400&h=600&fit=crop&q=90', badge: '📍 Pan India',                   tags: [] },
  offers: { name: 'Exclusive Offers',headline: "Deals you won't\nfind elsewhere.",           sub: 'Promo codes · Flash sales · First-order discounts',                          cta: 'See All Offers',  color: '#D97706', dark: '#92400E', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&h=600&fit=crop&q=90', badge: '🏷️ New deals daily',               tags: [] },
};

/* ═══════════════ DUAL HERO BANNERS ═══════════════ */
function DualHeroBanners() {
  const [hovNow, setHovNow] = useState(false);
  const [hovEats, setHovEats] = useState(false);
  const [, navigate] = useLocation();
  const nowVidRef = useRef<HTMLVideoElement>(null);
  const eatsVidRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    nowVidRef.current?.play().catch(() => {});
    eatsVidRef.current?.play().catch(() => {});
  }, []);

  return (
    <div style={{ background: W }}>
      <style>{`
        @media (max-width: 767px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-panel { height: 420px !important; min-height: 380px !important; }
          .hero-headline { font-size: 1.8rem !important; }
          .hero-pills { flex-wrap: wrap !important; }
        }
        .hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      `}</style>
      <div className="hero-grid" style={{ maxWidth: 1320, margin: '0 auto', padding: '24px 24px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* ── ZyphixNow ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .32 }}
          className="hero-panel"
          style={{ position: 'relative', height: 560, borderRadius: 28, overflow: 'hidden', cursor: 'pointer', boxShadow: hovNow ? '0 32px 80px rgba(6,95,70,.42)' : SH2, transition: 'box-shadow .28s, transform .28s', transform: hovNow ? 'translateY(-6px)' : 'none' }}
          onMouseEnter={() => setHovNow(true)} onMouseLeave={() => setHovNow(false)}
          onClick={() => navigate('/now')}
        >
          {/* Video background — groceries */}
          <video
            ref={nowVidRef}
            src="/videos/grocery-banner.mp4?v=3"
            autoPlay muted loop playsInline
            poster="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1280&h=720&fit=crop&q=80"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(175deg, rgba(3,32,18,.2) 0%, rgba(4,58,34,.72) 45%, rgba(2,26,14,.98) 100%)' }} />
          <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(16,214,120,.12)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ background: 'rgba(16,214,120,.18)', backdropFilter: 'blur(10px)', border: '1px solid rgba(16,214,120,.38)', color: '#6EE7B7', fontSize: 12, fontWeight: 700, padding: '5px 16px', borderRadius: 99, letterSpacing: '.03em' }}>
                ⚡ Now · 30 min delivery
              </span>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(145deg, #10D678 0%, #059E5C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 18px rgba(16,214,120,.5)' }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 18, color: '#fff', lineHeight: 1, letterSpacing: '-0.08em', userSelect: 'none', textShadow: '0 1px 4px rgba(0,0,0,.25)' }}>//</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: '#86EFAC', letterSpacing: '.11em', textTransform: 'uppercase', marginBottom: 10 }}>Zyphix Now</p>
              <h2 className="hero-headline" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', lineHeight: 1.04, fontSize: 'clamp(1.65rem,3.2vw,2.95rem)', letterSpacing: '-.045em', marginBottom: 13 }}>Groceries<br />in 30 minutes.</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', marginBottom: 16, lineHeight: 1.6 }}>Fresh produce · Dairy · Pharmacy · Snacks<br />200+ partner stores at kirana prices</p>
              <div className="hero-pills" style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
                {['Vegetables', 'Dairy', 'Snacks', 'Pharmacy', 'Household'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(6px)', color: 'rgba(255,255,255,.84)', fontSize: 12, fontWeight: 600, padding: '5px 13px', borderRadius: 9, border: '1px solid rgba(255,255,255,.18)' }}>{tag}</span>
                ))}
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.68)', fontStyle: 'italic', marginBottom: 20 }}>Sourced from kirana stores near you — not dark warehouses</p>
              <div>
                <button onClick={e => { e.stopPropagation(); navigate('/now'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: G, color: '#fff', fontSize: 15, fontWeight: 800, padding: '14px 30px', borderRadius: 13, boxShadow: '0 8px 28px rgba(16,214,120,.48)', border: 'none', cursor: 'pointer', transition: 'filter .15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'}>
                  Order Groceries <ArrowRight size={16} />
                </button>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 8 }}>Now live across India</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── ZyphixEats ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .32, delay: .1 }}
          className="hero-panel"
          style={{ position: 'relative', height: 560, borderRadius: 28, overflow: 'hidden', cursor: 'pointer', boxShadow: hovEats ? '0 32px 80px rgba(154,52,18,.42)' : SH2, transition: 'box-shadow .28s, transform .28s', transform: hovEats ? 'translateY(-6px)' : 'none' }}
          onMouseEnter={() => setHovEats(true)} onMouseLeave={() => setHovEats(false)}
          onClick={() => navigate('/eats')}
        >
          {/* Video background — food */}
          <video
            ref={eatsVidRef}
            src="/videos/eats-banner.mp4?v=3"
            autoPlay muted loop playsInline
            poster="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1280&h=720&fit=crop&q=80"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(175deg, rgba(50,10,5,.15) 0%, rgba(100,22,5,.68) 45%, rgba(40,4,0,.98) 100%)' }} />
          <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(249,115,22,.12)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ background: 'rgba(251,146,60,.18)', backdropFilter: 'blur(10px)', border: '1px solid rgba(251,146,60,.38)', color: '#FDBA74', fontSize: 12, fontWeight: 700, padding: '5px 16px', borderRadius: 99, letterSpacing: '.03em' }}>
                🍱 Eats · Local restaurants near you
              </span>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(145deg, #F97316 0%, #EA580C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 18px rgba(249,115,22,.5)' }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 18, color: '#fff', lineHeight: 1, letterSpacing: '-0.08em', userSelect: 'none', textShadow: '0 1px 4px rgba(0,0,0,.25)' }}>//</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: '#FDBA74', letterSpacing: '.11em', textTransform: 'uppercase', marginBottom: 10 }}>Zyphix Eats</p>
              <h2 className="hero-headline" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', lineHeight: 1.04, fontSize: 'clamp(1.65rem,3.2vw,2.95rem)', letterSpacing: '-.045em', marginBottom: 13 }}>Food from your<br />favourite places.</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', marginBottom: 20, lineHeight: 1.6 }}>Restaurants · Dhabas · Cloud kitchens<br />Local gems near you, delivered hot</p>
              <div className="hero-pills" style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 26 }}>
                {['Biryani', 'Pizza', 'Burgers', 'Thali', 'Desserts'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(6px)', color: 'rgba(255,255,255,.84)', fontSize: 12, fontWeight: 600, padding: '5px 13px', borderRadius: 9, border: '1px solid rgba(255,255,255,.18)' }}>{tag}</span>
                ))}
              </div>
              <div>
                <button onClick={e => { e.stopPropagation(); navigate('/eats'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EA580C', color: '#fff', fontSize: 15, fontWeight: 800, padding: '14px 30px', borderRadius: 13, boxShadow: '0 8px 28px rgba(234,88,12,.48)', border: 'none', cursor: 'pointer', transition: 'filter .15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'}>
                  Order Food <ArrowRight size={16} />
                </button>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 8 }}>Be first to order</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

/* ═══════════════ TRUST STRIP ═══════════════ */
function Trust() {
  const stats = [
    { icon: <Zap size={16} color={G} />,      label: '30 Min',       sub: 'Guaranteed delivery',  accent: true },
    { icon: <Package size={16} color={T2} />,  label: 'Pan India',    sub: 'Every city, every lane', accent: false },
    { icon: <MapPin size={16} color={T2} />,   label: 'Tier 2 India', sub: 'Built for Bharat',     accent: false },
    { icon: <Truck size={16} color={T2} />,    label: '₹0 Surge',     sub: 'Always fair pricing',  accent: false },
  ];
  return (
    <div style={{ background: BG, borderTop: `1px solid ${BD}`, borderBottom: `1px solid ${BD}` }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * .13, duration: .5, ease: [.22,1,.36,1] }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 20px', borderRight: i < 3 ? `1px solid ${BD}` : 'none', borderLeft: s.accent ? `3px solid ${G}` : '3px solid transparent' }}>
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * .13 + .1, type: 'spring', stiffness: 400 }}
              style={{ width: 34, height: 34, borderRadius: 9, background: s.accent ? 'rgba(13,163,102,.08)' : BG, border: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</motion.div>
            <div>
              <p style={{ fontWeight: 700, color: T1, fontSize: 14, lineHeight: 1 }}>{s.label}</p>
              <p style={{ fontSize: 11, fontWeight: 400, color: T3, marginTop: 2 }}>{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ ADD BUTTON ═══════════════ */
function AddBtn({ id, cart, add, rm }: { id: string; cart: Record<string, number>; add: (i: string) => void; rm: (i: string) => void }) {
  if (cart[id]) return (
    <div style={{ display: 'inline-flex', alignItems: 'center', background: G, borderRadius: 9, overflow: 'hidden' }}>
      <button onClick={e => { e.stopPropagation(); rm(id); }} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} color="#fff" /></button>
      <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', minWidth: 20, textAlign: 'center' }}>{cart[id]}</span>
      <button onClick={e => { e.stopPropagation(); add(id); }} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} color="#fff" /></button>
    </div>
  );
  return (
    <button onClick={e => { e.stopPropagation(); add(id); }} style={{ width: 30, height: 30, borderRadius: 9, background: `rgba(13,163,102,.08)`, border: `1.5px solid rgba(13,163,102,.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = G; (e.currentTarget as HTMLElement).style.borderColor = G; (e.currentTarget as HTMLElement as any).firstChild.style.color = '#fff'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(13,163,102,.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,163,102,.25)'; }}>
      <Plus size={13} color={G} />
    </button>
  );
}

/* ═══════════════ PRODUCT CARD ═══════════════ */
function PCard({ p, cart, add, rm }: { p: typeof products[0]; cart: Record<string, number>; add: (i: string) => void; rm: (i: string) => void }) {
  const disc = p.origPrice ? Math.round((1 - p.price / p.origPrice) * 100) : null;
  return (
    <div className="snap-start group cursor-pointer" style={{ width: 178, flexShrink: 0, background: W, border: `1px solid ${BD}`, borderRadius: 16, overflow: 'hidden', boxShadow: SH, transition: 'all .2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = SH2; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = SH; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
      <div style={{ position: 'relative', height: 130, background: BG }}>
        <img src={p.image} alt={p.name} className="w-full h-full img-cover group-hover:scale-105 transition-transform duration-300" />
        {disc && <div style={{ position: 'absolute', top: 8, left: 8, background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 6 }}>-{disc}%</div>}
        {!disc && p.tag && <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(13,163,102,.1)', color: G, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, border: `1px solid rgba(13,163,102,.25)` }}>{p.tag}</div>}
      </div>
      <div style={{ padding: '11px 12px' }}>
        <p style={{ fontSize: 9.5, color: T3, marginBottom: 2 }}>{p.brand}</p>
        <p style={{ fontSize: 13, fontWeight: 700, color: T1, lineHeight: 1.35, marginBottom: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.name}</p>
        <p style={{ fontSize: 10.5, color: T3, marginBottom: 10 }}>{p.weight}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 800, color: T1, fontSize: 14 }}>₹{p.price}</span>
            {p.origPrice && <span style={{ fontSize: 10.5, color: T3, textDecoration: 'line-through', marginLeft: 5 }}>₹{p.origPrice}</span>}
          </div>
          <AddBtn id={p.id} cart={cart} add={add} rm={rm} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ BRAND CHIP STRIP ═══════════════ */
interface BC { name: string; abbr: string; textColor: string; bg: string; }

const NOW_BRANDS: BC[] = [
  { name: 'Amul',        abbr: 'AM',  textColor: '#fff', bg: '#1D6FB4' },
  { name: 'Nestlé',      abbr: 'NE',  textColor: '#fff', bg: '#C8102E' },
  { name: 'Britannia',   abbr: 'BR',  textColor: '#fff', bg: '#E42313' },
  { name: 'Tata',        abbr: 'TA',  textColor: '#fff', bg: '#00285E' },
  { name: 'Haldirams',   abbr: 'HD',  textColor: '#fff', bg: '#E55126' },
  { name: 'ITC',         abbr: 'ITC', textColor: '#fff', bg: '#7B2335' },
  { name: 'Dabur',       abbr: 'DA',  textColor: '#fff', bg: '#007030' },
  { name: 'Patanjali',   abbr: 'PA',  textColor: '#fff', bg: '#F07800' },
  { name: 'Fortune',     abbr: 'FO',  textColor: '#fff', bg: '#EF4123' },
  { name: 'Mother Dairy',abbr: 'MD',  textColor: '#fff', bg: '#003A96' },
  { name: 'MDH',         abbr: 'MDH', textColor: '#fff', bg: '#C41230' },
  { name: 'Marico',      abbr: 'MA',  textColor: '#fff', bg: '#E31837' },
  { name: 'Colgate',     abbr: 'CO',  textColor: '#fff', bg: '#D01F3C' },
  { name: 'Maggi',       abbr: 'MG',  textColor: '#fff', bg: '#B62400' },
  { name: 'Parle',       abbr: 'PR',  textColor: '#fff', bg: '#DD4C00' },
  { name: 'Lifebuoy',    abbr: 'LB',  textColor: '#fff', bg: '#D2000D' },
];

const EATS_BRANDS: BC[] = [
  { name: "Domino's",      abbr: 'DO',  textColor: '#fff', bg: '#006DB7' },
  { name: "McDonald's",    abbr: 'MC',  textColor: '#DA291C', bg: '#FFC72C' },
  { name: 'KFC',           abbr: 'KFC', textColor: '#fff', bg: '#E8002D' },
  { name: 'Subway',        abbr: 'SU',  textColor: '#fff', bg: '#009B77' },
  { name: 'Pizza Hut',     abbr: 'PH',  textColor: '#fff', bg: '#EE3124' },
  { name: 'Burger King',   abbr: 'BK',  textColor: '#fff', bg: '#FF8732' },
  { name: 'Wow Momo',      abbr: 'WM',  textColor: '#fff', bg: '#E94B4B' },
  { name: 'Haldirams',     abbr: 'HD',  textColor: '#fff', bg: '#E55126' },
  { name: 'Starbucks',     abbr: 'SB',  textColor: '#fff', bg: '#00704A' },
  { name: 'CCD',           abbr: 'CCD', textColor: '#fff', bg: '#6F3D22' },
  { name: 'Behrouz',       abbr: 'BB',  textColor: '#fff', bg: '#8B1A2B' },
  { name: 'Box8',          abbr: 'B8',  textColor: '#fff', bg: '#F05A22' },
  { name: 'Chai Point',    abbr: 'CP',  textColor: '#fff', bg: '#C2412D' },
  { name: 'Biryani Blues', abbr: 'BI',  textColor: '#fff', bg: '#2E4A86' },
  { name: 'Barbeque Nation',abbr:'BN',  textColor: '#fff', bg: '#8B0000' },
];

const BOOK_BRANDS: BC[] = [
  { name: 'Urban Company',  abbr: 'UC',  textColor: '#fff', bg: '#7C3AED' },
  { name: 'Apollo',         abbr: 'AP',  textColor: '#fff', bg: '#00427A' },
  { name: 'Dr. Lal PathLabs',abbr:'LP',  textColor: '#fff', bg: '#E31837' },
  { name: 'Housejoy',       abbr: 'HJ',  textColor: '#fff', bg: '#FF6B35' },
  { name: 'Sulekha',        abbr: 'SL',  textColor: '#fff', bg: '#0066CC' },
  { name: 'HomeTriangle',   abbr: 'HT',  textColor: '#fff', bg: '#2E86AB' },
  { name: 'Quikr Services', abbr: 'QS',  textColor: '#fff', bg: '#9C27B0' },
  { name: 'TaskBob',        abbr: 'TB',  textColor: '#fff', bg: '#FF6B00' },
  { name: 'JustDial',       abbr: 'JD',  textColor: '#fff', bg: '#1A73E8' },
  { name: 'Mr. Right',      abbr: 'MR',  textColor: '#fff', bg: '#0F9D58' },
];

function BrandRow({ title, brands, accent }: { title: string; brands: BC[]; accent: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div>
      <Row title={title} action="All brands" />
      <Scroller>
        {brands.map((b, i) => {
          const on = active === b.name;
          return (
            <button
              key={i}
              onClick={() => setActive(on ? null : b.name)}
              className="snap-start shrink-0 flex flex-col items-center gap-2 group"
            >
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: b.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2.5px solid ${on ? accent : 'transparent'}`,
                boxShadow: on ? `0 0 0 4px ${accent}22, ${SH}` : SH,
                transition: 'all .2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.07)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              >
                <span style={{
                  color: b.textColor, fontWeight: 900,
                  fontSize: b.abbr.length > 2 ? 14 : 20,
                  fontFamily: "'Outfit',sans-serif", letterSpacing: '-0.02em',
                }}>{b.abbr}</span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: on ? T1 : T2,
                textAlign: 'center', width: 80, lineHeight: 1.3,
              }}>{b.name}</span>
            </button>
          );
        })}
      </Scroller>
    </div>
  );
}

/* ═══════════════ NOW TAB ═══════════════ */
function NowTab() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const add = (id: string) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const rm = (id: string) => setCart(c => { const n = { ...c }; n[id] > 1 ? n[id]-- : delete n[id]; return n; });
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalP = Object.entries(cart).reduce((s, [id, q]) => s + (products.find(x => x.id === id)?.price ?? 0) * q, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Hero banners */}
      <Scroller>
        {[
          { tag: 'New User Offer', h: '50% off your first order', sub: 'Code ZYPHIX50 · Max ₹100 off', code: 'ZYPHIX50', img: 'https://images.unsplash.com/photo-1543168256-418811576931?w=900&h=380&fit=crop&q=85' },
          { tag: 'Partner Stores', h: '200+ partner stores across India', sub: 'Zero surge pricing · Always fresh', code: '', img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=900&h=380&fit=crop&q=85' },
          { tag: 'Pharmacy', h: 'Medicines delivered fast', sub: 'Prescription & OTC · All brands', code: '', img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&h=380&fit=crop&q=85' },
        ].map((b, i) => (
          <div key={i} className="snap-start shrink-0" style={{ width: 'min(660px,88vw)', height: 210, borderRadius: 20, overflow: 'hidden', position: 'relative', background: '#111', flexShrink: 0, boxShadow: SH2, cursor: 'pointer' }}>
            <img src={b.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .32 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg,rgba(0,0,0,.92) 40%,rgba(0,0,0,.15))' }} />
            <div style={{ position: 'absolute', inset: 0, padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,.2)', width: 'fit-content' }}>{b.tag}</span>
              <div>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', lineHeight: 1.15, marginBottom: 5, letterSpacing: '-.03em' }}>{b.h}</p>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginBottom: b.code ? 12 : 0 }}>{b.sub}</p>
                {b.code && <span style={{ display: 'inline-block', fontWeight: 800, fontSize: 12.5, letterSpacing: '.08em', color: '#fff', background: 'rgba(255,255,255,.12)', border: '1.5px dashed rgba(255,255,255,.4)', padding: '5px 13px', borderRadius: 8 }}>{b.code}</span>}
              </div>
            </div>
          </div>
        ))}
      </Scroller>

      {/* Launching Soon Panel */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1, type:'spring', stiffness:120 }}
        style={{ background:'linear-gradient(135deg,#0B1829 0%,#0F2540 100%)', borderRadius:22, overflow:'hidden', position:'relative', padding:'44px 40px' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 50%,rgba(13,163,102,.18) 0%,transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:-40, right:-40, width:220, height:220, borderRadius:'50%', background:'rgba(13,163,102,.06)', pointerEvents:'none' }} />
        <div style={{ position:'relative', display:'flex', flexWrap:'wrap', gap:36, alignItems:'center' }}>
          <div style={{ flex:'1 1 280px' }}>
            <motion.div animate={{ scale:[1,1.1,1] }} transition={{ repeat:Infinity, duration:2 }}
              style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(13,163,102,.15)', border:'1px solid rgba(13,163,102,.35)', color:G, fontSize:12, fontWeight:700, padding:'6px 16px', borderRadius:99, marginBottom:18 }}>
              <span>🚀</span> Now live across India — Be first to shop
            </motion.div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(1.5rem,3vw,2.1rem)', color:'#fff', letterSpacing:'-.04em', lineHeight:1.15, marginBottom:12 }}>
              Groceries from your<br /><span style={{ color:G }}>local kirana stores</span>
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,.55)', lineHeight:1.7, marginBottom:24 }}>
              We're onboarding stores across India right now. Join the waitlist to shop 200+ categories — fresh produce, dairy, snacks, pharmacy and more — delivered in 30 minutes.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {['🥬 Fruits & Veg','🥛 Dairy','💊 Pharmacy','🍿 Snacks','🌾 Grains & Dal','🧹 Household'].map(c => (
                <span key={c} style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', color:'rgba(255,255,255,.75)', fontSize:12.5, fontWeight:600, padding:'6px 14px', borderRadius:99 }}>{c}</span>
              ))}
              <span style={{ color:'rgba(255,255,255,.35)', fontSize:12.5, fontWeight:600, padding:'6px 4px' }}>+ more</span>
            </div>
          </div>
          <div style={{ flex:'0 0 auto', textAlign:'center' }}>
            <motion.div animate={{ y:[0,-8,0] }} transition={{ repeat:Infinity, duration:2.4, ease:'easeInOut' }}
              style={{ fontSize:80, lineHeight:1, marginBottom:12 }}>🛒</motion.div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,.35)', fontWeight:600 }}>COMING SOON</p>
          </div>
        </div>
      </motion.div>

      {/* Cart toast */}
      <AnimatePresence>
        {total > 0 && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 50, width: 'min(460px,calc(100vw - 32px))' }}>
            <div style={{ background: '#0A1628', borderRadius: 16, padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 20px 60px rgba(0,0,0,.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 14 }}>{total}</div>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{total} item{total > 1 ? 's' : ''} · View Cart</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>₹{totalP}</span>
                <ArrowRight size={18} color="#fff" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════ EATS TAB ═══════════════ */
function EatsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div style={{ position: 'relative', height: 240, borderRadius: 22, overflow: 'hidden', boxShadow: SH2 }}>
        <img src="https://images.unsplash.com/photo-1567337710282-00832b415979?w=1400&h=500&fit=crop&q=85" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg,rgba(0,0,0,.88) 40%,rgba(0,0,0,.18))' }} />
        <div style={{ position: 'absolute', inset: 0, padding: '36px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 520 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#FCA5A5', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Zyphix Eats</p>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', lineHeight: 1.08, fontSize: 'clamp(1.6rem,3vw,2.4rem)', letterSpacing: '-.04em', marginBottom: 10 }}>Local food,<br />delivered fast.</h2>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.6)', marginBottom: 22 }}>Restaurants · Dhabas · Cloud kitchens · Available across India</p>
          <button style={{ background: '#EA580C', color: '#fff', fontSize: 13, fontWeight: 800, padding: '11px 24px', borderRadius: 11, width: 'fit-content', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 20px rgba(234,88,12,.4)' }}>
            Explore Restaurants <ArrowRight size={14} />
          </button>
        </div>
      </div>
      <div>
        <Row title="What are you craving?" action="All cuisines" />
        <Scroller>
          {foodCategories.map((fc, i) => (
            <button key={i} className="snap-start shrink-0 flex flex-col items-center gap-2 group">
              <div style={{ width: 76, height: 76, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${BD}`, boxShadow: SH, transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#EA580C'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = BD}>
                <img src={fc.image} alt={fc.name} className="w-full h-full img-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: T2, textAlign: 'center', width: 80, lineHeight: 1.3 }}>{fc.name}</span>
            </button>
          ))}
        </Scroller>
      </div>
      {/* Top restaurant chains */}
      <TabMarquee logos={EatsBrandLogos} items={EATS_MARQUEE} label={"Partner\nBrands"} />

      <div>
        <Row title="Restaurants Near You" sub="Open now · Delivering to your area" action="See all" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 16 }}>
          {restaurants.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }}>
              <div className="group cursor-pointer" style={{ background: W, border: `1px solid ${BD}`, borderRadius: 18, overflow: 'hidden', boxShadow: SH, transition: 'all .22s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = SH2; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = SH; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                <div style={{ height: 158, background: BG, overflow: 'hidden', position: 'relative' }}>
                  <img src={r.image} alt={r.name} className="w-full h-full img-cover group-hover:scale-105 transition-transform duration-400" />
                  {r.deliveryFee === 0 && <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(13,163,102,.12)', color: G, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 7, border: '1px solid rgba(13,163,102,.25)', backdropFilter: 'blur(4px)' }}>FREE DELIVERY</div>}
                </div>
                <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 800, color: T1, fontSize: 14.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</p>
                    <p style={{ fontSize: 12.5, color: T2, marginTop: 2 }}>{r.cuisine}</p>
                  </div>
                  <div style={{ flexShrink: 0, marginLeft: 12, textAlign: 'right' }}>
                    <Rat r={r.rating} />
                    <p style={{ fontSize: 11, color: T3, marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} />{r.eta}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════ MAP TAB ═══════════════ */
function MapTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: W, border: `1px solid ${BD}`, borderRadius: 22, padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: SH }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(13,163,102,.08)', border: '1px solid rgba(13,163,102,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <MapPin size={28} color={G} />
        </div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: T1, fontSize: '1.6rem', letterSpacing: '-.03em', marginBottom: 8 }}>Find Stores Near You</p>
        <p style={{ fontSize: 14, color: T2, marginBottom: 24 }}>Browse verified kirana stores, pharmacies & restaurants near your address</p>
        <button style={{ background: G, color: '#fff', fontSize: 14, fontWeight: 800, padding: '12px 28px', borderRadius: 12, boxShadow: `0 4px 18px rgba(13,163,102,.3)` }}>Open Map →</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 12 }}>
        {stores.map((st: any) => (
          <div key={st.id} className="cursor-pointer" style={{ background: W, border: `1px solid ${BD}`, borderRadius: 15, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: SH, transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = SH2; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = SH; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: BG, border: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {st.type === 'kirana' ? '🏪' : st.type === 'medical' ? '💊' : st.type === 'restaurant' ? '🍽️' : '🏢'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, color: T1, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st.name}</p>
              <p style={{ fontSize: 11.5, color: T3, marginTop: 2 }}>{st.distance} · {st.openHours}</p>
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <Rat r={st.rating} />
              <span style={{ display: 'block', marginTop: 6, background: st.open ? 'rgba(13,163,102,.08)' : 'rgba(239,68,68,.07)', color: st.open ? G : '#EF4444', border: `1px solid ${st.open ? 'rgba(13,163,102,.2)' : 'rgba(239,68,68,.2)'}`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>{st.open ? 'Open' : 'Closed'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ OFFERS TAB ═══════════════ */
function OffersTab() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (c: string) => { navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(null), 2500); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ position: 'relative', height: 230, borderRadius: 22, overflow: 'hidden', boxShadow: SH2 }}>
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=460&fit=crop&q=85" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg,rgba(0,0,0,.92) 45%,rgba(0,0,0,.15))' }} />
        <div style={{ position: 'absolute', inset: 0, padding: '36px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#86EFAC', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>New User Offer</p>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', fontSize: 'clamp(1.6rem,3vw,2.5rem)', letterSpacing: '-.04em', lineHeight: 1.08, marginBottom: 8 }}>Flat 50% off<br />your first order.</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.58)', marginBottom: 20 }}>Min ₹199 · Max ₹100 off · New users only</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#fff', background: 'rgba(255,255,255,.12)', border: '1.5px dashed rgba(255,255,255,.38)', padding: '7px 16px', borderRadius: 10, letterSpacing: '.08em' }}>ZYPHIX50</span>
            <button onClick={() => copy('ZYPHIX50')} style={{ background: G, color: '#fff', fontSize: 13, fontWeight: 800, padding: '9px 18px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 16px rgba(13,163,102,.4)` }}>
              {copied === 'ZYPHIX50' ? <><Check size={14} />Copied!</> : <><Copy size={14} />Copy Code</>}
            </button>
          </div>
        </div>
      </div>
      <Row title="All Offers" sub={`${promoCodes.length} active coupons`} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 12 }}>
        {promoCodes.map(o => {
          const c = copied === o.code;
          return (
            <div key={o.code} onClick={() => copy(o.code)} className="cursor-pointer"
              style={{ background: W, border: `1.5px solid ${c ? G : BD}`, borderRadius: 15, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, boxShadow: c ? `0 0 0 3px rgba(13,163,102,.12), ${SH}` : SH, transition: 'all .2s' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '.04em', color: G }}>{o.code}</span>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: T1, margin: '5px 0 3px' }}>{o.description}</p>
                <p style={{ fontSize: 11, color: T3 }}>Valid till 31 Dec 2025</p>
              </div>
              <button style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 9, background: c ? 'rgba(13,163,102,.08)' : BG, color: c ? G : T2, border: `1.5px solid ${c ? 'rgba(13,163,102,.25)' : BD}`, transition: 'all .15s' }}>
                {c ? <Check size={12} /> : <Copy size={12} />}
                {c ? 'Done' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>
      <div style={{ background: W, border: `1px solid ${BD}`, borderRadius: 18, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'space-between', boxShadow: SH }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: 'rgba(13,163,102,.08)', border: '1px solid rgba(13,163,102,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🎁</div>
          <div>
            <p style={{ fontWeight: 800, color: T1, fontSize: 15 }}>Refer & Earn ₹100</p>
            <p style={{ fontSize: 12.5, color: T2, marginTop: 3 }}>You & your friend both get ₹100 wallet credits instantly</p>
          </div>
        </div>
        <button style={{ background: G, color: '#fff', fontSize: 13.5, fontWeight: 800, padding: '11px 24px', borderRadius: 11, flexShrink: 0, boxShadow: `0 4px 14px rgba(13,163,102,.3)` }}>Share Now →</button>
      </div>
    </div>
  );
}

/* ═══════════════ PARTNER BRANDS ═══════════════ */

/* ── Faithful SVG brand-logo representations ── */
const BrandLogos: Record<string, React.ReactNode> = {
  Amul: (
    <svg viewBox="0 0 100 36" width={100} height={36}>
      <polygon points="18,2 30,2 36,13 30,24 18,24 12,13" fill="#1D6FB4"/>
      <text x="24" y="11" textAnchor="middle" fill="#FCD116" fontSize="5.5" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">UTTERLY</text>
      <text x="24" y="17" textAnchor="middle" fill="white" fontSize="5" fontWeight="700" fontFamily="Arial,sans-serif">BUTTERLY</text>
      <text x="24" y="23" textAnchor="middle" fill="#FCD116" fontSize="5" fontWeight="800" fontFamily="Arial,sans-serif">DELICIOUS</text>
      <text x="68" y="22" textAnchor="middle" fill="#1D6FB4" fontSize="20" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" letterSpacing="-1">Amul</text>
    </svg>
  ),
  Tata: (
    <svg viewBox="0 0 80 36" width={80} height={36}>
      <ellipse cx="40" cy="18" rx="37" ry="15" fill="none" stroke="#00285E" strokeWidth="2.5"/>
      <text x="40" y="23" textAnchor="middle" fill="#00285E" fontSize="14" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" letterSpacing="4">TATA</text>
    </svg>
  ),
  'Nestlé': (
    <svg viewBox="0 0 96 36" width={96} height={36}>
      <path d="M10 28 Q12 14 16 10 Q18 6 22 12 Q18 8 16 14 Q14 20 16 26" fill="#8B6F47" stroke="#8B6F47" strokeWidth="0.5"/>
      <path d="M14 14 Q18 10 22 14 M14 18 Q18 14 22 18" stroke="#8B6F47" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="16" cy="8" r="3" fill="#8B6F47"/>
      <circle cx="20" cy="6" r="2.5" fill="#8B6F47"/>
      <circle cx="24" cy="8" r="2" fill="#8B6F47"/>
      <text x="60" y="23" textAnchor="middle" fill="#1A1A1A" fontSize="18" fontWeight="700" fontFamily="Georgia,Times New Roman,serif" letterSpacing="-0.5">Nestlé</text>
    </svg>
  ),
  Britannia: (
    <svg viewBox="0 0 106 36" width={106} height={36}>
      <circle cx="18" cy="18" r="15" fill="#E42313"/>
      <text x="18" y="24" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="Georgia,serif">B</text>
      <text x="64" y="23" textAnchor="middle" fill="#E42313" fontSize="15" fontWeight="700" fontFamily="Georgia,Times New Roman,serif">Britannia</text>
    </svg>
  ),
  ITC: (
    <svg viewBox="0 0 74 36" width={74} height={36}>
      <rect x="2" y="4" width="70" height="28" rx="4" fill="none" stroke="#7B2335" strokeWidth="2.5"/>
      <rect x="6" y="8" width="62" height="20" rx="2" fill="#7B2335"/>
      <text x="37" y="23" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" letterSpacing="5">ITC</text>
    </svg>
  ),
  Haldirams: (
    <svg viewBox="0 0 108 36" width={108} height={36}>
      <path d="M8 26 L8 10 M8 18 L18 10 M18 10 L18 26" stroke="#E55126" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <text x="66" y="23" textAnchor="middle" fill="#E55126" fontSize="15" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Haldirams</text>
    </svg>
  ),
  Dabur: (
    <svg viewBox="0 0 84 36" width={84} height={36}>
      <path d="M8 30 Q8 8 14 6 Q10 10 12 18 Q14 8 16 12 Q12 14 14 22 Q18 12 18 26" fill="#007030" opacity="0.85"/>
      <circle cx="14" cy="5" r="3.5" fill="#007030"/>
      <text x="52" y="23" textAnchor="middle" fill="#007030" fontSize="18" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Dabur</text>
    </svg>
  ),
  Patanjali: (
    <svg viewBox="0 0 110 36" width={110} height={36}>
      <path d="M8 28 L14 6 L20 28 M10 20 L18 20" stroke="#F07800" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="14" cy="4" r="3" fill="#F07800"/>
      <text x="64" y="23" textAnchor="middle" fill="#F07800" fontSize="13.5" fontWeight="900" fontFamily="Arial,sans-serif">Patanjali</text>
    </svg>
  ),
  'P&G': (
    <svg viewBox="0 0 72 36" width={72} height={36}>
      <circle cx="20" cy="18" r="14" fill="none" stroke="#003DA5" strokeWidth="2.5"/>
      <circle cx="34" cy="18" r="14" fill="none" stroke="#003DA5" strokeWidth="2.5"/>
      <rect x="14" y="8" width="40" height="20" rx="0" fill="white"/>
      <text x="20" y="23" textAnchor="middle" fill="#003DA5" fontSize="13" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">P</text>
      <text x="36" y="23" textAnchor="middle" fill="#003DA5" fontSize="13" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">&amp;G</text>
      <circle cx="20" cy="18" r="14" fill="none" stroke="#003DA5" strokeWidth="2.5"/>
      <circle cx="34" cy="18" r="14" fill="none" stroke="#003DA5" strokeWidth="2.5"/>
    </svg>
  ),
  HUL: (
    <svg viewBox="0 0 80 36" width={80} height={36}>
      <path d="M12 4 Q12 32 12 32 M12 4 Q20 4 20 10 Q20 18 12 18 Q20 18 20 26 Q20 32 12 32" stroke="#00527E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M8 4 Q22 0 26 8 Q28 16 22 20 L28 32" stroke="#00527E" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      <text x="54" y="23" textAnchor="middle" fill="#00527E" fontSize="17" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">HUL</text>
    </svg>
  ),
  MDH: (
    <svg viewBox="0 0 76 36" width={76} height={36}>
      <circle cx="18" cy="18" r="15" fill="#C41230"/>
      <path d="M10 26 L14 10 L18 20 L22 10 L26 26" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="52" y="23" textAnchor="middle" fill="#C41230" fontSize="17" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">MDH</text>
    </svg>
  ),
  Fortune: (
    <svg viewBox="0 0 96 36" width={96} height={36}>
      <path d="M12 30 L12 8 M8 18 L16 18 M10 8 Q12 2 14 8" stroke="#EF4123" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M8 8 Q12 4 16 8" stroke="#EF4123" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <text x="58" y="23" textAnchor="middle" fill="#EF4123" fontSize="16" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Fortune</text>
    </svg>
  ),
  'Mother Dairy': (
    <svg viewBox="0 0 118 36" width={118} height={36}>
      <ellipse cx="16" cy="22" rx="10" ry="8" fill="none" stroke="#003A96" strokeWidth="2"/>
      <path d="M8 18 Q10 8 16 8 Q22 8 24 18" stroke="#003A96" strokeWidth="2" fill="#003A96" fillOpacity="0.15"/>
      <circle cx="12" cy="22" r="1.5" fill="#003A96"/>
      <circle cx="20" cy="22" r="1.5" fill="#003A96"/>
      <text x="70" y="23" textAnchor="middle" fill="#003A96" fontSize="13" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Mother Dairy</text>
    </svg>
  ),
  Godrej: (
    <svg viewBox="0 0 86 36" width={86} height={36}>
      <path d="M22 18 Q22 6 12 6 Q2 6 2 18 Q2 30 12 30 Q18 30 21 25 L16 25 Q14 27 12 27 Q6 27 5 18 Q6 9 12 9 Q18 9 19 15 L22 15 Z" fill="#1B2D4F"/>
      <text x="56" y="23" textAnchor="middle" fill="#1B2D4F" fontSize="16" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Godrej</text>
    </svg>
  ),
  Marico: (
    <svg viewBox="0 0 86 36" width={86} height={36}>
      <path d="M4 28 L8 8 L14 22 L20 8 L24 28" stroke="#E31837" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="56" y="23" textAnchor="middle" fill="#E31837" fontSize="16" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Marico</text>
    </svg>
  ),
};

const BRANDS = [
  { name: 'Amul',        color: '#1D6FB4' },
  { name: 'Tata',        color: '#00285E' },
  { name: 'Nestlé',      color: '#C8102E' },
  { name: 'Britannia',   color: '#E42313' },
  { name: 'ITC',         color: '#7B2335' },
  { name: 'Haldirams',   color: '#E55126' },
  { name: 'Dabur',       color: '#007030' },
  { name: 'Patanjali',   color: '#F07800' },
  { name: 'P&G',         color: '#003DA5' },
  { name: 'HUL',         color: '#00527E' },
  { name: 'MDH',         color: '#C41230' },
  { name: 'Fortune',     color: '#EF4123' },
  { name: 'Mother Dairy',color: '#003A96' },
  { name: 'Godrej',      color: '#1B2D4F' },
  { name: 'Marico',      color: '#E31837' },
];

function BrandsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const doubled = [...BRANDS, ...BRANDS];

  const onEnter = (i: number) => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused';
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      el.style.filter = idx === i ? 'none' : 'grayscale(1) opacity(0.3)';
      el.style.transform = idx === i ? 'translateY(-2px) scale(1.06)' : 'translateY(0) scale(1)';
    });
  };

  const onLeave = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running';
    itemRefs.current.forEach(el => {
      if (!el) return;
      el.style.filter = 'grayscale(1) opacity(0.3)';
      el.style.transform = 'translateY(0) scale(1)';
    });
  };

  return (
    <div style={{ background: W, borderTop: `1px solid ${BD}`, borderBottom: `1px solid ${BD}`, overflow: 'hidden', padding: '12px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flexShrink: 0, padding: '0 20px 0 16px', borderRight: `1px solid ${BD}`, marginRight: 0 }}>
          <p style={{ fontSize: 9, fontWeight: 800, color: T3, letterSpacing: '.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1.4 }}>Partner<br/>Brands</p>
        </div>
        <div style={{ overflow: 'hidden', flex: 1, maskImage: 'linear-gradient(to right, transparent, black 70px, black calc(100% - 70px), transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 70px, black calc(100% - 70px), transparent)' }}>
          <div ref={trackRef} style={{ display: 'flex', animation: 'marquee 42s linear infinite', width: 'max-content' }}>
            {doubled.map((b, i) => (
              <div
                key={i}
                ref={el => { itemRefs.current[i] = el; }}
                onMouseEnter={() => onEnter(i)}
                onMouseLeave={onLeave}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '6px 20px',
                  borderRight: `1px solid ${BD}`,
                  flexShrink: 0,
                  cursor: 'default',
                  filter: 'grayscale(1) opacity(0.3)',
                  transition: 'filter 0.22s ease, transform 0.22s ease',
                  height: 52,
                }}
              >
                {BrandLogos[b.name]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ EATS & BOOK PARTNER MARQUEES ═══════════════ */

const EatsBrandLogos: Record<string, React.ReactNode> = {
  "Domino's": (
    <svg viewBox="0 0 92 36" width={92} height={36}>
      <rect x="2" y="7" width="24" height="22" rx="3.5" fill="#fff" stroke="#006DB7" strokeWidth="2"/>
      <line x1="2" y1="18" x2="26" y2="18" stroke="#006DB7" strokeWidth="1.8"/>
      <circle cx="9.5" cy="12.5" r="2.2" fill="#006DB7"/>
      <circle cx="18.5" cy="23" r="2.2" fill="#006DB7"/>
      <text x="60" y="23" textAnchor="middle" fill="#006DB7" fontSize="13" fontWeight="700" fontFamily="Arial,sans-serif">domino's</text>
    </svg>
  ),
  "McDonald's": (
    <svg viewBox="0 0 94 36" width={94} height={36}>
      <path d="M4 28 L4 14 Q4 6 11 6 Q17 6 17 14 L17 18 L17 14 Q17 6 24 6 Q31 6 31 14 L31 28" stroke="#FFC72C" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="62" y="23" textAnchor="middle" fill="#DA291C" fontSize="12" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">McDonald's</text>
    </svg>
  ),
  KFC: (
    <svg viewBox="0 0 72 36" width={72} height={36}>
      <circle cx="18" cy="18" r="15" fill="#E8002D"/>
      <text x="18" y="23" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">KFC</text>
      <text x="46" y="23" textAnchor="middle" fill="#E8002D" fontSize="15" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">KFC</text>
    </svg>
  ),
  Subway: (
    <svg viewBox="0 0 100 36" width={100} height={36}>
      <rect x="1" y="7" width="98" height="22" rx="4" fill="#009B77"/>
      <text x="50" y="23" textAnchor="middle" fill="#FFC20E" fontSize="14" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" letterSpacing="2">SUBWAY</text>
    </svg>
  ),
  'Pizza Hut': (
    <svg viewBox="0 0 90 36" width={90} height={36}>
      <path d="M12 18 L20 6 L28 18 Z" fill="#EE3124"/>
      <rect x="11" y="17" width="18" height="12" rx="2" fill="#EE3124"/>
      <text x="60" y="23" textAnchor="middle" fill="#EE3124" fontSize="12.5" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Pizza Hut</text>
    </svg>
  ),
  'Burger King': (
    <svg viewBox="0 0 108 36" width={108} height={36}>
      <rect x="2" y="6" width="28" height="5" rx="2.5" fill="#FF8732"/>
      <rect x="2" y="14" width="28" height="8" rx="4" fill="#DA291C"/>
      <rect x="2" y="25" width="28" height="5" rx="2.5" fill="#FF8732"/>
      <text x="18" y="21" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="900" fontFamily="Arial,sans-serif">BK</text>
      <text x="72" y="23" textAnchor="middle" fill="#7B3D00" fontSize="12.5" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Burger King</text>
    </svg>
  ),
  'Wow Momo': (
    <svg viewBox="0 0 96 36" width={96} height={36}>
      <path d="M10 24 Q10 10 16 10 Q19 6 22 10 Q28 10 28 24 Q24 28 16 28 Q12 28 10 24Z" fill="#E94B4B"/>
      <path d="M14 16 Q18 12 22 16" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <text x="62" y="23" textAnchor="middle" fill="#E94B4B" fontSize="13" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Wow Momo</text>
    </svg>
  ),
  Haldirams: (
    <svg viewBox="0 0 108 36" width={108} height={36}>
      <path d="M8 26 L8 10 M8 18 L18 10 M18 10 L18 26" stroke="#E55126" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <text x="66" y="23" textAnchor="middle" fill="#E55126" fontSize="15" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Haldirams</text>
    </svg>
  ),
  Starbucks: (
    <svg viewBox="0 0 100 36" width={100} height={36}>
      <circle cx="18" cy="18" r="14" fill="#00704A"/>
      <path d="M18 8 L20 14 L26 14 L21 18 L23 24 L18 20 L13 24 L15 18 L10 14 L16 14 Z" fill="#fff"/>
      <text x="60" y="23" textAnchor="middle" fill="#00704A" fontSize="13" fontWeight="900" fontFamily="Arial,sans-serif">Starbucks</text>
    </svg>
  ),
  CCD: (
    <svg viewBox="0 0 78 36" width={78} height={36}>
      <path d="M8 26 Q4 26 4 18 Q4 10 8 10 L12 10 Q10 14 10 18 Q10 22 12 26Z" fill="#6F3D22"/>
      <path d="M8 30 Q28 30 28 18 Q28 8 22 6" stroke="#6F3D22" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="24" cy="5" r="2.5" fill="#6F3D22"/>
      <text x="52" y="23" textAnchor="middle" fill="#6F3D22" fontSize="16" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">CCD</text>
    </svg>
  ),
  Behrouz: (
    <svg viewBox="0 0 86 36" width={86} height={36}>
      <path d="M10 8 L14 4 L18 8 M14 4 L14 28" stroke="#8B1A2B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M8 28 L20 28" stroke="#8B1A2B" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="56" y="23" textAnchor="middle" fill="#8B1A2B" fontSize="14" fontWeight="900" fontFamily="Georgia,serif">Behrouz</text>
    </svg>
  ),
  Box8: (
    <svg viewBox="0 0 74 36" width={74} height={36}>
      <path d="M4 12 L14 7 L24 12 L24 24 L14 29 L4 24 Z" fill="#F05A22"/>
      <path d="M4 12 L14 17 L24 12 M14 17 L14 29" stroke="#fff" strokeWidth="1.5" fill="none"/>
      <text x="51" y="24" textAnchor="middle" fill="#F05A22" fontSize="18" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">b8</text>
    </svg>
  ),
  'Chai Point': (
    <svg viewBox="0 0 98 36" width={98} height={36}>
      <path d="M6 26 Q6 10 14 10 L22 10 Q30 10 30 18 Q30 26 22 26 L6 26" fill="none" stroke="#C2412D" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M30 16 Q34 14 34 18 Q34 22 30 20" stroke="#C2412D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <line x1="10" y1="30" x2="26" y2="30" stroke="#C2412D" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="64" y="23" textAnchor="middle" fill="#C2412D" fontSize="13" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Chai Point</text>
    </svg>
  ),
  'Biryani Blues': (
    <svg viewBox="0 0 112 36" width={112} height={36}>
      <path d="M4 28 Q4 10 14 10 Q18 6 22 10 Q32 10 32 28 L4 28" fill="#2E4A86"/>
      <path d="M8 20 Q18 16 28 20" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <text x="73" y="23" textAnchor="middle" fill="#2E4A86" fontSize="12.5" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Biryani Blues</text>
    </svg>
  ),
  'Barbeque Nation': (
    <svg viewBox="0 0 130 36" width={130} height={36}>
      <path d="M12 28 Q10 22 12 16 Q14 10 16 16 Q18 10 20 16 Q22 10 24 16 Q26 22 24 28" stroke="#8B0000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M10 30 L26 30" stroke="#8B0000" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="79" y="23" textAnchor="middle" fill="#8B0000" fontSize="12.5" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif">Barbeque Nation</text>
    </svg>
  ),
};

const EATS_MARQUEE = [
  { name: "Domino's",        color: '#006DB7' },
  { name: "McDonald's",      color: '#DA291C' },
  { name: 'KFC',             color: '#E8002D' },
  { name: 'Subway',          color: '#009B77' },
  { name: 'Pizza Hut',       color: '#EE3124' },
  { name: 'Burger King',     color: '#FF8732' },
  { name: 'Wow Momo',        color: '#E94B4B' },
  { name: 'Haldirams',       color: '#E55126' },
  { name: 'Starbucks',       color: '#00704A' },
  { name: 'CCD',             color: '#6F3D22' },
  { name: 'Behrouz',         color: '#8B1A2B' },
  { name: 'Box8',            color: '#F05A22' },
  { name: 'Chai Point',      color: '#C2412D' },
  { name: 'Biryani Blues',   color: '#2E4A86' },
  { name: 'Barbeque Nation', color: '#8B0000' },
];


function TabMarquee({ logos, items, label }: {
  logos: Record<string, React.ReactNode>;
  items: Array<{ name: string; color: string }>;
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const doubled = [...items, ...items];

  const onEnter = (i: number) => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused';
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      el.style.filter = idx === i ? 'none' : 'grayscale(1) opacity(0.3)';
      el.style.transform = idx === i ? 'translateY(-2px) scale(1.06)' : 'translateY(0) scale(1)';
    });
  };

  const onLeave = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running';
    itemRefs.current.forEach(el => {
      if (!el) return;
      el.style.filter = 'grayscale(1) opacity(0.3)';
      el.style.transform = 'translateY(0) scale(1)';
    });
  };

  return (
    <div style={{ background: W, border: `1px solid ${BD}`, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
        <div style={{ flexShrink: 0, padding: '0 20px 0 16px', borderRight: `1px solid ${BD}` }}>
          <p style={{ fontSize: 9, fontWeight: 800, color: T3, letterSpacing: '.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
            {label.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
            ))}
          </p>
        </div>
        <div style={{ overflow: 'hidden', flex: 1, maskImage: 'linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)' }}>
          <div ref={trackRef} style={{ display: 'flex', animation: 'marquee 36s linear infinite', width: 'max-content' }}>
            {doubled.map((b, i) => (
              <div
                key={i}
                ref={el => { itemRefs.current[i] = el; }}
                onMouseEnter={() => onEnter(i)}
                onMouseLeave={onLeave}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '6px 20px',
                  borderRight: `1px solid ${BD}`,
                  flexShrink: 0,
                  cursor: 'default',
                  filter: 'grayscale(1) opacity(0.3)',
                  transition: 'filter 0.22s ease, transform 0.22s ease',
                  height: 52,
                }}
              >
                {logos[b.name]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ HOW IT WORKS ═══════════════ */
function HowItWorks() {
  const steps = [
    {
      n: '01', title: 'Set your location',
      desc: 'Enter your address or allow GPS. We instantly surface verified kirana stores, restaurants and pharmacies within your delivery radius.',
      icon: <MapPin size={20} color={G} />,
      img: 'https://images.unsplash.com/photo-1512291313931-d4291048e7b6?w=480&h=300&fit=crop&q=85',
    },
    {
      n: '02', title: 'Browse & place order',
      desc: 'Choose from 1,000+ grocery items, local restaurants or neighbourhood pharmacies — all in one unified app with real-time stock.',
      icon: <ShoppingCart size={20} color={G} />,
      img: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=480&h=300&fit=crop&q=85',
    },
    {
      n: '03', title: 'Delivered in under 30 minutes',
      desc: 'Track your order live. Our hyperlocal riders pick up from the nearest partner store and reach your door — guaranteed no surge pricing, ever.',
      icon: <Zap size={20} color='#fff' />,
      img: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=480&h=300&fit=crop&q=85',
      highlight: true,
    },
  ];
  return (
    <div style={{ background: W, borderTop: `1px solid ${BD}`, padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 24, marginBottom: 52 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(13,163,102,.12)', border: '1px solid rgba(13,163,102,.3)', borderRadius: 999, padding: '4px 12px', marginBottom: 16 }}>
              <Zap size={11} color={G} fill={G} />
              <span style={{ fontSize: 11, fontWeight: 700, color: G, letterSpacing: '.08em', textTransform: 'uppercase' }}>How it works</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', color: T1, letterSpacing: '-.05em', lineHeight: 1.05, margin: 0 }}>
              Order to doorstep<br />
              <span style={{ color: G }}>in under 30 minutes.</span>
            </h2>
          </div>
          <p style={{ fontSize: 14, color: T2, maxWidth: 260, lineHeight: 1.7, marginBottom: 4, textAlign: 'right' }}>
            Three steps. Zero complexity.<br />Hyperlocal delivery built for India.
          </p>
        </div>

        {/* Step cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 48 }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.13, duration: 0.42 }}>
              <div
                style={{
                  borderRadius: 24, overflow: 'hidden', height: '100%',
                  background: s.highlight ? `linear-gradient(145deg, #065F46 0%, ${G} 100%)` : W,
                  border: s.highlight ? 'none' : `1px solid ${BD}`,
                  boxShadow: s.highlight ? '0 16px 48px rgba(13,163,102,.25)' : SH,
                  transition: 'transform .22s, box-shadow .22s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = s.highlight ? '0 24px 64px rgba(13,163,102,.35)' : SH2; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = s.highlight ? '0 16px 48px rgba(13,163,102,.25)' : SH; }}
              >
                {/* Image */}
                <div style={{ height: 188, overflow: 'hidden', position: 'relative' }}>
                  <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }} />
                  <div style={{ position: 'absolute', inset: 0, background: s.highlight ? 'rgba(6,95,70,.45)' : 'linear-gradient(180deg,transparent 50%,rgba(0,0,0,.18) 100%)' }} />
                  {/* Step number */}
                  <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '2.4rem', color: s.highlight ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.55)', letterSpacing: '-.04em', lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,.25)' }}>{s.n}</div>
                  {/* Icon badge */}
                  <div style={{ position: 'absolute', bottom: 16, right: 16, width: 40, height: 40, borderRadius: 12, background: s.highlight ? G : 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,.15)' }}>
                    {s.icon}
                  </div>
                </div>
                {/* Body */}
                <div style={{ padding: '22px 24px 28px' }}>
                  <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 16.5, letterSpacing: '-.025em', color: s.highlight ? '#fff' : T1, marginBottom: 10, lineHeight: 1.25 }}>{s.title}</h3>
                  <p style={{ fontSize: 13.5, color: s.highlight ? 'rgba(255,255,255,.75)' : T2, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                  {s.highlight && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 18, background: 'rgba(255,255,255,.12)', borderRadius: 999, padding: '5px 12px', border: '1px solid rgba(255,255,255,.2)' }}>
                      <Check size={11} color='#fff' />
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>Zero surge pricing · Always</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <div style={{ background: T1, borderRadius: 22, padding: '32px 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { v: '< 30 min', l: 'Guaranteed delivery time', icon: <Zap size={16} color={G} fill={G} />, accent: G },
            { v: '4.8 / 5', l: 'Average customer rating', icon: <Star size={16} color='#F59E0B' fill='#F59E0B' />, accent: '#F59E0B' },
            { v: '200+', l: 'Partner stores across India', icon: <Package size={16} color='#60A5FA' />, accent: '#60A5FA' },
            { v: '₹0', l: 'Surge pricing — ever', icon: <Shield size={16} color='#A78BFA' />, accent: '#A78BFA' },
          ].map(({ v, l, icon, accent }, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * .07 }}>
              <div style={{ padding: '0 28px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,.08)' : 'none', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                  </div>
                </div>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.4rem,2.5vw,1.75rem)', color: accent, letterSpacing: '-.04em', lineHeight: 1, marginBottom: 6 }}>{v}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', fontWeight: 500, lineHeight: 1.4 }}>{l}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ SOCIAL PROOF ═══════════════ */
function SocialProof() {
  return (
    <div style={{ background: BG, borderTop: `1px solid ${BD}`, padding: '52px 0' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: G, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Trusted by millions</p>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: T1, letterSpacing: '-.04em', lineHeight: 1.08 }}>
            What our customers say
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {[
            { name: 'Priya Sharma', city: 'Delhi', rating: 5, text: 'Ordered groceries at 11pm and they arrived in 28 minutes. Unbelievable! The app is so smooth and the prices are the same as my local kirana.' },
            { name: 'Rahul Verma', city: 'Mumbai', rating: 5, text: 'Ordered from my favourite biryani place on ZyphixEats — they delivered in 22 minutes. The food was hot, the app was smooth, and the price was the same as eating there.' },
            { name: 'Anjali Patel', city: 'Bengaluru', rating: 5, text: 'ZyphixEats is my go-to for ordering from that small biryani place nearby. They\'re not on Swiggy but they\'re on Zyphix. Love that!' },
          ].map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }}>
              <div style={{ background: W, border: `1px solid ${BD}`, borderRadius: 20, padding: '24px 22px', boxShadow: SH, height: '100%' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} fill="#D97706" color="#D97706" />)}
                </div>
                <p style={{ fontSize: 14, color: T1, lineHeight: 1.7, marginBottom: 20, fontWeight: 400 }}>"{r.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `rgba(13,163,102,.1)`, border: '1px solid rgba(13,163,102,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: G, fontSize: 14 }}>{r.name[0]}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: T1, fontSize: 13 }}>{r.name}</p>
                    <p style={{ fontSize: 11, color: T3 }}>{r.city}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Media mentions */}
        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: T3, marginRight: 8 }}>AS FEATURED IN</span>
          {['The Hindu', 'Economic Times', 'YourStory', 'Inc42', 'Entrackr'].map(m => (
            <span key={m} style={{ padding: '6px 16px', background: W, border: `1px solid ${BD}`, borderRadius: 8, fontSize: 12, fontWeight: 700, color: T2, boxShadow: SH }}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ APP COMING SOON ═══════════════ */
function AppDownload() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyError, setNotifyError] = useState('');

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotifyError('Please enter a valid email address.');
      return;
    }
    setNotifyLoading(true);
    setNotifyError('');
    try {
      const res = await apiFetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || 'Something went wrong.');
      }
      setSubmitted(true);
    } catch (err) {
      setNotifyError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setNotifyLoading(false);
    }
  };

  return (
    <div id="app-download" style={{ background: W, borderTop: `1px solid ${BD}`, padding: '60px 0' }}>
      <style>{`
        @keyframes zBlobA { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.18) translate(20px,-15px)} }
        @keyframes zBlobB { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.12) translate(-18px,12px)} }
        @keyframes zBlobC { 0%,100%{transform:scale(1)} 50%{transform:scale(1.22)} }
        @keyframes zFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes zFloat2 { 0%,100%{transform:translateY(-10px)} 50%{transform:translateY(4px)} }
        @keyframes zPulse { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
        @keyframes zSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes zShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      `}</style>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #020D08 0%, #041A10 40%, #062210 100%)',
          borderRadius: 28, overflow: 'hidden', position: 'relative',
          border: '1px solid rgba(13,163,102,0.25)',
          boxShadow: '0 0 0 1px rgba(13,163,102,0.1), 0 40px 80px rgba(0,0,0,0.5)',
        }}>
          {/* ── Animated blobs ── */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-30%', left: '-10%', width: '55%', height: '180%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,163,102,0.28) 0%, transparent 65%)', animation: 'zBlobA 9s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '-40%', right: '-5%', width: '50%', height: '160%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,217,126,0.18) 0%, transparent 65%)', animation: 'zBlobB 11s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: '20%', right: '25%', width: '30%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)', animation: 'zBlobC 13s ease-in-out infinite' }} />
            {/* Grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(13,163,102,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(13,163,102,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            {/* Floating dots */}
            {[
              { top: '15%', left: '12%', size: 5, delay: '0s', dur: '4s' },
              { top: '60%', left: '6%', size: 3, delay: '1s', dur: '5s' },
              { top: '80%', left: '20%', size: 4, delay: '2s', dur: '3.5s' },
              { top: '25%', right: '18%', size: 5, delay: '.5s', dur: '4.5s' },
              { top: '70%', right: '12%', size: 3, delay: '1.5s', dur: '5.5s' },
            ].map((d, i) => (
              <div key={i} style={{ position: 'absolute', ...d, width: d.size, height: d.size, borderRadius: '50%', background: '#00D97E', opacity: .5, animation: `zPulse ${d.dur} ${d.delay} ease-in-out infinite` }} />
            ))}
          </div>

          {/* ── Content grid ── */}
          <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 40, padding: 'clamp(36px,5vw,60px) clamp(24px,5vw,60px)' }}>

            {/* ── Left: text + form ── */}
            <div style={{ flex: '1 1 440px', minWidth: 0 }}>

              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,163,102,0.15)', border: '1px solid rgba(13,163,102,0.35)', borderRadius: 99, padding: '6px 16px', marginBottom: 24 }}>
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#00D97E', animation: 'zPulse 1.6s ease-in-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#00D97E', letterSpacing: '.1em' }}>COMING SOON ON iOS & ANDROID</span>
              </div>

              {/* Headline */}
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', lineHeight: 1.06, fontSize: 'clamp(1.9rem,3.5vw,3rem)', letterSpacing: '-.05em', marginBottom: 14 }}>
                The Zyphix app is<br />
                <span style={{
                  background: 'linear-gradient(90deg, #00D97E 0%, #34D399 40%, #6EE7B7 70%, #00D97E 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'zShimmer 3s linear infinite',
                }}>
                  on its way.
                </span>
              </h2>

              {/* Sub */}
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>
                Stay tuned — we're bringing hyperlocal delivery to your fingertips. Groceries, food, local services — all in one app. Register now to get exclusive early-access perks.
              </p>

              {/* Feature chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                {['⚡ 30-min delivery', '🍱 Local food', '📍 Live tracking', '🏷️ App-only deals', '🔔 Push alerts'].map(f => (
                  <span key={f} style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, padding: '5px 13px' }}>{f}</span>
                ))}
              </div>

              {/* Store badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
                {[
                  { icon: <svg width="24" height="24" viewBox="0 0 814 1000" fill="white"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.2-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.2 135.4-316.8 268.9-316.8 71 0 130.1 46.3 173.4 46.3 41.7 0 107.7-50.4 185.3-50.4 30.9 0 108.2 2.6 168.2 81.4zm-90.5-185.3c33.5-39.8 57-94.8 57-150.8 0-7.7-.7-15.4-2-22.5-53.7 2-117.3 35.7-157.4 80.7-34.5 39.2-64.4 94.8-64.4 153.6 0 8.4 1.3 16.7 1.9 19.2 3.5.6 9 1.3 14.5 1.3 47.7 0 105.4-31.9 150.4-81.5z"/></svg>, sub: 'Download on the', title: 'App Store' },
                  { icon: <svg width="24" height="24" viewBox="0 0 512 512" fill="none"><path d="M48 432c0 17.7 19.3 28 34.3 18.9L416 272v-32L82.3 61.1C67.3 52 48 62.3 48 80v352z" fill="#4285F4"/><path d="M48 80c0-17.7 19.3-28 34.3-18.9L282 181l-52 52L48 80z" fill="#34A853"/><path d="M230 181l52-52 100.4 60.6-52 52L230 181z" fill="#FBBC05"/><path d="M282 331 82.3 449.9C67.3 459 48 448.7 48 431l182-153 52 53z" fill="#EA4335"/></svg>, sub: 'Get it on', title: 'Google Play' },
                ].map(b => (
                  <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 18px', borderRadius: 13, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', opacity: .75 }}>
                    {b.icon}
                    <div>
                      <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 500, lineHeight: 1 }}>{b.sub}</p>
                      <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{b.title}</p>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#00D97E', background: 'rgba(0,217,126,0.15)', padding: '2px 6px', borderRadius: 4, letterSpacing: '.06em', marginLeft: 4 }}>SOON</span>
                  </div>
                ))}
              </div>

              {/* Email form */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: '22px 24px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>🔔 Get notified at launch</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Drop your email — we'll ping you the moment the app goes live with an exclusive launch offer.</p>
                {!submitted ? (
                  <form onSubmit={handleNotify} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setNotifyError(''); }}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      placeholder="your@email.com"
                      disabled={notifyLoading}
                      style={{
                        flex: 1, minWidth: 180, padding: '12px 16px', borderRadius: 11, fontSize: 13.5,
                        color: '#fff', background: inputFocused ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
                        border: `1.5px solid ${notifyError ? '#EF4444' : inputFocused ? 'rgba(13,163,102,0.6)' : 'rgba(255,255,255,0.1)'}`,
                        outline: 'none', fontFamily: 'inherit', transition: 'all .15s', boxSizing: 'border-box',
                      }}
                    />
                    <button type="submit" disabled={notifyLoading} style={{
                      padding: '12px 22px', borderRadius: 11, fontSize: 14, fontWeight: 800,
                      background: notifyLoading ? 'rgba(13,163,102,0.5)' : 'linear-gradient(135deg, #0DA366 0%, #00D97E 100%)',
                      color: '#fff', border: 'none', cursor: notifyLoading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                      boxShadow: '0 8px 24px rgba(13,163,102,0.4)', fontFamily: 'inherit',
                    }}>
                      {notifyLoading ? 'Sending…' : 'Notify Me →'}
                    </button>
                    {notifyError && <p style={{ width: '100%', fontSize: 12, color: '#EF4444', margin: '-4px 0 0' }}>{notifyError}</p>}
                  </form>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'rgba(13,163,102,0.15)', border: '1.5px solid rgba(13,163,102,0.35)', borderRadius: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#0DA366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✓</div>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>You're on the list!</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>We'll email you the moment the app drops. 🚀</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: phone mockups ── */}
            <div style={{ flex: '0 1 320px', display: 'flex', gap: 18, justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 12, flexShrink: 0 }}>
              {[
                { icon: '🛒', label: 'Zyphix Now', color: '#0DA366', anim: 'zFloat 4s ease-in-out infinite', top: 0 },
                { icon: '🍱', label: 'Zyphix Eats', color: '#F97316', anim: 'zFloat2 3.5s ease-in-out infinite', top: -24 },
              ].map(p => (
                <div key={p.label} style={{ animation: p.anim }}>
                  <div style={{
                    width: 120, height: 240, borderRadius: 26,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative', overflow: 'hidden', marginTop: p.top,
                    boxShadow: `0 28px 56px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)`,
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 40%, ${p.color}22, transparent 70%)` }} />
                    <div style={{ position: 'absolute', top: 10, width: 36, height: 7, borderRadius: 4, background: 'rgba(0,0,0,0.4)' }} />
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(145deg, ${p.color}44, ${p.color}18)`, border: `1px solid ${p.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{p.icon}</div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '.03em' }}>{p.label}</p>
                    <div style={{ position: 'absolute', bottom: 12, width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom stats bar ── */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '20px clamp(24px,5vw,60px)', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
              {[['3,200+', 'Pre-registered'], ['iOS + Android', 'Both platforms'], ['Q2 2025', 'Target launch'], ['50% OFF', 'Launch day deal']].map(([v, l]) => (
                <div key={l}>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', fontSize: '1.1rem', letterSpacing: '-.03em' }}>{v}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontWeight: 500 }}>{l}</p>
                </div>
              ))}
            </div>
            <Link href="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#00D97E', textDecoration: 'none' }}>
              See full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ FOOTER ═══════════════ */
function Footer() {
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const [, setLoc] = useLocation();
  const FOOTER_COLS = [
    {
      t: 'Services',
      links: [
        { l: 'Zyphix Now',      onClick: () => scroll('quick-browse') },
        { l: 'Zyphix Eats',     onClick: () => scroll('quick-browse') },
        { l: 'Stores Near Me',  onClick: () => scroll('stores') },
        { l: 'Offers',          onClick: () => scroll('offers') },
      ],
    },
    {
      t: 'Company',
      links: [
        { l: 'About Us',   href: '/about' },
        { l: 'Careers',    href: 'https://wa.me/919682394363?text=Hi%2C%20I%27m%20interested%20in%20career%20opportunities%20at%20Zyphix%20%2F%20Clavix%20Technologies.', ext: true },
        { l: 'Press Kit',  href: 'https://wa.me/919682394363?text=Hi%2C%20I%27d%20like%20to%20request%20the%20Zyphix%20Press%20Kit.', ext: true },
        { l: 'Blog',       href: '/blog' },
        { l: 'Investors',  href: '/investors' },
      ],
    },
    {
      t: 'Support',
      links: [
        { l: 'Help Center',       href: 'https://wa.me/919682394363?text=Hi%2C%20I%20need%20help%20with%20Zyphix.', ext: true },
        { l: 'Contact Us',        href: '/contact' },
        { l: 'Refund Policy',     href: '/terms' },
        { l: 'Privacy Policy',    href: '/privacy' },
        { l: 'Terms of Service',  href: '/terms' },
      ],
    },
  ] as const;

  return (
    <footer style={{ background: DARK }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '52px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 44 }}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <LogoMark size={30} dark />
            </div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.4)', lineHeight: 1.7, marginBottom: 10, maxWidth: 260 }}>India's SuperLocal App — groceries &amp; food delivered from kirana stores near you.</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.28)', lineHeight: 1.6, marginBottom: 22, maxWidth: 260 }}>Now live across India · More cities being added every week</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {([
                { ic: <Twitter size={14} />,   href: 'https://twitter.com/zyphixin' },
                { ic: <Instagram size={14} />, href: 'https://instagram.com/zyphixin' },
                { ic: <Linkedin size={14} />,  href: 'https://linkedin.com/in/rahulsangral' },
                { ic: <Phone size={14} />,     href: 'https://wa.me/919682394363' },
              ] as { ic: React.ReactNode; href: string }[]).map(({ ic, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.4)', transition: 'all .15s', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.14)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.07)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.4)'; }}>
                  {ic}
                </a>
              ))}
            </div>
          </div>
          {FOOTER_COLS.map(({ t, links }) => (
            <div key={t}>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: 13, marginBottom: 16 }}>{t}</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {links.map(item => {
                  const btnStyle = { fontSize: 13, color: 'rgba(255,255,255,.38)', transition: 'color .15s', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', textAlign: 'left' as const };
                  const aStyle = { fontSize: 13, color: 'rgba(255,255,255,.38)', transition: 'color .15s', textDecoration: 'none', cursor: 'pointer' };
                  const hover = (e: React.MouseEvent, on: boolean) => (e.currentTarget as HTMLElement).style.color = on ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.38)';
                  return (
                    <li key={item.l}>
                      {'ext' in item && (item as any).ext ? (
                        <a href={(item as any).href} target="_blank" rel="noopener noreferrer" style={aStyle}
                          onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>{item.l}</a>
                      ) : 'href' in item ? (
                        <button onClick={() => setLoc((item as any).href)} style={btnStyle}
                          onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>{item.l}</button>
                      ) : (
                        <button onClick={(item as any).onClick} style={btnStyle}
                          onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>{item.l}</button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.28)' }}>
            © 2026{' '}
            <a href="https://clavix.in" target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,.42)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,.18)', paddingBottom: 1, transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.75)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.42)'}>
              Clavix Technologies Pvt. Ltd.
            </a>
            {' '}· All rights reserved
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: G, display: 'block' }} />
            <p style={{ fontSize: 12, fontWeight: 600, color: G }}>All systems operational</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════ QUICK BROWSE ═══════════════ */
const GROC_CATS = [
  { e: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop&q=85', n: 'Fruits & Veg',  bg: '#ECFDF5', bd: '#A7F3D0', tc: '#065F46' },
  { e: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop&q=85',   n: 'Dairy & Eggs',  bg: '#F0F9FF', bd: '#BAE6FD', tc: '#0C4A6E' },
  { e: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop&q=85', n: 'Snacks',        bg: '#FFFBEB', bd: '#FDE68A', tc: '#78350F' },
  { e: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&q=85', n: 'Pharmacy',      bg: '#FDF4FF', bd: '#E9D5FF', tc: '#581C87' },
  { e: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop&q=85', n: 'Grains & Dal',  bg: '#FFFBEB', bd: '#FCD34D', tc: '#713F12' },
  { e: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop&q=85', n: 'Bakery',        bg: '#FFF7ED', bd: '#FED7AA', tc: '#9A3412' },
  { e: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&h=200&fit=crop&q=85', n: 'Household',     bg: '#F5F3FF', bd: '#DDD6FE', tc: '#4C1D95' },
  { e: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop&q=85', n: 'Personal Care', bg: '#F0FDFA', bd: '#99F6E4', tc: '#134E4A' },
];
const FOOD_CATS = [
  { e: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop&q=85', n: 'Biryani',       bg: '#FFF7ED', bd: '#FED7AA', tc: '#9A3412' },
  { e: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop&q=85', n: 'Pizza',         bg: '#FFF1F2', bd: '#FECDD3', tc: '#9F1239' },
  { e: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&q=85', n: 'Burgers',       bg: '#FFFBEB', bd: '#FDE68A', tc: '#78350F' },
  { e: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop&q=85', n: 'Thali',         bg: '#F0FDF4', bd: '#BBF7D0', tc: '#14532D' },
  { e: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop&q=85',   n: 'Chai & Drinks', bg: '#FDF4FF', bd: '#E9D5FF', tc: '#581C87' },
  { e: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop&q=85',   n: 'Desserts',      bg: '#FFF1F2', bd: '#FECDD3', tc: '#9F1239' },
  { e: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&q=85', n: 'Healthy',       bg: '#ECFDF5', bd: '#A7F3D0', tc: '#065F46' },
  { e: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop&q=85', n: 'Street Food',   bg: '#FFFBEB', bd: '#FDE68A', tc: '#78350F' },
];

/* ═══════════ ALL CATEGORIES (for modal) ═══════════ */
const ALL_GROC_CATS = [
  { e: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop&q=85', n: 'Fruits & Veg',        bg: '#ECFDF5', bd: '#A7F3D0', tc: '#065F46' },
  { e: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop&q=85',   n: 'Dairy & Eggs',        bg: '#F0F9FF', bd: '#BAE6FD', tc: '#0C4A6E' },
  { e: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop&q=85', n: 'Snacks & Munchies',   bg: '#FFFBEB', bd: '#FDE68A', tc: '#78350F' },
  { e: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&q=85', n: 'Pharmacy',            bg: '#FDF4FF', bd: '#E9D5FF', tc: '#581C87' },
  { e: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop&q=85', n: 'Atta, Rice & Dal',    bg: '#FFFBEB', bd: '#FCD34D', tc: '#713F12' },
  { e: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop&q=85', n: 'Bakery & Biscuits',   bg: '#FFF7ED', bd: '#FED7AA', tc: '#9A3412' },
  { e: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&h=200&fit=crop&q=85', n: 'Household',           bg: '#F5F3FF', bd: '#DDD6FE', tc: '#4C1D95' },
  { e: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop&q=85', n: 'Personal Care',       bg: '#F0FDFA', bd: '#99F6E4', tc: '#134E4A' },
  { e: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop&q=85',   n: 'Cold Drinks & Juices', bg: '#EFF6FF', bd: '#BFDBFE', tc: '#1E40AF' },
  { e: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&q=85',   n: 'Tea & Coffee',         bg: '#FFF7ED', bd: '#FED7AA', tc: '#92400E' },
  { e: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=200&h=200&fit=crop&q=85', n: 'Breakfast & Soya',    bg: '#ECFDF5', bd: '#A7F3D0', tc: '#14532D' },
  { e: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop&q=85', n: 'Baby Care',           bg: '#FFF1F2', bd: '#FECDD3', tc: '#9F1239' },
  { e: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop&q=85', n: 'Pet Care',            bg: '#FFF7ED', bd: '#FED7AA', tc: '#9A3412' },
  { e: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop&q=85', n: 'Frozen Food',         bg: '#F0F9FF', bd: '#BAE6FD', tc: '#075985' },
  { e: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop&q=85',   n: 'Ice Creams',          bg: '#FDF4FF', bd: '#E9D5FF', tc: '#7E22CE' },
  { e: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=200&fit=crop&q=85', n: 'Chocolates & Sweets', bg: '#FFF1F2', bd: '#FECDD3', tc: '#9F1239' },
  { e: 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=200&h=200&fit=crop&q=85', n: 'Dry Fruits & Nuts',   bg: '#FFFBEB', bd: '#FDE68A', tc: '#78350F' },
  { e: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop&q=85', n: 'Oils & Ghee',         bg: '#FEFCE8', bd: '#FEF08A', tc: '#713F12' },
  { e: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop&q=85', n: 'Masalas & Spices',    bg: '#FFF7ED', bd: '#FED7AA', tc: '#9A3412' },
  { e: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=200&h=200&fit=crop&q=85',   n: 'Meat & Seafood',      bg: '#FFF1F2', bd: '#FECDD3', tc: '#881337' },
  { e: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&q=85', n: 'Electronics',         bg: '#F1F5F9', bd: '#CBD5E1', tc: '#1E293B' },
  { e: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&q=85',   n: 'Kitchen & Dining',    bg: '#ECFDF5', bd: '#A7F3D0', tc: '#064E3B' },
  { e: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&q=85', n: 'Health & Wellness',   bg: '#F0FDF4', bd: '#BBF7D0', tc: '#14532D' },
  { e: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop&q=85', n: 'Paan Corner',         bg: '#ECFDF5', bd: '#6EE7B7', tc: '#065F46' },
];

const ALL_FOOD_CATS = [
  { e: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop&q=85', n: 'Biryani',             bg: '#FFF7ED', bd: '#FED7AA', tc: '#9A3412' },
  { e: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop&q=85', n: 'Pizza',               bg: '#FFF1F2', bd: '#FECDD3', tc: '#9F1239' },
  { e: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&q=85', n: 'Burgers',             bg: '#FFFBEB', bd: '#FDE68A', tc: '#78350F' },
  { e: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop&q=85', n: 'Thali',               bg: '#F0FDF4', bd: '#BBF7D0', tc: '#14532D' },
  { e: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop&q=85',   n: 'Chai & Snacks',       bg: '#FDF4FF', bd: '#E9D5FF', tc: '#581C87' },
  { e: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop&q=85',   n: 'Desserts & Cakes',    bg: '#FFF1F2', bd: '#FECDD3', tc: '#9F1239' },
  { e: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&q=85', n: 'Healthy Food',        bg: '#ECFDF5', bd: '#A7F3D0', tc: '#065F46' },
  { e: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop&q=85', n: 'Street Food',         bg: '#FFFBEB', bd: '#FDE68A', tc: '#78350F' },
  { e: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&q=85',   n: 'North Indian',        bg: '#FFFBEB', bd: '#FCD34D', tc: '#713F12' },
  { e: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&h=200&fit=crop&q=85', n: 'South Indian',        bg: '#FFF7ED', bd: '#FED7AA', tc: '#9A3412' },
  { e: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&h=200&fit=crop&q=85',   n: 'Chinese',             bg: '#FFF1F2', bd: '#FECDD3', tc: '#9F1239' },
  { e: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200&h=200&fit=crop&q=85', n: 'Momos',               bg: '#F0F9FF', bd: '#BAE6FD', tc: '#0C4A6E' },
  { e: 'https://images.unsplash.com/photo-1509722747041-616f39b57ef3?w=200&h=200&fit=crop&q=85', n: 'Rolls & Wraps',       bg: '#ECFDF5', bd: '#A7F3D0', tc: '#065F46' },
  { e: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=200&h=200&fit=crop&q=85',   n: 'Sandwiches',          bg: '#FFF7ED', bd: '#FED7AA', tc: '#92400E' },
  { e: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop&q=85',   n: 'Ice Cream',           bg: '#FDF4FF', bd: '#E9D5FF', tc: '#7E22CE' },
  { e: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop&q=85',   n: 'Juices & Drinks',     bg: '#EFF6FF', bd: '#BFDBFE', tc: '#1E40AF' },
  { e: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop&q=85', n: 'Breakfast',           bg: '#ECFDF5', bd: '#A7F3D0', tc: '#14532D' },
  { e: 'https://images.unsplash.com/photo-1548940740-204726a19be3?w=200&h=200&fit=crop&q=85',   n: 'Pasta & Noodles',     bg: '#FFF7ED', bd: '#FED7AA', tc: '#9A3412' },
  { e: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=200&h=200&fit=crop&q=85', n: 'Paratha & Roti',      bg: '#FFFBEB', bd: '#FDE68A', tc: '#78350F' },
  { e: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop&q=85',   n: 'Fast Food',           bg: '#FFF1F2', bd: '#FECDD3', tc: '#9F1239' },
  { e: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=200&h=200&fit=crop&q=85', n: 'Seafood',             bg: '#F0F9FF', bd: '#BAE6FD', tc: '#075985' },
  { e: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=200&fit=crop&q=85', n: 'Mughlai',             bg: '#FFFBEB', bd: '#FCD34D', tc: '#713F12' },
  { e: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop&q=85', n: 'Pizzas & Pastas',     bg: '#FFF1F2', bd: '#FECDD3', tc: '#881337' },
  { e: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop&q=85', n: 'Dhabas',              bg: '#ECFDF5', bd: '#A7F3D0', tc: '#064E3B' },
];

/* ═══════════ CATEGORY MODAL ═══════════ */
function CategoryModal({ open, onClose, type, navigate }: { open: boolean; onClose: () => void; type: 'grocery' | 'food'; navigate: (path: string) => void }) {
  const cats = type === 'grocery' ? ALL_GROC_CATS : ALL_FOOD_CATS;
  const accent = type === 'grocery' ? G : '#EA580C';
  const title = type === 'grocery' ? 'Shop Groceries' : 'Order Food';
  const sub = type === 'grocery' ? `${cats.length} categories · tap to browse products` : `${cats.length} cuisines · tap to see restaurants & menus`;
  const dest = type === 'grocery' ? '/now' : '/eats';
  const lsKey = type === 'grocery' ? 'zyphix_groc_cat' : 'zyphix_food_cat';

  const handleCatClick = (catName: string) => {
    try { localStorage.setItem(lsKey, catName); } catch {}
    onClose();
    navigate(dest);
  };

  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={onClose}>
      {/* Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)' }} />

      {/* Sheet */}
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 960, maxHeight: '88vh', background: '#fff', borderRadius: '22px 22px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 18, color: T1, letterSpacing: '-.03em', marginBottom: 3 }}>
              <span style={{ color: accent }}>{title}</span>
            </h2>
            <p style={{ fontSize: 12.5, color: T3, fontWeight: 500 }}>{sub}</p>
          </div>
          <button onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: '50%', background: BG, border: `1px solid ${BD}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T2, fontSize: 18, lineHeight: 1 }}>
            ✕
          </button>
        </div>

        {/* Grid */}
        <div style={{ overflowY: 'auto', padding: '20px 24px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
            {cats.map((c, i) => (
              <motion.button key={c.n}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025, type: 'spring', stiffness: 300, damping: 24 }}
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}
                onClick={() => handleCatClick(c.n)}
                style={{ padding: 0, borderRadius: 14, background: c.bg, border: `1.5px solid ${c.bd}`, cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', boxShadow: '0 1px 5px rgba(0,0,0,.06)' }}>
                <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden' }}>
                  <img src={c.e} alt={c.n} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.tc, lineHeight: 1.3, padding: '7px 4px 8px', wordBreak: 'keep-all' }}>{c.n}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ padding: '14px 24px', background: `${accent}0D`, borderTop: `1px solid ${accent}20`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 12.5, color: accent, fontWeight: 600 }}>
            {type === 'grocery' ? '⚡ 30-min delivery · Pan India' : '🍽️ 25-40 min · Real restaurants near you'}
          </p>
          <button onClick={() => { onClose(); navigate(dest); }}
            style={{ fontSize: 12, fontWeight: 700, color: accent, background: 'none', border: `1px solid ${accent}`, borderRadius: 99, padding: '5px 14px', cursor: 'pointer' }}>
            Browse all →
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function QuickBrowse({ setTab }: { setTab?: (t: TabId) => void }) {
  const [modal, setModal] = React.useState<'grocery' | 'food' | null>(null);
  const [, navigate] = useLocation();

  const navigateToCategory = (catName: string, type: 'grocery' | 'food') => {
    const lsKey = type === 'grocery' ? 'zyphix_groc_cat' : 'zyphix_food_cat';
    const dest = type === 'grocery' ? '/now' : '/eats';
    try { localStorage.setItem(lsKey, catName); } catch {}
    navigate(dest);
  };

  const Tile = ({ e, n, bg, bd, tc, type }: { e: string; n: string; bg: string; bd: string; tc: string; tab?: TabId; type: 'grocery' | 'food' }) => (
    <motion.button
      onClick={() => navigateToCategory(n, type)}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      style={{ padding: 0, borderRadius: 14, background: bg, border: `1.5px solid ${bd}`, cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', boxShadow: '0 1px 5px rgba(0,0,0,.06)', transition: 'box-shadow .15s', minWidth: 0 }}
    >
      <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', background: bg }}>
        <img src={e} alt={n} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: tc, lineHeight: 1.3, padding: '7px 4px 8px', wordBreak: 'keep-all' }}>{n}</span>
    </motion.button>
  );

  return (
    <>
      {modal && <CategoryModal open={!!modal} onClose={() => setModal(null)} type={modal} navigate={navigate} />}

      <div style={{ background: W, padding: '26px 24px 30px', borderBottom: `1px solid ${BD}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>

            {/* ── Groceries ── */}
            <div style={{ flex: '1 1 400px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 15, color: T1, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: G, display: 'inline-block', boxShadow: `0 0 0 3px ${G}22` }} />
                  Shop Groceries
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: T3, background: BG, padding: '2px 9px', borderRadius: 99, border: `1px solid ${BD}` }}>30 min</span>
                </span>
                <button onClick={() => setModal('grocery')} style={{ fontSize: 12.5, fontWeight: 700, color: G, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                  See all <ChevronRight size={13} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {GROC_CATS.map(c => <Tile key={c.n} {...c} type="grocery" />)}
              </div>
            </div>

            {/* ── Food ── */}
            <div style={{ flex: '1 1 400px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 15, color: T1, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#EA580C', display: 'inline-block', boxShadow: '0 0 0 3px rgba(234,88,12,.14)' }} />
                  Order Food
                </span>
                <button onClick={() => setModal('food')} style={{ fontSize: 12.5, fontWeight: 700, color: '#EA580C', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                  See all <ChevronRight size={13} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {FOOD_CATS.map(c => <Tile key={c.n} {...c} type="food" />)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════ STATS STRIP ═══════════════ */
function WhyZyphixStrip() {
  const ITEMS = [
    { Icon: Zap,        title: '30-Min Delivery',       sub: 'Guaranteed every time',        color: G,         iconBg: '#DCFCE7' },
    { Icon: Star,       title: 'Pan India',              sub: 'Every city, every lane',       color: '#F59E0B', iconBg: '#FEF3C7' },
    { Icon: TrendingUp, title: 'Tier 2 India',          sub: 'Built for Bharat',             color: '#3B82F6', iconBg: '#DBEAFE' },
    { Icon: Shield,     title: '₹0 Surge Pricing',      sub: 'Always fair, always honest',   color: '#10B981', iconBg: '#D1FAE5' },
    { Icon: Package,    title: 'Real Kirana Partners',  sub: 'No dark warehouses',           color: '#8B5CF6', iconBg: '#EDE9FE' },
    { Icon: BadgeCheck, title: 'Zero Extra Charges',    sub: 'Less than Swiggy / Zomato',    color: '#059669', iconBg: '#ECFDF5' },
    { Icon: MapPin,     title: 'Neighbourhood First',   sub: 'Your locality, digital',       color: '#EA580C', iconBg: '#FFEDD5' },
  ];
  const doubled = [...ITEMS, ...ITEMS];
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div style={{ background: W, borderTop: `1px solid ${BD}`, borderBottom: `1px solid ${BD}`, overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes stripScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      {/* Left fade */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to right, ${W} 30%, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
      {/* Right fade */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to left, ${W} 30%, transparent)`, zIndex: 2, pointerEvents: 'none' }} />

      <div
        ref={ref}
        style={{ display: 'flex', width: 'max-content', animation: 'stripScroll 38s linear infinite' }}
        onMouseEnter={() => { if (ref.current) ref.current.style.animationPlayState = 'paused'; }}
        onMouseLeave={() => { if (ref.current) ref.current.style.animationPlayState = 'running'; }}
      >
        {doubled.map(({ Icon, title, sub, color, iconBg }, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '15px 30px', flexShrink: 0, whiteSpace: 'nowrap' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: `0 0 0 1px ${color}22`,
              }}>
                <Icon size={15} color={color} strokeWidth={2.3} />
              </div>
              <div>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 13, color: T1, letterSpacing: '-.02em', lineHeight: 1.2 }}>{title}</p>
                <p style={{ fontSize: 11, color: T3, fontWeight: 500, marginTop: 1.5, letterSpacing: '.01em' }}>{sub}</p>
              </div>
            </div>
            {/* Dot separator */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingRight: 4 }}>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: BD }} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ BRAND MARQUEE (main page) ═══════════════ */
const KIRANA_BRANDS = [
  'Amul','Tata','Nestlé','Britannia','ITC','Haldirams','Dabur','Patanjali','P&G','HUL','MDH','Fortune','Mother Dairy','Godrej','Marico',
];
function BrandMarqueeMain() {
  const doubled = [...KIRANA_BRANDS, ...KIRANA_BRANDS];
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div style={{ background: W, borderTop: `1px solid ${BD}`, borderBottom: `1px solid ${BD}`, padding: '0' }}>
      <style>{`@keyframes marqueeL{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes marqueeR{from{transform:translateX(-50%)}to{transform:translateX(0)}}`}</style>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flexShrink: 0, padding: '16px 20px 16px 24px', borderRight: `1px solid ${BD}` }}>
          <p style={{ fontSize: 9, fontWeight: 800, color: T3, letterSpacing: '.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1.4 }}>Partner<br />Brands</p>
        </div>
        <div style={{ overflow: 'hidden', flex: 1, maskImage: 'linear-gradient(to right,transparent,black 40px,black calc(100% - 40px),transparent)', WebkitMaskImage: 'linear-gradient(to right,transparent,black 40px,black calc(100% - 40px),transparent)' }}>
          <div ref={ref} style={{ display: 'flex', animation: 'marqueeL 28s linear infinite', width: 'max-content' }}
            onMouseEnter={() => { if (ref.current) ref.current.style.animationPlayState = 'paused'; }}
            onMouseLeave={() => { if (ref.current) ref.current.style.animationPlayState = 'running'; }}>
            {doubled.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 24px', borderRight: `1px solid ${BD}`, flexShrink: 0, whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: T2, letterSpacing: '-.01em', filter: 'grayscale(1) opacity(0.5)', transition: 'filter .2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = 'none'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = 'grayscale(1) opacity(0.5)'}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ OFFER CARDS (3 image cards) ═══════════════ */
function OfferCards() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText('ZYPHIX50'); setCopied(true); setTimeout(() => setCopied(false), 2500); };
  const cards = [
    { tag: 'New User Offer', h: '50% off your first order', sub: 'Code ZYPHIX50 · Max ₹100 off', code: 'ZYPHIX50', img: 'https://images.unsplash.com/photo-1543168256-418811576931?w=900&h=380&fit=crop&q=85' },
    { tag: 'Partner Stores', h: '200+ partner stores across India', sub: 'Zero surge pricing · Always fresh', code: '', img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=900&h=380&fit=crop&q=85' },
    { tag: 'Pharmacy', h: 'Medicines delivered fast', sub: 'Prescription & OTC · All brands', code: '', img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&h=380&fit=crop&q=85' },
  ];
  return (
    <div style={{ background: BG, borderTop: `1px solid ${BD}`, padding: '40px 24px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {cards.map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <div
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}
              style={{ height: 210, borderRadius: 20, overflow: 'hidden', position: 'relative', background: '#111', boxShadow: SH2, cursor: 'pointer', transition: 'transform .22s' }}>
              <img src={b.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .35 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg,rgba(0,0,0,.92) 42%,rgba(0,0,0,.15))' }} />
              <div style={{ position: 'absolute', inset: 0, padding: '22px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,.2)', width: 'fit-content' }}>{b.tag}</span>
                <div>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', fontSize: 'clamp(1.1rem,2.2vw,1.45rem)', lineHeight: 1.15, marginBottom: 5, letterSpacing: '-.03em' }}>{b.h}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: b.code ? 12 : 0 }}>{b.sub}</p>
                  {b.code && (
                    <button onClick={copy} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 12.5, letterSpacing: '.08em', color: '#fff', background: 'rgba(255,255,255,.12)', border: '1.5px dashed rgba(255,255,255,.4)', padding: '5px 13px', borderRadius: 8, cursor: 'pointer' }}>
                      {b.code}
                      {copied ? <Check size={12} color="#6EE7B7" /> : <Copy size={11} color="rgba(255,255,255,.6)" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ KIRANA CTA ═══════════════ */
function KiranaCTA() {
  const chips = ['🥬 Fruits & Veg','🥛 Dairy','💊 Pharmacy','🍿 Snacks','🌾 Grains & Dal','🧹 Household'];
  return (
    <div style={{ background: W, borderTop: `1px solid ${BD}`, padding: '64px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `${G}10`, border: `1px solid ${G}30`, borderRadius: 999, padding: '5px 16px', marginBottom: 18 }}>
            <span style={{ fontSize: 13 }}>🚀</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: G, letterSpacing: '.05em' }}>Now live across India — Be first to shop</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,2.7rem)', color: T1, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: 16 }}>
            Groceries from your<br /><span style={{ color: G }}>local kirana stores</span>
          </h2>
          <p style={{ fontSize: 15, color: T2, lineHeight: 1.7, marginBottom: 28, maxWidth: 560, margin: '0 auto 28px' }}>
            We're onboarding stores across India right now. Join the waitlist to shop 200+ categories — fresh produce, dairy, snacks, pharmacy and more — delivered in 30 minutes.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
            {chips.map(c => (
              <span key={c} style={{ padding: '8px 16px', background: BG, border: `1.5px solid ${BD}`, borderRadius: 99, fontSize: 13.5, fontWeight: 600, color: T1 }}>{c}</span>
            ))}
            <span style={{ padding: '8px 16px', background: BG, border: `1.5px solid ${BD}`, borderRadius: 99, fontSize: 13.5, fontWeight: 600, color: T3 }}>+ more</span>
          </div>
          <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: BG, border: `2px solid ${BD}`, borderRadius: 14, padding: '16px 28px', cursor: 'pointer', fontSize: 15, fontWeight: 800, color: T2 }}>
            <span style={{ fontSize: 22 }}>🛒</span>
            <span>COMING SOON</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════ WAITLIST SECTION ═══════════════ */
const WLIST_BENEFITS = [
  { Icon: Truck,       title: 'Free Delivery',   sub: 'Up to 10 orders, no charge',  accent: '#0DA366', iconBg: '#ECFDF5' },
  { Icon: Gift,        title: '₹125 Credit',     sub: 'Code ZYPHIX125 at checkout',  accent: '#D97706', iconBg: '#FFFBEB' },
  { Icon: Crown,       title: 'Priority Access', sub: 'First in line when we launch', accent: '#7C3AED', iconBg: '#F5F3FF' },
  { Icon: Zap,         title: 'First to Order',  sub: 'In your city & beyond',        accent: '#EA580C', iconBg: '#FFF7ED' },
];
const WLIST_ROLES = [
  { v: 'restaurant', Icon: Utensils, l: 'Restaurant',        bg: '#FFF7ED', ac: '#EA580C', tc: '#9A3412' },
  { v: 'merchant',   Icon: Store,    l: 'Merchant',          bg: '#ECFDF5', ac: '#16A34A', tc: '#065F46' },
  { v: 'delivery',   Icon: Bike,     l: 'Delivery\nPartner', bg: '#F0F9FF', ac: '#2563EB', tc: '#1E40AF' },
];

const PARTNER_ROLES = ['restaurant','merchant','delivery'];

const CUISINE_TYPES = ['North Indian','South Indian','Chinese','Fast Food','Mughlai','Punjabi','Tandoor','Bakery & Desserts','Biryani','Street Food','Continental','Other'];
const PRODUCT_CATS  = ['Groceries & Staples','Dairy & Eggs','Fruits & Vegetables','Snacks & Beverages','Household & Cleaning','Personal Care','Medicines','Electronics','Clothing','Stationery','Other'];
const VEHICLE_TYPES = ['Bike (Petrol)', 'Bike (Electric)', 'Bicycle', 'Auto', 'Car'];

/* ─── Shared sub-components (module-level to avoid hooks violation) ─── */
function PartnerField({ label, error, children }: { label:string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize:11.5, fontWeight:700, color:T2, marginBottom:5, display:'block', textTransform:'uppercase', letterSpacing:'.04em' }}>{label}</label>
      {children}
      {error && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{error}</motion.p>}
    </div>
  );
}

function ToggleChip({ label, active, onClick, ac = G }: { label:string; active:boolean; onClick:()=>void; ac?: string }) {
  return (
    <button type="button" onClick={onClick}
      style={{ padding:'6px 12px', borderRadius:20, fontSize:12, fontWeight:700, border:`1.5px solid ${active?ac:BD}`, background:active?`${ac}15`:W, color:active?ac:T2, cursor:'pointer', transition:'all .15s', whiteSpace:'nowrap' }}>
      {active ? '✓ ' : ''}{label}
    </button>
  );
}

function WaitlistSection() {
  const [, setLoc] = useLocation();
  const [form, setForm]   = useState({ name: '', email: '', phone: '', city: '', role: '' });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [count, setCount] = useState(500);
  const [dispCount, setDispCount] = useState(500);
  const [step, setStep] = useState<1|2>(1);

  /* ── Partner-specific detail state ── */
  const [restaurant, setRestaurant] = useState({ shopName:'', cuisines:[] as string[], address:'', fssai:'', openFrom:'', openTo:'', seating:'', dishes:'' });
  const [merchant,   setMerchant]   = useState({ shopName:'', categories:[] as string[], address:'', gst:'', openFrom:'', openTo:'', monthlyRevenue:'' });
  const [delivery,   setDelivery]   = useState({ vehicle:'', vehicleNumber:'', areas:'', experience:'', prevApp:'' });
  const [step2Errors, setStep2Errors] = useState<Record<string,string>>({});

  useEffect(() => {
    let t: ReturnType<typeof setInterval> | undefined;
    try {
      const real = 500 + (JSON.parse(localStorage.getItem('zyphix_waitlist') || '[]') as unknown[]).length;
      setCount(real);
      let cur = 500;
      const s = Math.max(1, Math.ceil((real - 500) / 25));
      t = setInterval(() => { cur = Math.min(cur + s, real); setDispCount(cur); if (cur >= real) clearInterval(t); }, 40);
    } catch {}
    return () => { if (t) clearInterval(t); };
  }, []);

  const validate1 = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim())               e.name  = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!form.city)                      e.city  = 'Please select a city';
    if (!form.role)                      e.role  = 'Please select your role';
    return e;
  };

  const validate2 = () => {
    const e: Record<string,string> = {};
    if (form.role === 'restaurant') {
      if (!restaurant.shopName.trim()) e.shopName = 'Restaurant name is required';
      if (!restaurant.cuisines.length) e.cuisines = 'Select at least one cuisine';
      if (!restaurant.address.trim())  e.address  = 'Address is required';
    } else if (form.role === 'merchant') {
      if (!merchant.shopName.trim())     e.shopName  = 'Shop name is required';
      if (!merchant.categories.length)   e.categories = 'Select at least one category';
      if (!merchant.address.trim())      e.address    = 'Address is required';
    } else if (form.role === 'delivery') {
      if (!delivery.vehicle)            e.vehicle = 'Select your vehicle type';
      if (!delivery.areas.trim())       e.areas   = 'Enter the areas you can cover';
    }
    return e;
  };

  const handleContinue = () => {
    const e = validate1();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (form.role === 'restaurant') {
      const q = new URLSearchParams({ name: form.name, email: form.email, phone: form.phone, city: form.city });
      setLoc(`/restaurant-setup?${q.toString()}`); return;
    }
    if (form.role === 'merchant') {
      const q = new URLSearchParams({ name: form.name, email: form.email, phone: form.phone, city: form.city });
      setLoc(`/merchant-setup?${q.toString()}`); return;
    }
    if (form.role === 'delivery') {
      const q = new URLSearchParams({ name: form.name, email: form.email, phone: form.phone, city: form.city });
      setLoc(`/delivery-setup?${q.toString()}`); return;
    }
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (step === 2) {
      const e = validate2();
      if (Object.keys(e).length) { setStep2Errors(e); return; }
    }
    setApiError('');
    setLoading(true);
    try {
      const details = form.role === 'restaurant' ? restaurant : form.role === 'merchant' ? merchant : form.role === 'delivery' ? delivery : {};
      const payload = { ...form, details };
      if (PARTNER_ROLES.includes(form.role)) {
        const res = await apiFetch('/api/partner-register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        const data = await res.json() as { success?: boolean; error?: string };
        if (!res.ok || !data.success) { setApiError(data.error ?? 'Something went wrong. Please try again.'); setLoading(false); return; }
      }
      try {
        const stored = JSON.parse(localStorage.getItem('zyphix_waitlist') || '[]') as object[];
        stored.push({ ...payload, ts: Date.now() });
        localStorage.setItem('zyphix_waitlist', JSON.stringify(stored));
        const nc = 500 + stored.length; setCount(nc); setDispCount(nc);
      } catch {}
    } catch {
      setApiError('Network error. Please check your connection and try again.');
      setLoading(false); return;
    }
    setLoading(false);
    setSubmitted(true);
  };

  const inp = (err?: string) => ({
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `1.5px solid ${err ? '#EF4444' : BD}`, background: W,
    fontSize: 14, color: T1, outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color .15s, box-shadow .15s',
  });

  const focusStyle = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => { e.target.style.borderColor=G; e.target.style.boxShadow=`0 0 0 3px ${G}1A`; };
  const blurStyle  = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>, err?: string) => { e.target.style.borderColor=err?'#EF4444':BD; e.target.style.boxShadow='none'; };

  return (
    <div id="waitlist" style={{ background: BG, padding: '52px 24px 64px', borderBottom: `1px solid ${BD}`, position: 'relative', overflow: 'hidden' }}>

      {/* ── Animated background ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>

        {/* Green orb — top-left */}
        <motion.div
          style={{ position: 'absolute', top: '-12%', left: '-10%', width: 560, height: 560, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13,163,102,0.18) 0%, transparent 68%)', filter: 'blur(48px)' }}
          animate={{ x: [0, 36, 0], y: [0, 24, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />

        {/* Orange orb — bottom-right */}
        <motion.div
          style={{ position: 'absolute', bottom: '-18%', right: '-8%', width: 480, height: 480, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(234,88,12,0.14) 0%, transparent 68%)', filter: 'blur(52px)' }}
          animate={{ x: [0, -28, 0], y: [0, -18, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />

        {/* Small green orb — top-right */}
        <motion.div
          style={{ position: 'absolute', top: '15%', right: '10%', width: 260, height: 260, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13,163,102,0.1) 0%, transparent 70%)', filter: 'blur(32px)' }}
          animate={{ x: [0, 18, 0], y: [0, -22, 0], scale: [1, 1.18, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        {/* Subtle orange orb — left-centre */}
        <motion.div
          style={{ position: 'absolute', top: '45%', left: '5%', width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(234,88,12,0.09) 0%, transparent 70%)', filter: 'blur(28px)' }}
          animate={{ x: [0, 22, 0], y: [0, 16, 0], scale: [1, 1.14, 1] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 3.5 }} />

        {/* Floating particles */}
        {[
          { x:'12%', y:'22%', s:6,  c:`rgba(13,163,102,0.55)`,  d:0    },
          { x:'28%', y:'68%', s:4,  c:`rgba(234,88,12,0.45)`,   d:0.7  },
          { x:'55%', y:'14%', s:5,  c:`rgba(13,163,102,0.4)`,   d:1.2  },
          { x:'70%', y:'75%', s:7,  c:`rgba(234,88,12,0.35)`,   d:0.4  },
          { x:'85%', y:'30%', s:4,  c:`rgba(13,163,102,0.5)`,   d:1.8  },
          { x:'42%', y:'82%', s:5,  c:`rgba(234,88,12,0.4)`,    d:2.1  },
          { x:'18%', y:'50%', s:3,  c:`rgba(13,163,102,0.35)`,  d:0.9  },
          { x:'92%', y:'55%', s:6,  c:`rgba(234,88,12,0.3)`,    d:1.5  },
        ].map(({ x, y, s, c, d }, i) => (
          <motion.div key={i}
            style={{ position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: c }}
            animate={{ y: [-10, 10, -10], x: [-5, 5, -5], opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3.2 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: d }} />
        ))}

        {/* Soft grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(13,163,102,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,163,102,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>

          {/* ── LEFT: value prop ── */}
          <div style={{ flex: '1 1 340px', minWidth: 0 }}>

            {/* Badge */}
            <motion.div initial={{ opacity:0, y:-12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(13,163,102,.12)', border:'1px solid rgba(13,163,102,.3)', color:'#4ADE80', fontSize:12.5, fontWeight:700, padding:'7px 18px', borderRadius:99, marginBottom:22, letterSpacing:'.01em' }}>
                <motion.span style={{ width:7, height:7, borderRadius:'50%', background:G, display:'inline-block', flexShrink:0 }} animate={{ opacity:[1,0.35,1], scale:[1,1.4,1] }} transition={{ repeat:Infinity, duration:1.6 }} />
                Early Access Open · Across India
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2 initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.08 }}
              style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(2rem,4.5vw,3rem)', color:T1, letterSpacing:'-.045em', lineHeight:1.06, marginBottom:16 }}>
              Zyphix is now live<br /><span style={{ color:G }}>across India</span>
            </motion.h2>

            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:.16 }}
              style={{ fontSize:15, color:T2, lineHeight:1.7, marginBottom:28, maxWidth:420 }}>
              Be among the first to experience hyperlocal delivery from your neighbourhood kirana stores. Claim your launch perks now.
            </motion.p>

            {/* Benefit tiles */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:28 }}>
              {WLIST_BENEFITS.map(({ Icon, title, sub, accent, iconBg }, i) => (
                <motion.div key={title}
                  initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay:.15 + i*.07, type:'spring', stiffness:260, damping:22 }}
                  style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 14px', borderRadius:14, background:W, border:`1.5px solid ${BD}`, boxShadow:'0 1px 6px rgba(0,0,0,.05)' }}>
                  <div style={{ width:38, height:38, borderRadius:11, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={18} color={accent} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:800, color:T1, marginBottom:3, letterSpacing:'-.01em' }}>{title}</p>
                    <p style={{ fontSize:11.5, color:T2, lineHeight:1.45, fontWeight:500 }}>{sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social proof counter */}
            <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.52 }}
              style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:W, borderRadius:14, border:`1px solid ${BD}`, boxShadow:'0 1px 6px rgba(0,0,0,.06)' }}>
              <div style={{ display:'flex', flexShrink:0 }}>
                {[['R','#0DA366'],['A','#059669'],['S','#16A34A'],['P','#22C55E'],['K','#4ADE80']].map(([l,bg], i) => (
                  <motion.div key={i} initial={{ x:-8, opacity:0 }} whileInView={{ x:0, opacity:1 }} viewport={{ once:true }}
                    transition={{ delay:.55 + i*.06 }}
                    style={{ width:30, height:30, borderRadius:'50%', background:bg, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, marginLeft: i ? -9 : 0, border:`2.5px solid ${W}`, boxShadow:'0 1px 4px rgba(0,0,0,.4)', flexShrink:0 }}>{l}</motion.div>
                ))}
              </div>
              <div>
                <p style={{ fontSize:13.5, fontWeight:800, color:T1, lineHeight:1.2 }}>
                  <motion.span style={{ color:G }} animate={{ opacity:[1,0.7,1] }} transition={{ repeat:Infinity, duration:2.5 }}>{dispCount}+</motion.span> on the waitlist
                </p>
                <p style={{ fontSize:11.5, color:T3, marginTop:2 }}>Delhi · Mumbai · Bengaluru · more</p>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: form card ── */}
          <motion.div initial={{ opacity:0, x:32 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ delay:.22, type:'spring', stiffness:90, damping:18 }}
            style={{ flex:'1 1 390px', minWidth:0 }}>
            <div style={{ background:W, borderRadius:24, padding:'32px 30px', boxShadow:'0 8px 40px rgba(0,0,0,.1), 0 1px 4px rgba(0,0,0,.06)', border:`1px solid ${BD}`, position:'relative', overflow:'hidden' }}>
              {/* green top accent line */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${G} 0%, #22C55E 100%)` }} />

              {submitted ? (
                /* ── SUCCESS ── */
                <motion.div initial={{ scale:.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', stiffness:200 }}
                  style={{ textAlign:'center', padding:'12px 0 8px' }}>
                  <motion.div animate={{ rotate:[0,14,-14,10,-8,0], scale:[1,1.25,1] }} transition={{ duration:.7 }}
                    style={{ fontSize:56, marginBottom:14 }}>🎉</motion.div>
                  <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, color:T1, fontSize:'1.4rem', marginBottom:8 }}>
                    {PARTNER_ROLES.includes(form.role) ? 'Application Received!' : "You're on the list!"}
                  </h3>
                  <p style={{ color:T2, fontSize:14, lineHeight:1.65, marginBottom:22 }}>
                    {PARTNER_ROLES.includes(form.role)
                      ? <>Our team will review your details and reach out within <strong style={{color:G}}>24–48 hours</strong>. A confirmation email has been sent to <strong style={{color:G}}>{form.email}</strong>.</>
                      : <>We'll reach out before launch.<br />Your ₹125 credit is reserved — use code <strong style={{color:G}}>ZYPHIX125</strong></>
                    }
                  </p>
                  <motion.div animate={{ scale:[1,1.02,1] }} transition={{ repeat:Infinity, duration:2 }}
                    style={{ background:`${G}10`, border:`1.5px solid ${G}35`, borderRadius:12, padding:'14px 20px' }}>
                    <p style={{ fontSize:13.5, color:G, fontWeight:800 }}>
                      {PARTNER_ROLES.includes(form.role) ? '📋 Reference saved — check your email!' : `🌟 You're #${count} on the waitlist`}
                    </p>
                  </motion.div>

                  {/* ── What happens next ── */}
                  <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.45 }}
                    style={{ marginTop:22, borderTop:`1px solid ${BD}`, paddingTop:20, textAlign:'left' }}>
                    <p style={{ fontSize:11, fontWeight:700, color:T3, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:14 }}>
                      {PARTNER_ROLES.includes(form.role) ? 'What happens next' : 'While you wait'}
                    </p>

                    {PARTNER_ROLES.includes(form.role) ? (
                      /* Partner next steps */
                      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        {[
                          { icon:'📬', title:'Check your email', sub:'A confirmation with your reference ID has been sent.' },
                          { icon:'📞', title:'We will call you', sub:'Our team will reach out within 24\u201348 hours on your registered number.' },
                          { icon:'🚀', title:'Go live on Zyphix', sub:'Once verified, you will be listed on the app and start receiving orders.' },
                        ].map(({ icon, title, sub }, i) => (
                          <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: .5 + i * .1 }}
                            style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 12px', borderRadius:12, background:'#1A2332', border:`1px solid ${BD}` }}>
                            <span style={{ fontSize:20, flexShrink:0, lineHeight:1 }}>{icon}</span>
                            <div>
                              <p style={{ fontSize:13, fontWeight:700, color:T1, marginBottom:2 }}>{title}</p>
                              <p style={{ fontSize:12, color:T2, lineHeight:1.5 }}>{sub}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      /* Customer while-you-wait */
                      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        {[
                          { icon:'🛍️', title:'Browse our categories', sub:'Take a sneak peek at what Zyphix will deliver.', href:'#quick-browse' },
                          { icon:'🎁', title:'Save your promo code', sub:'Use ZYPHIX125 for ₹125 off on your first order.' },
                          { icon:'📲', title:'Get the app early', sub:'We will notify you the moment we launch in your city.', href:'#app-download' },
                        ].map(({ icon, title, sub, href }, i) => (
                          <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: .5 + i * .1 }}>
                            <a href={href ?? '#'} style={{ textDecoration:'none', display:'flex', gap:12, alignItems:'flex-start', padding:'10px 12px', borderRadius:12, background:'#1A2332', border:`1px solid ${BD}`, transition:'border-color .15s, background .15s' }}
                              onMouseEnter={e=>{ (e.currentTarget as HTMLAnchorElement).style.background='rgba(13,163,102,.12)'; (e.currentTarget as HTMLAnchorElement).style.borderColor=`${G}60`; }}
                              onMouseLeave={e=>{ (e.currentTarget as HTMLAnchorElement).style.background='#1A2332'; (e.currentTarget as HTMLAnchorElement).style.borderColor=BD; }}>
                              <span style={{ fontSize:20, flexShrink:0, lineHeight:1 }}>{icon}</span>
                              <div>
                                <p style={{ fontSize:13, fontWeight:700, color:T1, marginBottom:2 }}>{title}</p>
                                <p style={{ fontSize:12, color:T2, lineHeight:1.5 }}>{sub}</p>
                              </div>
                            </a>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* WhatsApp CTA */}
                    <motion.a href="https://wa.me/919682394363?text=Hi%20Zyphix%2C%20I%20just%20signed%20up%20and%20have%20a%20question."
                      target="_blank" rel="noopener noreferrer"
                      initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.85 }}
                      style={{ marginTop:16, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px', borderRadius:12, background:'rgba(13,163,102,.1)', border:`1px solid ${G}40`, textDecoration:'none', color:'#4ADE80', fontSize:13, fontWeight:700, transition:'background .15s' }}
                      onMouseEnter={e=>{ (e.currentTarget as HTMLAnchorElement).style.background=`rgba(13,163,102,.2)`; }}
                      onMouseLeave={e=>{ (e.currentTarget as HTMLAnchorElement).style.background='rgba(13,163,102,.1)'; }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Chat with us on WhatsApp
                    </motion.a>
                  </motion.div>
                </motion.div>

              ) : step === 1 ? (
                /* ── STEP 1: Basic Info ── */
                <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
                  <div style={{ marginBottom:4, paddingBottom:18, borderBottom:`1px solid ${BD}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                      <div style={{ width:4, height:30, borderRadius:3, background:`linear-gradient(to bottom, ${G}, #059669)`, flexShrink:0 }} />
                      <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(1.2rem,2vw,1.5rem)', color:T1, letterSpacing:'-.03em', lineHeight:1 }}>Reserve your spot</h3>
                    </div>
                    <p style={{ fontSize:12.5, color:T3, paddingLeft:14 }}>Takes 30 seconds · Free forever</p>
                  </div>

                  {/* Name */}
                  <div>
                    <label style={{ fontSize:11.5, fontWeight:700, color:T2, marginBottom:5, display:'block', textTransform:'uppercase' as const, letterSpacing:'.04em' }}>Full Name</label>
                    <motion.input whileFocus={{ scale:1.005 }} value={form.name}
                      onChange={e => { setForm(f=>({...f,name:e.target.value})); setErrors(x=>({...x,name:''})); }}
                      placeholder="Your full name" style={inp(errors.name)}
                      onFocus={focusStyle} onBlur={e=>blurStyle(e,errors.name)} />
                    {errors.name && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.name}</motion.p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontSize:11.5, fontWeight:700, color:T2, marginBottom:5, display:'block', textTransform:'uppercase' as const, letterSpacing:'.04em' }}>Email Address</label>
                    <motion.input whileFocus={{ scale:1.005 }} value={form.email} type="email"
                      onChange={e=>{setForm(f=>({...f,email:e.target.value}));setErrors(x=>({...x,email:''}));}}
                      placeholder="your@email.com" style={inp(errors.email)}
                      onFocus={focusStyle} onBlur={e=>blurStyle(e,errors.email)} />
                    {errors.email && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.email}</motion.p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ fontSize:11.5, fontWeight:700, color:T2, marginBottom:5, display:'block', textTransform:'uppercase' as const, letterSpacing:'.04em' }}>Phone Number</label>
                    <input value={form.phone} type="tel" inputMode="numeric" maxLength={10}
                      onChange={e=>{setForm(f=>({...f,phone:e.target.value}));setErrors(x=>({...x,phone:''}));}}
                      placeholder="10-digit mobile number" style={inp(errors.phone)}
                      onFocus={focusStyle} onBlur={e=>blurStyle(e,errors.phone)} />
                    {errors.phone && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.phone}</motion.p>}
                  </div>

                  {/* City */}
                  <div>
                    <label style={{ fontSize:11.5, fontWeight:700, color:T2, marginBottom:5, display:'block', textTransform:'uppercase' as const, letterSpacing:'.04em' }}>City</label>
                    <select value={form.city} onChange={e=>{setForm(f=>({...f,city:e.target.value}));setErrors(x=>({...x,city:''}));}}
                      style={{ ...inp(errors.city), color:form.city?T1:T3, appearance:'none' as const, cursor:'pointer' }}>
                      <option value="">Select your city</option>
                      {['Delhi','Mumbai','Bengaluru','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Lucknow','Chandigarh','Surat','Nagpur','Indore','Bhopal','Patna','Kochi','Other'].map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.city && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.city}</motion.p>}
                  </div>

                  {/* Role selector */}
                  <div>
                    <label style={{ fontSize:11.5, fontWeight:700, color:T2, marginBottom:8, display:'block', textTransform:'uppercase' as const, letterSpacing:'.04em' }}>I am a:</label>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                      {WLIST_ROLES.map(({ v, Icon, l, bg, ac, tc }) => (
                        <motion.button key={v} onClick={()=>{setForm(f=>({...f,role:v}));setErrors(x=>({...x,role:''}));}}
                          whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:.96 }}
                          style={{ padding:'14px 6px 12px', borderRadius:13, background:form.role===v?bg:W, border:`1.5px solid ${form.role===v?ac:BD}`, cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:7, boxShadow:form.role===v?`0 0 0 3px ${ac}22`:'0 1px 3px rgba(0,0,0,.04)', transition:'all .15s' }}>
                          <div style={{ width:34, height:34, borderRadius:10, background:form.role===v?`${ac}18`:BD, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Icon size={16} color={form.role===v?ac:T3} strokeWidth={2.1} />
                          </div>
                          <span style={{ fontSize:10.5, fontWeight:700, color:form.role===v?tc:T2, lineHeight:1.3, whiteSpace:'pre-line' as const }}>{l}</span>
                        </motion.button>
                      ))}
                    </div>
                    {errors.role && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} style={{fontSize:11.5,color:'#EF4444',marginTop:4}}>{errors.role}</motion.p>}

                    {/* Partner hint badge */}
                    <AnimatePresence>
                      {PARTNER_ROLES.includes(form.role) && (
                        <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}
                          style={{ marginTop:10, padding:'9px 12px', borderRadius:10, background:'rgba(13,163,102,.1)', border:`1px solid ${G}40`, display:'flex', alignItems:'center', gap:8 }}>
                          <span style={{ fontSize:14 }}>📋</span>
                          <p style={{ fontSize:12, color:'#4ADE80', fontWeight:600, lineHeight:1.4 }}>
                            Next step: Add your {form.role === 'restaurant' ? 'restaurant' : form.role === 'merchant' ? 'shop' : 'delivery'} details — shop info, timings & more.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* CTA */}
                  <motion.button onClick={handleContinue} disabled={loading}
                    whileHover={loading ? {} : { scale:1.025 }} whileTap={loading ? {} : { scale:.97 }}
                    animate={{ boxShadow:[`0 4px 18px ${G}45`,`0 8px 34px ${G}70`,`0 4px 18px ${G}45`] }}
                    transition={{ boxShadow:{ repeat:Infinity, duration:2, ease:'easeInOut' } }}
                    style={{ width:'100%', padding:'15px', borderRadius:13, background:G, color:'#fff', fontSize:15.5, fontWeight:800, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:2, letterSpacing:'-.01em' }}>
                    {PARTNER_ROLES.includes(form.role)
                      ? <>Continue <ArrowRight size={16} /></>
                      : <>Join the Waitlist <ArrowRight size={16} /></>}
                  </motion.button>

                  <p style={{ textAlign:'center', fontSize:12.5, color:T3 }}>
                    <span style={{ color:G, fontWeight:700 }}>{dispCount}+</span> people already joined · Free to join
                  </p>
                </div>

              ) : (
                /* ── STEP 2: Partner Details ── */
                <div style={{ display:'flex', flexDirection:'column', gap:15 }}>

                  {/* Step 2 header */}
                  <div style={{ paddingBottom:16, borderBottom:`1px solid ${BD}` }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                      <button onClick={()=>{ setStep(1); setStep2Errors({}); }}
                        style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:T2, fontSize:13, fontWeight:700, padding:0 }}>
                        ← Back
                      </button>
                      <span style={{ fontSize:11.5, fontWeight:700, color:T2, background:BD, padding:'3px 10px', borderRadius:20 }}>Step 2 of 2</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
                      <div style={{ width:4, height:28, borderRadius:3, background:`linear-gradient(to bottom, ${G}, #059669)`, flexShrink:0 }} />
                      <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'1.15rem', color:T1, letterSpacing:'-.03em', lineHeight:1 }}>
                        {form.role === 'restaurant' ? '🍴 Restaurant Details' : form.role === 'merchant' ? '🏪 Shop Details' : '🚴 Delivery Partner Details'}
                      </h3>
                    </div>
                    {/* Summary strip */}
                    <div style={{ marginTop:10, padding:'8px 12px', borderRadius:10, background:'#1A2332', border:`1px solid ${BD}`, display:'flex', gap:16, flexWrap:'wrap' as const }}>
                      {[['👤', form.name], ['📧', form.email], ['📍', form.city]].map(([icon, val]) => (
                        <span key={val} style={{ fontSize:12, color:T2, fontWeight:600 }}>{icon} {val}</span>
                      ))}
                    </div>
                  </div>

                  {/* Role-specific fields */}
                  <AnimatePresence mode="wait">
                    <motion.div key={form.role} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:.2}}
                      style={{ display:'flex', flexDirection:'column', gap:14 }}>

                      {/* ── Restaurant ── */}
                      {form.role === 'restaurant' && <>
                        <PartnerField label="Restaurant / Shop Name *" error={step2Errors.shopName}>
                          <input value={restaurant.shopName} onChange={e=>{ setRestaurant(r=>({...r,shopName:e.target.value})); setStep2Errors(x=>({...x,shopName:''})); }}
                            placeholder="e.g. Sharma Dhaba" style={inp(step2Errors.shopName)} onFocus={focusStyle} onBlur={e=>blurStyle(e,step2Errors.shopName)} />
                        </PartnerField>
                        <PartnerField label="Cuisine Type *" error={step2Errors.cuisines}>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                            {CUISINE_TYPES.map(c=><ToggleChip key={c} label={c} active={restaurant.cuisines.includes(c)}
                              onClick={()=>{ setStep2Errors(x=>({...x,cuisines:''})); setRestaurant(r=>({ ...r, cuisines: r.cuisines.includes(c) ? r.cuisines.filter(x=>x!==c) : [...r.cuisines,c] })); }} />)}
                          </div>
                        </PartnerField>
                        <PartnerField label="Restaurant Address *" error={step2Errors.address}>
                          <textarea value={restaurant.address} onChange={e=>{ setRestaurant(r=>({...r,address:e.target.value})); setStep2Errors(x=>({...x,address:''})); }}
                            placeholder="Full address with locality, street, pincode" rows={2}
                            style={{ ...inp(step2Errors.address), resize:'vertical' as const, fontFamily:'inherit' }} onFocus={focusStyle} onBlur={e=>blurStyle(e,step2Errors.address)} />
                        </PartnerField>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                          <PartnerField label="Opens At">
                            <input type="time" value={restaurant.openFrom} onChange={e=>setRestaurant(r=>({...r,openFrom:e.target.value}))} style={inp()} onFocus={focusStyle} onBlur={blurStyle} />
                          </PartnerField>
                          <PartnerField label="Closes At">
                            <input type="time" value={restaurant.openTo} onChange={e=>setRestaurant(r=>({...r,openTo:e.target.value}))} style={inp()} onFocus={focusStyle} onBlur={blurStyle} />
                          </PartnerField>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                          <PartnerField label="FSSAI License No. (optional)">
                            <input value={restaurant.fssai} onChange={e=>setRestaurant(r=>({...r,fssai:e.target.value}))} placeholder="14-digit number" style={inp()} onFocus={focusStyle} onBlur={blurStyle} />
                          </PartnerField>
                          <PartnerField label="Seating Capacity">
                            <input type="number" value={restaurant.seating} onChange={e=>setRestaurant(r=>({...r,seating:e.target.value}))} placeholder="e.g. 40" style={inp()} onFocus={focusStyle} onBlur={blurStyle} />
                          </PartnerField>
                        </div>
                        <PartnerField label="Signature / Best-Selling Dishes">
                          <textarea value={restaurant.dishes} onChange={e=>setRestaurant(r=>({...r,dishes:e.target.value}))}
                            placeholder="e.g. Rogan Josh, Tandoori Chicken, Paneer Tikka" rows={2}
                            style={{ ...inp(), resize:'vertical' as const, fontFamily:'inherit' }} onFocus={focusStyle} onBlur={blurStyle} />
                        </PartnerField>
                      </>}

                      {/* ── Merchant ── */}
                      {form.role === 'merchant' && <>
                        <PartnerField label="Shop / Store Name *" error={step2Errors.shopName}>
                          <input value={merchant.shopName} onChange={e=>{ setMerchant(m=>({...m,shopName:e.target.value})); setStep2Errors(x=>({...x,shopName:''})); }}
                            placeholder="e.g. Sharma General Store" style={inp(step2Errors.shopName)} onFocus={focusStyle} onBlur={e=>blurStyle(e,step2Errors.shopName)} />
                        </PartnerField>
                        <PartnerField label="Product Categories *" error={step2Errors.categories}>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                            {PRODUCT_CATS.map(c=><ToggleChip key={c} label={c} active={merchant.categories.includes(c)}
                              onClick={()=>{ setStep2Errors(x=>({...x,categories:''})); setMerchant(m=>({ ...m, categories: m.categories.includes(c) ? m.categories.filter(x=>x!==c) : [...m.categories,c] })); }} />)}
                          </div>
                        </PartnerField>
                        <PartnerField label="Shop Address *" error={step2Errors.address}>
                          <textarea value={merchant.address} onChange={e=>{ setMerchant(m=>({...m,address:e.target.value})); setStep2Errors(x=>({...x,address:''})); }}
                            placeholder="Full address with locality, street, pincode" rows={2}
                            style={{ ...inp(step2Errors.address), resize:'vertical' as const, fontFamily:'inherit' }} onFocus={focusStyle} onBlur={e=>blurStyle(e,step2Errors.address)} />
                        </PartnerField>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                          <PartnerField label="Opens At">
                            <input type="time" value={merchant.openFrom} onChange={e=>setMerchant(m=>({...m,openFrom:e.target.value}))} style={inp()} onFocus={focusStyle} onBlur={blurStyle} />
                          </PartnerField>
                          <PartnerField label="Closes At">
                            <input type="time" value={merchant.openTo} onChange={e=>setMerchant(m=>({...m,openTo:e.target.value}))} style={inp()} onFocus={focusStyle} onBlur={blurStyle} />
                          </PartnerField>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                          <PartnerField label="GST Number (optional)">
                            <input value={merchant.gst} onChange={e=>setMerchant(m=>({...m,gst:e.target.value}))} placeholder="15-digit GSTIN" style={inp()} onFocus={focusStyle} onBlur={blurStyle} />
                          </PartnerField>
                          <PartnerField label="Est. Monthly Revenue">
                            <select value={merchant.monthlyRevenue} onChange={e=>setMerchant(m=>({...m,monthlyRevenue:e.target.value}))}
                              style={{ ...inp(), color:merchant.monthlyRevenue?T1:T3, appearance:'none' as const, cursor:'pointer' }}>
                              <option value="">Select range</option>
                              {['Under ₹50K','₹50K – ₹1L','₹1L – ₹5L','₹5L – ₹10L','Above ₹10L'].map(v=><option key={v} value={v}>{v}</option>)}
                            </select>
                          </PartnerField>
                        </div>
                      </>}

                      {/* ── Delivery Partner ── */}
                      {form.role === 'delivery' && <>
                        <PartnerField label="Vehicle Type *" error={step2Errors.vehicle}>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                            {VEHICLE_TYPES.map(v=>(
                              <button type="button" key={v} onClick={()=>{ setDelivery(d=>({...d,vehicle:v})); setStep2Errors(x=>({...x,vehicle:''})); }}
                                style={{ padding:'8px 14px', borderRadius:10, fontSize:13, fontWeight:700, border:`1.5px solid ${delivery.vehicle===v?'#2563EB':BD}`, background:delivery.vehicle===v?'rgba(37,99,235,.15)':W, color:delivery.vehicle===v?'#60A5FA':T2, cursor:'pointer', transition:'all .15s' }}>
                                {v}
                              </button>
                            ))}
                          </div>
                        </PartnerField>
                        <PartnerField label="Vehicle Number (optional)">
                          <input value={delivery.vehicleNumber} onChange={e=>setDelivery(d=>({...d,vehicleNumber:e.target.value}))}
                            placeholder="e.g. JK01AB1234" style={inp()} onFocus={focusStyle} onBlur={blurStyle} />
                        </PartnerField>
                        <PartnerField label="Areas / Localities You Can Cover *" error={step2Errors.areas}>
                          <textarea value={delivery.areas} onChange={e=>{ setDelivery(d=>({...d,areas:e.target.value})); setStep2Errors(x=>({...x,areas:''})); }}
                            placeholder="e.g. Gandhi Nagar, Talab Tillo, Shastri Nagar, Bathindi…" rows={2}
                            style={{ ...inp(step2Errors.areas), resize:'vertical' as const, fontFamily:'inherit' }} onFocus={focusStyle} onBlur={e=>blurStyle(e,step2Errors.areas)} />
                        </PartnerField>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                          <PartnerField label="Delivery Experience">
                            <select value={delivery.experience} onChange={e=>setDelivery(d=>({...d,experience:e.target.value}))}
                              style={{ ...inp(), color:delivery.experience?T1:T3, appearance:'none' as const, cursor:'pointer' }}>
                              <option value="">Select</option>
                              {['Fresher (No experience)','Less than 6 months','6 months – 1 year','1 – 3 years','3+ years'].map(v=><option key={v} value={v}>{v}</option>)}
                            </select>
                          </PartnerField>
                          <PartnerField label="Previously Worked With">
                            <select value={delivery.prevApp} onChange={e=>setDelivery(d=>({...d,prevApp:e.target.value}))}
                              style={{ ...inp(), color:delivery.prevApp?T1:T3, appearance:'none' as const, cursor:'pointer' }}>
                              <option value="">Select app</option>
                              {['None','Zomato','Swiggy','Blinkit','Zepto','Dunzo','Other'].map(v=><option key={v} value={v}>{v}</option>)}
                            </select>
                          </PartnerField>
                        </div>
                      </>}

                    </motion.div>
                  </AnimatePresence>

                  {/* API error */}
                  {apiError && (
                    <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
                      style={{ padding:'11px 14px', borderRadius:10, background:'#FEF2F2', border:'1.5px solid #FCA5A5', fontSize:13, color:'#DC2626', fontWeight:500 }}>
                      ⚠️ {apiError}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <motion.button onClick={handleSubmit} disabled={loading}
                    whileHover={loading ? {} : { scale:1.025 }} whileTap={loading ? {} : { scale:.97 }}
                    animate={{ boxShadow:[`0 4px 18px ${G}45`,`0 8px 34px ${G}70`,`0 4px 18px ${G}45`] }}
                    transition={{ boxShadow:{ repeat:Infinity, duration:2, ease:'easeInOut' } }}
                    style={{ width:'100%', padding:'15px', borderRadius:13, background:loading?'#6B7280':G, color:'#fff', fontSize:15.5, fontWeight:800, border:'none', cursor:loading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:4, letterSpacing:'-.01em', transition:'background .2s' }}>
                    {loading ? (
                      <><motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:.8, ease:'linear' }}
                        style={{ width:18, height:18, border:'2.5px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%' }} />Submitting…</>
                    ) : <>Submit Application <ArrowRight size={16} /></>}
                  </motion.button>
                  <p style={{ textAlign:'center', fontSize:12, color:T3 }}>Your details are encrypted and only shared with the ZYPHIX team.</p>
                </div>
              )}

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════ ROOT ═══════════════ */
export function Home() {
  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <AnnoBar />
      <Navbar />
      <DualHeroBanners />
      <div id="quick-browse"><QuickBrowse /></div>
      <WaitlistSection />
      <WhyZyphixStrip />
      <div id="offers"><OfferCards /></div>
      <div id="stores"><KiranaCTA /></div>
      <HowItWorks />
      <SocialProof />
      <AppDownload />
      <Footer />
    </div>
  );
}
