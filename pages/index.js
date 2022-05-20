import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useDispatch, useSelector } from "react-redux";
import { movieAction } from "../store/movieList/action";
import { useEffect } from "react";
import Image from "next/image";

export default function Home({ results }) {
  const dispatch = useDispatch();
  const { movieList } = useSelector((state) => state.movieList);

  useEffect(() => {
    dispatch(movieAction(results));
  }, []);
  console.log(results);
  return (
    <div className={styles.movie_cnt}>
      <Head>
        <title>nextjs_practice</title>
        <meta name="description" content="Nextjs practice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.movie_box}>
        {results.map((movie) => (
          <div key={movie.id}>
            <div className={styles.movie_poster}>
              <Image
                src={movie.poster_path}
                alt={`${movie.title} image`}
                layout="fill"
              />
            </div>

            <p className={styles.movie_title}>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { results } = await (
    await fetch("http://localhost:3000/api/movies")
  ).json();
  results.map(
    (item) =>
      (item.poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`)
  );

  return { props: { results } };
}
