import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate OTP (6-digit code)
export const generateOTP = () => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
    step: 300, // OTP valid for 5 minutes
  });
  return otp;
};

// Send OTP via email
export const sendOTPEmail = async (email, otp, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Music Website Verification',
    html: `
      <h2>Email Verification</h2>
      <p>Hello ${userName},</p>
      <p>Your One-Time Password (OTP) for email verification is:</p>
      <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <hr />
      <p style="color: #666;">Please don't share this OTP with anyone.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Verify OTP
export const verifyOTP = (storedOTP, providedOTP, otpExpiry) => {
  if (!storedOTP || !providedOTP) {
    return false;
  }

  // Check if OTP has expired
  if (new Date() > new Date(otpExpiry)) {
    return false;
  }

  // Compare OTP
  return storedOTP === providedOTP;
};

// Generate OTP expiry time (5 minutes from now)
export const generateOTPExpiry = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};
