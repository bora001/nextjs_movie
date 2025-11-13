declare module "swiper" {
  export const EffectCoverflow: any;
  export type Swiper = any;
}

declare module "swiper/react" {
  import { ReactElement } from "react";

  export interface SwiperProps {
    [key: string]: any;
  }

  export function Swiper(props: SwiperProps): ReactElement;
  export function SwiperSlide(props: {
    children?: ReactElement;
    [key: string]: any;
  }): ReactElement;
}
