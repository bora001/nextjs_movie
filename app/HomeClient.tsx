"use client";

import { useEffect, useState, MouseEvent } from "react";
import axios from "axios";
import SliderMovieBox from "../component/SliderMovieBox";
import styles from "../styles/Home.module.css";
import { Movie, Genre, MovieListResponse } from "@/types/movie";

interface HomeClientProps {
  initialResults: Movie[];
  initialGenres: Genre[];
}

export default function HomeClient({
  initialResults,
  initialGenres,
}: HomeClientProps) {
  const [movieList, setMovieList] = useState<Movie[]>(initialResults || []);
  const [keyword, setKeyword] = useState<string>("");
  const [genres] = useState<Genre[]>(initialGenres || []);

  useEffect(() => {
    setMovieList(initialResults || []);
    setKeyword("");
  }, [initialResults]);

  const setGenre = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const query = Number(e.currentTarget.value);
      const response = await axios.get<MovieListResponse>(
        `/api/genres/${query}`
      );
      const { results } = response.data;
      setMovieList(results);
      setKeyword(e.currentTarget.innerText);
    } catch (error) {
      console.error("Error fetching genre movies:", error);
    }
  };

  const setAll = () => {
    setMovieList(initialResults || []);
    setKeyword("");
  };

  return (
    <div className={styles.main_box}>
      <h2 className={styles.title_txt}>Popular {keyword} Movies</h2>
      {movieList.length > 0 ? (
        <SliderMovieBox results={movieList} />
      ) : (
        <p>Loading movies...</p>
      )}
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
