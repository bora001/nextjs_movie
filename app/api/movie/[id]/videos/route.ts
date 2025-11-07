import { NextRequest } from "next/server";
import { VideoResponseType } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { withCache } from "@/lib/api-handler";

interface RouteParamsType {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParamsType) {
  const API_KEY = process.env.API_KEY;
  const { id } = params;

  return withCache<VideoResponseType>({
    cacheKey: CacheKeys.MOVIE_VIDEOS(id),
    cacheTTL: CacheTTL.MOVIE_DETAIL,
    apiUrl: `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`,
    errorMessage: "Failed to fetch movie videos",
  });
}
