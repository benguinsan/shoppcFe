import React, { useEffect } from "react";
import Banner from "../components/banner/Banner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductList from "../module/product/ProductListHome";
import { ProductLapTopData } from "../api/ProductLaptopData";
import BackToTopButton from "../components/backtotop/BackToTopButton";
import Navbar from "../components/navbar/Navbar";

const HomePage = () => {
  const navigate = useNavigate();

  const dataLapTopMacBook = ProductLapTopData;
  const bg = "'../../public/images/bg-laptop.png'";
  const bg1 = "'../../public/images/bg-laptop-1.png'";

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
      <Navbar />
      <Banner />
      <ProductList data={dataLapTopMacBook} bg={bg} />
      <ProductList data={dataLapTopMacBook} bg={bg1} />
      <BackToTopButton />
    </>
  );
};

export default HomePage;
