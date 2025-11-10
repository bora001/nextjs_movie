import MovieBox from "../../component/MovieBox";
import InfiniteMovieBox from "../../component/InfiniteMovieBox";
import styles from "../../styles/movieList.module.css";
import axios from "axios";
import { MovieType, MovieListResponseType } from "@/types/movie";
import { CONFIG } from "@/config/config";
import { redirect } from "next/navigation";
import { API, NAMING } from "@/constants";
interface PagePropsType {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: PagePropsType) {
  const title = params.category
    .replace("_", " ")
    .replace(params.category[0], params.category[0].toUpperCase());

  return {
    title: `nextjs_practice | ${title} movie`,
    description: `${title} movie list`,
  };
}

export default async function MovieListPage({ params }: PagePropsType) {
  if (!NAMING.CATEGORIES[params.category as keyof typeof NAMING.CATEGORIES]) {
    redirect(API.ROUTES.HOME);
  }
  const API_KEY = process.env.API_KEY;
  const category = params.category;
  const title = category
    .replace("_", " ")
    .replace(category[0], category[0].toUpperCase());

  let results: MovieType[] = [];

  try {
    const response = await axios.get<MovieListResponseType>(
      `${CONFIG.MOVIE_URL}/movie/${category}?api_key=${API_KEY}`
    );
    results = response.data.results || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
  }

  const formattedResults: MovieType[] = results.map((item) => ({
    ...item,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : null,
  }));

  return (
    <div className={styles.movie_cnt}>
      <h1 className={styles.list_head}>{title} movie</h1>
      <MovieBox results={formattedResults} />
      <InfiniteMovieBox />
    </div>
  );
}
