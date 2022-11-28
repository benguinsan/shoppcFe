import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import InformationProduct from "./information/InformationProduct";
import InformationService from "./information/InformationService";
import ProductDescription from "./information/ProductDescription";
import ProductParameters from "./information/ProductParameters";
import BackToTopButton from "../../components/backtotop/BackToTopButton";
import Feedback from "../feedback/Feedback";
import { useDispatch, useSelector } from "react-redux";
import LoadingPage from "../../components/loading/LoadingPage";
import { action_status } from "../../utils/constants/status";
import {
  getProductBrand,
  getProductId,
} from "../../redux/product/productSlice";
import PageNotFound from "../../page/NotFoundPage";
import ProductListHome from "../../module/product/ProductListHome";

const ProductInformation = () => {
  const params = useParams();
  const { statusId, productId, statusProductBrand, productBrand } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  console.log("Product Brand", productBrand);
  console.log(productId?.brand?.name);

  useEffect(() => {
    try {
      dispatch(getProductId(params.id));
    } catch (error) {
      console.log(error.message);
    }
  }, [params.id]);

  useEffect(() => {
    try {
      dispatch(getProductBrand(productId?.brand?.id));
    } catch (error) {
      console.log(error.message);
    }
  }, [productId?.brand]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [params.id]);

  useEffect(() => {
    if (
      localStorage.getItem("jwt") &&
      JSON.parse(localStorage.getItem("user")).active === "verify"
    ) {
      return navigate("/verify");
    }
  }, []);

  return (
    <>
      {statusId === action_status.LOADING && (
        <div className="mt-10 rounded-lg">
          <div className="container">
            <LoadingPage />
          </div>
        </div>
      )}
      {statusId === action_status.SUCCEEDED && (
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
              <ProductParameters data={productId} />
            </div>

            <Feedback id={productId?._id} data={productId} />
            <BackToTopButton />
          </div>
          {statusProductBrand === action_status.LOADING && <LoadingPage />}
          {statusProductBrand === action_status.SUCCEEDED && (
            <div className="container">
              <div className="mt-10 w-full bg-white rounded-lg p-5">
                <div className=" text-xl font-semibold">
                  Cùng thương hiệu {productId?.brand?.name}
                </div>
                <ProductListHome data={productBrand} />
              </div>
            </div>
          )}
          {statusProductBrand === action_status.FAILED && <div>Error</div>}
        </div>
      )}

      {statusId === action_status.FAILED && <PageNotFound />}
    </>
  );
};

export default ProductInformation;
