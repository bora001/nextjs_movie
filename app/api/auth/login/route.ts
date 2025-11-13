import { NextRequest } from "next/server";
import { LoginRequest } from "@/types/user";
import { comparePassword, generateToken, setAuthCookie } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response-handler";
import { API } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return errorResponse({
        message: "Please enter your email and password.",
        status: API.STATUS_CODES.BAD_REQUEST,
      });
    }

    // Get user
    const user = await getUserByEmail(email.toLowerCase());
    if (!user) {
      return errorResponse({
        message: "Email or password is incorrect.",
        status: API.STATUS_CODES.UNAUTHORIZED,
      });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse({
        message: "Email or password is incorrect.",
        status: API.STATUS_CODES.UNAUTHORIZED,
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    // Set auth cookie
    await setAuthCookie(token);

    return successResponse({
      message: "Login successful.",
      status: API.STATUS_CODES.OK,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
