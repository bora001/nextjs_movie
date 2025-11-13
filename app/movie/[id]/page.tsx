import MovieDetail from "./MovieDetail";
import axios from "axios";
import { MovieDetailType, LikeType, MovieType, VideoType } from "@/types/movie";
import { CONFIG } from "@/config/config";
import { getCurrentUser } from "@/lib/auth";
import {
  fetchMovieDetail,
  fetchMovieDetailLike,
  fetchMovieDetailVideos,
} from "@/lib/api/movie/movieApi";
interface PagePropsType {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PagePropsType) {
  const API_KEY = process.env.API_KEY;
  const movieId = params.id;

  try {
    const response = await axios.get<MovieDetailType>(
      `${CONFIG.MOVIE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    const detail = response.data;
    return {
      title: `Movie | ${detail.title}`,
      description: detail.overview || "",
    };
  } catch (error) {
    return {
      title: "Movie Not Found",
    };
  }
}

export default async function MovieDetailPage({ params }: PagePropsType) {
  const movieId = params.id;
  const user = await getCurrentUser();

  let detail: MovieType | null = null;
  let like: LikeType | null = null;
  let trailer: VideoType | null = null;
  try {
    const detailRes = await fetchMovieDetail(movieId);
    detail = detailRes ? detailRes : null;
    const videoRes = await fetchMovieDetailVideos(movieId);
    const trailerData = videoRes
      ? videoRes.results.filter((x) => x.name === "Official Trailer")
      : [];
    if (detail && trailerData.length > 0) {
      trailer = trailerData[trailerData.length - 1];
    }
    const likeRes = await fetchMovieDetailLike(movieId);
    like = likeRes ? likeRes : null;
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }

  return (
    <MovieDetail detail={detail} user={user} like={like} trailer={trailer} />
  );
}
