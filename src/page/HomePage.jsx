import React, { useEffect } from "react";
import Banner from "../components/banner/Banner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductListHome from "../module/product/ProductListHome";
import ProductList from "../module/product/ProductList";
import { useDispatch, useSelector } from "react-redux";
// import { getProduct } from "../redux/product/productSlice";
import { productData } from "../data/productData";
import { useState } from "react";



const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, totalPage, product } = useSelector((state) => state.product);
  const [page, setPage] = useState(1);

  console.log(productData)

  useEffect(() => {
    if (
      localStorage.getItem("jwt") &&
      JSON.parse(localStorage.getItem("user")).active === "verify"
    ) {
      toast.dismiss();
      toast.warning("Vui lòng xác thực tài khoản", { pauseOnHover: false });
      return navigate("/verify");
    }
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [dispatch]);

  useEffect(() => {
    function fetchDataProduct(page) {
      const limit = 10;
      const data = {
        page: page,
        limit: limit,
      };
      try {
        dispatch(getProduct(data));
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchDataProduct(page);
  }, [page]);

  const handlePageClick = (values) => {
    setPage(values);
    window.scrollTo({
      top: 1750,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Banner />
      <ProductListHome data={productData} bg="bg1" className="pt-20" />
      <ProductListHome data={productData} bg="bg2" className="pt-20" />
      <ProductList
        data={productData}
        handlePageClick={handlePageClick}
        page={page}
        totalPage={totalPage}
      />
    </>
  );
};

export default HomePage;
