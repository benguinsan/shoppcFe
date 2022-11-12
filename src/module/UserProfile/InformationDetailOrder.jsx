import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ProductOrder from "./ProductOrder";
import { formatPrice } from "../../utils/formatPrice";

const InformationDetailOrder = () => {
  const navigate = useNavigate();
  return (
    <div className="container flex flex-col">
      <div className="flex items-center justify-start gap-x-5">
        <button
          className="p-2 bg-white rounded-lg hover:bg-blue-600 hover:text-white"
          onClick={() => navigate("/account/orders")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <span className="text-2xl font-medium">ĐƠN HÀNG: 22111035598700</span>
      </div>
      <div className="grid grid-cols-2 h-[200px] mt-5 gap-x-5">
        <div className="bg-white flex flex-col items-start p-5 rounded-lg text-lg justify-between">
          <span className=" font-medium">Thông tin người nhận</span>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-x-2">
              <span className=" font-medium">Người nhận:</span>
              <span>Hello world</span>
            </div>
            <div className="flex items-center gap-x-2">
              <span className=" font-medium">Hình thức nhận hàng:</span>
              <span>Giao tiêu chuẩn</span>
            </div>
            <div className="flex items-center gap-x-2">
              <span className=" font-medium">Địa chỉ:</span>
              <span>1, Phường Cống Vị, Quận Ba Đình, Thành phố Hà Nội</span>
            </div>
            <div className="flex items-center gap-x-2">
              <span className=" font-medium">Điện thoại:</span>
              <span>0987654321</span>
            </div>
          </div>
        </div>
        <div className="bg-white flex flex-col items-start p-5 rounded-lg text-lg gap-y-3">
          <span className=" font-medium">Thông tin đơn hàng</span>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-x-2">
              <span className=" font-medium">Trạng thái đơn hàng:</span>
              <span>Đang xử lý</span>
            </div>
            <div className="flex items-center gap-x-2">
              <span className=" font-medium">Thời gian tạo:</span>
              <span> {new Date().toLocaleTimeString("vi-VI")} </span>
              <span> {format(new Date(), "MM/dd/yyyy")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start p-5 bg-white rounded-lg mt-10">
        <span className="text-xl font-medium">Sản phẩm</span>
        <ProductOrder />
      </div>
      <div className="flex flex-col items-start p-5 bg-white rounded-lg mt-10">
        <span className="text-xl font-medium border-b-2 border-solid w-full pb-5">
          Phương thức thanh toán
        </span>
        <div className="flex items-center mt-5 w-full justify-between">
          <span className="text-lg  ">Thanh toán khi nhận hàng</span>
          <span className="text-lg font-medium">{formatPrice(67560000)}</span>
        </div>
      </div>
    </div>
  );
};

export default InformationDetailOrder;
