import React from "react";

const ProductDescription = ({ data }) => {
  // Chuyển đổi text xuống dòng thành thẻ HTML
  const formatDescription = (text) => {
    if (!text) return "";

    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="product-description">
      <div className="text-2xl font-semibold mb-8">Mô tả sản phẩm</div>
      <div className="whitespace-pre-line">{formatDescription(data?.MoTa)}</div>
    </div>
  );
};

export default ProductDescription;
