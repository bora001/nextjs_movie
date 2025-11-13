import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchGenreMovies,
  fetchInfiniteMovieList,
  fetchLikedMovies,
  fetchMovieDetailCredits,
  fetchMovieDetail,
  fetchMovieDetailLike,
  fetchMovieDetailVideos,
  fetchToggleLike,
} from "./movieApi";
import { MovieType } from "@/types/movie";

const useGenreMovies = (selectedGenreId: number | null) => {
  return useQuery({
    queryKey: ["genreMovies", selectedGenreId],
    queryFn: () =>
      selectedGenreId
        ? fetchGenreMovies(selectedGenreId)
        : Promise.resolve(null),
    enabled: selectedGenreId !== null,
  });
};

const useLikedMovies = () => {
  return useQuery<MovieType[]>({
    queryKey: ["likedMovies"],
    queryFn: () => fetchLikedMovies(),
  });
};

const useMovieDetail = (movieId: string | null) => {
  return useQuery({
    queryKey: ["movieDetail", movieId],
    queryFn: () =>
      movieId ? fetchMovieDetail(movieId) : Promise.resolve(null),
    enabled: movieId !== null,
  });
};

const useMovieDetailVideos = (movieId: string | null) => {
  return useQuery({
    queryKey: ["movieDetailVideos", movieId],
    queryFn: () =>
      movieId ? fetchMovieDetailVideos(movieId) : Promise.resolve(null),
    enabled: movieId !== null,
  });
};

const useMovieDetailCredits = (movieId: string | null) => {
  return useQuery({
    queryKey: ["movieDetailCredits", movieId],
    queryFn: () =>
      movieId ? fetchMovieDetailCredits(movieId) : Promise.resolve(null),
    enabled: movieId !== null,
  });
};

const useMovieDetailLike = (movieId: string | null) => {
  return useQuery({
    queryKey: ["movieDetailLike", movieId],
    queryFn: () =>
      movieId ? fetchMovieDetailLike(movieId) : Promise.resolve(null),
    enabled: movieId !== null,
  });
};

const useMutationToggleLike = (isLiked: boolean, detail: MovieType | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (detail: MovieType | null) => {
      if (!detail)
        return { data: { success: false, message: "Movie not found" } };

      return await fetchToggleLike(detail.id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["likedMovies"] });

      if (isLiked) {
        queryClient.setQueryData(["likedMovies"], (old: MovieType[] = []) => {
          return [...old].filter((movie) => movie.id !== detail?.id);
        });
      } else {
        queryClient.setQueryData(["likedMovies"], (old: MovieType[] = []) => {
          if (!detail) return [...old];
          return [detail, ...old];
        });
      }
    },
    onError: (error) => {
      console.error("Error toggling like:", error);
    },
  });
};

const useInfiniteMovieList = (category: string) => {
  return useInfiniteQuery({
    queryKey: ["movies", category],
    queryFn: async ({ pageParam = 1 }) => {
      return fetchInfiniteMovieList(category, pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.total_pages && allPages.length < lastPage.total_pages) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export {
  useGenreMovies,
  useLikedMovies,
  useMovieDetail,
  useMutationToggleLike,
  useMovieDetailVideos,
  useMovieDetailCredits,
  useMovieDetailLike,
  useInfiniteMovieList,
};
