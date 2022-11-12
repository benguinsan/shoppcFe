import React from "react";
import { formatPrice } from "../../utils/formatPrice";
const ProductOrder = () => {
  return (
    <div className="flex flex-col items-start mt-5 w-full">
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start gap-x-2">
          <img
            src="https://lh3.googleusercontent.com/UL9bIySZatUyckrYhzv4NV7v9aiOeOUUM5nbkvF_M6jjDF_4ctEcEx2--m8bTZWP74ESzIp6b8GMLMlcM1YzdPw1yM07K0o=rw"
            alt=""
            className="w-[120px] h-[120px]"
          />
          <div className="flex flex-col items-start gap-y-2">
            <span className="text-lg font-medium">
              Máy tính xách tay/ Laptop Lenovo IdeaPad 5 15ITL05-82FG01H8VN
              (i5-1135G7) (Xám)
            </span>
            <span className="text-base">SKU: 220200620</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg">{formatPrice(13590000)}</span>
          <span className="text-base line-through">
            {formatPrice(17990000)}
          </span>
          <span>X1</span>
        </div>
      </div>
    </div>
  );
};

export default ProductOrder;
