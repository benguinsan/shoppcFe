import React, { useState } from "react";
import { formatPrice } from "../../../utils/formatPrice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const arrayImage = [
  "https://lh3.googleusercontent.com/lc6DzDy1TKN_guYmItGOG1DIWMp3iACXwfMJL4ZdlW501Sqm4j86XGaQDD_mrGiT8OoxFGj7FQGrc5DTR8MSZjrwV0ezEds=w500-rw",
  "https://lh3.googleusercontent.com/lc6DzDy1TKN_guYmItGOG1DIWMp3iACXwfMJL4ZdlW501Sqm4j86XGaQDD_mrGiT8OoxFGj7FQGrc5DTR8MSZjrwV0ezEds=rw",
  "https://lh3.googleusercontent.com/Py0IiPsUUlPtJenM3wKeS2h0sBUNr5HEo15MIxC2nBK93eeGpd4jkeINKDgnf1GA5RwEXe3RP8VUKgcmre595-IAKVMytpF-=rw",
  "https://lh3.googleusercontent.com/zhOrgbEbf-AUGRCDp-RRhEVnXYNXGUbJLnlj80NFUp7U1AKdMH8ad9z-lu1C-bgFtwEpANpXm4ONr1Ykd9M75rFLgEnDiMkM=rw",
  "https://lh3.googleusercontent.com/XcZ_1jBsvR9F4oWXoZsvCT67dD6isiU-srDBswuvAULwSiGbgA_LPzOFm8EPMoJuGCKiWGjuGs5qeVSU6VrrdTKmffwI8BFoyA=rw",
  "https://lh3.googleusercontent.com/GMMMIV-6haJTpTX10W-xdqSLiaV6IIu6kzYPhdJqRMZgjd6b0qyjUVzbeyMJ5oKehvI50su9d1eVOTIGcmO1CTBXeQ17CxI=rw",
];
const InformationProduct = () => {
  const [activeThumb, setActiveThumb] = useState();
  const navigate = useNavigate();

  const handleClick = () => {
    toast.success("Đã thêm sản phẩm vào giỏ hàng", { pauseOnHover: false });
    navigate("/cart");
  };
  return (
    <div className="Information-product bg-white rounded-xl py-8 px-2">
      <div className="product-image">
        <Swiper
          loop={true}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation, Thumbs, Autoplay]}
          grabCursor={true}
          autoplay={{ delay: 4000 }}
          thumbs={{ swiper: activeThumb }}
          className="product-images-slider"
        >
          {arrayImage.map((item, index) => (
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
          {arrayImage.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="product-images-slider-thumbs-wrapper">
                <img src={item} alt="" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="product-info flex flex-col p-6">
        <span className="text-2xl font-medium mb-2">
          Laptop APPLE MacBook Air 2020 MGNE3SA/A (13.3" Apple M1/8GB/512GB
          SSD/Onboard/macOS/1.3kg)
        </span>
        <div className="flex items-center justify-start gap-x-5 mb-4">
          <span className="text-lg text-slate-400">Thương hiệu: Apple</span>
          <span>|</span>
          <span className="text-lg text-slate-400">SKU: 201201619</span>
        </div>
        <span className="text-orange-500 font-medium mb-4">
          Chỉ còn 1 sản phẩm
        </span>
        <span className="text-2xl font-semibold text-blue-700 mb-2">
          {formatPrice(30889000)}
        </span>
        <div className="flex items-center mb-6">
          <span className="text-base line-through text-slate-400 ">
            {formatPrice(34990000)}
          </span>
          <span className="text-blue"> - 11.7%</span>
        </div>
        <span className="w-full border-dotted border-2 mb-6"></span>
        <div className="flex items-center justify-between">
          <button
            className="px-24 py-4 bg-blue-800 text-white text-xl font-medium rounded-md"
            type="button"
            onClick={handleClick}
          >
            MUA NGAY
          </button>
          <button
            className="px-8 py-4  text-blue-700 text-xl font-medium rounded-md border-2 border-blue-700"
            type="button"
          >
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
        <span className="w-full border-dotted border-2 my-6"></span>
      </div>
    </div>
  );
};

export default InformationProduct;
