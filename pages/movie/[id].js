import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../../styles/movie.module.css";

export default function MovieDetail({ detail, credit }) {
  console.log(credit, "credit");
  const [viewCast, setViewCast] = useState(false);
  return (
    <div>
      {detail && (
        <div className={styles.detail_cnt}>
          <div className="img_box">
            <div className={styles.img_poster}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${detail.poster_path}`}
                layout="fill"
              />
            </div>
            <div className={styles.img_backdrop}>
              <Image
                layout="fill"
                src={`https://image.tmdb.org/t/p/w500${detail.backdrop_path}`}
              />
            </div>
          </div>
          <div className={styles.txt_box}>
            <div className="movie_info">
              <h2>{detail.title}</h2>
              {detail.genres.map((g, i) => (
                <span key={i}>{g.name}</span>
              ))}

              <p>{detail.release_date}</p>
              <p>{detail.vote_average}</p>
              <p>{detail.overview}</p>
              <button onClick={() => setViewCast(!viewCast)}>View Cast</button>
            </div>
            <div className={styles.cast_box}>
              {viewCast &&
                credit &&
                credit.cast.map((cast, i) => (
                  <div className={styles.cast_info} key={i}>
                    <div className={styles.cast_img}>
                      <Image
                        layout="fill"
                        src={
                          cast.profile_path
                            ? `https://image.tmdb.org/t/p/w500${cast.profile_path}`
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        }
                      />
                    </div>
                    <p>{cast.character}</p>
                    <p>({cast.name})</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  // //   const movieList = useSelector((state) => state.movieList);
  console.log("test", context.query.id);
  const detail = await (
    await fetch(`http://localhost:3000/api/movie/${context.query.id}`)
  ).json();

  const credit = await (
    await fetch(`http://localhost:3000/api/movie/${context.query.id}/credit`)
  ).json();

  // const { genres } = await (
  //   await fetch("http://localhost:3000/api/genres")
  // ).json();
  // console.log("server");

  // console.log(context.store);
  // //   console.log("test", context.store);
  return { props: { detail, credit } };
}
