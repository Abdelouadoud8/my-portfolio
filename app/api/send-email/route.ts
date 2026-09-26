import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const LIMITS = {
  firstname: 100,
  lastname: 100,
  email: 254,
  phone: 30,
  subject: 200,
  message: 5000,
};
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE_PATTERN = /^[+\d\s().-]*$/;

// Anti-spam: humans take a few seconds to fill the form; bots fill the hidden honeypot field
const MIN_FILL_TIME_MS = 3000;
const MAX_FILL_TIME_MS = 24 * 60 * 60 * 1000;

// Best-effort rate limit per IP (in memory, so per serverless instance)
const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };
const recentSends = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const sends = (recentSends.get(ip) || []).filter(
    (time) => now - time < RATE_LIMIT.windowMs
  );
  if (sends.length >= RATE_LIMIT.max) {
    recentSends.set(ip, sends);
    return true;
  }
  sends.push(now);
  recentSends.set(ip, sends);
  return false;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Single-line values (names, subject) must not carry line breaks into email headers
function singleLine(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return error("Invalid request.");
  }

  // Honeypot filled: pretend it worked so bots don't adapt
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  const startedAt = Number(data.startedAt);
  const elapsed = Date.now() - startedAt;
  if (!startedAt || elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FILL_TIME_MS) {
    return error("Please take a moment to fill in the form, then try again.");
  }

  const fields = {} as Record<keyof typeof LIMITS, string>;
  for (const [key, max] of Object.entries(LIMITS) as [keyof typeof LIMITS, number][]) {
    const value = data[key] ?? "";
    if (typeof value !== "string" || value.length > max) {
      return error(`The ${key} field is invalid.`);
    }
    fields[key] = key === "message" ? value.trim() : singleLine(value);
  }

  const { firstname, lastname, email, phone, subject, message } = fields;

  if (!firstname || !lastname || !email || !subject || !message) {
    return error("Some required fields are missing.");
  }
  if (!EMAIL_PATTERN.test(email)) {
    return error("The email address is invalid.");
  }
  if (!PHONE_PATTERN.test(phone)) {
    return error("The phone number is invalid.");
  }

  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";
  if (isRateLimited(ip)) {
    return error("Too many messages. Please try again in a few minutes.", 429);
  }

  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpEmail || !smtpPassword) {
    console.error("❌ SMTP credentials missing");
    return error("Server configuration is missing.", 500);
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });

  const fullname = `${lastname} ${firstname}`;
  const safe = {
    fullname: escapeHtml(fullname),
    email: escapeHtml(email),
    phone: escapeHtml(phone || "Non fourni"),
    subject: escapeHtml(subject),
    message: escapeHtml(message).replace(/\r?\n/g, "<br />"),
  };

  try {
    await transporter.sendMail({
      // Send from our own address (the visitor's would fail SPF/DMARC); reply goes to the visitor
      from: { name: `Portfolio · ${fullname}`, address: smtpEmail },
      replyTo: { name: fullname, address: email },
      to: smtpEmail,
      subject: `[Portfolio] ${subject}`,
      text: `${subject}\n\nFullname: ${fullname}\nEmail: ${email}\nTéléphone: ${
        phone || "Non fourni"
      }\n\nMessage:\n${message}`,
      html: `
      <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #F9FAFC;">
      <h2 style="color: #2d3748; border-bottom: 2px solid #2B4A78; padding-bottom: 8px;">${safe.subject}</h2>

      <p style="margin: 16px 0;"><strong>Fullname :</strong> ${safe.fullname}</p>
      <p style="margin: 16px 0;"><strong>Email :</strong> <a href="mailto:${safe.email}" style="color: #4a90e2;">${safe.email}</a></p>
      <p style="margin: 16px 0;"><strong>Téléphone :</strong> ${safe.phone}</p>
      <div style="margin-top: 24px;">
        <p style="font-weight: bold; margin-bottom: 8px;">Message :</p>
        <p style="background: #ffffff; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">${safe.message}</p>
      </div>

      <p style="margin-top: 32px; font-size: 12px; color: #888;">
        Ce message a été généré automatiquement depuis le formulaire de contact de mon portfolio.
      </p>
    </div>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return error("Error while sending email.", 500);
  }
}
