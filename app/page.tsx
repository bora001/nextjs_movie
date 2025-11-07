import HomeClient from "./HomeClient";
import { Movie, Genre, MovieListResponse, GenreResponse } from "@/types/movie";
import { CacheKeys, CacheTTL } from "@/lib/cache";
import { fetchWithCache } from "@/lib/api-handler";

export default async function Home() {
  const API_KEY = process.env.API_KEY;

  let results: Movie[] = [];
  let genres: Genre[] = [];

  try {
    const [cachedMovies, cachedGenres] = await Promise.all([
      fetchWithCache<MovieListResponse>({
        cacheKey: CacheKeys.MOVIE_LIST("popular", 1),
        cacheTTL: CacheTTL.MOVIE_LIST,
        apiUrl: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
        errorMessage: "Failed to fetch popular movies",
      }),
      fetchWithCache<GenreResponse>({
        cacheKey: CacheKeys.GENRE_LIST(),
        cacheTTL: CacheTTL.GENRE_LIST,
        apiUrl: `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
        errorMessage: "Failed to fetch genres",
      }),
    ]);

    results = cachedMovies?.results || [];
    genres = cachedGenres?.genres || [];
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }

  return <HomeClient initialResults={results} initialGenres={genres} />;
}
