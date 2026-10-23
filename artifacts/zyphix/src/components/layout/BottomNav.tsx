import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Zap, Utensils, CalendarCheck, Tag } from 'lucide-react';

const G = '#0DA366';

const navItems = [
  { label: 'Home',   path: '/',       icon: Home },
  { label: 'Now',    path: '/now',    icon: Zap },
  { label: 'Eats',   path: '/eats',   icon: Utensils },
  { label: 'Book',   path: '/book',   icon: CalendarCheck },
  { label: 'Offers', path: '/offers', icon: Tag },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-200 bg-white/95 backdrop-blur-md px-2 pt-2"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 6px)' }}
    >
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}
              className="flex flex-1 flex-col items-center justify-center gap-1 px-1 pt-1.5 pb-2 no-underline transition-opacity"
              onClick={() => {}}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors ${isActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
                <Icon size={22} color={isActive ? G : '#9CA3AF'} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] tracking-[.01em] ${isActive ? 'font-bold' : 'font-medium'}`} style={{ color: isActive ? G : '#9CA3AF' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
