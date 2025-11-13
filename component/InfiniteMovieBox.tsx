"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import MovieBox from "./MovieBox";
import { API } from "@/constants";
import { useInfiniteMovieList } from "@/lib/api/movie/movie";

export default function InfiniteMovieBox() {
  const pathname = usePathname();

  const getCategory = (): string => {
    const segments = pathname.split(API.ROUTES.HOME).filter(Boolean);
    return segments[0] || "popular";
  };

  const { data, fetchNextPage, hasNextPage, isLoading, error } =
    useInfiniteMovieList(getCategory());
  const infiniteMovie = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.results);
  }, [data]);

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h4>Loading...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h4>Error loading movies</h4>
        <p>Please try again later.</p>
      </div>
    );
  }

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
        next={fetchNextPage}
        hasMore={hasNextPage ?? false}
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
