import React, { useEffect, useState } from "react";
import Banner from "../components/banner/Banner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductListHome from "../module/product/ProductListHome";
import { ProductLapTopData } from "../api/ProductLaptopData";
import BackToTopButton from "../components/backtotop/BackToTopButton";
import productApi from "../api/productApi";
import ProductList from "../module/product/ProductList";
import LoadingPage from "../components/loading/LoadingPage";

const HomePage = () => {
  const navigate = useNavigate();

  const bg = "'../../public/images/bg-laptop.png'";
  const bg1 = "'../../public/images/bg-laptop-1.png'";

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

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
    async function fetchDataProduct() {
      try {
        setLoading(true);
        const response = await productApi.getAllProduct();
        setProduct(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchDataProduct();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Banner />
          <ProductListHome data={product} bg="bg1" className="pt-20" />
          <ProductListHome data={product} bg="bg2" className="pt-20" />
          <ProductList data={product} />
          <BackToTopButton />
        </>
      )}
    </>
  );
};

export default HomePage;
