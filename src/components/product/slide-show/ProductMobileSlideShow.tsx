"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import './slideshow.css';

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideShow = ({ images, title, className }: Props) => {

  return (
    <div className={`${className}`}>
      <Swiper
        style={{
          height:"500px",
          width:"100vw"
        }}
        modules={[FreeMode, Navigation, Autoplay, Pagination]}
        className="mySwiper2"
        autoplay= {{ delay: 2500 }}
        pagination
      >
        {
          images.map( image => (
            <SwiperSlide key={image} >
              <Image  src={ `/products/${image}` }
                      alt={ title }
                      width={300}
                      height={300}
                      className="object-fill"
                      />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
};
