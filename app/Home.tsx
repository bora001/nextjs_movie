"use client";

import { useState, MouseEvent } from "react";
import SliderMovieBox from "../component/SliderMovieBox";
import styles from "../styles/Home.module.css";
import { MovieType, GenreType } from "@/types/movie";
import { useGenreMovies } from "@/lib/api/movie/movie";
import Center from "@/component/Center";
import { Clapperboard } from "lucide-react";
import { CONSTANTS } from "@/constants";

interface HomeProps {
  initialResults: MovieType[];
  initialGenres: GenreType[];
}

export default function Home({ initialResults, initialGenres }: HomeProps) {
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const { data: genreMovies, isLoading } = useGenreMovies(selectedGenreId);

  const movieList =
    selectedGenreId === null ? initialResults : genreMovies || [];
  const genres = initialGenres || [];

  const setGenre = (e: MouseEvent<HTMLButtonElement>) => {
    const genreId = Number(e.currentTarget.value);
    setSelectedGenreId(genreId);
    setKeyword(e.currentTarget.innerText);
  };

  const setAll = () => {
    setSelectedGenreId(null);
    setKeyword("");
  };

  return (
    <div
      className={styles.main_box}
      style={{ height: `calc(100vh - ${CONSTANTS.NAV_HEIGHT * 2}px)` }}
    >
      <h2 className={styles.title_txt}>Popular {keyword} Movies</h2>
      <div className={styles.movie_list_box}>
        {isLoading && (
          <Center>
            <p>Loading movies...</p>
          </Center>
        )}
        {!isLoading && (
          <>
            {movieList.length > 0 ? (
              <SliderMovieBox results={movieList} />
            ) : (
              <Center type="center">
                <Clapperboard size={32} />
                <p>No movies found</p>
              </Center>
            )}
          </>
        )}
      </div>

      <div className={styles.btn_box}>
        {genres && (
          <button onClick={setAll} aria-label="Show all movies">
            All
          </button>
        )}
        {genres &&
          genres.map((genre) => (
            <button
              key={genre.id}
              value={genre.id}
              onClick={setGenre}
              aria-label={`Filter by ${genre.name} genre`}
            >
              {genre.name}
            </button>
          ))}
      </div>
    </div>
  );
}
