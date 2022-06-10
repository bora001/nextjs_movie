import styles from "../styles/Slider.module.css";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { EffectCoverflow, Navigation } from "swiper";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css";

export default function MovieBox({ results }) {
  const [activeSlide, setActiveSlide] = useState(0);
  return (
    <>
      <Swiper
        className={styles.movie_cnt}
        spaceBetween={50}
        slidesPerView={5}
        effect={"coverflow"}
        centeredSlides={true}
        initialSlide={9}
        coverflowEffect={{
          rotate: 0,
          stretch: 10,
          depth: 150,
          modifier: 3,
          slideShadows: false,
        }}
        navigation={true}
        modules={[EffectCoverflow, Navigation]}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
      >
        {results.map((movie, i) => (
          <SwiperSlide
            key={movie.id}
            className={i == activeSlide ? styles.active_slide : ""}
          >
            <Link href={`/movie/${movie.id}`}>
              <div className={styles.movie_box}>
                <div className={styles.movie_poster}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} image`}
                    layout="fill"
                  />
                </div>
                {i == activeSlide && (
                  <>
                    <p className={styles.movie_title}>{movie.title}</p>
                    <p className={styles.movie_rate}>
                      {movie.vote_average.toFixed(1)}
                    </p>
                  </>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
