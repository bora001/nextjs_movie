import MovieBox from "../../../component/MovieBox";
import styles from "../../../styles/Home.module.css";
import { MovieType } from "@/types/movie";
import { TextSearch } from "lucide-react";
import { fetchSearchMovieList } from "@/lib/api/movie/movieApi";
import Center from "@/component/Center";
interface PageProps {
  searchParams: {
    query?: string;
  };
}

export async function generateMetadata({ searchParams }: PageProps) {
  const params = searchParams.query || "";
  return {
    title: `search movie | ${params}`,
    description: `search movie by ${params}`,
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = searchParams.query;
  let results: MovieType[] = [];
  results = await fetchSearchMovieList(params || "");

  return (
    <div className={styles.movie_cnt}>
      <h1 className={styles.list_head}>Results of &lsquo;{params}&rsquo;</h1>
      {results.length ? (
        <MovieBox results={results} />
      ) : (
        <Center type="center">
          <div className={styles.not_found}>
            <TextSearch className={styles.icon} />
            <p>No result found</p>
          </div>
        </Center>
      )}
    </div>
  );
}
