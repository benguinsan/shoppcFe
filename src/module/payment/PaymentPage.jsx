import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserAddress from "../UserProfile/UserAddress";
import { formatPrice } from "../../utils/formatPrice";

const PaymentPage = () => {
  const [check, setCheck] = useState(true);
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="payment container">
        <div className="information-payment">
          <div className="bg-white w-full rounded-lg">
            <span className="text-2xl font-bold p-5 inline-block">
              Thông tin nhận hàng
            </span>
            <div className="flex flex-col px-5 pb-10">
              <UserAddress />
            </div>
          </div>
          <div className="flex flex-col px-5 mt-10 rounded-lg py-5 bg-white">
            <span className="text-2xl font-bold">Phương thức thanh toán</span>
            <div className="flex items-center justify-between mt-5 px-16 ">
              <button
                className={`px-16 py-10 border-2 border-solid text-xl font-bold ${
                  check ? "border-blue-500" : ""
                }`}
                onClick={() => setCheck(!check)}
              >
                Thanh toán qua ngân hàng
              </button>
              <button
                className={`px-16 py-10 border-2 border-solid text-xl font-bold ${
                  check ? "" : "border-blue-500"
                }`}
                onClick={() => setCheck(!check)}
              >
                Thanh toán khi nhận hàng
              </button>
            </div>
          </div>
        </div>

        <div className="information-order">
          <div className="flex flex-col bg-white rounded-lg pb-10">
            <div className="flex items-center justify-between p-5 ">
              <span className="text-2xl font-bold inline-block">
                Thông tin đơn hàng
              </span>
              <span
                className="text-lg font-medium text-blue-600 cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                Chỉnh sửa
              </span>
            </div>
            <div className="flex items-center justify-between px-5 gap-x-5">
              <img
                src="https://lh3.googleusercontent.com/YvbLR5xADVTTWcGf_4GNDCfFdXZlwldcxn0L9Fm2WQoOmjimmaKV6d9hIehVgfGN9tpnixKBRYOsp1puN9ceiHhiH6oGYP3c-g=rw"
                alt=""
                className="w-[100px] h-[100px] border-2 border-solid"
              />
              <div className="flex flex-col justify-start items-start">
                <span className="text-base">
                  Laptop APPLE MacBook Air 2020 MGNA3SA/A
                </span>
                <span className="text-base text-[#a28faa]">Số lượng: 1</span>
                <span className="text-lg font-medium">
                  {formatPrice(36900000)}
                </span>
                <span className="text-base text-[#a28faa] line-through">
                  {formatPrice(40000000)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-lg pb-10 mt-10">
            <div className="flex items-center justify-between p-5">
              <span className="text-[#8b8f9b] text-lg font-normal">
                Tổng tạm tính
              </span>
              <span className="text-lg font-bold">{formatPrice(36900000)}</span>
            </div>
            <div className="flex items-center justify-between px-5 pb-5">
              <span className="text-[#8b8f9b] text-lg font-normal">
                Phí vận chuyển
              </span>
              <span className="text-lg font-bold">Miễn phí</span>
            </div>
            <div className="flex items-center justify-between px-5 pb-5">
              <span className="text-[#8b8f9b] text-lg font-normal">
                Thành tiền
              </span>
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(36900000)}
              </span>
            </div>
            <button className="bg-blue-700 text-white rounded-lg font-medium text-xl mx-5 py-4 mt-5">
              THANH TOÁN
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
