import { Redis } from "@upstash/redis";

const DEFAULT_TTL = {
  MOVIE_LIST: 10800, // 3 hour
  GENRE_LIST: 86400, // 24 hours
  MOVIE_DETAIL: 21600, // 6 hours
  SEARCH_RESULTS: 1800, // 30 minutes
};
const redis = Redis.fromEnv();
export async function getCachedData<T>(key: string): Promise<T | null> {
  if (!redis) {
    return null;
  }

  try {
    const data = await redis.get(key);
    if (data) {
      console.log("🔍 fetched cached data for key", key);
      return data as T;
    }
    return null;
  } catch (error) {
    // Only log if it's not a connection error (to avoid spam)
    if (
      error instanceof Error &&
      !error.message.includes("MaxRetriesPerRequestError") &&
      !error.message.includes("Connection is closed")
    ) {
      console.error(`❌ Error getting cached data for key ${key}:`, error);
    }
    return null;
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  ttl?: number
): Promise<boolean> {
  if (!redis) {
    console.error("❌ Redis client not found");
    return false;
  }

  try {
    const serialized = JSON.stringify(data);
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
    console.log("✍️ saved cached data for key", key);
    return true;
  } catch (error) {
    // Log all errors for debugging
    if (error instanceof Error) {
      // If connection closed, try to get a new client
      if (
        error.message.includes("Connection is closed") ||
        error.message.includes("end")
      ) {
        console.log(
          "❌ Connection closed during operation, will retry on next request"
        );
      }
    } else {
      console.error("❌ Error setting cached data for key", key, error);
    }
    return false;
  }
}

export async function deleteCachedData(key: string): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    await redis.del(key);
    return true;
  } catch (error) {
    // Only log if it's not a connection error (to avoid spam)
    if (
      error instanceof Error &&
      !error.message.includes("MaxRetriesPerRequestError") &&
      !error.message.includes("Connection is closed")
    ) {
      console.error(`Error deleting cached data for key ${key}:`, error);
    }
    return false;
  }
}

export function generateCacheKey(
  prefix: string,
  ...params: (string | number)[]
): string {
  return `${prefix}:${params.join(":")}`;
}

export const CacheKeys = {
  MOVIE_LIST: (category: string, page: number) =>
    generateCacheKey("movies", category, page),
  GENRE_LIST: () => generateCacheKey("genres", "list"),
  GENRE_MOVIES: (genreId: number) =>
    generateCacheKey("genres", "movies", genreId),
  MOVIE_DETAIL: (movieId: string) => generateCacheKey("movie", movieId),
  MOVIE_CREDITS: (movieId: string) =>
    generateCacheKey("movie", movieId, "credits"),
  MOVIE_VIDEOS: (movieId: string) =>
    generateCacheKey("movie", movieId, "videos"),
  SEARCH_RESULTS: (query: string) => generateCacheKey("search", "movie", query),
};

export const CacheTTL = DEFAULT_TTL;
