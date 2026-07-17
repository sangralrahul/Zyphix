import { Router } from "express";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { BrevoClient, BrevoEnvironment } from "@getbrevo/brevo";

const router = Router();

const ROLE_LABELS: Record<string, string> = {
  restaurant: "Restaurant / Dhaba Owner",
  merchant:   "Merchant / Kirana Store",
  delivery:   "Delivery Partner",
};

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function escHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

type PartnerDetails = Record<string, string | string[]>;

async function generatePDF(data: {
  name: string; email: string; phone: string; city: string; role: string; ts: string; ref: string;
  details?: PartnerDetails;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg     = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const G      = hexToRgb("#0DA366");
  const DARK   = hexToRgb("#0A1F14");
  const WHITE  = rgb(1, 1, 1);
  const GRAY   = hexToRgb("#6B7280");
  const LGRAY  = hexToRgb("#E5E7EB");
  const XGRAY  = hexToRgb("#F9FAFB");
  const INK    = hexToRgb("#111827");
  const AMBER  = hexToRgb("#92400E");
  const LAMBER = hexToRgb("#FFFBEB");

  /* ── Dark header ── */
  page.drawRectangle({ x: 0, y: height - 110, width, height: 110, color: DARK });

  // Green logo block
  page.drawRectangle({ x: 48, y: height - 88, width: 44, height: 44,
    color: G, borderRadius: 8 });
  page.drawText("//", { x: 58, y: height - 70, size: 20, font: fontBold, color: WHITE });

  // Brand name
  page.drawText("ZYPHIX", { x: 104, y: height - 56, size: 24, font: fontBold, color: WHITE });
  page.drawText("India's SuperLocal App", { x: 104, y: height - 76, size: 9, font: fontReg, color: rgb(0.43, 0.91, 0.60) });

  // Ref + timestamp — top right
  page.drawText(`Ref: ${data.ref}`, { x: width - 180, y: height - 54, size: 8, font: fontReg,
    color: rgb(0.6, 0.6, 0.6) });
  page.drawText(data.ts, { x: width - 180, y: height - 67, size: 8, font: fontReg,
    color: rgb(0.5, 0.5, 0.5) });

  /* ── Title ── */
  page.drawText("Partner Registration", { x: 50, y: height - 148, size: 18, font: fontBold, color: INK });
  page.drawText("New partner sign-up submitted via zyphix.in",
    { x: 50, y: height - 166, size: 10, font: fontReg, color: GRAY });

  // Divider line
  page.drawLine({ start: { x: 50, y: height - 178 }, end: { x: width - 50, y: height - 178 },
    thickness: 1, color: LGRAY });

  /* ── Partner type badge ── */
  page.drawRectangle({ x: 50, y: height - 238, width: width - 100, height: 52,
    color: hexToRgb("#F0FDF4"), borderColor: hexToRgb("#BBF7D0"), borderWidth: 1, borderRadius: 4 });
  page.drawText("PARTNER TYPE", { x: 66, y: height - 204, size: 9, font: fontBold, color: G });
  page.drawText(ROLE_LABELS[data.role] ?? data.role,
    { x: 66, y: height - 223, size: 14, font: fontBold, color: INK });

  /* ── Details table ── */
  const fields: [string, string][] = [
    ["Full Name",     data.name],
    ["Email Address", data.email],
    ["Phone Number",  `+91 ${data.phone}`],
    ["City",          data.city],
    ["Partner Type",  ROLE_LABELS[data.role] ?? data.role],
    ["Submitted On",  data.ts],
    ["Reference ID",  data.ref],
  ];

  let y = height - 270;
  page.drawText("Registration Details", { x: 50, y, size: 11, font: fontBold, color: INK });
  y -= 8;

  fields.forEach(([label, value], i) => {
    const rowH = 36;
    y -= rowH;
    page.drawRectangle({ x: 50, y, width: width - 100, height: rowH,
      color: i % 2 === 0 ? XGRAY : WHITE });
    page.drawText(label.toUpperCase(),
      { x: 66, y: y + rowH - 14, size: 8, font: fontBold, color: GRAY });
    page.drawText(value,
      { x: 66, y: y + rowH - 28, size: 12, font: fontReg, color: INK });
  });

  // Table bottom line
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y },
    thickness: 1, color: LGRAY });

  /* ── Partner-specific details ── */
  if (data.details && Object.keys(data.details).length) {
    y -= 18;
    page.drawText("Partner Details", { x: 50, y, size: 11, font: fontBold, color: INK });
    y -= 8;
    const detailEntries = Object.entries(data.details).filter(([, v]) => {
      if (Array.isArray(v)) return v.length > 0;
      return v && String(v).trim();
    });
    detailEntries.forEach(([key, val], i) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
      const value = Array.isArray(val) ? val.join(", ") : String(val);
      const rowH = 36;
      y -= rowH;
      page.drawRectangle({ x: 50, y, width: width - 100, height: rowH,
        color: i % 2 === 0 ? XGRAY : WHITE });
      page.drawText(label.toUpperCase(),
        { x: 66, y: y + rowH - 14, size: 8, font: fontBold, color: GRAY });
      const truncated = value.length > 72 ? value.slice(0, 72) + "…" : value;
      page.drawText(truncated, { x: 66, y: y + rowH - 28, size: 11, font: fontReg, color: INK });
    });
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y },
      thickness: 1, color: LGRAY });
  }

  /* ── Action box ── */
  y -= 28;
  const actionBoxH = 90;
  page.drawRectangle({ x: 50, y: y - actionBoxH, width: width - 100, height: actionBoxH,
    color: LAMBER, borderColor: hexToRgb("#FDE68A"), borderWidth: 1, borderRadius: 4 });
  page.drawText("Action Required", { x: 66, y: y - 18, size: 11, font: fontBold, color: AMBER });
  const actionText = `A new partner has registered on zyphix.in. Please verify their details and reach out via ${data.email} or +91 ${data.phone} to complete onboarding.`;
  const words = actionText.split(" ");
  let line = "";
  let lineY = y - 36;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (fontReg.widthOfTextAtSize(test, 10) > width - 150) {
      page.drawText(line, { x: 66, y: lineY, size: 10, font: fontReg, color: hexToRgb("#78350F") });
      line = word;
      lineY -= 16;
    } else {
      line = test;
    }
  }
  if (line) page.drawText(line, { x: 66, y: lineY, size: 10, font: fontReg, color: hexToRgb("#78350F") });

  /* ── Next steps ── */
  y = y - actionBoxH - 28;
  page.drawText("Verification Steps", { x: 50, y, size: 11, font: fontBold, color: INK });
  y -= 18;
  const steps = [
    "Call / WhatsApp the partner to verify their identity",
    "Ask for GSTIN / Aadhaar / business registration documents",
    "Create their merchant account on the Zyphix dashboard",
    "Send onboarding kit and credentials to their email",
  ];
  steps.forEach((step, i) => {
    page.drawCircle({ x: 60, y: y + 4, size: 4, color: G });
    page.drawText(`${i + 1}. ${step}`,
      { x: 74, y: y - 2, size: 10, font: fontReg, color: hexToRgb("#374151") });
    y -= 22;
  });

  /* ── Footer ── */
  page.drawRectangle({ x: 0, y: 0, width, height: 48, color: DARK });
  page.drawText(
    "This document was auto-generated by the Zyphix Partner Registration system. Do not share externally.",
    { x: 50, y: 28, size: 8, font: fontOblique, color: rgb(0.55, 0.55, 0.55) }
  );
  page.drawText("© 2025 Zyphix · Jammu, J&K · partner@zyphix.in",
    { x: 50, y: 12, size: 8, font: fontReg, color: rgb(0.4, 0.4, 0.4) });

  return pdfDoc.save();
}

router.post("/partner-register", async (req, res) => {
  const { name, email, phone, city, role, details } = req.body as {
    name?: string; email?: string; phone?: string; city?: string; role?: string; details?: PartnerDetails;
  };

  const missing = (["name", "email", "phone", "city", "role"] as const)
    .filter(k => !req.body[k]?.toString().trim());
  if (missing.length) {
    res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email!)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }
  if (!/^[0-9]{10}$/.test(phone!)) {
    res.status(400).json({ error: "Phone must be a 10-digit number." });
    return;
  }

  const apiKey = process.env["BREVO_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "Email service is not configured." });
    return;
  }

  const ts = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata", dateStyle: "long", timeStyle: "short",
  });
  const ref = `ZYP-${Date.now().toString(36).toUpperCase().slice(-8)}`;
  const roleLabel = ROLE_LABELS[role!] ?? role!;

  try {
    // HTML-escape all user-supplied values before interpolating into email templates
    const eName      = escHtml(name);
    const eEmail     = escHtml(email);
    const ePhone     = escHtml(phone);
    const eCity      = escHtml(city);
    const eRoleLabel = escHtml(roleLabel);
    const eRef       = escHtml(ref);
    const eTs        = escHtml(ts);

    const pdfBytes   = await generatePDF({ name: name!, email: email!, phone: phone!, city: city!, role: role!, ts, ref, details });
    const pdfBase64  = Buffer.from(pdfBytes).toString("base64");
    const fileName   = `zyphix-partner-${name!.toLowerCase().replace(/\s+/g, "-")}-${ref}.pdf`;

    const client = new BrevoClient({ apiKey, environment: BrevoEnvironment.Production });

    // 1️⃣ Email owner at partner@zyphix.in with PDF attached
    await client.transactionalEmails.sendTransacEmail({
      subject: `🆕 New Partner Registration — ${roleLabel} (${name})`,
      sender:  { name: "Zyphix Partner", email: "partner@zyphix.in" },
      to:      [{ email: "rahul.rishusangral@gmail.com", name: "Rahul (Zyphix Owner)" }],
      replyTo: { email: email!, name: name! },
      tags:    ["partner-registration", role!],
      attachment: [{ content: pdfBase64, name: fileName }],
      htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:560px;width:100%;">

<tr><td style="background:linear-gradient(135deg,#041A10 0%,#0A1F14 100%);padding:32px 40px;">
  <table cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="width:40px;height:40px;border-radius:8px;background:#0DA366;text-align:center;vertical-align:middle;font-weight:900;font-size:18px;color:#fff;">//</td>
    <td style="padding-left:10px;font-size:20px;font-weight:900;color:#fff;letter-spacing:-0.04em;vertical-align:middle;">ZYPHI<span style="color:#34D399;">X</span></td>
  </tr></table>
</td></tr>

<tr><td style="padding:32px 40px 20px;">
  <div style="display:inline-block;background:#FEF3C7;border-radius:20px;padding:4px 12px;margin-bottom:16px;">
    <span style="font-size:12px;font-weight:700;color:#92400E;letter-spacing:0.06em;">NEW PARTNER REGISTRATION</span>
  </div>
  <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111827;line-height:1.2;">New ${eRoleLabel} on Zyphix! 🎉</h1>
  <p style="margin:0 0 24px;font-size:14px;color:#6B7280;line-height:1.6;">A new partner has signed up on zyphix.in. Their registration PDF is attached below.</p>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
    ${[
      ["Name",         eName],
      ["Email",        eEmail],
      ["Phone",        `+91 ${ePhone}`],
      ["City",         eCity],
      ["Partner Type", eRoleLabel],
      ["Reference ID", eRef],
      ["Submitted",    eTs],
    ].map(([l, v], i) => `
    <tr style="background:${i % 2 === 0 ? "#F9FAFB" : "#FFFFFF"};">
      <td style="padding:10px 16px;font-size:11px;font-weight:700;color:#9CA3AF;letter-spacing:0.05em;width:140px;">${l.toUpperCase()}</td>
      <td style="padding:10px 16px;font-size:13px;color:#111827;font-weight:600;">${v}</td>
    </tr>`).join("")}
  </table>

  ${details && Object.keys(details).length ? `
  <div style="margin-top:20px;">
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#6B7280;letter-spacing:0.06em;">PARTNER-SPECIFIC DETAILS</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
      ${Object.entries(details).filter(([,v]) => Array.isArray(v) ? (v as string[]).length > 0 : String(v||"").trim()).map(([key, val], i) => {
        const label = escHtml(key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()));
        const value = escHtml(Array.isArray(val) ? (val as string[]).join(", ") : String(val));
        return `<tr style="background:${i % 2 === 0 ? "#F9FAFB" : "#FFFFFF"};">
          <td style="padding:10px 16px;font-size:11px;font-weight:700;color:#9CA3AF;letter-spacing:0.05em;width:160px;">${label.toUpperCase()}</td>
          <td style="padding:10px 16px;font-size:13px;color:#111827;font-weight:600;">${value}</td>
        </tr>`;
      }).join("")}
    </table>
  </div>` : ""}

  <div style="margin-top:24px;background:#FFF7ED;border-radius:12px;padding:18px 20px;border-left:4px solid #F97316;">
    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#9A3412;">⚡ Action Required</p>
    <p style="margin:0;font-size:13px;color:#78350F;line-height:1.6;">Contact <strong>${eName}</strong> at <a href="mailto:${eEmail}" style="color:#0DA366;">${eEmail}</a> or <strong>+91 ${ePhone}</strong> to complete verification. The full registration PDF is attached.</p>
  </div>
</td></tr>

<tr><td style="padding:0 40px 28px;">
  <a href="mailto:${eEmail}" style="display:inline-block;padding:12px 24px;background:#0DA366;color:#fff;font-size:13px;font-weight:800;text-decoration:none;border-radius:10px;">Reply to Partner →</a>
</td></tr>

<tr><td style="background:#F9FAFB;padding:16px 40px;text-align:center;">
  <p style="margin:0;font-size:11px;color:#9CA3AF;">© 2025 Zyphix · partner@zyphix.in · Auto-generated by Zyphix Partner System</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`.trim(),
    });

    // 2️⃣ Confirmation email to the partner
    await client.transactionalEmails.sendTransacEmail({
      subject: `Your Zyphix partner application is received! 🎉`,
      sender:  { name: "Zyphix Partner", email: "partner@zyphix.in" },
      to:      [{ email: email!, name: name! }],
      replyTo: { email: "partner@zyphix.in", name: "Zyphix Partnerships" },
      tags:    ["partner-confirmation", role!],
      htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:560px;width:100%;">

<tr><td style="background:linear-gradient(135deg,#041A10 0%,#0A1F14 100%);padding:32px 40px;">
  <table cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="width:40px;height:40px;border-radius:8px;background:#0DA366;text-align:center;vertical-align:middle;font-weight:900;font-size:18px;color:#fff;">//</td>
    <td style="padding-left:10px;font-size:20px;font-weight:900;color:#fff;letter-spacing:-0.04em;vertical-align:middle;">ZYPHI<span style="color:#34D399;">X</span></td>
  </tr></table>
</td></tr>

<tr><td style="padding:32px 40px 28px;">
  <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#0DA366;letter-spacing:0.08em;text-transform:uppercase;">Application Received ✓</p>
  <h1 style="margin:0 0 14px;font-size:24px;font-weight:900;color:#111827;line-height:1.15;">Welcome aboard, ${eName}! 🙌</h1>
  <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.7;">Your <strong style="color:#111827;">${eRoleLabel}</strong> application for Zyphix has been received. Our team will review your details and reach out within <strong style="color:#0DA366;">24–48 hours</strong> to complete your onboarding.</p>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F0FDF4;border-radius:12px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#065F46;letter-spacing:0.06em;text-transform:uppercase;">What happens next</p>
      <p style="margin:0 0 10px;font-size:14px;color:#374151;">✅ &nbsp;Your application is registered with ref <strong style="color:#0DA366;">${eRef}</strong></p>
      <p style="margin:0 0 10px;font-size:14px;color:#374151;">📞 &nbsp;Our team will call/WhatsApp you on <strong>+91 ${ePhone}</strong></p>
      <p style="margin:0 0 10px;font-size:14px;color:#374151;">📄 &nbsp;Have your GSTIN / Aadhaar / business documents ready</p>
      <p style="margin:0;font-size:14px;color:#374151;">🚀 &nbsp;Go live on Zyphix and start receiving orders!</p>
    </td></tr>
  </table>

  <p style="margin:24px 0 0;font-size:13px;color:#9CA3AF;line-height:1.6;">Questions? Reply to this email or reach us at <a href="mailto:partner@zyphix.in" style="color:#0DA366;">partner@zyphix.in</a></p>
</td></tr>

<tr><td style="background:#F9FAFB;padding:16px 40px;text-align:center;">
  <p style="margin:0;font-size:11px;color:#9CA3AF;">© 2025 Zyphix · Jammu, J&K · <a href="mailto:partner@zyphix.in" style="color:#0DA366;text-decoration:none;">partner@zyphix.in</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`.trim(),
    });

    res.json({ success: true, message: "Registration submitted! You'll receive a confirmation email shortly." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    res.status(500).json({ error: message });
  }
});

export default router;
