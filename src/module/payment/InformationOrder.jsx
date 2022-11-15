import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";
const InformationOrder = ({ data }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    const path = slugify(data?.product?.title, { strict: true });
    navigate(`/${path}/${data.id}`);
  };
  return (
    <div className="flex items-center justify-between px-5 gap-x-5 py-5">
      <img
        src={data.product.images[0]}
        alt=""
        className="w-[100px] h-[100px] border-2 border-solid"
      />
      <div className="flex flex-col justify-start items-start">
        <span
          className="text-base line-clamp-2 hover:text-blue-700 cursor-pointer"
          onClick={handleClick}
        >
          {data.product.title}
        </span>
        <span className="text-base text-[#a28faa]">
          Số lượng: {data.quantity}
        </span>
        <span className="text-lg font-medium">
          {formatPrice(data.product.promotion)}
        </span>
        <span className="text-base text-[#a28faa] line-through">
          {formatPrice(data.product.price)}
        </span>
      </div>
    </div>
  );
};

export default InformationOrder;
