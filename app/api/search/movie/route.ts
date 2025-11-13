import { NextRequest } from "next/server";
import { MovieListResponseType } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";
import { errorResponse } from "@/lib/response-handler";
import { CONFIG } from "@/config/config";
import { API } from "@/constants";

export async function GET(request: NextRequest) {
  const API_KEY = process.env.API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return errorResponse({
      message: "Query parameter is required",
      status: API.STATUS_CODES.BAD_REQUEST,
    });
  }

  return withCache<MovieListResponseType>({
    cacheKey: CacheKeys.SEARCH_RESULTS(query),
    cacheTTL: CacheTTL.SEARCH_RESULTS,
    apiUrl: `${
      CONFIG.MOVIE_URL
    }/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
    errorMessage: "Failed to search movies",
  });
}
