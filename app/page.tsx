import HomeClient from "./HomeClient";
import axios from "axios";
import { Movie, Genre, MovieListResponse, GenreResponse } from "@/types/movie";

export default async function Home() {
  const API_KEY = process.env.API_KEY;

  let results: Movie[] = [];
  let genres: Genre[] = [];

  try {
    const [moviesRes, genresRes] = await Promise.all([
      axios.get<MovieListResponse>(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
      ),
      axios.get<GenreResponse>(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      ),
    ]);

    results = moviesRes.data.results || [];
    genres = genresRes.data.genres || [];
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }

  return <HomeClient initialResults={results} initialGenres={genres} />;
}
