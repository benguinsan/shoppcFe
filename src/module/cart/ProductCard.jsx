import React from "react";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
const ProductCard = ({ data }) => {
  console.log(data);
  const navigate = useNavigate();
  const handleClick = () => {
    const path = slugify(data?.product?.title, { strict: true });
    navigate(`/${path}/${data?.id}`);
  };
  return (
    <div className="flex items-center justify-start gap-x-3">
      <img
        src={data.product.images[0]}
        alt=""
        className="w-[100px] h-[100px] object-cover border-2 border-solid"
      />
      <div className="flex flex-col items-start flex-wrap">
        <span
          className="text-base hover:text-blue-600 leading-7 cursor-pointer"
          onClick={handleClick}
        >
          {data.product.title}
        </span>
        <span className="text-base text-[#8e8db7]">SKU: {data.product.id}</span>
        <span className="text-orange-500 text-base">
          Chỉ còn {data.product.inventory} sản phẩm{" "}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
