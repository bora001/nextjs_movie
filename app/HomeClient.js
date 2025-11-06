"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SliderMovieBox from "../component/SliderMovieBox";
import styles from "../styles/Home.module.css";

export default function HomeClient({ initialResults, initialGenres }) {
  const [movieList, setMovieList] = useState(initialResults || []);
  const [keyword, setKeyword] = useState("");
  const [genres] = useState(initialGenres || []);

  useEffect(() => {
    setMovieList(initialResults || []);
    setKeyword("");
  }, [initialResults]);

  const setGenre = async (e) => {
    try {
      const query = +e.target.value;
      const { results } = await axios
        .get(`/api/genres/${query}`)
        .then((res) => res.data);
      setMovieList(results);
      setKeyword(e.target.innerText);
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
