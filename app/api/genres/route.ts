import { GenreResponseType } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";
import { CONFIG } from "@/config/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const API_KEY = process.env.API_KEY;
  return withCache<GenreResponseType>({
    cacheKey: CacheKeys.GENRE_LIST(),
    cacheTTL: CacheTTL.GENRE_LIST,
    apiUrl: `${CONFIG.MOVIE_URL}/genre/movie/list?api_key=${API_KEY}`,
    errorMessage: "Failed to fetch genres",
  });
}
