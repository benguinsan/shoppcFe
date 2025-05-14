import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";

const ProductItem = ({ product, className = "", selected }) => {
  const navigate = useNavigate();
  // const handleRemove = (e, product) => {
  //   e.stopPropagation();
  //   removeFromCompare(product);
  // };

  // const handleAdd = (e, product) => {
  //   e.stopPropagation();
  //   addToCompare(product);
  // };

  const handleClick = (item) => {
    console.log(item);
    const path = slugify(item.TenSP, { strict: true });
    navigate(`/${path}/${item.MaSP}`);
  };

  return (
    <div
      className={`flex flex-col rounded-lg p-3 bg-white h-[55%] mx-2 cursor-pointer  ${className}`}
      onClick={() => handleClick(product)}
    >
      <img
        src={product?.ImgUrl || "https://via.placeholder.com/300"}
        alt={product?.TenSP}
        className="w-full h-[180px] object-cover rounded-lg mb-2 transition-transform hover:scale-105"
      />
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-medium mb-2 truncate hover:text-clip hover:whitespace-normal">
          {product?.TenSP}
        </h3>
        {/* {product?.inventory < 5 && product?.inventory > 0 && (
          <span className="text-orange-500 font-medium mb-2 text-sm">
            Chỉ còn {product?.inventory} sản phẩm
          </span>
        )} */}
        {/* {product?.inventory === 0 && (
          <span className="text-orange-500 font-medium mb-2 text-sm">
            Sản phẩm hiện tại hết hàng
          </span>
        )}
        {product?.inventory > 4 && <span className="mb-8"></span>} */}
        <div className="flex items-center justify-between text-sm  mb-2">
          <span className="text-lg text-blue-700 font-semibold">
            {formatPrice(product?.Gia)}
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-green-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </span>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ProductItem;
