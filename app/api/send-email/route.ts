import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const data = await req.json();

  const { firstname, lastname, email, phone, subject, message } = data;

  // Validate required fields
  if (!lastname || !firstname || !subject || !message || !email) {
    return NextResponse.json(
      { error: "Some required fields are missing." },
      { status: 400 }
    );
  }

  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpEmail || !smtpPassword) {
    console.error("❌ SMTP credentials missing");
    return NextResponse.json(
      { error: "Server configuration is missing." },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `${lastname + " " + firstname} <${email}>`,
      to: smtpEmail,
      subject: subject,
      html: `
      <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #F9FAFC;">
      <h2 style="color: #2d3748; border-bottom: 2px solid #2B4A78; padding-bottom: 8px;">${subject}</h2>

      <p style="margin: 16px 0;"><strong>Fullname :</strong> ${lastname} ${firstname}</p>
      <p style="margin: 16px 0;"><strong>Email :</strong> <a href="mailto:${email}" style="color: #4a90e2;">${email}</a></p>
      <p style="margin: 16px 0;"><strong>Téléphone :</strong> ${
        phone || "Non fourni"
      }</p>
      <div style="margin-top: 24px;">
        <p style="font-weight: bold; margin-bottom: 8px;">Message :</p>
        <p style="background: #ffffff; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">${message}</p>
      </div>

      <p style="margin-top: 32px; font-size: 12px; color: #888;">
        Ce message a été généré automatiquement depuis le formulaire de contact de mon portfolio.
      </p>
    </div>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Error while sending email." },
      { status: 500 }
    );
  }
}
