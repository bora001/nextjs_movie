import MovieBox from "../../component/MovieBox";
import styles from "../../styles/movieList.module.css";
import axios from "axios";
import { MovieType } from "@/types/movie";
import { CONFIG } from "@/config/config";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { API } from "@/constants";
import { cookies } from "next/headers";

export async function generateMetadata() {
  return {
    title: "nextjs_practice | Liked Movies",
    description: "Your liked movies list",
  };
}

export default async function LikedMoviesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(API.ROUTES.LOGIN);
  }

  const API_KEY = process.env.API_KEY;
  let likedMoviesList: MovieType[] = [];

  try {
    // Get liked movie IDs from database
    const res = await fetch(`${CONFIG.APP_URL}${API.ROUTES.API.MOVIES_LIKED}`, {
      headers: { Cookie: cookies().toString() || "" },
    });
    const {
      data: { likedMovies },
    } = await res.json();
    const movieIds: number[] = likedMovies ?? [];

    if (movieIds.length > 0) {
      // Fetch movie details from TMDB API
      const moviePromises = movieIds.map((movieId: number) =>
        axios
          .get<MovieType>(
            `${CONFIG.MOVIE_URL}/movie/${movieId}?api_key=${API_KEY}`
          )
          .then((res) => res.data)
          .catch((error) => {
            console.error(`Error fetching movie ${movieId}:`, error);
            return null;
          })
      );

      const movies = await Promise.all(moviePromises);
      likedMoviesList = movies.filter(
        (movie): movie is MovieType => movie !== null
      );
    }
  } catch (error) {
    console.error("Error fetching liked movies:", error);
  }

  const formattedResults: MovieType[] = likedMoviesList.map((item) => ({
    ...item,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : null,
  }));

  return (
    <div className={styles.movie_cnt}>
      <h1 className={styles.list_head}>Liked Movies</h1>
      {formattedResults.length > 0 ? (
        <MovieBox results={formattedResults} />
      ) : (
        // todo empty box style
        <div className={styles.empty_movie_cnt}>
          <div>
            <p>You haven't liked any movies yet.</p>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.8 }}>
              Like movies from their detail pages to see them here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
