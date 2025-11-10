import nodemailer from "nodemailer";
import crypto from "crypto";
import { CONFIG } from "@/config/config";

// Create transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: CONFIG.EMAIL.HOST,
    port: CONFIG.EMAIL.PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: CONFIG.EMAIL.USER,
      pass: CONFIG.EMAIL.PASSWORD,
    },
  });
}

// Generate verification token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Generate verification code (6-digit number)
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification code email
export async function sendVerificationCodeEmail(
  email: string,
  code: string
): Promise<boolean> {
  try {
    // If email is not configured, log and return true for development
    if (!CONFIG.EMAIL.USER || !CONFIG.EMAIL.PASSWORD) {
      console.log("📧 Email not configured. Verification code:", code);
      return true;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: CONFIG.EMAIL.FROM,
      to: email,
      subject: "Email Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification Code</h2>
          <p>Your email verification code is:</p>
          <p style="margin: 30px 0; font-size: 32px; font-weight: bold; color: #0070f3; letter-spacing: 5px;">
            ${code}
          </p>
          <p style="color: #666; font-size: 14px;">
            This code will expire in 10 minutes.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending verification code email:", error);
    return false;
  }
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<boolean> {
  try {
    // If email is not configured, log and return true for development
    if (!CONFIG.EMAIL.USER || !CONFIG.EMAIL.PASSWORD) {
      console.log("📧 Email not configured. Verification token:", token);
      console.log(
        `📧 Verification link: ${CONFIG.APP_URL}/verify-email?token=${token}`
      );
      return true;
    }

    const transporter = createTransporter();
    const verificationUrl = `${CONFIG.APP_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: CONFIG.EMAIL.FROM,
      to: email,
      subject: "Please verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello, ${name}!</h2>
          <p>Please click the link below to verify your email to complete registration.</p>
          <p style="margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #0070f3; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste the link into your browser:<br>
            <a href="${verificationUrl}" style="color: #0070f3;">${verificationUrl}</a>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This link will expire in 1 hour.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}
