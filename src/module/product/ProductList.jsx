import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/product/productSlice";
import ProductItem from "./ProductItem";
import Pagination from "react-js-pagination";
import ModalAdvanced from "../../components/Modal/ModalAdvanced";
import { formatPrice } from "../../utils/formatPrice";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.product) || {
    items: { data: [] },
    status: "idle",
    error: null,
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage - 1,
        limit: 10,
      })
    );
  }, [dispatch, currentPage]);

  // useEffect(() => {
  //   console.log("Fetched products:", items);
  // }, [items]);

  return (
    <div className="mt-20">
      <div className="flex flex-col container rounded-lg bg-white">
        <div className="flex items-center justify-between p-5 ">
          <span className="font-bold text-xl">Laptop</span>
          <div className="flex items-center gap-x-1 cursor-pointer">
            <span
              className="text-base text-[#a497a2] font-semibold "
              onClick={() => navigate("/product")}
            >
              Xem tất cả
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
        <div className="grid-cols-5 grid gap-y-2 pb-10 items-stretch min-h-[650px]">
          {status === "loading" ? (
            <div>Loading...</div>
          ) : status === "failed" ? (
            <div>Error: {error}</div>
          ) : (
            items?.dataSource?.map((item, index) => (
              <ProductItem
                key={item.MaSP || index}
                product={item}
                className="border-2 border-solid border-[#f6f6f6]"
                selected={selectedItems}
                onClickItem={() => handleClick(item)}
              />
            ))
          )}
        </div>
      </div>
      {items?.dataSource?.length > 0 && (
        <div className="flex justify-center items-center mt-4 mb-8">
          <Pagination
            activePage={currentPage}
            nextPageText={">"}
            prevPageText={"<"}
            totalItemsCount={items.totalElements || 0}
            itemsCountPerPage={10} // Fixed to 10 items per page
            firstPageText={"<<"}
            lastPageText={">>"}
            linkClass="page-num"
            onChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
