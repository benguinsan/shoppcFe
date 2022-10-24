import React, { useEffect } from "react";
import Banner from "../components/banner/Banner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductList from "../module/product/ProductListHome";
import { ProductLapTopData } from "../api/ProductLaptopData";
import BackToTopButton from "../components/backtotop/BackToTopButton";
const HomePage = () => {
  const navigate = useNavigate();

  const dataLapTopMacBook = ProductLapTopData;

  useEffect(() => {
    if (
      localStorage.getItem("jwt") &&
      JSON.parse(localStorage.getItem("user")).active === "verify"
    ) {
      toast.warning("Vui lòng xác thực tài khoản");
      return navigate("/verify");
    }
  }, []);

  return (
    <>
      <Banner />
      <ProductList data={dataLapTopMacBook} bg="laptop-gaming" />
      <ProductList data={dataLapTopMacBook} bg="laptop" />

      <BackToTopButton />
    </>
  );
};

export default HomePage;
