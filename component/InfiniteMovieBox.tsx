"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import MovieBox from "./MovieBox";
import { MovieType, MovieListResponseType } from "@/types/movie";
import { API } from "@/constants";

export default function InfiniteMovieBox() {
  const pathname = usePathname();
  const [infiniteMovie, setInfiniteMovie] = useState<MovieType[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pageNumRef = useRef<number>(1);
  const categoryRef = useRef<string>("");
  const initializedRef = useRef<boolean>(false);
  const isLoadingRef = useRef<boolean>(false);

  const getCategory = useCallback((): string => {
    const segments = pathname.split(API.ROUTES.HOME).filter(Boolean);
    return segments[0] || "popular";
  }, [pathname]);

  const fetchMovies = useCallback(async (page: number, category: string) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    try {
      const res = await axios.get<MovieListResponseType>(
        `${API.ROUTES.API.MOVIES}/${category}/${page}`
      );
      const newData = res.data.results;

      if (!newData || newData.length === 0) {
        setHasMore(false);
        isLoadingRef.current = false;
        return;
      }

      const formattedData: MovieType[] = newData.map((item) => ({
        ...item,
        poster_path: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : null,
      }));

      setInfiniteMovie((prev) => [...prev, ...formattedData]);

      if (res.data.total_pages && page >= res.data.total_pages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      setHasMore(false);
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  const getMoreMovie = useCallback(() => {
    if (!isLoadingRef.current && hasMore) {
      const currentPage = pageNumRef.current;
      const category = categoryRef.current;

      if (currentPage > 1) {
        fetchMovies(currentPage, category);
        pageNumRef.current = currentPage + 1;
      }
    }
  }, [hasMore, fetchMovies]);

  useEffect(() => {
    const category = getCategory();

    if (categoryRef.current !== category) {
      categoryRef.current = category;
      pageNumRef.current = 1;
      setInfiniteMovie([]);
      setHasMore(true);
      isLoadingRef.current = false;
      initializedRef.current = false;
    }

    if (!initializedRef.current && !isLoadingRef.current) {
      initializedRef.current = true;
      fetchMovies(1, category).then(() => {
        pageNumRef.current = 2;
      });
    }
  }, [pathname, getCategory, fetchMovies]);

  return (
    <div
      className="infinite-scroll-component__outerdiv"
      style={{
        width: "100%",
        textAlign: "center",
      }}
    >
      <InfiniteScroll
        dataLength={infiniteMovie.length}
        next={getMoreMovie}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>No more movies to load</p>
        }
      >
        {infiniteMovie && infiniteMovie.length > 0 ? (
          <MovieBox results={infiniteMovie} />
        ) : (
          <div />
        )}
      </InfiniteScroll>
    </div>
  );
}
