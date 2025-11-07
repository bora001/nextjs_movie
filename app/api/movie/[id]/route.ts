import { NextRequest } from "next/server";
import { MovieDetail } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const API_KEY = process.env.API_KEY;
  const { id } = params;

  return withCache<MovieDetail>({
    cacheKey: CacheKeys.MOVIE_DETAIL(id),
    cacheTTL: CacheTTL.MOVIE_DETAIL,
    apiUrl: `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    errorMessage: "Failed to fetch movie",
  });
}
