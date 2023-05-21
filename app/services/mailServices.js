import nodemailer from "nodemailer";

export const sendMail = async ({
  to = "",
  message = "",
  subject = "",
  attachments = [],
}) => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `Company Name  <${process.env.SENDER_EMAIL}>`,
    to,
    html: message,
    subject,
    attachments,
  });
  if (info.accepted.length) {
    return true;
  }
  return false;
};
