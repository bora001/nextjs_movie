import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../../styles/movie.module.css";
import { useSelector } from "react-redux";
export default function MovieDetail() {
  const router = useRouter();
  const { movieList } = useSelector((state) => state.movieList);
  const [detail, setDetail] = useState();
  useEffect(() => {
    if (movieList) {
      const [detail] = movieList.filter((x) => x.id == router.query.id);
      setDetail(() => detail);
    }
  }, [router.query.id]);
  console.log(detail);
  return (
    <div>
      {detail && (
        <div className={styles.detail_cnt}>
          <div className="img_box">
            <div className={styles.img_poster}>
              <Image src={detail.poster_path} layout="fill" />
            </div>
            <div className={styles.img_backdrop}>
              <Image
                layout="fill"
                src={`https://image.tmdb.org/t/p/w500${detail.backdrop_path}`}
              />
            </div>
          </div>
          <div className="txt_box">
            <h2>{detail.title}</h2>
            <p>{detail.release_date}</p>
            <p>{detail.vote_average}</p>
            <p>{detail.overview}</p>
          </div>
        </div>
      )}
    </div>
  );
}
