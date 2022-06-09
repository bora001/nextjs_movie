import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";

export default function MovieBox({ results }) {
  console.log(results);
  return (
    <div className={styles.movie_cnt}>
      {results.map((movie) => (
        <Link href={`/movie/${movie.id}`} key={movie.id}>
          <div className={styles.movie_box}>
            <div className={styles.movie_poster}>
              {(
                <Image
                  src={movie.poster_path}
                  alt={`${movie.title} image`}
                  layout="fill"
                />
              ) || <Skeleton />}
            </div>
            <p className={styles.movie_title}>{movie.title}</p>
            <p className={styles.movie_rate}>{movie.vote_average.toFixed(1)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
