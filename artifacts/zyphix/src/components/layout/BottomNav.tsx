import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Zap, Utensils, CalendarCheck, Tag } from 'lucide-react';
import { FONT, G } from '@/ui/kit';
import { detectSite } from '@/lib/site';

const navItems = [
  { label: 'Home',   path: '/',       icon: Home,          site: 'main', url: 'https://zyphix.in/' },
  { label: 'Now',    path: '/now',    icon: Zap,           site: 'now',  url: 'https://now.zyphix.in/' },
  { label: 'Eats',   path: '/eats',   icon: Utensils,      site: 'eats', url: 'https://eats.zyphix.in/' },
  { label: 'Book',   path: '/book',   icon: CalendarCheck, site: 'book', url: 'https://book.zyphix.in/' },
  { label: 'Offers', path: '/offers', icon: Tag,           site: '',     url: 'https://zyphix.in/offers' },
];

export function BottomNav() {
  const [location] = useLocation();
  // On now./eats./book.zyphix.in each tab is its own site: link across domains and mark the current one.
  const site = detectSite();
  const onApp = (site === 'now' || site === 'eats' || site === 'book') && typeof window !== 'undefined' && /(^|\.)zyphix\.in$/.test(window.location.hostname);

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E6E8EC] bg-white/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', fontFamily: FONT }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[480px] items-stretch">
        {navItems.map((item) => {
          const isActive = onApp ? item.site === site : (location === item.path || (item.path !== '/' && location.startsWith(item.path)));
          const Icon = item.icon;
          const color = isActive ? G : '#6B7280';
          const inner = (
            <>
              <Icon size={20} color={color} strokeWidth={isActive ? 2.25 : 1.75} />
              <span className={`text-[11px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`} style={{ color }}>
                {item.label}
              </span>
            </>
          );
          const cls = 'flex flex-1 flex-col items-center justify-center gap-1 no-underline';
          if (onApp && isActive) return <Link key={item.path} href="/" className={cls} aria-current="page">{inner}</Link>;
          if (onApp) return <a key={item.path} href={item.url} className={cls}>{inner}</a>;
          return <Link key={item.path} href={item.path} className={cls}>{inner}</Link>;
        })}
      </div>
    </div>
  );
}
