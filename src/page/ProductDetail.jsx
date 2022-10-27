import React from "react";
import Navbar from "../components/navbar/Navbar";
import ProductInformation from "../module/product/ProductInformation";
const ProductDetail = () => {
  return (
    <>
      <Navbar />
      <div>
        <ProductInformation />
      </div>
    </>
  );
};

export default ProductDetail;
