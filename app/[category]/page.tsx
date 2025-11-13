import MovieBox from "../../component/MovieBox";
import InfiniteMovieBox from "../../component/InfiniteMovieBox";
import styles from "../../styles/movieList.module.css";
import { MovieType } from "@/types/movie";
import { redirect } from "next/navigation";
import { API, NAMING } from "@/constants";
import { fetchMovieList } from "@/lib/api/movie/movieApi";

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
  const category = params.category;
  const title = category
    .replace("_", " ")
    .replace(category[0], category[0].toUpperCase());

  let results: MovieType[] = [];
  results = await fetchMovieList(category);

  return (
    <div className={styles.movie_outer_cnt}>
      <h1 className={styles.list_head}>{title} movie</h1>
      <MovieBox results={results} />
      <InfiniteMovieBox />
    </div>
  );
}
