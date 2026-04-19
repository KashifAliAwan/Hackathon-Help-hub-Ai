import nodemailer from "nodemailer";

export const generateOtp = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const sendOtpEmail = async ({ email, otp, name }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Email Verification</h2>
      <p>Hello${name ? ` ${name}` : ""},</p>
      <p>Your verification code is:</p>
      <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${otp}</div>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;

  return transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Your OTP Code",
    html,
  });
};