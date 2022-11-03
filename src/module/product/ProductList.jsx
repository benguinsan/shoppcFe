import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductItem from "./ProductItem";
import slugify from "slugify";
import queryString from "query-string";
import ReactPaginate from "react-paginate";

// số sản phẩm hiển thị
const itemsPerPage = 20;
const ProductList = ({ data }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // if(!data || !data.total_pages) return;
    // Tính pageCount
    // setPageCount(Math.ceil(data.total_pages / itemsPerPage));
    setPageCount(5);
  }, [data, itemOffset]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    // Offset khoảng bn để hiển thị dấu ...
    // event.selected cái số mình click
    // const newOffSet = (event.selected * itemsPerPage) % data.total_pages;
    // setItemOffset(newOffset);
    setPage(event.selected + 1);
  };

  const handleClick = (item) => {
    const path = slugify(item.title, { strict: true });
    const filters = {
      sku: item.id,
    };
    navigate({
      pathname: `/${path}`,
      search: queryString.stringify(filters),
    });
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
        <div className="grid-cols-5 grid gap-y-2 pb-10">
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
        <ReactPaginate
          className="flex items-center gap-x-4 py-5 text-xl"
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          pageLinkClassName="page-num"
          previousClassName="page-num"
          nextLinkClassName="page-num"
          activeClassName="active"
        />
      </div>
    </div>
  );
};

export default ProductList;
