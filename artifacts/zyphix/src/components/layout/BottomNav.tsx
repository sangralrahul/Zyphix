import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Zap, Utensils, CalendarCheck, MapPin, Tag } from 'lucide-react';

const navItems = [
  { label: 'Home',   path: '/',           icon: Home,          color: '#00D97E' },
  { label: 'Now',    path: '/now',         icon: Zap,           color: '#00C9A7' },
  { label: 'Eats',   path: '/eats',        icon: Utensils,      color: '#F97316' },
  { label: 'Book',   path: '/book',        icon: CalendarCheck, color: '#F97316' },
  { label: 'Offers', path: '/offers',      icon: Tag,           color: '#D4AF37' },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(9,9,14,0.97)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      paddingBottom: 'env(safe-area-inset-bottom, 6px)',
      paddingTop: 8,
      paddingLeft: 8,
      paddingRight: 8,
      display: 'flex',
    }}
    className="md:hidden"
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', maxWidth: 480, margin: '0 auto' }}>
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px 4px 8px', textDecoration: 'none', transition: 'opacity .15s', gap: 4 }}
              onClick={() => {}}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive ? `${item.color}22` : 'transparent',
                transition: 'background .15s',
              }}>
                <Icon size={22} color={isActive ? item.color : 'rgba(255,255,255,0.38)'} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? item.color : 'rgba(255,255,255,0.38)', letterSpacing: '.01em' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
