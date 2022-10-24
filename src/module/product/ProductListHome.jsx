import React from "react";
import ProdictItem from "../product/ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCards } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";

const ProductList = ({ data, bg, className = "" }) => {
  return (
    <div className="m-20">
      <div
        className={`container bg-[${bg}] h-[500px] bg-no-repeat w-full bg-cover rounded-lg ${className}`}
      >
        <Swiper
          modules={[Navigation, Pagination, EffectCards]}
          slidesPerView={5}
          navigation
          pagination={{ clickable: true }}
          className="w-full rounded-lg pt-20"
        >
          {data.length > 0 &&
            data.map((item) => (
              <SwiperSlide key={item.id}>
                <ProdictItem product={item} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductList;
