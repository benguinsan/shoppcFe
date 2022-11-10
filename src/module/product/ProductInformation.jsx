import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProductLapTopData } from "../../api/ProductLaptopData";
import CategoryBrand from "./information/CategoryBrand";
import InformationProduct from "./information/InformationProduct";
import InformationService from "./information/InformationService";
import ProductDescription from "./information/ProductDescription";
import ProductParameters from "./information/ProductParameters";
import BackToTopButton from "../../components/backtotop/BackToTopButton";
import queryString from "query-string";
import Feedback from "../feedback/Feedback";

const ProductInformation = () => {
  const location = useLocation();
  const params = queryString.parse(location.search).sku;
  const dataLapTopMacBook = ProductLapTopData;
  const data = dataLapTopMacBook.filter((item) => item.id === Number(params));
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
            {data.length > 0 && data.map((item) => item.title)}
          </span>
        </div>
        <div className="ProductDetail">
          <InformationProduct data={data} />
          <InformationService />
        </div>
        <div className="ProductDescription">
          <ProductDescription data={data} />
          <ProductParameters />
        </div>
        <Feedback data={data} />
        <CategoryBrand />
        <BackToTopButton />
      </div>
    </div>
  );
};

export default ProductInformation;
