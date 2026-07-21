import { corsHeaders, json, sendBrevoEmail } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { email, source } = await req.json() as { email?: string; source?: string };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "A valid email address is required." }, 400);
    }

    await sendBrevoEmail({
      subject: "You're on the Zyphix app waitlist! 🚀",
      sender: { name: "Zyphix", email: "app@zyphix.in" },
      to: [{ email }],
      replyTo: { email: "app@zyphix.in", name: "Zyphix Team" },
      tags: [source ?? "waitlist"],
      htmlContent: `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:560px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#041A10,#062210);padding:36px 40px;text-align:center;">
<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>
<td style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#0DA366,#00D97E);text-align:center;vertical-align:middle;font-weight:900;font-size:18px;color:#fff;">//</td>
<td style="padding-left:10px;font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.04em;vertical-align:middle;">ZYPHI<span style="color:#34D399;">X</span></td>
</tr></table></td></tr>
<tr><td style="padding:40px 40px 28px;">
<p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0DA366;letter-spacing:0.08em;text-transform:uppercase;">You're in! 🎉</p>
<h1 style="margin:0 0 16px;font-size:26px;font-weight:900;color:#111827;line-height:1.18;">The Zyphix app is coming<br/>to your phone.</h1>
<p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.7;">We'll ping you the moment the Zyphix app drops on <strong style="color:#111827;">iOS &amp; Android</strong>. As an early registrant, you'll get an <strong style="color:#0DA366;">exclusive 50% off</strong> on your first order — app-only.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdf4;border-radius:12px;margin-bottom:28px;"><tr><td style="padding:20px 24px;">
<p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#065f46;letter-spacing:0.06em;text-transform:uppercase;">Your early-access perks</p>
<p style="margin:0 0 10px;font-size:14px;color:#374151;">⚡ 30-min grocery delivery at kirana prices</p>
<p style="margin:0 0 10px;font-size:14px;color:#374151;">🍱 Food from Jammu's best local dhabas</p>
<p style="margin:0 0 10px;font-size:14px;color:#374151;">🏷️ App-exclusive deals — not available on web</p>
<p style="margin:0 0 10px;font-size:14px;color:#374151;">🎁 50% OFF on your very first app order</p>
<p style="margin:0;font-size:14px;color:#374151;">🔔 Priority launch-day access</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
<a href="https://zyphix.in" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#0DA366,#00D97E);color:#fff;font-size:15px;font-weight:800;text-decoration:none;border-radius:12px;">Visit Zyphix.in →</a>
</td></tr></table></td></tr>
<tr><td style="padding:0 40px;"><div style="height:1px;background:#f3f4f6;"></div></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="margin:0;font-size:12px;color:#9ca3af;">© 2025 Zyphix · Jammu, J&amp;K · <a href="mailto:app@zyphix.in" style="color:#0DA366;text-decoration:none;">app@zyphix.in</a></p>
</td></tr></table></td></tr></table></body></html>`.trim(),
    });

    return json({ success: true, message: "You're on the list! Check your inbox." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return json({ error: message }, 500);
  }
});
