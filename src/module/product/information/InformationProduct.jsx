import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/cart/cartSlice";
import SubInformationProduct from "./SubInformationProduct";

const InformationProduct = ({ data }) => {
  const [activeThumb, setActiveThumb] = useState();

  const navigate = useNavigate();
  return (
    <div className="Information-product bg-white rounded-xl py-8 px-2">
      <div className="product-image">
        <Swiper
          loop={true}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation, Thumbs, Autoplay]}
          grabCursor={true}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          thumbs={{ swiper: activeThumb }}
          className="product-images-slider"
        >
          {data[0].linkImg.map((item, index) => (
            <SwiperSlide key={index}>
              <img src={item} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>

        <Swiper
          onSwiper={setActiveThumb}
          loop={true}
          spaceBetween={10}
          slidesPerView={5}
          modules={[Navigation, Thumbs]}
          className="product-images-slider-thumbs"
        >
          {data[0].linkImg.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="product-images-slider-thumbs-wrapper">
                <img src={item} alt="" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {data.length > 0 &&
        data.map((item) => <SubInformationProduct key={item.id} data={item} />)}
    </div>
  );
};

export default InformationProduct;
