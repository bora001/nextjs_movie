import Head from "next/head";
import styles from "../styles/Home.module.css";
import MovieBox from "../component/Moviebox";

export default function Home({ results, params }) {
  return (
    <div className={styles.movie_cnt}>
      <Head>
        <title>nextjs_practice | {`${params} movie`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={`${params} movie list`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MovieBox results={results} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const params = context.params.index;

  const { results } = await (
    await fetch(`http://localhost:3000/api/movies/${params}`)
  ).json();
  results.map(
    (item) =>
      (item.poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`)
  );

  return { props: { results, params } };
}
