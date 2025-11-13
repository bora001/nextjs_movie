import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response-handler";
import { API } from "@/constants";
import { connectCollection } from "@/lib/db";

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
    const { movieId } = body;

    if (!movieId) {
      return errorResponse({
        message: "Movie ID is required.",
        status: API.STATUS_CODES.BAD_REQUEST,
      });
    }

    const likedMoviesCollection = await connectCollection("likedMovies");
    // Check if movie is already liked
    const existingLike = await likedMoviesCollection.findOne({
      userId: user.id,
      movieId: Number(movieId),
    });

    if (existingLike) {
      // Unlike: remove from collection
      await likedMoviesCollection.deleteOne({
        userId: user.id,
        movieId: Number(movieId),
      });

      const likeCount = await likedMoviesCollection.countDocuments({
        movieId: Number(movieId),
      });

      return successResponse({
        message: "Movie unliked successfully.",
        status: API.STATUS_CODES.OK,
        data: { liked: false, likeCount },
      });
    } else {
      // Like: add to collection
      await likedMoviesCollection.insertOne({
        userId: user.id,
        movieId: Number(movieId),
        createdAt: new Date(),
      });

      const likeCount = await likedMoviesCollection.countDocuments({
        movieId: Number(movieId),
      });

      return successResponse({
        message: "Movie liked successfully.",
        status: API.STATUS_CODES.OK,
        data: { liked: true, likeCount },
      });
    }
  } catch (error) {
    console.error("Like movie error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (movieId) {
      // Check if specific movie is liked and get like count
      const likedMoviesCollection = await connectCollection("likedMovies");

      // Get like count (public information)
      const likeCount = await likedMoviesCollection.countDocuments({
        movieId: Number(movieId),
      });

      // Check if user liked this movie (only if user is logged in)
      let liked = false;
      if (user) {
        const existingLike = await likedMoviesCollection.findOne({
          userId: user.id,
          movieId: Number(movieId),
        });
        liked = !!existingLike;
      }

      return successResponse({
        message: "Like status retrieved.",
        status: API.STATUS_CODES.OK,
        data: { liked, likeCount },
      });
    }

    return errorResponse({
      message: "Movie ID is required.",
      status: API.STATUS_CODES.BAD_REQUEST,
    });
  } catch (error) {
    console.error("Get like status error:", error);
    return errorResponse({
      message: "Server error occurred.",
      status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}
