import React from "react";
import { useNavigate } from "react-router-dom";
const CartHidden = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="mt-5">
      <div className="container bg-white h-[600px] rounded-lg flex flex-col items-center justify-center">
        <img
          src="../../../public/images/logo-cart.png"
          alt=""
          className="w-[300px]h-[300px] object-cover pb-5"
        />
        <span className="text-[#969594] text-lg pb-6">
          Giỏ hàng chưa có sản phẩm nào
        </span>
        <button
          className="px-6 py-3  rounded-lg bg-blue-700 text-white"
          onClick={handleClick}
        >
          Mua sắm ngay
        </button>
      </div>
    </div>
  );
};

export default CartHidden;
