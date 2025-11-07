"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Modal from "../../../component/Modal";
import styles from "../../../styles/movie.module.css";
import { MovieDetailType, CreditType } from "@/types/movie";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface MovieDetailPropsType {
  detail: MovieDetailType | null;
  credit: CreditType | null;
}

export default function MovieDetail({ detail, credit }: MovieDetailPropsType) {
  const [viewCast, setViewCast] = useState<boolean>(false);
  const [viewTrailer, setViewTrailer] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = viewTrailer ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [viewTrailer]);

  if (!detail) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Movie not found</h1>
        <p>The movie you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div>
      {detail && (
        <div className={styles.detail_cnt}>
          <div className="img_box">
            <div className={styles.img_poster}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${detail.poster_path}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={`${detail.title} poster image1`}
                priority
              />
            </div>
            <div className={styles.img_backdrop}>
              <Image
                fill
                sizes="(max-width: 768px) 0px, (max-width: 1440px) 34.7222vw, 500px"
                src={`https://image.tmdb.org/t/p/w500${detail.backdrop_path}`}
                alt={`${detail.title} poster image2`}
              />
            </div>
          </div>
          <div className={styles.movie_box}>
            <div className={styles.movie_info}>
              <h2>{detail.title}</h2>
              <div className={styles.genres_box}>
                {detail.genres?.map((g) => (
                  <span key={g.id}>{g.name}</span>
                ))}
              </div>

              <p>{detail.release_date}</p>
              <p className={styles.movie_rate}>
                {detail.vote_average.toFixed(1)}
              </p>
              <p className={styles.desc_txt}>{detail.overview}</p>
              <div className={styles.btn_box}>
                {detail.trailer && (
                  <button
                    className={styles.view_cast}
                    onClick={() => setViewTrailer(!viewTrailer)}
                    aria-label="View trailer"
                  >
                    View Trailer
                  </button>
                )}
                <button
                  className={styles.view_cast}
                  onClick={() => setViewCast(!viewCast)}
                  aria-label="View cast"
                >
                  View Cast
                </button>
              </div>
            </div>
            <div className={styles.cast_box}>
              {viewCast &&
                credit &&
                credit.cast.map((cast) => (
                  <div
                    className={styles.cast_info}
                    key={cast.id || cast.cast_id}
                  >
                    <div className={styles.cast_img}>
                      <Image
                        fill
                        sizes="(max-width: 768px) 80px, 120px"
                        alt={`${cast.name} profile image`}
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                          transform: "scale(0.9)",
                          filter: "brightness(0.85)",
                        }}
                        src={
                          cast.profile_path
                            ? `https://image.tmdb.org/t/p/w500${cast.profile_path}`
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        }
                      />
                    </div>
                    <div className={styles.cast_txt}>
                      <p className={styles.cast_act}>{cast.character}</p>
                      <p className={styles.cast_name}>({cast.name})</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {viewTrailer && detail.trailer && (
        <Modal>
          <ReactPlayer
            className={styles.youtube_edit}
            url={`https://www.youtube.com/watch?v=${detail.trailer.key}`}
            playing={true}
            controls={false}
          />
          <button
            className={styles.youtube_close}
            onClick={() => setViewTrailer(!viewTrailer)}
            aria-label="Close trailer"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}
