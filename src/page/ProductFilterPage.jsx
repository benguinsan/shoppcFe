import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { formatPrice } from "../utils/formatPrice";
import FilterPrice from "../module/filter/FilterPrice";
import FilterBrand from "../module/filter/FilterBrand";
import { ProductLapTopData } from "../api/ProductLaptopData";
import ProductList from "../module/product/ProductList";
import FilterProduct from "../module/filter/FilterProduct";

const ProductFilterPage = ({ onChange }) => {
  const dataLapTopMacBook = ProductLapTopData;

  const handleChange = (values) => {
    if (onChange) {
      onChange(values);
    }
    console.log(values);
  };
  return (
    <>
      <Navbar />
      <div className="mt-10">
        <div className="container">
          {" "}
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
            <span className="text-lg text-[#a8b4c9]">Laptop chính hãng</span>
          </div>
          <div className="wrapper-product">
            <div className="product-filter w-full  bg-white rounded-lg flex flex-col items-start text-black">
              <FilterPrice onChange={handleChange} />
              <FilterBrand />
            </div>
            <div className="product-list">
              <FilterProduct data={dataLapTopMacBook} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilterPage;
