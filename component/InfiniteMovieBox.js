import Image from "next/image";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import MovieBox from "./Moviebox";

export default function InfiniteMovieBox() {
  const router = useRouter();
  const path = router.asPath;
  const [pageNum, setPageNum] = useState(2);
  const [infiniteMovie, setInfiniteMovie] = useState([]);

  useEffect(() => {
    getMoreMovie();
  }, [path]);

  const getMoreMovie = async () => {
    const detail = await axios
      .get(`https://nextjs-movie-ten.vercel.app/api/movies/popular/${pageNum}`)
      .then((res) => {
        const newData = res.data.results;
        newData.map(
          (item) =>
            (item.poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`)
        );
        setTimeout(() => {
          setInfiniteMovie(() => infiniteMovie.concat(newData));
          setPageNum(() => pageNum + 1);
        }, 1500);
      });
  };
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
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <MovieBox results={infiniteMovie} />
      </InfiniteScroll>
    </div>
  );
}
