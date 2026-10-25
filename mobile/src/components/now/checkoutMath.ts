import { RESTAURANTS } from '@/data/eats';
import type { Bill } from '@/components/now/shared';
import { deliveryFee, type Kind, type Line } from '@/lib/cart';

/** Everything the cart and checkout screens need to price a cart. */
export function priceCart(kind: Kind, lines: Line[], restaurantId?: string | null) {
  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const savings = lines.reduce((a, l) => a + Math.max(0, (l.origPrice ?? l.price) - l.price) * l.qty, 0);
  const restaurant = kind === 'eats' && restaurantId ? RESTAURANTS.find(r => r.id === restaurantId) : undefined;
  const delivery = lines.length === 0 ? 0 : deliveryFee(kind, subtotal, restaurant?.deliveryFee ?? 0);
  const bill: Bill = { itemTotal: subtotal, savings, delivery, total: subtotal + delivery };
  const minOrder = restaurant?.minOrder ?? 0;
  const belowMin = kind === 'eats' && subtotal < minOrder;
  const freeHint = kind === 'now' && subtotal > 0 && subtotal < 149 ? `Add ₹${149 - subtotal} more for free delivery` : undefined;
  const etaMinutes = kind === 'eats' ? (parseInt(restaurant?.eta ?? '', 10) || 35) : 30;
  return { subtotal, savings, delivery, bill, restaurant, minOrder, belowMin, freeHint, etaMinutes };
}

export const kindLabel = (k: Kind) => (k === 'now' ? 'Groceries' : 'Food');
