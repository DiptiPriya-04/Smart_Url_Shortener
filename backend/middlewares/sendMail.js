import nodemailer from "nodemailer";

let transporter;

export const getTransporter = () => {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Missing SMTP_USER or SMTP_PASSWORD environment variables. Set them in Render's Environment tab."
    );
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false, // Brevo uses STARTTLS on 587, not SSL
    auth: {
      user,
      pass: pass.trim(),
    },
  });

  return transporter;
};

export const transport = {
  sendMail: async (options) => {
    const t = getTransporter();
    console.log(`[SMTP] Sending email to ${options.to} via ${t.options.host}...`);
    try {
      const info = await t.sendMail(options);
      console.log(`[SMTP] Sent. Message ID: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error(`[SMTP] Failed to send email to ${options.to}:`, err.message);
      throw err; // re-throw so the caller (your OTP controller) knows it failed
    }
  },
};