import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryBrand from "./information/CategoryBrand";
import InformationProduct from "./information/InformationProduct";
import InformationService from "./information/InformationService";
import ProductDescription from "./information/ProductDescription";
import ProductParameters from "./information/ProductParameters";

const ProductInformation = () => {
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
  }, []);
  return (
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
          <span className="text-lg text-[#a8b4c9]">
            Laptop APPLE MacBook Air 2020 MGNA3SA/A (13.3" Apple M1/8GB/512GB
            SSD/Onboard/macOS/1.3kg)
          </span>
        </div>
        <div className="ProductDetail">
          <InformationProduct />
          <InformationService />
        </div>
        <div className="ProductDescription">
          <ProductDescription />
          <ProductParameters />
        </div>
        <CategoryBrand />
      </div>
    </div>
  );
};

export default ProductInformation;
