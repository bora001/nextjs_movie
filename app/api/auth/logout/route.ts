import { CONSTANTS } from "@/constants/constants";
import { clearAuthCookie } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response-handler";

export async function POST() {
  try {
    await clearAuthCookie();
    return successResponse({
      message: "Logged out successfully.",
      status: CONSTANTS.STATUS_CODES.OK,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
