/* ────────────────────────────────────────────────────────────────────────────
   Partner application emails (Brevo):
   - to the applicant: confirmation from partnerships@zyphix.in, PDF copy attached
   - to the owner (PARTNER_NOTIFY_EMAIL, default rahul@zyphix.in): new application
     with every submitted detail and the same PDF attached
   The PDF is drawn with pdf-lib (standard fonts → text is reduced to Latin-1).
──────────────────────────────────────────────────────────────────────────── */
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';

export type PartnerMailInput = {
  id: string; type: string; name: string; businessName: string; email: string; phone: string;
  city: string; category: string; tags: string; details: Record<string, unknown>; updated: boolean;
};

const TYPE_LABEL: Record<string, string> = { store: 'Store partner', restaurant: 'Restaurant partner', service: 'Service professional', delivery: 'Delivery partner' };
const PRODUCT: Record<string, string> = { store: 'Zyphix Now', restaurant: 'Zyphix Eats', service: 'Zyphix Book', delivery: 'Zyphix delivery' };

const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); };
const latin = (s: string) => s.replace(/₹/g, 'Rs ').replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, '...').replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ACR = /\b(fssai|gst|gstin|pan|ifsc|upi|id|kyc|dl|rc|url|pin)\b/gi;
const pretty = (k: string) => k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()).replace(ACR, m => m.toUpperCase());
const val = (v: unknown): string => Array.isArray(v) ? v.map(val).join(', ') : v && typeof v === 'object' ? Object.entries(v as Record<string, unknown>).map(([k, x]) => `${pretty(k)}: ${val(x)}`).join('; ') : String(v ?? '');

function detailRows(p: PartnerMailInput): [string, string][] {
  const base: [string, string][] = [
    ['Application type', TYPE_LABEL[p.type] ?? p.type], ['Business name', p.businessName], ['Contact name', p.name],
    ['Mobile', p.phone ? `+91 ${p.phone}` : ''], ['Email', p.email], ['City', p.city], ['Category', p.category], ['Tags', p.tags],
  ];
  const skip = new Set(['storeName', 'restaurantName', 'businessName', 'name', 'email', 'phone', 'city']);
  const extra = Object.entries(p.details).filter(([k, v]) => !skip.has(k) && v !== '' && v != null && !(Array.isArray(v) && !v.length)).map(([k, v]) => [pretty(k), val(v)] as [string, string]);
  return [...base, ...extra].filter(([, v]) => v && v.trim());
}

function wrap(text: string, font: PDFFont, size: number, max: number): string[] {
  const words = latin(text).split(/\s+/); const lines: string[] = []; let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(t, size) <= max) cur = t;
    else { if (cur) lines.push(cur); cur = w; while (font.widthOfTextAtSize(cur, size) > max && cur.length > 1) { let i = cur.length; while (i > 1 && font.widthOfTextAtSize(cur.slice(0, i), size) > max) i--; lines.push(cur.slice(0, i)); cur = cur.slice(i); } }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

export async function partnerPdf(p: PartnerMailInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Zyphix partner application ${p.id}`); doc.setAuthor('Zyphix'); doc.setCreator('zyphix.in');
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const W = 595.28, H = 841.89, M = 48;
  const INK = hex('#0B0F12'), GRAY = hex('#6B7280'), LINE = hex('#E5E7EB'), G = hex('#0DA366'), DARK = hex('#06080A');
  let page: PDFPage = doc.addPage([W, H]);
  const header = (pg: PDFPage) => {
    pg.drawRectangle({ x: 0, y: H - 120, width: W, height: 120, color: DARK });
    pg.drawRectangle({ x: 0, y: H - 123, width: W, height: 3, color: G });
    pg.drawRectangle({ x: M, y: H - 84, width: 38, height: 38, color: G });
    pg.drawText('//', { x: M + 9, y: H - 71, size: 17, font: bold, color: rgb(1, 1, 1) });
    pg.drawText('ZYPHIX', { x: M + 52, y: H - 62, size: 21, font: bold, color: rgb(1, 1, 1) });
    pg.drawText('Partner application', { x: M + 52, y: H - 80, size: 10.5, font: reg, color: hex('#9CA3AF') });
    const ref = `Ref ${p.id}`;
    pg.drawText(ref, { x: W - M - reg.widthOfTextAtSize(ref, 10), y: H - 62, size: 10, font: reg, color: hex('#D1D5DB') });
    const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
    pg.drawText(latin(date), { x: W - M - reg.widthOfTextAtSize(latin(date), 10), y: H - 78, size: 10, font: reg, color: hex('#9CA3AF') });
  };
  header(page);
  let y = H - 160;
  page.drawText(latin(p.businessName || p.name), { x: M, y, size: 22, font: bold, color: INK }); y -= 22;
  page.drawText(latin(`${TYPE_LABEL[p.type] ?? p.type} · ${PRODUCT[p.type] ?? 'Zyphix'}`), { x: M, y, size: 11.5, font: reg, color: G }); y -= 18;
  page.drawText('Status: received, waiting for review', { x: M, y, size: 10.5, font: reg, color: GRAY }); y -= 26;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: LINE }); y -= 22;

  const labelW = 150, valX = M + labelW, valW = W - M - valX;
  for (const [k, v] of detailRows(p)) {
    const lines = wrap(v, reg, 11, valW);
    const need = 16 * lines.length + 10;
    if (y - need < 80) { page = doc.addPage([W, H]); header(page); y = H - 160; }
    page.drawText(latin(k), { x: M, y, size: 10, font: bold, color: GRAY });
    lines.forEach((ln, i) => page.drawText(ln, { x: valX, y: y - i * 16, size: 11, font: reg, color: INK }));
    y -= need;
    page.drawLine({ start: { x: M, y: y + 4 }, end: { x: W - M, y: y + 4 }, thickness: 0.5, color: LINE });
    y -= 8;
  }
  for (const pg of doc.getPages()) {
    pg.drawText('Zyphix · partnerships@zyphix.in · zyphix.in', { x: M, y: 40, size: 9, font: reg, color: GRAY });
    pg.drawText('This document confirms that the application was received. It is not an approval.', { x: M, y: 27, size: 8, font: reg, color: hex('#9CA3AF') });
  }
  return doc.save();
}

function b64(bytes: Uint8Array): string {
  let s = ''; const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) s += String.fromCharCode(...bytes.subarray(i, i + CH));
  return btoa(s);
}

const shell = (inner: string) => `<!doctype html><html><body style="margin:0;background:#F4F5F2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #E5E7EB">
<tr><td style="background:#06080A;padding:22px 28px;border-bottom:3px solid #0DA366"><span style="display:inline-block;background:#0DA366;color:#fff;font-weight:800;border-radius:8px;padding:4px 8px;font-size:13px">//</span> <span style="color:#fff;font-weight:800;font-size:17px;letter-spacing:.02em;vertical-align:middle">ZYPHIX</span> <span style="color:#9CA3AF;font-size:13px;vertical-align:middle">&nbsp;Partners</span></td></tr>
${inner}
</table><p style="margin:16px 0 0;font-size:11.5px;color:#9CA3AF">&copy; ${new Date().getFullYear()} Zyphix &middot; <a href="https://partner.zyphix.in" style="color:#9CA3AF">partner.zyphix.in</a></p></td></tr></table></body></html>`;

const table = (rows: [string, string][]) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">${rows.map(([k, v]) => `<tr><td style="padding:9px 0;border-bottom:1px solid #F0F1F3;color:#6B7280;width:38%;vertical-align:top">${esc(k)}</td><td style="padding:9px 0;border-bottom:1px solid #F0F1F3;color:#0B0F12;font-weight:600">${esc(v)}</td></tr>`).join('')}</table>`;

export function applicantEmail(p: PartnerMailInput) {
  const first = (p.name || '').split(' ')[0] || 'there';
  const html = shell(`<tr><td style="padding:30px 28px 6px">
<p style="margin:0;font-size:21px;font-weight:700;color:#0B0F12">${p.updated ? 'We updated your application' : 'We received your application'}, ${esc(first)}</p>
<p style="margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#4B5563">Thank you for applying to join ${esc(PRODUCT[p.type] ?? 'Zyphix')} as a ${esc((TYPE_LABEL[p.type] ?? 'partner').toLowerCase())}. A member of our team will review it and call you on <b>+91 ${esc(p.phone)}</b>, usually within 2 working days.</p>
<p style="margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#4B5563">A PDF copy of your application is attached. Your reference is <b>${esc(p.id)}</b>.</p></td></tr>
<tr><td style="padding:16px 28px 6px"><p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0DA366">What happens next</p>
<ol style="margin:0;padding-left:18px;font-size:14px;line-height:1.8;color:#374151"><li>We check your details.</li><li>We call you to confirm and answer questions.</li><li>Once approved, your listing goes live on Zyphix.</li></ol></td></tr>
<tr><td style="padding:16px 28px 28px"><p style="margin:0;font-size:13px;line-height:1.6;color:#6B7280">Questions? Just reply to this email or write to <a href="mailto:partnerships@zyphix.in" style="color:#0DA366">partnerships@zyphix.in</a>.</p></td></tr>`);
  const text = `${p.updated ? 'We updated your application' : 'We received your application'}, ${first}.\n\nThanks for applying to ${PRODUCT[p.type] ?? 'Zyphix'}. We'll review it and call you on +91 ${p.phone}, usually within 2 working days.\nReference: ${p.id}\n\nQuestions? Reply to this email or write to partnerships@zyphix.in.`;
  return { subject: `Your Zyphix partner application (${p.id})`, html, text };
}

export function ownerEmail(p: PartnerMailInput) {
  const rows = detailRows(p);
  const html = shell(`<tr><td style="padding:28px 28px 8px">
<p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#D97706">${p.updated ? 'Updated application' : 'New partner application'}</p>
<p style="margin:8px 0 0;font-size:21px;font-weight:700;color:#0B0F12">${esc(p.businessName || p.name)}</p>
<p style="margin:4px 0 0;font-size:14px;color:#6B7280">${esc(TYPE_LABEL[p.type] ?? p.type)} · ${esc(p.city || 'City not given')}</p></td></tr>
<tr><td style="padding:12px 28px">${table(rows)}</td></tr>
<tr><td style="padding:14px 28px 28px">
<a href="https://admin.zyphix.in/" style="display:inline-block;background:#0DA366;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:999px">Review in admin</a>
<a href="tel:+91${esc(p.phone)}" style="display:inline-block;margin-left:8px;background:#0B0F12;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:999px">Call +91 ${esc(p.phone)}</a>
<p style="margin:14px 0 0;font-size:12.5px;color:#9CA3AF">Reference ${esc(p.id)} · PDF attached</p></td></tr>`);
  const text = `${p.updated ? 'Updated' : 'New'} partner application: ${p.businessName || p.name}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nReview: https://admin.zyphix.in/`;
  return { subject: `${p.updated ? 'Updated' : 'New'} partner application: ${p.businessName || p.name} (${TYPE_LABEL[p.type] ?? p.type}, ${p.city || 'no city'})`, html, text };
}

export type MailEnv = { BREVO_API_KEY?: string; PARTNER_FROM?: string; PARTNER_NOTIFY_EMAIL?: string };

async function brevo(env: MailEnv, body: Record<string, unknown>) {
  if (!env.BREVO_API_KEY) throw new Error('mail-not-configured');
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST', headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`brevo ${res.status} ${(await res.text()).slice(0, 200)}`);
}

/** Sends both emails; never throws (registration must succeed even if email fails). */
export async function sendPartnerMails(env: MailEnv, p: PartnerMailInput): Promise<{ applicant: boolean; owner: boolean }> {
  const from = { name: 'Zyphix Partnerships', email: env.PARTNER_FROM || 'partnerships@zyphix.in' };
  const owner = env.PARTNER_NOTIFY_EMAIL || 'rahul@zyphix.in';
  let attachment: { name: string; content: string }[] | undefined;
  try { attachment = [{ name: `Zyphix-partner-application-${p.id}.pdf`, content: b64(await partnerPdf(p)) }]; } catch (e) { console.error('partner pdf', (e as Error).message); }
  const result = { applicant: false, owner: false };
  const jobs: Promise<void>[] = [];
  if (p.email) {
    const m = applicantEmail(p);
    jobs.push(brevo(env, { sender: from, to: [{ email: p.email, name: p.name || undefined }], replyTo: from, subject: m.subject, htmlContent: m.html, textContent: m.text, attachment })
      .then(() => { result.applicant = true; }).catch(e => console.error('partner applicant mail', (e as Error).message)));
  }
  const o = ownerEmail(p);
  jobs.push(brevo(env, { sender: from, to: [{ email: owner }], replyTo: p.email ? { email: p.email, name: p.name || undefined } : undefined, subject: o.subject, htmlContent: o.html, textContent: o.text, attachment })
    .then(() => { result.owner = true; }).catch(e => console.error('partner owner mail', (e as Error).message)));
  await Promise.all(jobs);
  return result;
}
