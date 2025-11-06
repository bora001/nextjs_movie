import MovieDetailClient from "./MovieDetailClient";
import axios from "axios";
import { MovieDetail, VideoResponse, Credit } from "@/types/movie";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const API_KEY = process.env.API_KEY;
  const movieId = params.id;

  try {
    const response = await axios.get<MovieDetail>(
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

export default async function MovieDetailPage({ params }: PageProps) {
  const API_KEY = process.env.API_KEY;
  const movieId = params.id;

  let detail: MovieDetail | null = null;
  let credit: Credit | null = null;

  try {
    const [detailRes, videoRes, creditRes] = await Promise.all([
      axios.get<MovieDetail>(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
      ),
      axios.get<VideoResponse>(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      ),
      axios.get<Credit>(
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

  return <MovieDetailClient detail={detail} credit={credit} />;
}
