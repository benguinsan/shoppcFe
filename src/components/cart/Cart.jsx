import React from "react";
import styled from "styled-components";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
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
  const product = JSON.parse(localStorage.getItem("cart"));

  let length = product?.length;
  let total = 0;
  if (length > 0) {
    total = product.reduce(
      (count, item) => count + item.quantity * item.product.promotion,
      0
    );
  }
  const navigate = useNavigate();

  return (
    <CartStyles className="cart-child">
      <div className="flex flex-col items-start p-5 h-[500px] overflow-hidden overflow-y-auto rounded-lg">
        {product?.length > 0 &&
          product.map((item) => <CartItem product={item} key={item.id} />)}
        <div className="flex justify-end flex-col h-full">
          <span className="border-2 border-dotted border-x-gray-500 w-full"></span>
          <div className="flex items-center justify-between py-3 text-black gap-x-24 ">
            <span className="font-normal text-lg">
              Tổng tiền ({length}) sản phẩm
            </span>
            <span className=" text-xl font-semibold">{formatPrice(total)}</span>
          </div>
          <button
            className="bg-blue-700 w-full py-3 mt-2 rounded-lg"
            type="button"
            onClick={() => navigate("/cart")}
          >
            Xem giỏ hàng
          </button>
        </div>
      </div>
    </CartStyles>
  );
};

export default Cart;
