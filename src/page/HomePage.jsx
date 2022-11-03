import React, { useEffect, useState } from "react";
import Banner from "../components/banner/Banner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductListHome from "../module/product/ProductListHome";
import { ProductLapTopData } from "../api/ProductLaptopData";
import BackToTopButton from "../components/backtotop/BackToTopButton";
import Navbar from "../components/navbar/Navbar";
import productApi from "../api/productApi";
import ProductList from "../module/product/ProductList";

const HomePage = () => {
  const navigate = useNavigate();

  const dataLapTopMacBook = ProductLapTopData;
  const bg = "'../../public/images/bg-laptop.png'";
  const bg1 = "'../../public/images/bg-laptop-1.png'";

  const [product, setProduct] = useState([]);

  useEffect(() => {
    if (
      localStorage.getItem("jwt") &&
      JSON.parse(localStorage.getItem("user")).active === "verify"
    ) {
      toast.warning("Vui lòng xác thực tài khoản", { pauseOnHover: false });
      return navigate("/verify");
    }
  }, []);

  // useEffect(() => {
  //   async function fetchDataProduct() {
  //     try {
  //       const response = await productApi.getAllProduct();
  //       setProduct(response.data.data);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   }
  //   fetchDataProduct();
  // }, []);

  return (
    <>
      <Navbar />
      <Banner />
      <ProductListHome data={dataLapTopMacBook} bg="bg1" className="pt-20" />
      <ProductListHome data={dataLapTopMacBook} bg="bg2" className="pt-20" />
      <ProductList data={dataLapTopMacBook} />
      {/* <ProductListHome data={product} bg="bg1" className="pt-20" />
      <ProductListHome data={product} bg="bg2" className="pt-20" />
      <ProductList data={product} /> */}
      <BackToTopButton />
    </>
  );
};

export default HomePage;
