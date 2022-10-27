import React from "react";
import ProductListHome from "../ProductListHome";
import { ProductLapTopData } from "../../../api/ProductLaptopData";
const CategoryBrand = () => {
  const dataLapTopMacBook = ProductLapTopData;
  return (
    <div className="mt-10 w-full bg-white rounded-lg">
      <div className="p-7 text-2xl font-bold">Cùng thương hiệu APPLE</div>
      <ProductListHome data={dataLapTopMacBook} />
    </div>
  );
};

export default CategoryBrand;
