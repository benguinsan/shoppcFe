import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import PriceCard from "./PriceCard";
import ProductCard from "./ProductCard";
import QuantityCard from "./QuantityCard";
import { formatPrice } from "../../utils/formatPrice";

const CartPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const productCart = JSON.parse(localStorage.getItem("cart"));
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (
      localStorage.getItem("jwt") &&
      JSON.parse(localStorage.getItem("user")).active === "verify"
    ) {
      return navigate("/verify");
    }
    if (
      localStorage.getItem("jwt") === null &&
      JSON.parse(localStorage.getItem("user")) === null
    ) {
      setIsLoggedIn(false);
    }
  }, []);
  const handleClick = () => {
    navigate("/sign-in");
  };
  const handleCheckout = () => {
    navigate("/checkout");
  };
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
            <div className="information-cart mt-7 bg-white text-lg rounded-lg">
              <Table>
                <thead>
                  <tr>
                    <th>HC.VN</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {productCart?.length > 0 &&
                    productCart.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <ProductCard data={item} />
                        </td>
                        <td>
                          <PriceCard data={item} />
                        </td>
                        <td>
                          <QuantityCard data={item} />
                        </td>
                        <td className="text-xl font-semibold">
                          {formatPrice(27700000)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            <div className="information-price bg-white mt-7 text-lg rounded-lg pb-14 pt-4 px-3 flex flex-col justify-start">
              <span className="text-xl font-semibold">Thanh toán</span>
              <div className="flex items-center justify-between py-4">
                <span className="text-[#8b8f9b] text-lg font-normal">
                  Tổng tạm tính
                </span>
                <span>{formatPrice(27000000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8b8f9b] text-lg font-normal">
                  Thành tiền
                </span>
                <span className="text-blue-700 font-semibold text-xl">
                  {formatPrice(27000000)}
                </span>
              </div>
              {!isLoggedIn ? (
                <button
                  className="w-full px-2 py-2 bg-blue-700 text-white mt-12 rounded-lg flex flex-col items-center"
                  type="button"
                  onClick={handleClick}
                >
                  <span className="font-medium text-xl">THANH TOÁN</span>
                  <span className="text-base">
                    Bạn cần đăng nhập để tiếp tục
                  </span>
                </button>
              ) : (
                <button
                  className="w-full px-3 py-3 bg-blue-700 text-white mt-12 rounded-lg"
                  onClick={handleCheckout}
                >
                  <span className="font-medium text-xl ">TIẾP TỤC</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
