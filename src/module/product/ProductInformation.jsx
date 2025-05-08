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
import productApi from "../../api/productApi";

const ProductInformation = () => {
  const params = useParams();
  console.log("URL Params:", params);
  
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

 
  // Lấy thông tin sản phẩm theo ID
  useEffect(() => {
    setLoading(true);
    try {
      productApi.getSanPhamById(params.id)
        .then(response => {
          const productData = response.data;
          console.log("Product data received in component:", productData);
          if (productData) {
            setProduct(productData[0]);
            setLoading(false);
          } else {
            console.log("Product not found");
            setNotFound(true);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error("Error fetching product:", error);
          setNotFound(true);
          setLoading(false);
        });
    } catch (error) {
      console.error("Exception in useEffect:", error.message);
      setNotFound(true);
      setLoading(false);
    }
  }, [params.id]);

  // Scroll to top when product ID changes
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
  if (product) {
    return (
      <div className="mt-10">
        <div className="container">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-base text-[#a8b4c9] flex items-center font-medium"
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
              {product?.TenSP}
            </span>
          </div>
          <div className="ProductDetail">
            <InformationProduct data={product} />
            <InformationService />
          </div>
          <div className="ProductDescription">
            <ProductDescription data={product} />
            <ProductParameters data={product} />
          </div>
        </div>
      </div>
    );
  }

  // Trả về null trong trường hợp đang tải dữ liệu
  return null;
};

export default ProductInformation;
