import { NextRequest } from "next/server";
import { MovieListResponseType } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";

interface RouteParams {
  params: {
    category: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const API_KEY = process.env.API_KEY;
  const { category } = params;

  return withCache<MovieListResponseType>({
    cacheKey: CacheKeys.MOVIE_LIST(category, 1),
    cacheTTL: CacheTTL.MOVIE_LIST,
    apiUrl: `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}`,
    errorMessage: "Failed to fetch movies",
  });
}
