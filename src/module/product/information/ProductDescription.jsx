import React from "react";

const ProductDescription = ({ data }) => {
  const html = data[0].description;
  return (
    <div className="product-description">
      <div className="text-2xl font-semibold mb-8">Mô tả sản phẩm</div>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
};

export default ProductDescription;
