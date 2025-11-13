import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { comparePassword, hashPassword } from "@/lib/auth";
import { getUserByEmail, updateUser } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response-handler";
import { API } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse({
        message: "Unauthorized user.",
        status: API.STATUS_CODES.UNAUTHORIZED,
      });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Get user with password
    const userWithPassword = await getUserByEmail(user.email);
    if (!userWithPassword) {
      return errorResponse({
        message: "User not found.",
        status: API.STATUS_CODES.NOT_FOUND,
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      userWithPassword.password
    );

    if (!isCurrentPasswordValid) {
      return errorResponse({
        message: "Current password is incorrect.",
        status: API.STATUS_CODES.UNAUTHORIZED,
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    const updated = await updateUser(user.id, { password: hashedNewPassword });

    if (!updated) {
      return errorResponse({
        message: "Failed to update password. Please try again.",
        status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }

    return successResponse({
      message: "Password changed successfully.",
      status: API.STATUS_CODES.OK,
    });
  } catch (error) {
    console.error("Change password error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
