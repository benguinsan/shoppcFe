import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import InformationProduct from "./information/InformationProduct";
import InformationService from "./information/InformationService";
import ProductDescription from "./information/ProductDescription";
import ProductParameters from "./information/ProductParameters";
// import { useDispatch, useSelector } from "react-redux";
// import { action_status } from "../../utils/constants/status";
// import {
//   getProductBrand,
//   getProductId,
// } from "../../redux/product/productSlice";
import PageNotFound from "../../page/NotFoundPage";
import ProductListHome from "../../module/product/ProductListHome";

// fake data
import { getProductById, getProductsByBrand } from "../../data/productData";

const ProductInformation = () => {
  const params = useParams();
  // const { statusId, productId, statusProductBrand, productBrand } = useSelector(
  //   (state) => state.product
  // );
  // const dispatch = useDispatch();
  const [productId, setProductId] = useState(null);
  const [productBrand, setProductBrand] = useState([]);
  const [notFound, setNotFound] = useState(false);


  // Lấy thông tin sản phẩm theo ID
  // useEffect(() => {
  //   try {
  //     dispatch(getProductId(params.id));
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }, [params.id]);
  
  // sử dụng fake data
  useEffect(() => {
    try {
      const product = getProductById(params.id);
      if (product) {
        setProductId(product);
        // Lấy sản phẩm cùng thương hiệu
        if (product.brand?.id) {
          const brandProducts = getProductsByBrand(product.brand.id);
          setProductBrand(brandProducts);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.log(error.message);
      setNotFound(true);
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

  // Kiểm tra xác thực người dùng
  useEffect(() => {
    if (
      localStorage.getItem("jwt") &&
      JSON.parse(localStorage.getItem("user"))?.active === "verify"
    ) {
      return navigate("/verify");
    }
  }, []);

  // Hiển thị trang 404 nếu không tìm thấy sản phẩm
  if (notFound) {
    return <PageNotFound />;
  }

  // Hiển thị nội dung chính khi có dữ liệu sản phẩm
  if (productId) {
    return (
      <div className="mt-10">
        <div className="container">
          <div className="flex items-center">
            <Link
              to="/"
              className=" text-base text-[#a8b4c9] flex items-center font-medium"
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
            <span className="text-base text-[#a8b4c9] font-medium">
              {productId?.title}
            </span>
          </div>
          <div className="ProductDetail">
            <InformationProduct data={productId} />
            <InformationService />
          </div>
          <div className="ProductDescription">
            <ProductDescription data={productId} />
            <ProductParameters data={productId} />
          </div>
        </div>

        {productBrand.length > 0 && (
          <div className="container">
            <div className="mt-10 w-full bg-white rounded-lg p-5">
              <div className=" text-xl font-semibold">
                Cùng thương hiệu {productId?.brand?.name}
              </div>
              <ProductListHome data={productBrand} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Trả về null trong trường hợp đang tải dữ liệu
  return null;
};

export default ProductInformation;
