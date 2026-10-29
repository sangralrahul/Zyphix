/* ────────────────────────────────────────────────────────────────────────────
   Transactional emails beyond partner applications (Brevo):
   - order placed → confirmation to the customer, alert to the team
   - partner approved / rejected (from the admin console) → note to the applicant
   All senders fail soft: the request that triggered them has already succeeded.
──────────────────────────────────────────────────────────────────────────── */

export type NotifyEnv = { BREVO_API_KEY?: string; MAIL_FROM?: string; PARTNER_FROM?: string; NOTIFY_EMAIL?: string; PARTNER_NOTIFY_EMAIL?: string };
type Log = (to: string, subject: string, ok: boolean, detail: string) => Promise<void>;

const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

/** Shared branded frame (same look as the partner emails). */
export function shell(inner: string, tag = '') {
  return `<!doctype html><html><body style="margin:0;background:#F4F5F2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #E5E7EB">
<tr><td style="background:#06080A;padding:22px 28px;border-bottom:3px solid #0DA366"><span style="display:inline-block;background:#0DA366;color:#fff;font-weight:800;border-radius:8px;padding:4px 8px;font-size:13px">//</span> <span style="color:#fff;font-weight:800;font-size:17px;letter-spacing:.02em;vertical-align:middle">ZYPHIX</span>${tag ? ` <span style="color:#9CA3AF;font-size:13px;vertical-align:middle">&nbsp;${esc(tag)}</span>` : ''}</td></tr>
${inner}
</table><p style="margin:16px 0 0;font-size:11.5px;color:#9CA3AF">&copy; ${new Date().getFullYear()} Zyphix &middot; <a href="https://zyphix.in" style="color:#9CA3AF">zyphix.in</a> &middot; <a href="https://support.zyphix.in" style="color:#9CA3AF">Help centre</a></p></td></tr></table></body></html>`;
}

const btn = (href: string, label: string, dark = false) => `<a href="${esc(href)}" style="display:inline-block;background:${dark ? '#0B0F12' : '#0DA366'};color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:999px">${esc(label)}</a>`;

async function brevo(env: NotifyEnv, body: Record<string, unknown>, log?: Log) {
  const to = ((body.to as { email: string }[])?.[0]?.email) ?? '';
  const subject = String(body.subject ?? '');
  try {
    if (!env.BREVO_API_KEY) throw new Error('BREVO_API_KEY is not set on the Worker');
    const send = (b: Record<string, unknown>) => fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST', headers: { 'api-key': env.BREVO_API_KEY!, 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(b),
    });
    let res = await send(body);
    let detail = (await res.text()).slice(0, 200);
    let sender = (body.sender as { email: string }).email;
    // Brevo refuses senders it has not verified: fall back to the verified default address.
    const fallback = env.MAIL_FROM || 'noreply@zyphix.in';
    if (res.status === 400 && /sender|not valid|domain/i.test(detail) && sender !== fallback) {
      res = await send({ ...body, sender: { name: (body.sender as { name?: string }).name || 'Zyphix', email: fallback }, replyTo: body.replyTo ?? body.sender });
      detail = (await res.text()).slice(0, 200); sender = fallback;
    }
    if (!res.ok) throw new Error(`Brevo ${res.status}: ${detail}`);
    await log?.(to, subject, true, `sent from ${sender} (${detail})`);
  } catch (e) {
    console.error('notify mail', (e as Error).message);
    await log?.(to, subject, false, (e as Error).message).catch(() => {});
  }
}

/* ── orders ─────────────────────────────────────────────────────────────── */

export type OrderForMail = {
  id: string; email: string | null; items: { name: string; qty: number; price: number; weight?: string; brand?: string }[];
  subtotal: number; deliveryFee: number; discount: number; total: number; paymentMode: string;
  address: { name?: string; phone?: string; line1?: string; line2?: string; city?: string; pincode?: string; notes?: string }; eta: number;
};

const PAY: Record<string, string> = { COD: 'Cash on delivery', cod: 'Cash on delivery', UPI: 'UPI', upi: 'UPI', card: 'Card', CARD: 'Card', wallet: 'Zyphix wallet' };

function itemsTable(o: OrderForMail) {
  const rows = o.items.map(i => `<tr><td style="padding:9px 0;border-bottom:1px solid #F0F1F3;color:#0B0F12">${esc(i.name)}<span style="color:#6B7280;font-size:12.5px"> &nbsp;${esc([i.weight, `× ${i.qty}`].filter(Boolean).join(' · '))}</span></td><td align="right" style="padding:9px 0;border-bottom:1px solid #F0F1F3;color:#0B0F12;white-space:nowrap">${inr(i.price * i.qty)}</td></tr>`).join('');
  const line = (k: string, v: string, bold = false) => `<tr><td style="padding:6px 0;color:${bold ? '#0B0F12' : '#6B7280'};font-weight:${bold ? 700 : 400}">${k}</td><td align="right" style="padding:6px 0;color:#0B0F12;font-weight:${bold ? 700 : 400}">${v}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">${rows}</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin-top:10px">
${line('Items', inr(o.subtotal))}${line('Delivery', o.deliveryFee ? inr(o.deliveryFee) : 'Free')}${o.discount ? line('Discount', `− ${inr(o.discount)}`) : ''}${line('Total', inr(o.total), true)}</table>`;
}

const addr = (a: OrderForMail['address']) => [a.name, a.line1, a.line2, [a.city, a.pincode].filter(Boolean).join(' '), a.phone ? `+91 ${a.phone}` : ''].filter(Boolean).map(esc).join('<br>');

export function customerOrderEmail(o: OrderForMail) {
  const first = (o.address.name || '').split(' ')[0] || 'there';
  const html = shell(`<tr><td style="padding:30px 28px 6px">
<p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0DA366">Order confirmed</p>
<p style="margin:8px 0 0;font-size:21px;font-weight:700;color:#0B0F12">Thanks, ${esc(first)}. Your order is on its way.</p>
<p style="margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#4B5563">Order <b>${esc(o.id)}</b> is being packed at the store and should reach you in about <b>${o.eta} minutes</b>. ${o.paymentMode.toUpperCase() === 'COD' ? `Please keep <b>${inr(o.total)}</b> ready for the rider.` : `Paid by ${esc(PAY[o.paymentMode] ?? o.paymentMode)}.`}</p></td></tr>
<tr><td style="padding:16px 28px 6px">${itemsTable(o)}</td></tr>
<tr><td style="padding:16px 28px 6px"><p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0DA366">Delivering to</p><p style="margin:0;font-size:14px;line-height:1.6;color:#374151">${addr(o.address)}</p></td></tr>
<tr><td style="padding:18px 28px 28px">${btn(`https://now.zyphix.in/order/${encodeURIComponent(o.id)}`, 'Track your order')}
<p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#6B7280">Something wrong with the order? Reply to this email or visit the <a href="https://support.zyphix.in" style="color:#0DA366">help centre</a>.</p></td></tr>`, 'Now');
  const text = `Order ${o.id} confirmed. ETA about ${o.eta} minutes.\n\n${o.items.map(i => `${i.name} × ${i.qty}  ${inr(i.price * i.qty)}`).join('\n')}\n\nTotal ${inr(o.total)} (${PAY[o.paymentMode] ?? o.paymentMode})\nTrack: https://now.zyphix.in/order/${o.id}`;
  return { subject: `Order ${o.id} confirmed · arriving in about ${o.eta} min`, html, text };
}

export function teamOrderEmail(o: OrderForMail) {
  const html = shell(`<tr><td style="padding:28px 28px 8px">
<p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#D97706">New order</p>
<p style="margin:8px 0 0;font-size:21px;font-weight:700;color:#0B0F12">${esc(o.id)} · ${inr(o.total)}</p>
<p style="margin:4px 0 0;font-size:14px;color:#6B7280">${esc(PAY[o.paymentMode] ?? o.paymentMode)} · ${o.items.reduce((n, i) => n + i.qty, 0)} items · ETA ${o.eta} min</p></td></tr>
<tr><td style="padding:12px 28px 6px">${itemsTable(o)}</td></tr>
<tr><td style="padding:16px 28px 6px"><p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0DA366">Deliver to</p><p style="margin:0;font-size:14px;line-height:1.6;color:#374151">${addr(o.address)}${o.address.notes ? `<br><i>${esc(o.address.notes)}</i>` : ''}${o.email ? `<br>${esc(o.email)}` : ''}</p></td></tr>
<tr><td style="padding:14px 28px 28px">${btn('https://admin.zyphix.in/', 'Open in admin')}${o.address.phone ? ` ${btn(`tel:+91${esc(o.address.phone)}`, `Call +91 ${o.address.phone}`, true)}` : ''}</td></tr>`, 'Orders');
  const text = `New order ${o.id} · ${inr(o.total)} · ${PAY[o.paymentMode] ?? o.paymentMode}\n\n${o.items.map(i => `${i.name} × ${i.qty}`).join('\n')}\n\nDeliver to: ${[o.address.name, o.address.line1, o.address.city, o.address.pincode, o.address.phone].filter(Boolean).join(', ')}\nhttps://admin.zyphix.in/`;
  return { subject: `New order ${o.id} · ${inr(o.total)} · ${o.address.city || 'Zyphix Now'}`, html, text };
}

export async function sendOrderMails(env: NotifyEnv, o: OrderForMail, log?: Log) {
  const from = { name: 'Zyphix', email: env.MAIL_FROM || 'noreply@zyphix.in' };
  const team = env.NOTIFY_EMAIL || env.PARTNER_NOTIFY_EMAIL || 'rahul@zyphix.in';
  const jobs: Promise<void>[] = [];
  if (o.email) {
    const m = customerOrderEmail(o);
    jobs.push(brevo(env, { sender: from, to: [{ email: o.email, name: o.address.name || undefined }], replyTo: { email: 'support@zyphix.in', name: 'Zyphix Support' }, subject: m.subject, htmlContent: m.html, textContent: m.text }, log));
  }
  const t = teamOrderEmail(o);
  jobs.push(brevo(env, { sender: from, to: [{ email: team }], replyTo: o.email ? { email: o.email, name: o.address.name || undefined } : undefined, subject: t.subject, htmlContent: t.html, textContent: t.text }, log));
  await Promise.all(jobs);
}

/* ── partner status ─────────────────────────────────────────────────────── */

export type PartnerForMail = { id: string; type: string; name: string; business_name: string; email: string; phone: string; city: string };
const TYPE_LABEL: Record<string, string> = { store: 'store', restaurant: 'restaurant', service: 'service', delivery: 'delivery partner' };
const PRODUCT: Record<string, { name: string; url: string }> = {
  store: { name: 'Zyphix Now', url: 'https://now.zyphix.in' }, restaurant: { name: 'Zyphix Eats', url: 'https://eats.zyphix.in' },
  service: { name: 'Zyphix Book', url: 'https://book.zyphix.in' }, delivery: { name: 'Zyphix', url: 'https://partner.zyphix.in' },
};

export function partnerStatusEmail(p: PartnerForMail, status: 'live' | 'rejected') {
  const first = (p.name || '').split(' ')[0] || 'there';
  const prod = PRODUCT[p.type] ?? PRODUCT.delivery;
  if (status === 'live') {
    const isRider = p.type === 'delivery';
    const html = shell(`<tr><td style="padding:30px 28px 6px">
<p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0DA366">Application approved</p>
<p style="margin:8px 0 0;font-size:21px;font-weight:700;color:#0B0F12">Welcome to Zyphix, ${esc(first)}.</p>
<p style="margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#4B5563">${isRider ? `You are approved as a delivery partner. Our onboarding team will call you on <b>+91 ${esc(p.phone)}</b> with your start details and the partner app.` : `<b>${esc(p.business_name || p.name)}</b> is now live on ${esc(prod.name)}. Customers in ${esc(p.city || 'your area')} can find you from today.`}</p></td></tr>
<tr><td style="padding:16px 28px 6px"><p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0DA366">What happens next</p>
<ol style="margin:0;padding-left:18px;font-size:14px;line-height:1.8;color:#374151">${isRider ? '<li>We call to confirm your working hours and area.</li><li>You get access to the partner app.</li><li>Your first orders start the same week.</li>' : '<li>Your onboarding manager calls to confirm your catalogue, hours and payouts.</li><li>Orders start arriving in the partner app.</li><li>Payouts are settled to your bank account every Monday.</li>'}</ol></td></tr>
<tr><td style="padding:18px 28px 28px">${btn(prod.url, isRider ? 'Partner portal' : `See yourself on ${prod.name}`)}
<p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#6B7280">Questions? Reply to this email or write to <a href="mailto:partnerships@zyphix.in" style="color:#0DA366">partnerships@zyphix.in</a>. Reference ${esc(p.id)}.</p></td></tr>`, 'Partners');
    const text = `Welcome to Zyphix, ${first}. Your application (${p.id}) is approved. ${isRider ? 'Our team will call you with your start details.' : `${p.business_name || p.name} is now live on ${prod.name}: ${prod.url}`}\n\nQuestions? Write to partnerships@zyphix.in.`;
    return { subject: isRider ? 'You are approved as a Zyphix delivery partner' : `${p.business_name || p.name} is now live on ${prod.name}`, html, text };
  }
  const html = shell(`<tr><td style="padding:30px 28px 6px">
<p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6B7280">Application update</p>
<p style="margin:8px 0 0;font-size:21px;font-weight:700;color:#0B0F12">About your Zyphix application, ${esc(first)}</p>
<p style="margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#4B5563">Thank you for applying to join Zyphix as a ${esc(TYPE_LABEL[p.type] ?? 'partner')}. We are not able to onboard <b>${esc(p.business_name || p.name)}</b> right now. This is usually because we have not opened in your area yet, or a detail in the application needs updating.</p>
<p style="margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#4B5563">You can apply again at any time, and we will let you know as soon as Zyphix launches near you.</p></td></tr>
<tr><td style="padding:18px 28px 28px">${btn('https://partner.zyphix.in', 'Partner portal', true)}
<p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#6B7280">Think this is a mistake? Reply to this email and a person will look into it. Reference ${esc(p.id)}.</p></td></tr>`, 'Partners');
  const text = `Thank you for applying to Zyphix. We are not able to onboard ${p.business_name || p.name} right now, usually because we have not opened in your area yet. You can apply again at any time: https://partner.zyphix.in\n\nReference ${p.id}. Reply to this email if you think this is a mistake.`;
  return { subject: 'An update on your Zyphix partner application', html, text };
}

export async function sendPartnerStatusMail(env: NotifyEnv, p: PartnerForMail, status: 'live' | 'rejected', log?: Log) {
  if (!p.email) return;
  const from = { name: 'Zyphix Partnerships', email: env.PARTNER_FROM || 'partnerships@zyphix.in' };
  const m = partnerStatusEmail(p, status);
  await brevo(env, { sender: from, to: [{ email: p.email, name: p.name || undefined }], replyTo: from, subject: m.subject, htmlContent: m.html, textContent: m.text }, log);
}
