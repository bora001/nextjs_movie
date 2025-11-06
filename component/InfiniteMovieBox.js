"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import MovieBox from "./MovieBox";

export default function InfiniteMovieBox() {
  const pathname = usePathname();
  const [infiniteMovie, setInfiniteMovie] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const pageNumRef = useRef(2);
  const categoryRef = useRef("");
  const initializedRef = useRef(false);
  const isLoadingRef = useRef(false);

  const getCategory = useCallback(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] || "popular";
  }, [pathname]);

  const fetchMovies = useCallback(async (page, category) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    try {
      const res = await axios.get(`/api/movies/${category}/${page}`);
      const newData = res.data.results;

      if (!newData || newData.length === 0) {
        setHasMore(false);
        isLoadingRef.current = false;
        return;
      }

      const formattedData = newData.map((item) => ({
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

  // Reset when pathname changes
  useEffect(() => {
    const category = getCategory();

    // Only reset if category actually changed
    if (categoryRef.current !== category) {
      categoryRef.current = category;
      pageNumRef.current = 2;
      setInfiniteMovie([]);
      setHasMore(true);
      isLoadingRef.current = false;
      initializedRef.current = false;
    }

    // Fetch first page only once per category
    if (!initializedRef.current && !isLoadingRef.current) {
      initializedRef.current = true;
      fetchMovies(2, category).then(() => {
        pageNumRef.current = 3;
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
