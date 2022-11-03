import React from "react";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import queryString from "query-string";
const ProductCard = ({ data }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    const path = slugify(data.data.title, { strict: true });
    const filters = {
      sku: data.data.id,
    };
    navigate({
      pathname: `/${path}`,
      search: queryString.stringify(filters),
    });
    location.reload();
  };
  return (
    <div className="flex items-center justify-start gap-x-3">
      <img
        src={data.data.linkImg[0]}
        alt=""
        className="w-[100px] h-[100px] object-cover border-2 border-solid"
      />
      <div className="flex flex-col items-start flex-wrap">
        <span
          className="text-base hover:text-blue-600 leading-7 cursor-pointer"
          onClick={handleClick}
        >
          {data.data.title}
        </span>
        <span className="text-base text-[#8e8db7]">SKU: {data.data.id}</span>
        <span className="text-orange-500 text-base">
          Chỉ còn {data.data.inventory} sản phẩm{" "}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
