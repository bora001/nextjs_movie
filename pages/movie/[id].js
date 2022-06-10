import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/movie.module.css";
import axios from "axios";

export default function MovieDetail({ detail, credit }) {
  const [viewCast, setViewCast] = useState(false);
  return (
    <div>
      <Head>
        <title>Movie | {detail.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={detail.overview} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {detail && (
        <div className={styles.detail_cnt}>
          <div className="img_box">
            <div className={styles.img_poster}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${detail.poster_path}`}
                layout="fill"
                alt={`${detail.title} poster image1`}
              />
            </div>
            <div className={styles.img_backdrop}>
              <Image
                layout="fill"
                src={`https://image.tmdb.org/t/p/w500${detail.backdrop_path}`}
                alt={`${detail.title} poster image2`}
              />
            </div>
          </div>
          <div className={styles.movie_box}>
            <div className={styles.movie_info}>
              <h2>{detail.title}</h2>
              <div className={styles.genres_box}>
                {detail.genres.map((g, i) => (
                  <span key={i}>{g.name}</span>
                ))}
              </div>

              <p>{detail.release_date}</p>
              <p className={styles.movie_rate}>{detail.vote_average}</p>
              <p className={styles.desc_txt}>{detail.overview}</p>
              <button
                className={styles.view_cast}
                onClick={() => setViewCast(!viewCast)}
              >
                View Cast
              </button>
            </div>
            <div className={styles.cast_box}>
              {viewCast &&
                credit &&
                credit.cast.map((cast, i) => (
                  <div className={styles.cast_info} key={i}>
                    <div className={styles.cast_img}>
                      <Image
                        layout="fill"
                        alt={`${cast.name} profile image`}
                        src={
                          cast.profile_path
                            ? `https://image.tmdb.org/t/p/w500${cast.profile_path}`
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        }
                      />
                    </div>
                    <p className={styles.cast_act}>{cast.character}</p>
                    <p className={styles.cast_name}>({cast.name})</p>
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
  const detail = await axios
    .get(`http://localhost:3000/api/movie/${context.query.id}`)
    .then((res) => res.data);

  const credit = await axios
    .get(`http://localhost:3000/api/movie/${context.query.id}/credit`)
    .then((res) => res.data);

  return { props: { detail, credit } };
}
