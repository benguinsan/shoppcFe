import React, { useEffect } from "react";
import Banner from "../components/banner/Banner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductListHome from "../module/product/ProductListHome";
import BackToTopButton from "../components/backtotop/BackToTopButton";
import ProductList from "../module/product/ProductList";
import LoadingPage from "../components/loading/LoadingPage";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, selectAllProduct } from "../redux/product/productSlice";
import { action_status } from "../utils/constants/status";
const HomePage = () => {
  const navigate = useNavigate();

  const bg = "'../../public/images/bg-laptop.png'";
  const bg1 = "'../../public/images/bg-laptop-1.png'";

  const dispatch = useDispatch();
  const product = useSelector(selectAllProduct);
  const { status } = useSelector((state) => state.product);

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
    function fetchDataProduct() {
      try {
        if (status === action_status.IDLE) {
          dispatch(getProduct());
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchDataProduct();
  }, []);

  return (
    <>
      {status === action_status.LOADING && <LoadingPage />}
      {status === action_status.SUCCEEDED && (
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
