import nodemailer from "nodemailer";

type ContactEmailPayload = {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
};

function hasMailConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_TO_EMAIL
  );
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendContactNotification(payload: ContactEmailPayload) {
  if (!hasMailConfig()) {
    return { sent: false, reason: "mail_not_configured" as const };
  }

  const transport = createTransport();

  await transport.sendMail({
    from: `"Dentova Contact" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: payload.email,
    subject: `Nouveau message de ${payload.fullName}`,
    text: [
      `Nom: ${payload.fullName}`,
      `Email: ${payload.email}`,
      `Telephone: ${payload.phone || "Non renseigne"}`,
      "",
      payload.message
    ].join("\n"),
    html: `
      <h2>Nouveau message depuis le site Dentova</h2>
      <p><strong>Nom:</strong> ${payload.fullName}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Telephone:</strong> ${payload.phone || "Non renseigne"}</p>
      <p><strong>Message:</strong></p>
      <p>${payload.message.replace(/\n/g, "<br />")}</p>
    `
  });

  return { sent: true as const };
}

export function isMailConfigured() {
  return hasMailConfig();
}
