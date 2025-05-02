import React, { useEffect, useState } from "react";
import Banner from "../components/banner/Banner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductListHome from "../module/product/ProductListHome";
import ProductList from "../module/product/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/product/productSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.product);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Verify account check
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
    // Fetch initial products
    dispatch(
      fetchProducts({
        page: 0,
        limit: 10,
      })
    );
  }, [dispatch]);

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
      <ProductListHome
        data={items?.dataSource || []}
        bg="bg1"
        className="pt-20"
      />
      <ProductListHome
        data={items?.dataSource || []}
        bg="bg2"
        className="pt-20"
      />
      <ProductList
        data={items?.dataSource || []}
        handlePageClick={handlePageClick}
        page={page}
        totalPage={items?.totalElements || 0}
      />
    </>
  );
};

export default HomePage;
