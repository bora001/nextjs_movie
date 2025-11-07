import { NextRequest } from "next/server";
import { MovieListResponse } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";

interface RouteParams {
  params: {
    genreId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const API_KEY = process.env.API_KEY;
  const { genreId } = params;
  const genreIdNum = parseInt(genreId, 10);

  return withCache<MovieListResponse>({
    cacheKey: CacheKeys.GENRE_MOVIES(genreIdNum),
    cacheTTL: CacheTTL.MOVIE_LIST,
    apiUrl: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`,
    errorMessage: "Failed to fetch genre movies",
  });
}
