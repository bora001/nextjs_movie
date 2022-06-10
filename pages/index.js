import SliderMovieBox from "../component/SliderMoviebox";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home({ results, genres, date }) {
  const [movieList, setMovieList] = useState([]);
  const [keyword, setkeyword] = useState("");

  useEffect(() => {
    setMovieList(results);
  }, [results]);

  useEffect(() => {
    setAll();
  }, [date]);

  const setGenre = async (e) => {
    const query = +e.target.value;
    const { results } = await axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_MOVIE_API_KEY}&with_genres=${query}`
      )
      .then((res) => res.data);
    setMovieList(() => results);
    setkeyword(e.target.innerText);
  };

  const setAll = () => {
    setMovieList(results);
    setkeyword("");
  };

  return (
    <div className={styles.main_box}>
      <Head>
        <title>Nextjs_movie Project</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={`next.js movie project`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className={styles.title_txt}>Popular {keyword} Movies</h2>
      <SliderMovieBox results={movieList} />
      <div className={styles.btn_box}>
        {genres && <button onClick={setAll}>All</button>}
        {genres &&
          genres.map((genre) => (
            <button key={genre.id} value={genre.id} onClick={setGenre}>
              {genre.name}
            </button>
          ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const date = +new Date();

  const { results } = await axios
    .get(`https://nextjs-movie-ten.vercel.app/api/movies/popular`)
    .then((res) => res.data);

  const { genres } = await axios
    .get(`https://nextjs-movie-ten.vercel.app/api/genres`)
    .then((res) => res.data);

  return { props: { results, genres, date } };
}
