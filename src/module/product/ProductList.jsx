import React from "react";
import { useNavigate } from "react-router-dom";
import ProductItem from "./ProductItem";
import slugify from "slugify";
import Pagination from "react-js-pagination";

const ProductList = ({ data, handlePageClick, page, totalPage }) => {
  const navigate = useNavigate();
  const handleClick = (item) => {
    const path = slugify(item.title, { strict: true });
    navigate(`/${path}/${item._id}`);
  };
  return (
    <div className="mt-20">
      <div className="flex flex-col container rounded-lg bg-white ">
        <div className="flex items-center justify-between p-5 ">
          <span className="font-bold text-2xl">Laptop</span>
          <div className="flex items-center gap-x-1 cursor-pointer">
            <span
              className="text-lg text-[#a497a2] font-semibold "
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
        <div className="grid-cols-5 grid gap-y-2 pb-10 items-stretch">
          {data.length > 0 &&
            data.map((item, index) => (
              <ProductItem
                product={item}
                onClick={() => handleClick(item)}
                key={index}
                className="border-2 border-solid border-[#f6f6f6]"
              />
            ))}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Pagination
          activePage={page}
          nextPageText={">"}
          prevPageText={"<"}
          totalItemsCount={totalPage}
          itemsCountPerPage={1}
          firstPageText={"<<"}
          lastPageText={">>"}
          linkClass="page-num"
          onChange={handlePageClick}
        />
      </div>
    </div>
  );
};

export default ProductList;
