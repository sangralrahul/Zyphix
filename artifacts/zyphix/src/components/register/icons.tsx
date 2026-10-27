import React from 'react';
import {
  Apple, Baby, Banknote, Bath, Beef, Candy, Carrot, Coffee, CookingPot, Cookie, Croissant, CupSoda, Drumstick, EggFried, Flame,
  HandPlatter, Hamburger, IceCreamCone, Leaf, Milk, Package, Pill, Pizza, Popcorn, Salad, ShoppingCart, Smartphone, Soup,
  SprayCan, Sprout, Store, Utensils, UtensilsCrossed, Wallet, Wheat, Bike, Snowflake, PawPrint, PenLine, type LucideIcon,
} from 'lucide-react';

/* Consistent line icons for partner sign-up choices (replaces emoji artwork). */

export const CUISINE_ICONS: Record<string, LucideIcon> = {
  north_indian: CookingPot, mughlai: Drumstick, chinese: Soup, fast_food: Hamburger, pizza: Pizza, biryani: HandPlatter,
  sweets: Candy, snacks: Popcorn, continental: UtensilsCrossed, south_indian: Leaf, tandoor: Flame, beverages: CupSoda,
  desserts: IceCreamCone, bakes: Croissant, healthy: Salad,
};

export const STORE_TYPE_ICONS: Record<string, LucideIcon> = {
  kirana: Store, super: ShoppingCart, medical: Pill, bakery: Croissant, fruits: Carrot, dairy: Milk,
};

export const GROCERY_CAT_ICONS: Record<string, LucideIcon> = {
  fruits_veg: Apple, dairy: Milk, snacks: Popcorn, beverages: CupSoda, grains: Wheat, spices: Sprout, atta: Wheat, oil: Flame,
  breakfast: EggFried, biscuits: Cookie, noodles: Soup, tea: Coffee, personal: Bath, household: Package, cleaning: SprayCan,
  baby: Baby, pharmacy: Pill, frozen: Snowflake, pet: PawPrint, stationery: PenLine, meat: Beef,
};

export const PAYMENT_ICONS: Record<string, LucideIcon> = { cash: Banknote, cash_only: Banknote, digital: Smartphone, both: Wallet };
export const ORDER_ICONS: Record<string, LucideIcon> = { delivery: Bike, dine: Utensils, both: UtensilsCrossed, pickup: Package };

/** Icon inside a softly tinted rounded square. */
export function IconBadge({ icon: Icon, color = 'var(--acc)', size = 40, active = false }: { icon?: LucideIcon; color?: string; size?: number; active?: boolean }) {
  if (!Icon) return null;
  return (
    <span className="flex shrink-0 items-center justify-center rounded-xl transition-colors duration-200"
      style={{ width: size, height: size, color: active ? '#fff' : color, background: active ? color : `color-mix(in srgb, ${color} 11%, white)` }}>
      <Icon size={Math.round(size * 0.48)} strokeWidth={1.8} />
    </span>
  );
}
