import { NextRequest } from "next/server";
import { verifyEmailVerificationCode } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response-handler";
import { CONSTANTS } from "@/constants/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validation
    if (!email || !code) {
      return errorResponse({
        message: "Please enter your email and verification code.",
        status: CONSTANTS.STATUS_CODES.BAD_REQUEST,
      });
    }

    // Verify code
    const isValid = await verifyEmailVerificationCode(email, code);
    if (!isValid) {
      return errorResponse({
        message: "Invalid or expired verification code.",
        status: CONSTANTS.STATUS_CODES.BAD_REQUEST,
      });
    }

    return successResponse({
      message: "Email verified successfully.",
      status: CONSTANTS.STATUS_CODES.OK,
    });
  } catch (error) {
    console.error("Verify code error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
