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
import { getProductId } from "../../redux/product/productSlice";
import PageNotFound from "../../page/NotFoundPage";

const ProductInformation = () => {
  const params = useParams();
  const { statusId, productId } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  console.log(productId);

  useEffect(() => {
    try {
      dispatch(getProductId(params.id));
    } catch (error) {
      console.log(error.message);
    }
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
        </div>
      )}
      {statusId === action_status.FAILED && <PageNotFound />}
    </>
  );
};

export default ProductInformation;
