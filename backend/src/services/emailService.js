import { Resend } from "resend";

/**
 * Creates and returns a configured Resend client instance
 */
const getResendClient = () => {
  const apiKey = (process.env.RESEND_API_KEY || "").trim().replace(/^["']|["']$/g, "");
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is missing or empty in environment variables. Please configure RESEND_API_KEY on Render."
    );
  }
  return new Resend(apiKey);
};

/**
 * Safe Resend configuration verifier (does not log API keys or secrets)
 */
export async function verifyEmailService() {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    console.warn("⚠️ Resend Email service: RESEND_API_KEY is not set in environment variables.");
    return false;
  }
  console.log("✅ Resend Email API initialized and ready to send OTPs over HTTPS.");
  return true;
}

/**
 * Send 6-digit OTP to the specified recipient email address using Resend HTTPS API
 * @param {string} to - Recipient email address entered by user
 * @param {string|number} otp - 6-digit verification code
 * @param {string} purpose - Purpose of OTP ("login" or "password_reset")
 */
export async function sendEmail(to, otp, purpose = "login") {
  const recipient = (to || "").trim().toLowerCase();
  if (!recipient) {
    throw new Error("Recipient email address is required");
  }

  const resend = getResendClient();

  // In Resend, default to "Fillcart <onboarding@resend.dev>" or user configured domain in EMAIL_FROM
  const fromEmail = (
    process.env.EMAIL_FROM || "Fillcart <onboarding@resend.dev>"
  )
    .trim()
    .replace(/^["']|["']$/g, "");

  const isReset = purpose === "password_reset";
  const subject = isReset
    ? `Fillcart - Password Reset Verification Code: ${otp}`
    : `Fillcart - Your Login Verification Code: ${otp}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { text-align: center; margin-bottom: 24px; }
        .logo { font-size: 26px; font-weight: 900; color: #16a34a; letter-spacing: -0.5px; }
        .logo span { color: #15803d; }
        .title { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 8px; margin-bottom: 4px; }
        .subtitle { font-size: 14px; color: #64748b; margin: 0; }
        .otp-box { background: #f0fdf4; border: 2px dashed #86efac; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 36px; font-weight: 900; color: #166534; letter-spacing: 8px; font-family: monospace; }
        .meta { font-size: 13px; color: #64748b; line-height: 1.6; text-align: center; }
        .meta strong { color: #334155; }
        .footer { border-top: 1px solid #f1f5f9; margin-top: 28px; padding-top: 16px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Fill<span>Carts</span></div>
          <div class="title">${isReset ? "Password Reset Request" : "Account Verification"}</div>
          <p class="subtitle">Use the verification code below to ${isReset ? "reset your password" : "log in to your account"}.</p>
        </div>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
        </div>
        
        <p class="meta">
          This OTP is valid for <strong>5 minutes</strong>. For your security, please do not share this code with anyone.
        </p>
        
        <div class="footer">
          &copy; ${new Date().getFullYear()} Fillcart Inc. All rights reserved.<br/>
          If you didn't request this code, you can safely ignore this email.
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `Your Fillcart verification code is: ${otp}\n\nThis OTP is valid for 5 minutes. Please do not share it with anyone.`;

  const response = await resend.emails.send({
    from: fromEmail,
    to: [recipient],
    subject,
    text: textContent,
    html: htmlContent,
  });

  if (response.error) {
    throw new Error(`Resend API delivery failed: ${response.error.message || JSON.stringify(response.error)}`);
  }

  return response.data;
}

export default sendEmail;