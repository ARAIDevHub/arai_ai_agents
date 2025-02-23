import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset</p>
      <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
      <p>If you didn't request this, please ignore this email</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};