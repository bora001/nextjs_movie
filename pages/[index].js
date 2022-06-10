import Head from "next/head";
import styles from "../styles/movieList.module.css";
import MovieBox from "../component/Moviebox";
import axios from "axios";

export default function Home({ results, params }) {
  return (
    <div className={styles.movie_cnt}>
      <Head>
        <title>nextjs_practice | {`${params} movie`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={`${params} movie list`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.list_head}>{params} movie</h1>
      <MovieBox results={results} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const params = context.params.index;
  const { results } = await axios
    .get(`https://nextjs-movie-ten.vercel.app/api/movies/${params}`)
    .then((res) => res.data);

  results.map(
    (item) =>
      (item.poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`)
  );

  return { props: { results, params } };
}
