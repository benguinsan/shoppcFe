import React from "react";
import ProdictItem from "../product/ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCards } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import queryString from "query-string";

const ProductListHome = ({ data, bg = "", className = "" }) => {
  const navigate = useNavigate();

  const handleClick = (item) => {
    const path = slugify(item.title, { strict: true });
    const filters = {
      sku: item.id,
    };
    navigate({
      pathname: `/${path}`,
      search: queryString.stringify(filters),
    });
  };
  return (
    <div className={`${className}`}>
      <div
        className={`container ${
          bg === "bg1" ? 'bg-[url("../../../public/images/bg-laptop.png")]' : ""
        }
        ${
          bg === "bg2"
            ? 'bg-[url("../../../public/images/bg-laptop-1.png")]'
            : ""
        }
          h-[500px] bg-no-repeat w-full bg-cover rounded-lg`}
      >
        <Swiper
          modules={[Navigation, Pagination, EffectCards]}
          slidesPerView={5}
          slidesPerGroup={5}
          navigation
          pagination={{ clickable: true }}
          className={`w-full rounded-lg ${className}`}
        >
          {data.length > 0 &&
            data.map((item) => (
              <SwiperSlide key={item.id}>
                <ProdictItem product={item} onClick={() => handleClick(item)} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductListHome;
