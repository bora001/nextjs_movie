"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Modal from "../../../component/Modal";
import styles from "../../../styles/movie.module.css";
import { LikeType, MovieType, VideoType } from "@/types/movie";
import { UserType } from "@/types/user";
import {
  useMovieDetailCredits,
  useMovieDetailLike,
  useMutationToggleLike,
} from "@/lib/api/movie/movie";
import { useQueryClient } from "@tanstack/react-query";
import { CONFIG } from "@/config/config";
import Button from "@/component/Button";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface MovieDetailPropsType {
  detail: MovieType | null;
  user: UserType | null;
  like: LikeType | null;
  trailer: VideoType | null;
}

export default function MovieDetail({
  detail,
  user,
  like,
  trailer,
}: MovieDetailPropsType) {
  const [viewCast, setViewCast] = useState<boolean>(false);
  const [viewTrailer, setViewTrailer] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(like?.likeCount || 0);
  const [isLiked, setIsLiked] = useState<boolean>(like?.liked || false);
  const queryClient = useQueryClient();
  const { data: credit } = useMovieDetailCredits(
    detail?.id?.toString() || null
  );

  const { data: likeData } = useMovieDetailLike(detail?.id?.toString() || null);

  useEffect(() => {
    document.body.style.overflow = viewTrailer ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [viewTrailer]);

  const {
    mutate: toggleLike,
    isPending: isLoadingLike,
    isSuccess: isSuccessToggleLike,
  } = useMutationToggleLike(isLiked, detail);

  useEffect(() => {
    // update from client
    if (likeData && likeData) {
      setIsLiked(likeData.liked);
      setLikeCount(likeData.likeCount);
    }
  }, [likeData]);

  useEffect(() => {
    if (isSuccessToggleLike) {
      queryClient.invalidateQueries({
        queryKey: ["movieDetailLike", detail?.id?.toString() || null],
      });
    }
  }, [detail?.id, isSuccessToggleLike, queryClient]);

  const handleLikeToggle = () => {
    if (!user || !detail || isLoadingLike) return;
    toggleLike(detail);
  };

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
                src={`${CONFIG.MOVIE_IMAGE_URL}${detail.poster_path}`}
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
                src={`${CONFIG.MOVIE_IMAGE_URL}${detail.backdrop_path}`}
                alt={`${detail.title} poster image2`}
              />
            </div>
          </div>
          <div className={styles.movie_box}>
            <div className={styles.movie_info}>
              <div className={styles.movie_info_header}>
                <div className={styles.movie_info_header_left}>
                  <h2>{detail.title}</h2>
                  <div className={styles.genres_box}>
                    {detail.genres?.map((g) => (
                      <span key={g.id}>{g.name}</span>
                    ))}
                  </div>
                  <p>{detail.release_date}</p>
                </div>
                <div className={styles.movie_info_header_right}>
                  <p className={styles.movie_rate}>
                    {detail.vote_average.toFixed(1)}
                  </p>
                  <span className={styles.like_count}>
                    {likeCount > 0 ? `❤️ ${likeCount}` : "🤍 0"}
                  </span>
                </div>
              </div>
              <p className={styles.desc_txt}>{detail.overview}</p>

              <div className={styles.btn_box}>
                {trailer && (
                  <Button
                    onClick={() => setViewTrailer(!viewTrailer)}
                    text="View Trailer"
                  />
                )}
                <Button
                  onClick={() => setViewCast(!viewCast)}
                  text="View Cast"
                />
                {user && (
                  <Button
                    className={`${styles.view_cast} ${styles.like_btn} ${
                      isLiked ? styles.liked : ""
                    }`}
                    onClick={handleLikeToggle}
                    disabled={isLoadingLike}
                    text={isLiked ? "❤️ Liked" : "🤍 Like"}
                  />
                )}
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
                          filter: "brightness(0.85)",
                        }}
                        src={
                          cast.profile_path
                            ? `${CONFIG.MOVIE_IMAGE_URL}${cast.profile_path}`
                            : "/empty-profile.webp"
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
      {viewTrailer && trailer && (
        <Modal>
          <ReactPlayer
            className={styles.youtube_edit}
            url={`https://www.youtube.com/watch?v=${trailer.key}`}
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
