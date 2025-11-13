import MovieDetail from "./MovieDetail";
import { LikeType, MovieType, VideoType } from "@/types/movie";
import { getCurrentUser } from "@/lib/auth";
import {
  fetchMovieDetail,
  fetchMovieDetailVideos,
} from "@/lib/api/movie/movieApi";
import { getMovieLikeStatus } from "@/lib/db";
interface PagePropsType {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PagePropsType) {
  try {
    const detail = await fetchMovieDetail(params.id);
    return {
      title: `Movie | ${detail.title}`,
      description: detail.overview || "",
    };
  } catch (error) {
    return { title: "Movie Not Found" };
  }
}

export default async function MovieDetailPage({ params }: PagePropsType) {
  const movieId = params.id;
  const user = await getCurrentUser();

  let detail: MovieType | null = null;
  let like: LikeType | null = null;
  let trailer: VideoType | null = null;
  try {
    const [detailRes, videoRes] = await Promise.all([
      fetchMovieDetail(movieId),
      fetchMovieDetailVideos(movieId),
    ]);

    detail = detailRes ? detailRes : null;
    const trailerData = videoRes
      ? videoRes.results.filter((x) => x.name === "Official Trailer")
      : [];
    if (detail && trailerData.length > 0) {
      trailer = trailerData[trailerData.length - 1];
    }

    if (detail) {
      like = await getMovieLikeStatus(Number(movieId), user?.id || null);
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
  return (
    <MovieDetail detail={detail} user={user} like={like} trailer={trailer} />
  );
}
