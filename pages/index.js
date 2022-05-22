import Head from "next/head";
import styles from "../styles/Home.module.css";

import Image from "next/image";
import Link from "next/link";
import MovieBox from "../component/Moviebox";
export default function Home({ results }) {
  return (
    <div className={styles.movie_cnt}>
      <Head>
        <title>nextjs_practice</title>
        <meta name="description" content="Nextjs practice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MovieBox results={results} />
      {/* <div className={styles.movie_box}>
        {results.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <div>
              <div className={styles.movie_poster}>
                <Image
                  src={movie.poster_path}
                  alt={`${movie.title} image`}
                  layout="fill"
                />
              </div>

              <p className={styles.movie_title}>{movie.title}</p>
            </div>
          </Link>
        ))}
      </div> */}
    </div>
  );
}

export async function getServerSideProps(context) {
  console.log(context.req.url);
  const { results } = await (
    await fetch("http://localhost:3000/api/movies")
  ).json();
  results.map(
    (item) =>
      (item.poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`)
  );

  // const { genres } = await (
  //   await fetch("http://localhost:3000/api/genres")
  // ).json();
  // console.log("server");

  return { props: { results } };
}
