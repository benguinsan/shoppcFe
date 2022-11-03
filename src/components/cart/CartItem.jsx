import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const CartItem = ({ product }) => {
  return (
    <div className="flex items-center gap-x-3 mb-5">
      <img
        src={product.data.linkImg[0]}
        alt=""
        className="w-[80px] h-[80px] border-2 border-solid"
      />
      <div className="flex flex-col items-start text-black">
        <span className=" text-base"> {product.data.title}</span>
        <span className="text-base text-[#a28faa]">
          Số lượng: {product.quantity}
        </span>
        <span className="text-lg font-medium">
          {formatPrice(product.data.promotion)}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
