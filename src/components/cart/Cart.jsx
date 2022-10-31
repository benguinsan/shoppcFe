import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { formatPrice } from "../../utils/formatPrice";

const CartStyles = styled.div`
  width: 480px;
  position: absolute;
  top: 60px;
  right: 0;
  border-radius: 10px;
  background-color: white;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all linear 0.25s;
  &::before {
    content: "";
    width: 100%;
    height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
    transform: translateY(-100%);
  }
`;
const Cart = () => {
  const navigate = useNavigate();
  return (
    <CartStyles className="cart-child">
      <div className="flex flex-col items-start p-5">
        <div className="flex items-center gap-x-3 pb-20">
          <img
            src="https://lh3.googleusercontent.com/YvbLR5xADVTTWcGf_4GNDCfFdXZlwldcxn0L9Fm2WQoOmjimmaKV6d9hIehVgfGN9tpnixKBRYOsp1puN9ceiHhiH6oGYP3c-g=rw"
            alt=""
            className="w-[80px] h-[80px] border-2 border-solid"
          />
          <div className="flex flex-col items-start text-black">
            <span className=" text-base">
              {" "}
              Laptop APPLE MacBook Air 2020 MGNA3SA/A
            </span>
            <span className="text-base text-[#a28faa]">Số lượng: 1</span>
            <span className="text-lg font-medium">{formatPrice(36900000)}</span>
          </div>
        </div>
        <span className="border-2 border-dotted border-x-gray-500 w-full"></span>
        <div className="flex items-center justify-between py-3 text-black gap-x-32">
          <span className="font-normal text-lg">Tổng tiền (1) sản phẩm</span>
          <span className=" text-xl font-semibold">
            {formatPrice(36900000)}
          </span>
        </div>
        <button
          className="bg-blue-700 w-full py-3 mt-2 rounded-lg"
          type="button"
          onClick={() => navigate("/cart")}
        >
          Xem giỏ hàng
        </button>
      </div>
    </CartStyles>
  );
};

export default Cart;
