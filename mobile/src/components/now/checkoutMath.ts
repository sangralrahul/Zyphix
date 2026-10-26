import { useQuery } from '@tanstack/react-query';

import { RESTAURANTS } from '@/data/eats';
import type { Bill } from '@/components/now/shared';
import { Api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { deliveryFee, type Kind, type Line } from '@/lib/cart';
import { evaluateCoupon, findCoupon, type Coupon, type CouponEval } from '@/lib/coupons';

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

export type Priced = ReturnType<typeof priceCart>;

/** Applies a coupon (same rules as the website) on top of a priced cart. */
export function withCoupon(m: Priced, code: string | null | undefined, hasPreviousOrders: boolean) {
  const coupon: Coupon | null = code ? findCoupon(code) : null;
  const ev: CouponEval | null = coupon ? evaluateCoupon(coupon, m.subtotal, hasPreviousOrders) : null;
  const ok = !!ev?.ok;
  const couponDiscount = ok ? ev!.itemDiscount : 0;
  const shippingWaived = ok && ev!.shippingWaived;
  const delivery = shippingWaived ? 0 : m.delivery;
  const deliveryWaived = shippingWaived ? m.delivery : 0;
  const total = Math.max(0, m.subtotal + delivery - couponDiscount);
  return { coupon, ev, ok, couponDiscount, delivery, deliveryWaived, total, totalSaved: m.savings + couponDiscount + deliveryWaived };
}

/** Whether the signed-in user has ordered before (first-order coupons). Guests count as new. */
export function useHasOrders() {
  const { user } = useAuth();
  const q = useQuery({ queryKey: ['my-orders', user?.id], queryFn: Api.myOrders, enabled: !!user, staleTime: 60_000 });
  return !!user && (q.data?.length ?? 0) > 0;
}

export const kindLabel = (k: Kind) => (k === 'now' ? 'Groceries' : 'Food');
