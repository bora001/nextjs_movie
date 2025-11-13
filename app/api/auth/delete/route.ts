import { getCurrentUser } from "@/lib/auth";
import { deleteUser } from "@/lib/db";
import { clearAuthCookie } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response-handler";
import { API } from "@/constants";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse({
        message: "Unauthorized user.",
        status: API.STATUS_CODES.UNAUTHORIZED,
      });
    }

    // Delete user and all associated data
    const deleted = await deleteUser(user.id);

    if (!deleted) {
      return errorResponse({
        message: "Failed to delete user. Please try again.",
        status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }

    // Clear auth cookie
    await clearAuthCookie();

    return successResponse({
      message: "User account deleted successfully.",
      status: API.STATUS_CODES.OK,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
