import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CategoryBrand from "./information/CategoryBrand";
import InformationProduct from "./information/InformationProduct";
import InformationService from "./information/InformationService";
import ProductDescription from "./information/ProductDescription";
import ProductParameters from "./information/ProductParameters";
import BackToTopButton from "../../components/backtotop/BackToTopButton";
import queryString from "query-string";
import Feedback from "../feedback/Feedback";
import { useDispatch, useSelector } from "react-redux";
import LoadingPage from "../../components/loading/LoadingPage";
import { action_status } from "../../utils/constants/status";
import {
  getProduct,
  selectProductById,
} from "../../redux/product/productSlice";

const ProductInformation = () => {
  const location = useLocation();
  const params = queryString.parse(location.search).sku;
  const { status } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const productId = useSelector((state) => selectProductById(state, params));

  useEffect(() => {
    if (status === action_status.IDLE) {
      dispatch(getProduct());
    }
  }, [status, dispatch]);

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
      {status === action_status.LOADING && (
        <div className="mt-10 rounded-lg">
          <div className="container">
            <LoadingPage />
          </div>
        </div>
      )}
      {status === action_status.SUCCEEDED && (
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
              <span className="text-lg text-[#a8b4c9]">{productId?.title}</span>
            </div>
            <div className="ProductDetail">
              <InformationProduct data={productId} />
              <InformationService />
            </div>
            <div className="ProductDescription">
              <ProductDescription data={productId} />
              <ProductParameters />
            </div>

            <Feedback id={productId?._id} data={productId} />
            {/* <CategoryBrand data/> */}
            <BackToTopButton />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductInformation;
