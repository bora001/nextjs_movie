import { CONSTANTS } from "@/constants/constants";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response-handler";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse({
        message: "Unauthorized user.",
        status: CONSTANTS.STATUS_CODES.UNAUTHORIZED,
      });
    }

    return successResponse({
      message: "User found.",
      status: CONSTANTS.STATUS_CODES.OK,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
