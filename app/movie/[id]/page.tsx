import MovieDetail from "./MovieDetail";
import axios from "axios";
import {
  MovieDetailType,
  VideoResponseType,
  CreditType,
  LikeType,
} from "@/types/movie";
import { CONFIG } from "@/config/config";
import { getCurrentUser } from "@/lib/auth";
import { API } from "@/constants";
import { cookies } from "next/headers";
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
  const API_KEY = process.env.API_KEY;
  const movieId = params.id;
  const user = await getCurrentUser();

  let detail: MovieDetailType | null = null;
  let credit: CreditType | null = null;
  let like: LikeType | null = null;
  const cookie = cookies();
  try {
    const detailRes = await axios.get<MovieDetailType>(
      `${CONFIG.MOVIE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    detail = detailRes.data;

    const [videoRes, creditRes, likeRes] = await Promise.all([
      axios.get<VideoResponseType>(
        `${CONFIG.MOVIE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      ),
      axios.get<CreditType>(
        `${CONFIG.MOVIE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
      ),
      axios.get(
        `${CONFIG.APP_URL}${API.ROUTES.API.MOVIES_LIKE}?movieId=${detail.id}`,
        { headers: { Cookie: cookie.toString() || "" } }
      ),
    ]);
    const video = videoRes.data;
    credit = creditRes.data;
    like = likeRes.data.data;

    const trailer = video.results.filter((x) => x.name === "Official Trailer");
    if (detail && trailer.length > 0) {
      detail.trailer = trailer[trailer.length - 1];
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }

  return (
    <MovieDetail detail={detail} credit={credit} user={user} like={like} />
  );
}
