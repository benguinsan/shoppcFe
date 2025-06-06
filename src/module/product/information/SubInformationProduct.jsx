import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../redux/cart/cartSlice";
import { formatPrice } from "../../../utils/formatPrice";
import { useState, useEffect } from "react";
import brandApi from "../../../api/Brandapi";
const SubInformationProduct = ({ data }) => {
  const [brandName, setBrandName] = useState("");
  console.log("data", data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAddCart = () => {
    const action = addToCart({
      id: data._id || data.MaSP,
      product: data,
      quantity: 1,
    });
    dispatch(action);
  };
  const handleBuy = () => {
    const action = addToCart({
      id: data._id || data.MaSP,
      product: data,
      quantity: 1,
    });
    dispatch(action);
    navigate("/cart");
  };
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        if (data?.MaLoaiSP) {
          const response = await brandApi.getBrandById(data.MaLoaiSP);
          // console.log("Brand data:", response);
          // Update to access TenLoaiSP directly from response.data
          setBrandName(response?.data?.TenLoaiSP || "");
        }
      } catch (error) {
        console.error("Error fetching brand:", error);
      }
    };
    fetchBrandData();
  }, [data?.MaLoaiSP]);
  return (
    <div className="product-info flex flex-col p-6">
      <span
        className="text-xl font-semibold mb-2 line-clamp-2 cursor-pointer"
        title={data?.TenSP}
      >
        {data?.TenSP}
      </span>
      <div className="flex items-center justify-start gap-x-5 mb-4">
        {/* <span className="text-base text-slate-400">
          Thương hiệu: {data?.brand?.name}
        </span> */}
        {/* <span>|</span> */}
        <span className="text-base text-slate-400">
          Thương hiệu: {brandName}
        </span>
      </div>
      {/* {data?.inventory > 0 && data?.inventory < 5 && (
        <span className="text-orange-500 font-medium mb-4">
          Chỉ còn {data?.inventory} sản phẩm
        </span>
      )}
      {/* {data?.inventory === 0 && (
        <span className="text-orange-500 font-medium mb-4">
          Sản phẩm hiện tại hết hàng
        </span>
      )} */}
      <div className="flex items-center mb-6">
        <span className="text-2xl font-semibold text-blue-700">
          {formatPrice(data?.Gia)}
        </span>
      </div>
      <span className="w-full border-dotted border-2 mb-6"></span>
      {/* /* {data?.inventory > 0 && (
        <>
          <div className="flex items-center justify-between px-10">
            <button
              className="px-8 py-3 bg-blue-800 text-white text-lg font-medium rounded-md w-[220px]"
              type="button"
              onClick={handleBuy}
            >
              MUA NGAY
            </button>
            <button
              className="px-3 py-3  text-blue-700 text-lg font-medium rounded-md border-2 border-blue-700"
              type="button"
              onClick={handleAddCart}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
          <span className="w-full border-dotted border-2 my-6"></span>
        </>
      )} */}

      <span className="w-full border-dotted border-2 mb-6"></span>
      <div className="flex items-center justify-between px-10">
        <button
          className="px-8 py-3 bg-blue-800 text-white text-lg font-medium rounded-md w-[220px]"
          type="button"
          onClick={handleBuy}
        >
          MUA NGAY
        </button>
        <button
          className="px-3 py-3 text-blue-700 text-lg font-medium rounded-md border-2 border-blue-700"
          type="button"
          onClick={handleAddCart}
        >
          THÊM VÀO GIỎ HÀNG
        </button>
      </div>
      <span className="w-full border-dotted border-2 my-6"></span>
    </div>
  );
};

export default SubInformationProduct;
