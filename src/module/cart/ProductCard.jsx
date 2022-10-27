import React from "react";
import { Link } from "react-router-dom";
const ProductCard = () => {
  return (
    <div className="flex items-center justify-start gap-x-3">
      <img
        src="https://lh3.googleusercontent.com/HpIeBeBl9TBMm6VAEI68xV_xa7wfqIRqRxjKdwo7uawK-F1ZnLdIDe3c75Zpfvw9hE5Ql3VZXPCNHsxyTN4=rw"
        alt=""
        className="w-[100px] h-[100px] object-cover border-2 border-solid"
      />
      <div className="flex flex-col items-start flex-wrap">
        <Link to="/" className="text-base hover:text-blue-600 leading-7">
          Laptop APPLE MacBook Air 2020 MGNE3SA/A (13.3" Apple M1/8GB/512GB
          SSD/Onboard/macOS/1.3kg)
        </Link>
        <span className="text-base text-[#8e8db7]">SKU: 190800126</span>
        <span className="text-orange-500 text-base">Chỉ còn 1 sản phẩm </span>
      </div>
    </div>
  );
};

export default ProductCard;
