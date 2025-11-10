import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateUser } from "@/lib/db";
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
    const { name } = body;

    // Validation
    if (!name || typeof name !== "string") {
      return errorResponse({
        message: "Please enter a valid name.",
        status: API.STATUS_CODES.BAD_REQUEST,
      });
    }

    // Update name
    const updated = await updateUser(user.id, { name: name.trim() });

    if (!updated) {
      return errorResponse({
        message: "Failed to update name. Please try again.",
        status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }

    // Get updated user information
    const updatedUser = await getCurrentUser();
    if (!updatedUser) {
      return errorResponse({
        message: "Failed to retrieve updated user information.",
        status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }

    return successResponse({
      message: "Name changed successfully.",
      status: API.STATUS_CODES.OK,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          emailVerified: updatedUser.emailVerified,
        },
      },
    });
  } catch (error) {
    console.error("Change name error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
