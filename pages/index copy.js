import Head from "next/head";
import styles from "../styles/Home.module.css";
import MovieBox from "../component/Moviebox";
export default function Home({ results }) {
  return (
    <div className={styles.movie_cnt}>
      <Head>
        <title>nextjs_practice</title>
        <meta name="description" content="Popular movie list" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MovieBox results={results} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { results } = await axios
    .get(`http://localhost:3000/api/movies/`)
    .then((res) => res.data);

  results.map(
    (item) =>
      (item.poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`)
  );

  return { props: { results } };
}
