import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { formatPrice } from "../../utils/formatPrice";
import { useSelector } from "react-redux";
const PaymentCash = () => {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  console.log(cart);
  return (
    <div className="mt-10">
      <div className="container bg-white rounded-lg flex flex-col items-center p-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-[220px] h-[220px] text-orange-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-4xl font-bold">Đơn hàng chờ xử lý</span>
        <span className="mt-5 text-xl">
          Vui lòng chờ trong giây lát hoặc liên hệ bộ phận quản trị viên
        </span>
        <div className="mt-10 p-5">
          <div className="flex items-center text-xl gap-x-32">
            <span>Mã đơn hàng:</span>
            <span>22111038489650</span>
          </div>
          <div className="flex items-center text-xl gap-x-36">
            <span>Giá trị đơn hàng:</span>
            <span>
              {formatPrice(
                cart?.reduce(
                  (count, item) => count + item.quantity * item.data.promotion,
                  0
                )
              )}
            </span>
          </div>
          <div className="flex items-center text-xl gap-x-28">
            <span>Còn phải thanh toán:</span>
            <span>
              {" "}
              {formatPrice(
                cart?.reduce(
                  (count, item) => count + item.quantity * item.data.promotion,
                  0
                )
              )}
            </span>
          </div>
        </div>
        <button
          className="mt-5 py-3 px-4 text-white bg-[#1435c3] rounded-lg "
          onClick={() => navigate("/account/orders")}
        >
          Xem chi tiết giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default PaymentCash;
