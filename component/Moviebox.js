import Image from "next/image";
import Link from "next/link";
import styles from "../styles/movieList.module.css";

export default function MovieBox({ results }) {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return <div className={styles.movie_cnt} />;
  }

  return (
    <div className={styles.movie_cnt}>
      {results
        .filter((movie) => movie && movie.id)
        .map((movie, index) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <div className={styles.movie_box}>
              <div className={styles.movie_poster}>
                {movie.poster_path && (
                  <Image
                    src={movie.poster_path}
                    alt={`${movie.title || "Movie"} image`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    style={{ objectFit: "contain" }}
                    priority={index < 4}
                  />
                )}
              </div>
              <p className={styles.movie_title}>{movie.title || "Untitled"}</p>
              <p className={styles.movie_rate}>
                {movie.vote_average != null
                  ? movie.vote_average.toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
