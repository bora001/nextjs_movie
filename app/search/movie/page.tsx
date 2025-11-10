import MovieBox from "../../../component/MovieBox";
import axios from "axios";
import styles from "../../../styles/Home.module.css";
import { MovieType, MovieListResponseType } from "@/types/movie";
import { CONFIG } from "@/config/config";
import { TextSearch } from "lucide-react";
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
  const API_KEY = process.env.API_KEY;

  let results: MovieType[] = [];

  try {
    const response = await axios.get<MovieListResponseType>(
      `${CONFIG.MOVIE_URL}/search/movie?api_key=${API_KEY}`,
      {
        params: { query: params },
      }
    );
    results = response.data.results || [];
  } catch (error) {
    console.error("Error fetching search results:", error);
  }

  const formattedResults: MovieType[] = results.map((item) => ({
    ...item,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : null,
  }));

  return (
    <div className={styles.movie_cnt}>
      <h1 className={styles.list_head}>Results of &lsquo;{params}&rsquo;</h1>
      {formattedResults.length ? (
        <MovieBox results={formattedResults} />
      ) : (
        <div className={styles.not_found}>
          <TextSearch className={styles.icon} />
          <p>No result found</p>
        </div>
      )}
    </div>
  );
}
