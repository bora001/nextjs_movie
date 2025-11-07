import { NextRequest } from "next/server";
import { MovieListResponseType } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";
import { CONFIG } from "@/config/config";
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

  return withCache<MovieListResponseType>({
    cacheKey: CacheKeys.MOVIE_LIST(category, pageNum),
    cacheTTL: CacheTTL.MOVIE_LIST,
    apiUrl: `${CONFIG.MOVIE_URL}/movie/${category}?api_key=${API_KEY}&page=${page}`,
    errorMessage: "Failed to fetch movies",
  });
}
