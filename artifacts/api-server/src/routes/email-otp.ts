import { Router } from "express";
import { BrevoClient, BrevoEnvironment } from "@getbrevo/brevo";

const router = Router();

interface OtpRecord {
  otp: string;
  expiresAt: number;
  attempts: number;
  name?: string;
}

const otpStore = new Map<string, OtpRecord>();

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function escHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function cleanExpired() {
  const now = Date.now();
  for (const [key, val] of otpStore.entries()) {
    if (val.expiresAt < now) otpStore.delete(key);
  }
}

/* ── POST /api/send-email-otp ── */
router.post("/send-email-otp", async (req, res) => {
  const { email, name } = req.body as { email?: string; name?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  const apiKey = process.env["BREVO_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "Email service not configured." });
    return;
  }

  cleanExpired();
  const otp = generateOtp();
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
    attempts: 0,
    name: name?.trim() || undefined,
  });

  const client = new BrevoClient({ apiKey, environment: BrevoEnvironment.Production });

  // HTML-escape values before interpolating into email template
  const eOtp = escHtml(otp);

  try {
    await client.transactionalEmails.sendTransacEmail({
      subject: `${otp} — Your Zyphix login code`,
      sender: { name: "Zyphix", email: "noreply@zyphix.in" },
      to: [{ email, name: name || email.split("@")[0] }],
      replyTo: { email: "noreply@zyphix.in", name: "Zyphix" },
      tags: ["email-otp"],
      htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,0.10);max-width:480px;width:100%;">

  <tr><td style="background:linear-gradient(135deg,#041A10 0%,#0A1F14 100%);padding:30px 36px 28px;">
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="width:38px;height:38px;border-radius:8px;background:#0DA366;text-align:center;vertical-align:middle;font-weight:900;font-size:17px;color:#fff;">//</td>
      <td style="padding-left:10px;font-size:19px;font-weight:900;color:#fff;letter-spacing:-0.04em;vertical-align:middle;">ZYPHI<span style="color:#34D399;">X</span></td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:36px 36px 20px;text-align:center;">
    <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0DA366;letter-spacing:0.08em;text-transform:uppercase;">Your Login Code</p>
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111827;">Verify your email</h1>
    <p style="margin:0 0 28px;font-size:14px;color:#6B7280;line-height:1.6;">Use the code below to sign in to Zyphix. It expires in <strong>10 minutes</strong>.</p>

    <div style="background:#F0FDF4;border:2px solid #BBF7D0;border-radius:16px;padding:28px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:48px;font-weight:900;letter-spacing:14px;color:#0DA366;font-family:'Courier New',monospace;">${eOtp}</p>
    </div>

    <p style="margin:0 0 0;font-size:12.5px;color:#9CA3AF;line-height:1.7;">If you didn't request this code, you can safely ignore this email.<br/>This code is valid for one use only.</p>
  </td></tr>

  <tr><td style="background:#F9FAFB;padding:16px 36px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9CA3AF;">© 2025 Zyphix · Jammu, J&K · <a href="https://zyphix.in" style="color:#0DA366;text-decoration:none;">zyphix.in</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`.trim(),
    });

    res.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send OTP";
    res.status(500).json({ error: message });
  }
});

/* ── POST /api/verify-email-otp ── */
router.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body as { email?: string; otp?: string };

  if (!email || !otp) {
    res.status(400).json({ error: "Email and OTP are required." });
    return;
  }

  cleanExpired();
  const key = email.toLowerCase();
  const record = otpStore.get(key);

  if (!record) {
    res.status(400).json({ error: "OTP expired or not found. Please request a new one." });
    return;
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    res.status(400).json({ error: "OTP has expired. Please request a new one." });
    return;
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    otpStore.delete(key);
    res.status(400).json({ error: "Too many attempts. Please request a new OTP." });
    return;
  }
  if (otp.trim() !== record.otp) {
    res.status(400).json({ error: "Incorrect OTP. Please try again." });
    return;
  }

  const name = record.name;
  otpStore.delete(key);
  res.json({ success: true, name: name || null });
});

export default router;
