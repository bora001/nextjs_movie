import { NextRequest } from "next/server";
import { MovieListResponseType } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";
import { CONFIG } from "@/config/config";
interface RouteParamsType {
  params: {
    genreId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParamsType) {
  const API_KEY = process.env.API_KEY;
  const { genreId } = params;
  const genreIdNum = parseInt(genreId, 10);

  return withCache<MovieListResponseType>({
    cacheKey: CacheKeys.GENRE_MOVIES(genreIdNum),
    cacheTTL: CacheTTL.MOVIE_LIST,
    apiUrl: `${CONFIG.MOVIE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`,
    errorMessage: "Failed to fetch genre movies",
  });
}
