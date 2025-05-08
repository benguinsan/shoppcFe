import React from "react";
import SubInformationProduct from "./SubInformationProduct";

const InformationProduct = ({ data }) => {
  console.log(data);
  return (
    <div className="Information-product bg-white rounded-xl py-8 px-2">
      <div className="product-image">
        <div className="single-product-image">
          {data?.ImgUrl && (
            <img 
              src={data.ImgUrl} 
              alt={data.TenSP || "Product image"} 
              className="w-full h-auto object-contain"
            />
          )}
        </div>
      </div>
      <SubInformationProduct key={data.MaSP} data={data} />
    </div>
  );
};

export default InformationProduct;
