import { corsHeaders, json, escHtml, sendBrevoEmail } from "../_shared/cors.ts";

const OTP_SECRET = Deno.env.get("BREVO_API_KEY") ?? "zyphix-otp-fallback-secret";

async function hmac(msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(OTP_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function b64url(s: string) {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s: string) {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  return atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json() as {
      action?: "send" | "verify";
      email?: string;
      name?: string;
      otp?: string;
      token?: string;
    };
    const action = body.action ?? "send";
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Please enter a valid email address." }, 400);
    }

    if (action === "send") {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = Date.now() + 10 * 60 * 1000;
      const name = body.name?.trim() || "";
      const payload = JSON.stringify({ e: email, o: otp, x: expiresAt, n: name });
      const payloadB64 = b64url(payload);
      const sig = await hmac(payloadB64);
      const token = `${payloadB64}.${sig}`;

      await sendBrevoEmail({
        subject: `${otp} — Your Zyphix login code`,
        sender: { name: "Zyphix", email: "noreply@zyphix.in" },
        to: [{ email, name: name || email.split("@")[0] }],
        replyTo: { email: "noreply@zyphix.in", name: "Zyphix" },
        tags: ["email-otp"],
        htmlContent: `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;"><tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,0.10);max-width:480px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#041A10,#0A1F14);padding:30px 36px 28px;">
<table cellpadding="0" cellspacing="0" border="0"><tr>
<td style="width:38px;height:38px;border-radius:8px;background:#0DA366;text-align:center;vertical-align:middle;font-weight:900;font-size:17px;color:#fff;">//</td>
<td style="padding-left:10px;font-size:19px;font-weight:900;color:#fff;letter-spacing:-0.04em;vertical-align:middle;">ZYPHI<span style="color:#34D399;">X</span></td>
</tr></table></td></tr>
<tr><td style="padding:36px 36px 20px;text-align:center;">
<p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0DA366;letter-spacing:0.08em;text-transform:uppercase;">Your Login Code</p>
<h1 style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111827;">Verify your email</h1>
<p style="margin:0 0 28px;font-size:14px;color:#6B7280;line-height:1.6;">Use the code below to sign in to Zyphix. It expires in <strong>10 minutes</strong>.</p>
<div style="background:#F0FDF4;border:2px solid #BBF7D0;border-radius:16px;padding:28px 20px;margin-bottom:24px;">
<p style="margin:0;font-size:48px;font-weight:900;letter-spacing:14px;color:#0DA366;font-family:'Courier New',monospace;">${escHtml(otp)}</p>
</div>
<p style="margin:0;font-size:12.5px;color:#9CA3AF;line-height:1.7;">If you didn't request this code, ignore this email.<br/>This code is valid for one use only.</p>
</td></tr>
<tr><td style="background:#F9FAFB;padding:16px 36px;text-align:center;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">© 2025 Zyphix · Jammu, J&amp;K · <a href="https://zyphix.in" style="color:#0DA366;text-decoration:none;">zyphix.in</a></p>
</td></tr></table></td></tr></table></body></html>`.trim(),
      });

      return json({ success: true, token });
    }

    // verify
    const otp = body.otp?.trim();
    const token = body.token;
    if (!otp || !token) return json({ error: "OTP and token are required." }, 400);
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return json({ error: "Invalid token." }, 400);
    const expectedSig = await hmac(payloadB64);
    if (!timingSafeEqual(sig, expectedSig)) return json({ error: "Invalid or tampered token." }, 400);
    let parsed: { e: string; o: string; x: number; n?: string };
    try {
      parsed = JSON.parse(b64urlDecode(payloadB64));
    } catch {
      return json({ error: "Invalid token." }, 400);
    }
    if (parsed.e !== email) return json({ error: "Email mismatch." }, 400);
    if (Date.now() > parsed.x) return json({ error: "OTP has expired. Please request a new one." }, 400);
    if (parsed.o !== otp) return json({ error: "Incorrect OTP. Please try again." }, 400);

    return json({ success: true, name: parsed.n || null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    return json({ error: message }, 500);
  }
});
