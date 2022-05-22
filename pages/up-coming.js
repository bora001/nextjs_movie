import Head from "next/head";
import styles from "../styles/Home.module.css";

import Image from "next/image";
import Link from "next/link";
import MovieBox from "../component/Moviebox";

export default function UpComing({ results }) {
  return <MovieBox results={results} />;
}
export async function getServerSideProps(context) {
  console.log(context.req.url);
  const { results } = await (
    await fetch("http://localhost:3000/api/movies/up-coming")
  ).json();
  results.map(
    (item) =>
      (item.poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`)
  );

  return { props: { results } };
}
