import nodemailer from "nodemailer";

/**
 * Creates and returns a configured Nodemailer transporter
 */
const getTransporter = () => {
  const user = (process.env.EMAIL || process.env.EMAIL_USER || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  const pass = (process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || "")
    .trim()
    .replace(/^["']|["']$/g, "");

  if (!user || !pass) {
    throw new Error(
      "Email credentials missing in environment variables. Please set EMAIL and EMAIL_PASS."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Send 6-digit OTP to the specified recipient email address
 * @param {string} to - Recipient email address
 * @param {string|number} otp - 6-digit verification code
 * @param {string} purpose - Purpose of OTP ("login" or "password_reset")
 */
export async function sendEmail(to, otp, purpose = "login") {
  const recipient = (to || "").trim().toLowerCase();
  if (!recipient) {
    throw new Error("Recipient email address is required");
  }

  const senderEmail = (process.env.EMAIL || process.env.EMAIL_USER || "").trim();
  const transporter = getTransporter();

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
        .warning { font-size: 12px; color: #dc2626; margin-top: 16px; text-align: center; }
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

  return transporter.sendMail({
    from: `"Fillcart" <${senderEmail}>`,
    to: recipient,
    subject,
    text: textContent,
    html: htmlContent,
  });
}

export default sendEmail;