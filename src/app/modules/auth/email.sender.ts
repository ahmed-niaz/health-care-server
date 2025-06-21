import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (email: string, html: string) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.node_mailer.email,
      pass: config.node_mailer.app_password,
    },
  });

  const info = await transporter.sendMail({
    from: '"Health Care" <niazahmed1427@gmail.com>',
    to: email,
    subject: "Reset Password Link",
    // text: "Hello world?", // plain‑text body
    html, // HTML body
  });

  console.log("Message sent:", info.messageId);
};

export default emailSender;
