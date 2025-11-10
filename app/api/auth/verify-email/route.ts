import { NextRequest } from "next/server";
import { generateToken, setAuthCookie } from "@/lib/auth";
import {
  getEmailFromVerificationToken,
  deleteEmailVerificationToken,
  getUserByEmail,
  updateUser,
  getPendingRegistrationByToken,
  deletePendingRegistration,
  createUser,
} from "@/lib/db";
import crypto from "crypto";
import { errorResponse, successResponse } from "@/lib/response-handler";
import { CONSTANTS } from "@/constants/constants";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return errorResponse({
        message: "Verification token is required.",
        status: CONSTANTS.STATUS_CODES.BAD_REQUEST,
      });
    }

    // Get email from token
    const email = await getEmailFromVerificationToken(token);
    if (!email) {
      return errorResponse({
        message: "Invalid or expired verification token.",
        status: CONSTANTS.STATUS_CODES.BAD_REQUEST,
      });
    }

    // Get user (if exists)
    const user = await getUserByEmail(email);

    if (user) {
      // User exists - update user email verification status
      if (user.emailVerified) {
        await deleteEmailVerificationToken(token);
        // Generate JWT token and set auth cookie
        const authToken = generateToken(user.id, user.email);
        await setAuthCookie(authToken);

        return successResponse({
          message: "Email already verified.",
          status: CONSTANTS.STATUS_CODES.OK,
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              emailVerified: true,
            },
            token: authToken,
          },
        });
      }

      // Update user email verification status
      const updated = await updateUser(user.id, {
        emailVerified: true,
        emailVerificationToken: undefined,
        emailVerificationTokenExpiry: undefined,
      });

      if (!updated) {
        return errorResponse({
          message: "Email verification update failed.",
          status: CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
      }

      // Delete verification token
      await deleteEmailVerificationToken(token);

      // Generate JWT token and set auth cookie
      const authToken = generateToken(user.id, user.email);
      await setAuthCookie(authToken);

      return successResponse({
        message: "Email verification completed.",
        status: CONSTANTS.STATUS_CODES.OK,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: true,
          },
          token: authToken,
        },
      });
    } else {
      // User doesn't exist yet - check for pending registration
      const pendingRegistration = await getPendingRegistrationByToken(token);

      if (!pendingRegistration) {
        await deleteEmailVerificationToken(token);

        return errorResponse({
          message: "Registration information not found. Please register again.",
          status: CONSTANTS.STATUS_CODES.NOT_FOUND,
        });
      }

      // Create user from pending registration
      const userId = crypto.randomUUID();
      const newUser = {
        id: userId,
        email: pendingRegistration.email,
        name: pendingRegistration.name,
        password: pendingRegistration.password,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };

      const created = await createUser(newUser);
      if (!created) {
        return errorResponse({
          message: "Registration failed. Please try again.",
          status: CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
      }

      // Delete pending registration and verification token
      await deletePendingRegistration(token);
      await deleteEmailVerificationToken(token);

      // Generate JWT token and set auth cookie
      const authToken = generateToken(userId, newUser.email);
      await setAuthCookie(authToken);

      return successResponse({
        message: "Email verification completed and registration completed.",
        status: CONSTANTS.STATUS_CODES.OK,
        data: {
          user: {
            id: userId,
            email: newUser.email,
            name: newUser.name,
            emailVerified: true,
          },
          token: authToken,
        },
      });
    }
  } catch (error) {
    console.error("Verify email error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
