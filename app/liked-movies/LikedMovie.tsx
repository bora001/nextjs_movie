"use client";
import LoadingSpinner from "@/component/LoadingSpinner";
import MovieBox from "../../component/MovieBox";
import styles from "../../styles/movieList.module.css";
import { useLikedMovies } from "@/lib/api/movie/movie";
import { Clapperboard } from "lucide-react";
import Center from "@/component/Center";

export default function LikedMoviesPage() {
  const { data: likedMoviesList, isLoading } = useLikedMovies();

  return (
    <div className={styles.movie_outer_cnt}>
      <h1 className={styles.list_head}>Liked Movies</h1>
      <div className={styles.movie_cnt}>
        {isLoading ? (
          <LoadingSpinner />
        ) : likedMoviesList && likedMoviesList.length > 0 ? (
          <MovieBox results={likedMoviesList} />
        ) : (
          <div className={styles.empty_movie_cnt}>
            <Center type="center">
              <Clapperboard size={32} />
              <p>You haven&apos;t liked any movies yet.</p>
            </Center>
          </div>
        )}
      </div>
    </div>
  );
}
