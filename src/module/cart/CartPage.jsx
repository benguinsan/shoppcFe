import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import PriceCard from "./PriceCard";
import ProductCard from "./ProductCard";
const CartPage = () => {
  return (
    <>
      <Navbar />
      <div className="mt-10">
        <div className="container">
          <div className="flex items-center">
            <Link to="/" className=" text-lg text-[#a8b4c9] flex items-center">
              Trang chủ
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mx-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
            <span className="text-lg text-[#a8b4c9]">Giỏ hàng</span>
          </div>
          <div className="text-3xl font-bold mt-10">Giỏ hàng</div>
          <div className="cart">
            <div className="information-cart mt-7 bg-white text-lg">
              <Table>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" className="w-5 h-5"></input>
                    </th>
                    <th>HC.VN</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input type="checkbox" className="w-5 h-5"></input>
                    </td>
                    <td>
                      <ProductCard />
                    </td>
                    <td>
                      <PriceCard />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className="information-price"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
