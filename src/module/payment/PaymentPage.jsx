import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserAddress from "../UserProfile/UserAddress";
import { formatPrice } from "../../utils/formatPrice";
import { useSelector } from "react-redux";
import InformationOrder from "./InformationOrder";
import CartHidden from "../cart/CartHidden";
import { useEffect } from "react";
import { toast } from "react-toastify";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cash, setCash] = useState(true);
  const [payPal, setPayPal] = useState();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { current } = useSelector((state) => state.user);

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
      return navigate("/sign-in");
    }
  }, []);

  const payWithCash = () => {
    setPaymentMethod("Cash");
    setPayPal(false);
    setCash(true);
  };

  const payWithPayPal = () => {
    setPaymentMethod("PayPal");
    setPayPal(true);
    setCash(false);
  };

  const handleClick = () => {
    if (current.address.length < 0) {
      toast.dismiss();
      toast.warning("Vui lòng thêm thông tin nhận hàng");
      return;
    }
    if (paymentMethod === "Cash") {
      navigate("/payment-cash");
    } else {
      navigate("/payment-bank");
    }
  };

  return (
    <>
      <Navbar />
      {cart?.length > 0 ? (
        <>
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
              <div className="flex flex-col px-5 mt-10 rounded-lg py-5 bg-white h-[265px]">
                <span className="text-2xl font-bold">
                  Phương thức thanh toán
                </span>
                <div className="flex items-center justify-between mt-10 px-16 ">
                  <button
                    className={`px-16 py-10 border-2 border-solid text-xl font-bold ${
                      cash ? "border-blue-500" : ""
                    }`}
                    onClick={payWithCash}
                  >
                    Thanh toán khi nhận hàng
                  </button>
                  <button
                    className={`px-16 py-10 border-2 border-solid text-xl font-bold ${
                      payPal ? "border-blue-500" : ""
                    }`}
                    onClick={payWithPayPal}
                  >
                    Thanh toán qua ngân hàng
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
                {cart?.length > 0 &&
                  cart.map((item) => (
                    <InformationOrder key={item.id} data={item} />
                  ))}
              </div>
              <div className="flex flex-col bg-white rounded-lg pb-5 mt-10">
                <div className="flex items-center justify-between p-5">
                  <span className="text-[#8b8f9b] text-lg font-normal">
                    Tổng tạm tính
                  </span>
                  <span className="text-lg font-bold">
                    {formatPrice(
                      cart?.reduce(
                        (count, item) =>
                          count + item.quantity * item.data.promotion,
                        0
                      )
                    )}
                  </span>
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
                    {formatPrice(
                      cart?.reduce(
                        (count, item) =>
                          count + item.quantity * item.data.promotion,
                        0
                      )
                    )}
                  </span>
                </div>
                <button
                  className="bg-blue-700 text-white rounded-lg font-medium text-lg mx-5 py-3 mt-5"
                  onClick={handleClick}
                >
                  THANH TOÁN
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <CartHidden />
      )}
    </>
  );
};

export default PaymentPage;
