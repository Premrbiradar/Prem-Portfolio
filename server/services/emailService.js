const nodemailer = require('nodemailer');

// Supports two providers so the person can use whichever they already have:
// - Resend (simple API, no SMTP setup) when RESEND_API_KEY is set
// - Classic SMTP (Nodemailer) otherwise, e.g. a Gmail app password
const isResendConfigured = () => Boolean(process.env.RESEND_API_KEY);
const isSmtpConfigured = () =>
  Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

let transporter = null;
const getTransporter = () => {
  if (!transporter && isSmtpConfigured()) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });
  }
  return transporter;
};

const sendViaResend = async ({ from, to, replyTo, subject, html }) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, reply_to: replyTo, subject, html }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error: ${response.status} ${body}`);
  }
};

// Sends the contact-form notification to the site owner. Returns false
// (without throwing) if no email provider is configured yet, so the message
// still gets saved to MongoDB even before email is set up.
const sendContactNotification = async ({ name, email, subject, message }) => {
  const to = process.env.CONTACT_EMAIL;
  const html = `
    <h2>New portfolio contact message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br />')}</p>
  `;

  if (isResendConfigured()) {
    await sendViaResend({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to,
      replyTo: email,
      subject: `Portfolio contact: ${subject}`,
      html,
    });
    return true;
  }

  const smtp = getTransporter();
  if (smtp) {
    await smtp.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to,
      replyTo: email,
      subject: `Portfolio contact: ${subject}`,
      html,
    });
    return true;
  }

  console.warn('No email provider configured (RESEND_API_KEY or EMAIL_* vars). Message saved but not emailed.');
  return false;
};

module.exports = { sendContactNotification };
