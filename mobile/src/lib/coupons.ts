export type Coupon = {
  code: string;
  title: string;
  desc: string;
  type: 'FLAT' | 'PERCENT' | 'FREESHIP';
  value: number;           // ₹ for FLAT, % for PERCENT, 0 for FREESHIP
  maxDiscount?: number;    // cap for PERCENT
  minOrder: number;        // min subtotal in ₹
  firstOrderOnly?: boolean;
};

export const COUPONS: Coupon[] = [
  { code: 'WELCOME50',  title: '₹50 OFF for new users',       desc: 'Flat ₹50 off on your first order above ₹199',            type: 'FLAT',     value: 50,  minOrder: 199, firstOrderOnly: true },
  { code: 'SAVE10',     title: '10% OFF up to ₹75',           desc: '10% off on orders above ₹149 (max ₹75 off)',              type: 'PERCENT',  value: 10,  maxDiscount: 75,  minOrder: 149 },
  { code: 'SAVE20',     title: '20% OFF up to ₹150',          desc: '20% off on orders above ₹299 (max ₹150 off)',             type: 'PERCENT',  value: 20,  maxDiscount: 150, minOrder: 299 },
  { code: 'FREESHIP',   title: 'FREE Delivery',               desc: 'Free delivery on orders above ₹99',                        type: 'FREESHIP', value: 0,   minOrder: 99 },
  { code: 'ZYPHIX100',  title: '₹100 OFF on big orders',      desc: 'Flat ₹100 off on orders above ₹499',                       type: 'FLAT',     value: 100, minOrder: 499 },
  { code: 'FRESH25',    title: '25% OFF Mega Saver',          desc: '25% off up to ₹200 on orders above ₹599',                  type: 'PERCENT',  value: 25,  maxDiscount: 200, minOrder: 599 },
];

export function findCoupon(code: string): Coupon | null {
  const c = code.trim().toUpperCase();
  return COUPONS.find(x => x.code === c) || null;
}

export type CouponEval = {
  ok: boolean;
  reason?: string;
  itemDiscount: number;   // ₹ discount applied against items
  shippingWaived: boolean;
};

export function evaluateCoupon(coupon: Coupon, subtotal: number, hasPreviousOrders: boolean): CouponEval {
  if (subtotal < coupon.minOrder) {
    return { ok: false, reason: `Add ₹${coupon.minOrder - subtotal} more to use this coupon`, itemDiscount: 0, shippingWaived: false };
  }
  if (coupon.firstOrderOnly && hasPreviousOrders) {
    return { ok: false, reason: 'Only valid on your first order', itemDiscount: 0, shippingWaived: false };
  }
  if (coupon.type === 'FLAT')     return { ok: true, itemDiscount: Math.min(coupon.value, subtotal), shippingWaived: false };
  if (coupon.type === 'FREESHIP') return { ok: true, itemDiscount: 0, shippingWaived: true };
  // PERCENT
  const raw = Math.floor((subtotal * coupon.value) / 100);
  const capped = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  return { ok: true, itemDiscount: capped, shippingWaived: false };
}
