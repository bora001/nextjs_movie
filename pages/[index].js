import Head from "next/head";
import MovieBox from "../component/Moviebox";
import axios from "axios";
import styles from "../styles/movieList.module.css";
import InfiniteMovieBox from "../component/InfiniteMovieBox";

export default function Home({ results, params }) {
  const title = params
    .replace("_", " ")
    .replace(params[0], params[0].toUpperCase());
  return (
    <div className={styles.movie_cnt}>
      <Head>
        <title>nextjs_practice | {`${title} movie`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={`${title} movie list`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.list_head}>{title} movie</h1>
      <MovieBox results={results} />
      <InfiniteMovieBox />
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
