import { NextRequest } from "next/server";
import { RegisterRequest } from "@/types/user";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { getUserByEmail, createUser } from "@/lib/db";
import crypto from "crypto";
import { errorResponse, successResponse } from "@/lib/response-handler";
import { CONSTANTS } from "@/constants/constants";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, name, password } = body;

    // Validation
    if (!email || !name || !password) {
      return errorResponse({
        message: "Please enter your email, name, and password.",
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

    // Password validation
    if (password.length < 6) {
      return errorResponse({
        message: "Password must be at least 6 characters.",
        status: CONSTANTS.STATUS_CODES.BAD_REQUEST,
      });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return errorResponse({
        message: "Email already exists.",
        status: CONSTANTS.STATUS_CODES.CONFLICT,
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate user ID
    const userId = crypto.randomUUID();

    // Create user
    const user = {
      id: userId,
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    const created = await createUser(user);
    if (!created) {
      return errorResponse({
        message: "Registration failed. Please try again.",
        status: CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }

    // Generate JWT token
    const token = generateToken(userId, email);

    // Set auth cookie
    await setAuthCookie(token);

    return successResponse({
      message: "Registration completed successfully.",
      status: CONSTANTS.STATUS_CODES.CREATED,
      data: {
        user: {
          id: userId,
          email: user.email,
          name: user.name,
          emailVerified: true,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
