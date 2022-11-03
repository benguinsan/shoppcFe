import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import slugify from "slugify";
import queryString from "query-string";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import ProductItem from "../product/ProductItem";
import FilterSort from "./FilterSort";

const itemsPerPage = 20;
const FilterProduct = ({ data }) => {
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
    <div>
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

export default FilterProduct;
