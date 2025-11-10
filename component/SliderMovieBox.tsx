"use client";

import { useState, useRef } from "react";
import { EffectCoverflow } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Slider.module.css";
import { MovieType } from "@/types/movie";
import "swiper/css/effect-coverflow";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderMovieBoxPropsType {
  results: MovieType[];
}

export default function SliderMovieBox({ results }: SliderMovieBoxPropsType) {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const swiperRef = useRef<SwiperType | null>(null);

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
        onSlideChange={(swiper: any) => setActiveSlide(swiper.activeIndex)}
        onSwiper={(swiper: any) => {
          swiperRef.current = swiper;
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
                    i === activeSlide
                      ? styles.movie_poster_active
                      : styles.movie_poster
                  }
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} image`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "contain" }}
                    priority={i === 0 || i === 3}
                  />
                </div>
                {i === activeSlide && (
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
        <ChevronLeft
          className={styles.swiper_prev}
          onClick={() => swiperRef.current?.slidePrev()}
        />

        <ChevronRight
          className={styles.swiper_next}
          onClick={() => swiperRef.current?.slideNext()}
        />
      </div>
    </div>
  );
}
