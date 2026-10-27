/* Real customer requests saved to the Zyphix database (visible on zyphix.in/admin).
 *  - Eats orders and Book bookings are stored as orders with status "requested";
 *    the team calls the customer to confirm. Id prefix tells the product apart:
 *    ZNW = Now, ZET = Eats, ZBK = Book.
 *  - Waitlist: "tell me when it opens near me".                                   */

const newId = (prefix: string) => prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

export type RequestContact = { name: string; phone: string; address: string; city?: string; notes?: string };

export async function sendRequest(kind: 'eats' | 'book', contact: RequestContact, items: { name: string; qty?: number; note?: string }[], meta: Record<string, string> = {}): Promise<string> {
  const id = newId(kind === 'eats' ? 'ZET' : 'ZBK');
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      id,
      status: 'requested',
      items: items.map(i => ({ name: i.name, qty: i.qty ?? 1, note: i.note })),
      subtotal: 0, deliveryFee: 0, couponDiscount: 0, walletUsed: 0, total: 0,
      paymentMode: 'CALL_TO_CONFIRM',
      etaMinutes: 0,
      address: { name: contact.name.trim(), phone: contact.phone, line1: contact.address.trim(), city: (contact.city || '').trim(), notes: contact.notes?.trim() || undefined, ...meta },
    }),
  });
  if (!res.ok) throw new Error(`request failed (${res.status})`);
  return id;
}

export async function joinWaitlist(product: 'now' | 'eats' | 'book', data: { name?: string; phone: string; city?: string; email?: string }) {
  const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ product, ...data }) });
  if (!res.ok) throw new Error(`waitlist failed (${res.status})`);
}

export const OFFLINE_MSG = "We couldn't send that. Check your internet connection and try again.";
