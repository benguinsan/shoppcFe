import React from "react";

const ProductParameters = ({ data }) => {
  return (
    <div className="product-parameters px-5 pb-10">
      <div className="text-2xl font-semibold mb-8">Thông tin chi tiết</div>
      <table className="table-product">
        <thead>
          <tr>
            <td>Bảo hành</td>
            <td>12</td>
          </tr>
          <tr>
            <td>CPU</td>
            <td>{data?.CPU}</td>
          </tr>
          <tr>
            <td>GPU</td>
            <td>{data?.GPU}</td>
          </tr>
          <tr>
            <td>RAM</td>
            <td>{data?.RAM}</td>
          </tr>
          <tr>
            <td>Màn hình</td>
            <td>{data?.ManHinh}</td>
          </tr>
          <tr>
            <td>Storage</td>
            <td>{data?.Storage}</td>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default ProductParameters;
