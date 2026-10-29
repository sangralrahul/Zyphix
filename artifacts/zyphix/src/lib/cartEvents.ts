/** Opens the Zyphix Now cart drawer from anywhere (kept tiny so the header doesn't pull the drawer into the main bundle). */
export const CART_OPEN_EVENT = 'zx:cart-open';
export const openCart = () => window.dispatchEvent(new Event(CART_OPEN_EVENT));
