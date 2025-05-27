// utils/mailSender.js
import nodemailer from 'nodemailer';

const mailSender = async (email, title, body) => {
  try {
    // Create a transporter
let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465, // or 587 for TLS
  secure: true, // true for port 465, false for port 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


    // Send email
    let info = await transporter.sendMail({
      from: 'expenseTracker@gmail.com',
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

export default mailSender;
