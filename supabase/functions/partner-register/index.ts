import { corsHeaders, json, escHtml, sendBrevoEmail } from "../_shared/cors.ts";

const ROLE_LABELS: Record<string, string> = {
  restaurant: "Restaurant / Dhaba Owner",
  merchant: "Merchant / Kirana Store",
  delivery: "Delivery Partner",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { name, email, phone, city, role, details } = await req.json() as {
      name?: string; email?: string; phone?: string; city?: string; role?: string;
      details?: Record<string, string | string[]>;
    };

    const missing = (["name", "email", "phone", "city", "role"] as const)
      .filter((k) => !({ name, email, phone, city, role }[k] ?? "").toString().trim());
    if (missing.length) return json({ error: `Missing fields: ${missing.join(", ")}` }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email!)) return json({ error: "Please enter a valid email address." }, 400);
    if (!/^[0-9]{10}$/.test(phone!)) return json({ error: "Phone must be a 10-digit number." }, 400);

    const ts = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long", timeStyle: "short" });
    const ref = `ZYP-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    const roleLabel = ROLE_LABELS[role!] ?? role!;

    const eName = escHtml(name); const eEmail = escHtml(email); const ePhone = escHtml(phone);
    const eCity = escHtml(city); const eRoleLabel = escHtml(roleLabel);
    const eRef = escHtml(ref); const eTs = escHtml(ts);

    const detailsHtml = details && Object.keys(details).length ? `
    <div style="margin-top:20px;">
      <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#6B7280;letter-spacing:0.06em;">PARTNER-SPECIFIC DETAILS</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
        ${Object.entries(details).filter(([, v]) => Array.isArray(v) ? v.length > 0 : String(v || "").trim()).map(([key, val], i) => {
          const label = escHtml(key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()));
          const value = escHtml(Array.isArray(val) ? val.join(", ") : String(val));
          return `<tr style="background:${i % 2 === 0 ? "#F9FAFB" : "#FFFFFF"};">
            <td style="padding:10px 16px;font-size:11px;font-weight:700;color:#9CA3AF;letter-spacing:0.05em;width:160px;">${label.toUpperCase()}</td>
            <td style="padding:10px 16px;font-size:13px;color:#111827;font-weight:600;">${value}</td>
          </tr>`;
        }).join("")}
      </table>
    </div>` : "";

    // Owner notification
    await sendBrevoEmail({
      subject: `🆕 New Partner Registration — ${roleLabel} (${name})`,
      sender: { name: "Zyphix Partner", email: "partner@zyphix.in" },
      to: [{ email: "rahul.rishusangral@gmail.com", name: "Rahul (Zyphix Owner)" }],
      replyTo: { email: email!, name: name! },
      tags: ["partner-registration", role!],
      htmlContent: `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#041A10,#0A1F14);padding:32px 40px;">
<table cellpadding="0" cellspacing="0" border="0"><tr>
<td style="width:40px;height:40px;border-radius:8px;background:#0DA366;text-align:center;vertical-align:middle;font-weight:900;font-size:18px;color:#fff;">//</td>
<td style="padding-left:10px;font-size:20px;font-weight:900;color:#fff;vertical-align:middle;">ZYPHI<span style="color:#34D399;">X</span></td>
</tr></table></td></tr>
<tr><td style="padding:32px 40px 20px;">
<div style="display:inline-block;background:#FEF3C7;border-radius:20px;padding:4px 12px;margin-bottom:16px;"><span style="font-size:12px;font-weight:700;color:#92400E;letter-spacing:0.06em;">NEW PARTNER REGISTRATION</span></div>
<h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111827;">New ${eRoleLabel} on Zyphix! 🎉</h1>
<p style="margin:0 0 24px;font-size:14px;color:#6B7280;line-height:1.6;">A new partner has signed up on zyphix.in.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
${[["Name", eName], ["Email", eEmail], ["Phone", `+91 ${ePhone}`], ["City", eCity], ["Partner Type", eRoleLabel], ["Reference ID", eRef], ["Submitted", eTs]].map(([l, v], i) => `
<tr style="background:${i % 2 === 0 ? "#F9FAFB" : "#FFFFFF"};">
<td style="padding:10px 16px;font-size:11px;font-weight:700;color:#9CA3AF;width:140px;">${l.toUpperCase()}</td>
<td style="padding:10px 16px;font-size:13px;color:#111827;font-weight:600;">${v}</td>
</tr>`).join("")}
</table>
${detailsHtml}
<div style="margin-top:24px;background:#FFF7ED;border-radius:12px;padding:18px 20px;border-left:4px solid #F97316;">
<p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#9A3412;">⚡ Action Required</p>
<p style="margin:0;font-size:13px;color:#78350F;line-height:1.6;">Contact <strong>${eName}</strong> at <a href="mailto:${eEmail}" style="color:#0DA366;">${eEmail}</a> or <strong>+91 ${ePhone}</strong> to complete verification.</p>
</div></td></tr>
<tr><td style="background:#F9FAFB;padding:16px 40px;text-align:center;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">© 2025 Zyphix · partner@zyphix.in</p>
</td></tr></table></td></tr></table></body></html>`.trim(),
    });

    // Partner confirmation
    await sendBrevoEmail({
      subject: `Your Zyphix partner application is received! 🎉`,
      sender: { name: "Zyphix Partner", email: "partner@zyphix.in" },
      to: [{ email: email!, name: name! }],
      replyTo: { email: "partner@zyphix.in", name: "Zyphix Partnerships" },
      tags: ["partner-confirmation", role!],
      htmlContent: `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#041A10,#0A1F14);padding:32px 40px;">
<table cellpadding="0" cellspacing="0" border="0"><tr>
<td style="width:40px;height:40px;border-radius:8px;background:#0DA366;text-align:center;vertical-align:middle;font-weight:900;font-size:18px;color:#fff;">//</td>
<td style="padding-left:10px;font-size:20px;font-weight:900;color:#fff;vertical-align:middle;">ZYPHI<span style="color:#34D399;">X</span></td>
</tr></table></td></tr>
<tr><td style="padding:32px 40px 28px;">
<p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#0DA366;letter-spacing:0.08em;text-transform:uppercase;">Application Received ✓</p>
<h1 style="margin:0 0 14px;font-size:24px;font-weight:900;color:#111827;">Welcome aboard, ${eName}! 🙌</h1>
<p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.7;">Your <strong style="color:#111827;">${eRoleLabel}</strong> application for Zyphix has been received. Our team will review your details and reach out within <strong style="color:#0DA366;">24–48 hours</strong>.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F0FDF4;border-radius:12px;"><tr><td style="padding:20px 24px;">
<p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#065F46;letter-spacing:0.06em;text-transform:uppercase;">What happens next</p>
<p style="margin:0 0 10px;font-size:14px;color:#374151;">✅ Your application is registered with ref <strong style="color:#0DA366;">${eRef}</strong></p>
<p style="margin:0 0 10px;font-size:14px;color:#374151;">📞 Our team will call/WhatsApp you on <strong>+91 ${ePhone}</strong></p>
<p style="margin:0 0 10px;font-size:14px;color:#374151;">📄 Have your GSTIN / Aadhaar / business documents ready</p>
<p style="margin:0;font-size:14px;color:#374151;">🚀 Go live on Zyphix and start receiving orders!</p>
</td></tr></table>
<p style="margin:24px 0 0;font-size:13px;color:#9CA3AF;line-height:1.6;">Questions? Reply to this email or reach us at <a href="mailto:partner@zyphix.in" style="color:#0DA366;">partner@zyphix.in</a></p>
</td></tr>
<tr><td style="background:#F9FAFB;padding:16px 40px;text-align:center;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">© 2025 Zyphix · Jammu, J&amp;K</p>
</td></tr></table></td></tr></table></body></html>`.trim(),
    });

    return json({ success: true, ref });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit registration";
    return json({ error: message }, 500);
  }
});
