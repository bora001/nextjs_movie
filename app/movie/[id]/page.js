import MovieDetailClient from "./MovieDetailClient";
import axios from "axios";

export async function generateMetadata({ params }) {
  const API_KEY = process.env.API_KEY;
  const movieId = params.id;

  try {
    const response = await axios.get(
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

export default async function MovieDetailPage({ params }) {
  const API_KEY = process.env.API_KEY;
  const movieId = params.id;

  try {
    const [detailRes, videoRes, creditRes] = await Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
      ),
      axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      ),
      axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
      ),
    ]);

    const detail = detailRes.data;
    const video = videoRes.data;
    const credit = creditRes.data;

    const trailer = video.results.filter((x) => x.name === "Official Trailer");
    detail.trailer = trailer.length > 0 ? trailer[trailer.length - 1] : null;

    return <MovieDetailClient detail={detail} credit={credit} />;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Movie not found</h1>
        <p>The movie you are looking for does not exist.</p>
      </div>
    );
  }
}
