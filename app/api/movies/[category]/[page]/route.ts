import { NextRequest } from "next/server";
import { MovieListResponseType } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";
import { CONFIG } from "@/config/config";
import { errorResponse } from "@/lib/response-handler";
import { API } from "@/constants";
interface RouteParams {
  params: {
    category: string;
    page: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const API_KEY = process.env.API_KEY;
  const { category, page } = params;
  const pageNum = parseInt(page, 10);

  // Validate environment variables
  if (!API_KEY) {
    console.error("API_KEY is not set");
    return errorResponse({
      message: "API key is not configured",
      status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }

  if (!CONFIG.MOVIE_URL) {
    console.error("MOVIE_API_URL is not set");
    return errorResponse({
      message: "Movie API URL is not configured",
      status: API.STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  }

  // Validate category
  const validCategories = ["popular", "top_rated", "now_playing", "upcoming"];
  if (!validCategories.includes(category)) {
    return errorResponse({
      message: `Invalid category: ${category}`,
      status: API.STATUS_CODES.BAD_REQUEST,
    });
  }

  // Validate page number
  if (isNaN(pageNum) || pageNum < 1) {
    return errorResponse({
      message: `Invalid page number: ${page}`,
      status: API.STATUS_CODES.BAD_REQUEST,
    });
  }

  return withCache<MovieListResponseType>({
    cacheKey: CacheKeys.MOVIE_LIST(category, pageNum),
    cacheTTL: CacheTTL.MOVIE_LIST,
    apiUrl: `${CONFIG.MOVIE_URL}/movie/${category}?api_key=${API_KEY}&page=${page}`,
    errorMessage: "Failed to fetch movies",
  });
}
