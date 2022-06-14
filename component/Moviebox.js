import Image from "next/image";
import Link from "next/link";
import styles from "../styles/movieList.module.css";

export default function MovieBox({ results }) {
  return (
    <div className={styles.movie_cnt}>
      {results.map((movie, i) => (
        <Link href={`/movie/${movie.id}`} key={movie.id + new Date() / 1 + i}>
          <div className={styles.movie_box}>
            <div className={styles.movie_poster}>
              <Image
                src={movie.poster_path}
                alt={`${movie.title} image`}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className={styles.movie_title}>{movie.title}</p>
            <p className={styles.movie_rate}>{movie.vote_average.toFixed(1)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
