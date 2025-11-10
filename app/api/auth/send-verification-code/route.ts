import { NextRequest } from "next/server";
import { getUserByEmail, storeEmailVerificationCode } from "@/lib/db";
import {
  generateVerificationCode,
  sendVerificationCodeEmail,
} from "@/lib/email/email";
import { errorResponse, successResponse } from "@/lib/response-handler";
import { CONSTANTS } from "@/constants/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return errorResponse({
        message: "Please enter your email.",
        status: CONSTANTS.STATUS_CODES.BAD_REQUEST,
      });
    }

    // Email validation
    if (!CONSTANTS.REGEX.EMAIL.test(email)) {
      return errorResponse({
        message: "Invalid email format.",
        status: CONSTANTS.STATUS_CODES.BAD_REQUEST,
      });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return errorResponse({
        message: "Email already exists. Please login instead.",
        status: CONSTANTS.STATUS_CODES.CONFLICT,
      });
    }

    // Generate verification code
    const code = generateVerificationCode();

    // Store verification code
    await storeEmailVerificationCode(email, code, 10); // 10 minutes

    // Send verification code email
    await sendVerificationCodeEmail(email, code);
    return successResponse({
      message: "Verification code sent to your email.",
      status: CONSTANTS.STATUS_CODES.OK,
    });
  } catch (error) {
    console.error("Send verification code error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
