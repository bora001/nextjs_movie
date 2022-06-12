import { useState, useRef } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { EffectCoverflow } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Slider.module.css";
import "swiper/css/effect-coverflow";
import "swiper/css";

export default function MovieBox({ results }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef();
  return (
    <div className={styles.swiper_box}>
      <Swiper
        className={styles.movie_cnt}
        spaceBetween={0}
        slidesPerView={3}
        effect={"coverflow"}
        centeredSlides={true}
        initialSlide={3}
        coverflowEffect={{
          slideShadows: false,
        }}
        modules={[EffectCoverflow]}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          console.log(swiper.activeIndex);
        }}
        breakpoints={{
          768: {
            slidesPerView: 3,
            spaceBetween: 24,
            coverflowEffect: {
              rotate: 0,
              stretch: 35,
              depth: 60,
              modifier: 2,
              slideShadows: false,
            },
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
            coverflowEffect: {
              rotate: 0,
              stretch: 20,
              depth: 60,
              modifier: 5,
              slideShadows: false,
            },
          },

          1440: {
            slidesPerView: 3,
            spaceBetween: 48,
            coverflowEffect: {
              rotate: 0,
              stretch: 20,
              depth: 60,
              modifier: 5,
              slideShadows: false,
            },
          },
        }}
      >
        {results.map((movie, i) => (
          <SwiperSlide key={movie.id}>
            <Link href={`/movie/${movie.id}`}>
              <div className={styles.movie_box}>
                <div
                  className={
                    i == activeSlide
                      ? styles.movie_poster_active
                      : styles.movie_poster
                  }
                >
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
      <div className={styles.swiper_arrow}>
        <MdNavigateBefore
          className={styles.swiper_prev}
          onClick={() => swiperRef.current.slidePrev()}
        />
        <MdNavigateNext
          className={styles.swiper_next}
          onClick={() => swiperRef.current.slideNext()}
        />
      </div>
    </div>
  );
}
