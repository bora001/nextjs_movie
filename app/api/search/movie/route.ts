import { NextRequest, NextResponse } from "next/server";
import { MovieListResponse } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";

export async function GET(request: NextRequest) {
  const API_KEY = process.env.API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  return withCache<MovieListResponse>({
    cacheKey: CacheKeys.SEARCH_RESULTS(query),
    cacheTTL: CacheTTL.SEARCH_RESULTS,
    apiUrl: `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`,
    errorMessage: "Failed to search movies",
  });
}
