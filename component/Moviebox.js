import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";

export default function MovieBox({ results }) {
  return (
    <div className={styles.movie_box}>
      {results.map((movie) => (
        <Link href={`/movie/${movie.id}`} key={movie.id}>
          <div>
            <div className={styles.movie_poster}>
              <Image
                src={movie.poster_path}
                alt={`${movie.title} image`}
                layout="fill"
              />
            </div>

            <p className={styles.movie_title}>{movie.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
