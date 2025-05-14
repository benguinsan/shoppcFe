import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Banner from "../components/banner/Banner";
import ProductList from "../module/product/ProductList";
import ProductListHome from "../module/product/ProductListHome";
import { fetchProducts } from "../redux/product/productSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.product);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Verify account check
    const jwt = localStorage.getItem("jwt");
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    if (jwt && user && user.active === "verify") {
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
