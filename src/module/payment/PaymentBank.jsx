import React, { useEffect } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetCart } from "../../redux/cart/cartSlice";

const PaymentBank = () => {
  const dataOrder = JSON.parse(localStorage.getItem("order"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  return (
    <div className="mt-10">
      <div className="w-[1000px] mx-auto h-[200px] bg-[#fff4de] rounded-lg flex flex-col p-12 justify-between">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-medium">Số tiền thanh toán</span>
          <span className="text-5xl font-medium text-[#009245]">
            {formatPrice(dataOrder?.totalPrice)}
          </span>
        </div>
      </div>
      <div className="mx-auto w-[800px] mt-10">
        <PayPalButtons
          style={{ shape: "pill" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: dataOrder?.id,
                  amount: {
                    value: dataOrder?.totalPrice / 24000,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            const order = await actions.order.capture();
            console.log("order:", order);
            Swal.fire(
              "Thanh toán thành công!",
              "Cảm ơn bạn đã ủng hộ cửa hàng. Bạn có thể vào quản lý đơn hàng để kiểm tra lại đơn hàng",
              "success"
            );
            console.log(dataOrder);
            const data1 = {
              address: dataOrder?.address,
              phone: dataOrder?.phone,
              receiver: dataOrder?.receiver,
              cart: dataOrder?.cart,
              totalPrice: dataOrder?.totalPrice,
              payments: dataOrder?.payments,
              invoicePayment: order,
            };
            console.log(data1);
            dispatch(resetCart());
            navigate("/");
          }}
          onError={(err) => {
            toast.dismiss();
            toast.error("Lỗi hệ thống thanh toán Paypal", {
              pauseOnHover: false,
            });
            console.log("Paypal checkout onError", err);
          }}
          onCancel={() => {
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
};

export default PaymentBank;
