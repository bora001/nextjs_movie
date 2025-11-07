import MovieDetail from "./MovieDetail";
import axios from "axios";
import { MovieDetailType, VideoResponseType, CreditType } from "@/types/movie";

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
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
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

  let detail: MovieDetailType | null = null;
  let credit: CreditType | null = null;

  try {
    const [detailRes, videoRes, creditRes] = await Promise.all([
      axios.get<MovieDetailType>(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
      ),
      axios.get<VideoResponseType>(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      ),
      axios.get<CreditType>(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
      ),
    ]);

    detail = detailRes.data;
    const video = videoRes.data;
    credit = creditRes.data;

    const trailer = video.results.filter((x) => x.name === "Official Trailer");
    if (detail && trailer.length > 0) {
      detail.trailer = trailer[trailer.length - 1];
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }

  return <MovieDetail detail={detail} credit={credit} />;
}
