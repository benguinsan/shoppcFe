import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CategoryBrand from "./information/CategoryBrand";
import InformationProduct from "./information/InformationProduct";
import InformationService from "./information/InformationService";
import ProductDescription from "./information/ProductDescription";
import ProductParameters from "./information/ProductParameters";
import BackToTopButton from "../../components/backtotop/BackToTopButton";
import queryString from "query-string";
import Feedback from "../feedback/Feedback";
import productApi from "../../api/productApi";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import LoadingPage from "../../components/loading/LoadingPage";
const ProductInformation = () => {
  const location = useLocation();
  const params = queryString.parse(location.search).sku;
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await productApi.getProductId(params);
        setProduct(data.data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

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
    <>
      {loading ? (
        <div className="mt-10 rounded-lg">
          <div className="container">
            <LoadingPage />
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <div className="container">
            <div className="flex items-center">
              <Link
                to="/"
                className=" text-lg text-[#a8b4c9] flex items-center"
              >
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
              <span className="text-lg text-[#a8b4c9]">{product?.title}</span>
            </div>
            <div className="ProductDetail">
              <InformationProduct data={product} />
              <InformationService />
            </div>
            <div className="ProductDescription">
              <ProductDescription data={product} />
              <ProductParameters />
            </div>

            <Feedback id={product._id} data={product} />
            {/* <CategoryBrand data/> */}
            <BackToTopButton />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductInformation;
