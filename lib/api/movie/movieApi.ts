import { CONFIG } from "@/config/config";
import { API } from "@/constants";
import {
  CreditType,
  LikeApiResponse,
  MovieDetailType,
  MovieListResponseType,
  MovieType,
  VideoResponseType,
} from "@/types/movie";
import axios from "axios";
const API_KEY = process.env.API_KEY;

export async function fetchGenreMovies(genreId: number) {
  try {
    const response = await axios.get<MovieListResponseType>(
      `${API.ROUTES.API.GENRES}/${genreId}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching genre movies:", error);
    throw error;
  }
}

export async function fetchMovieList(category: string) {
  try {
    const response = await axios.get<MovieListResponseType>(
      `${CONFIG.MOVIE_URL}/movie/${category}?api_key=${API_KEY}`
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching movie list:", error);
    throw error;
  }
}

export async function fetchInfiniteMovieList(
  category: string,
  pageParam: number
) {
  try {
    const response = await axios.get<MovieListResponseType>(
      `${API.ROUTES.API.MOVIES}/${category}/${pageParam}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching infinite movie list:", error);
    throw error;
  }
}

export async function fetchSearchMovieList(params: string) {
  try {
    const response = await axios.get<MovieListResponseType>(
      `${CONFIG.MOVIE_URL}/search/movie?api_key=${API_KEY}`,
      {
        params: { query: params },
      }
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
}

export async function fetchMovieData(movieId: string) {
  try {
    const response = await axios.get<MovieDetailType>(
      `${CONFIG.APP_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie ${movieId}:`, error);
    throw error;
  }
}

export async function fetchMovieDetail(movieId: string) {
  try {
    const response = await axios.get<MovieType>(
      `${CONFIG.APP_URL}/api/movie/detail/${movieId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    throw error;
  }
}

export const fetchLikedMovies = async (): Promise<MovieType[]> => {
  try {
    const response = await axios.get(
      `${CONFIG.APP_URL}${API.ROUTES.API.MOVIES_LIKED}`
    );
    const { likedMovies } = response.data.data;
    const movieIds: number[] = likedMovies ?? [];
    if (movieIds.length === 0) return [];

    const moviePromises = movieIds.map((id) => fetchMovieDetail(id.toString()));
    const movies = await Promise.all(moviePromises);
    return movies.filter((movie): movie is MovieType => movie !== null);
  } catch (error) {
    console.error("Error fetching liked movies:", error);
    throw error;
  }
};

export const fetchToggleLike = async (movieId: number) => {
  try {
    const response = await axios.post(API.ROUTES.API.MOVIES_LIKE, {
      movieId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to toggle like", error);
    throw error;
  }
};

export const fetchMovieDetailVideos = async (movieId: string) => {
  try {
    const response = await axios.get<VideoResponseType>(
      `${CONFIG.APP_URL}/api/movie/${movieId}/videos`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching movie detail videos:", error);
    throw error;
  }
};

export const fetchMovieDetailCredits = async (movieId: string) => {
  try {
    const response = await axios.get<CreditType>(
      // `${CONFIG.MOVIE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
      `${CONFIG.APP_URL}/api/movie/${movieId}/credit`
    );
    // const response = await axios.get<CreditType>(
    //   `${CONFIG.MOVIE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    // );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie detail credits:", error);
    throw error;
  }
};

export const fetchMovieDetailLike = async (movieId: string) => {
  try {
    const response = await axios.get<LikeApiResponse>(
      `${CONFIG.APP_URL}/api/movies/like?movieId=${movieId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching movie detail like:", error);
    throw error;
  }
};
