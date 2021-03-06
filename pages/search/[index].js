import Head from "next/head";
import MovieBox from "../../component/Moviebox";
import { MdManageSearch } from "react-icons/md";
import axios from "axios";
import styles from "../../styles/Home.module.css";

export default function Home({ results, params }) {
  return (
    <div className={styles.movie_cnt}>
      <Head>
        <title>search movie | {params}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={`search movie by ${params}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.list_head}>Results of &lsquo;{params}&rsquo;</h1>
      {results.length ? (
        <MovieBox results={results} />
      ) : (
        <div className={styles.not_found}>
          <MdManageSearch className={styles.icon} />
          <p>No result found</p>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const params = context.query.query;

  const { results } = await axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_MOVIE_API_KEY}&query=${params}`
    )
    .then((res) => res.data);

  results.map(
    (item) =>
      (item.poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`)
  );

  return { props: { results, params } };
}
