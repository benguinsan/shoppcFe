import React from "react";
import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import queryString from "query-string";
const FilterSort = ({ onClick }) => {
  const params = useLocation(location.search);
  const searchSort = queryString.parse(params.search)._sort;
  const [active, setActive] = useState(searchSort);

  const handleClickASC = (e) => {
    setActive("salePrice:ASC");
    if (onClick) {
      onClick(e.target.value);
    }
    console.log(e.target.value);
  };
  const handleClickDSC = (e) => {
    setActive("salePrice:DESC");
    if (onClick) {
      onClick(e.target.value);
    }
    console.log(e.target.value);
  };
  return (
    <>
      <button
        className={`border-2 border-solid border-[#f6f6f6] px-3 py-2  cursor-pointer ${
          active === "salePrice:ASC"
            ? "border-blue-600 pointer-events-none"
            : ""
        }`}
        name="sort"
        value="salePrice:ASC"
        onClick={handleClickASC}
      >
        Giá tăng dần
      </button>
      <button
        className={`border-2 border-solid border-[#f6f6f6] px-3 py-2 cursor-pointer ${
          active === "salePrice:DESC"
            ? "border-blue-600 pointer-events-none"
            : ""
        }`}
        name="sort"
        value="salePrice:DESC"
        onClick={handleClickDSC}
      >
        Giá giảm dần
      </button>
    </>
  );
};

export default FilterSort;
