import Home from "./Home";
import {
  MovieType,
  GenreType,
  MovieListResponseType,
  GenreResponseType,
} from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { fetchWithCache } from "@/lib/api-handler";
import { CONFIG } from "@/config/config";

export default async function HomePage() {
  const API_KEY = process.env.API_KEY;

  let results: MovieType[] = [];
  let genres: GenreType[] = [];

  try {
    const [cachedMovies, cachedGenres] = await Promise.all([
      fetchWithCache<MovieListResponseType>({
        cacheKey: CacheKeys.MOVIE_LIST("popular", 1),
        cacheTTL: CacheTTL.MOVIE_LIST,
        apiUrl: `${CONFIG.MOVIE_URL}/movie/popular?api_key=${API_KEY}`,
        errorMessage: "Failed to fetch popular movies",
      }),
      fetchWithCache<GenreResponseType>({
        cacheKey: CacheKeys.GENRE_LIST(),
        cacheTTL: CacheTTL.GENRE_LIST,
        apiUrl: `${CONFIG.MOVIE_URL}/genre/movie/list?api_key=${API_KEY}`,
        errorMessage: "Failed to fetch genres",
      }),
    ]);

    results = cachedMovies?.results || [];
    genres = cachedGenres?.genres || [];
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }

  return <Home initialResults={results} initialGenres={genres} />;
}
