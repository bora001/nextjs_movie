import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home({ results }) {
  console.log(results);
  return (
    <div>
      <Head>
        <title>nextjs_practice</title>
        <meta name="description" content="Nextjs practice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Nextjs practice
    </div>
  );
}

export async function getServerSideProps() {
  const { results } = await (
    await fetch("http://localhost:3000/api/movies")
  ).json();
  return { props: { results } };
}
