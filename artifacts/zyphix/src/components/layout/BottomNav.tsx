import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Zap, Utensils, CalendarCheck, Tag } from 'lucide-react';
import { FONT, G } from '@/ui/kit';

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
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E6E8EC] bg-white/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', fontFamily: FONT }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[480px] items-stretch">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
          const Icon = item.icon;
          const color = isActive ? G : '#6B7280';
          return (
            <Link key={item.path} href={item.path}
              className="flex flex-1 flex-col items-center justify-center gap-1 no-underline"
              onClick={() => {}}>
              <Icon size={20} color={color} strokeWidth={isActive ? 2.25 : 1.75} />
              <span className={`text-[11px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`} style={{ color }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
