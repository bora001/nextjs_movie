import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useDispatch, useSelector } from "react-redux";
import { movieAction } from "../store/movieList/action";
import { useEffect } from "react";

export default function Home({ results }) {
  const dispatch = useDispatch();
  const { movieList } = useSelector((state) => state.movieList);

  useEffect(() => {
    dispatch(movieAction(results));
  }, []);

  return (
    <div>
      <Head>
        <title>nextjs_practice</title>
        <meta name="description" content="Nextjs practice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {movieList && console.log(movieList)}
    </div>
  );
}

export async function getServerSideProps() {
  const { results } = await (
    await fetch("http://localhost:3000/api/movies")
  ).json();

  return { props: { results } };
}
