import { GenreResponse } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";

export async function GET() {
  const API_KEY = process.env.API_KEY;
  return withCache<GenreResponse>({
    cacheKey: CacheKeys.GENRE_LIST(),
    cacheTTL: CacheTTL.GENRE_LIST,
    apiUrl: `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
    errorMessage: "Failed to fetch genres",
  });
}
