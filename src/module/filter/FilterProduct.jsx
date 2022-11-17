import React from "react";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";
import ProductItem from "../product/ProductItem";

const FilterProduct = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = (item) => {
    const path = slugify(item.title, { strict: true });
    navigate(`/${path}/${item._id}`);
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
    </div>
  );
};

export default FilterProduct;
