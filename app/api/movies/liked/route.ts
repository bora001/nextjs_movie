import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response-handler";
import { API } from "@/constants";
import { connectCollection } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse({
        message: "Unauthorized user.",
        status: API.STATUS_CODES.UNAUTHORIZED,
      });
    }
    const likedMoviesCollection = await connectCollection("likedMovies");

    const likedMovies = await likedMoviesCollection
      .find({ userId: user.id }, { projection: { _id: 0, userId: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    // todo update the liked movies list

    return successResponse({
      message: "Liked movies retrieved.",
      status: API.STATUS_CODES.OK,
      data: { likedMovies: likedMovies.map((item) => item.movieId) },
    });
  } catch (error) {
    console.error("Get liked movies error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
