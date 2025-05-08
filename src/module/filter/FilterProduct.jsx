import React, { useEffect, useState } from "react";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";
// Bỏ import ProductItem vì không cần thiết nếu không dùng so sánh
// import ProductItem from "../product/ProductItem";
// Bỏ import ModalAdvanced vì không cần thiết cho so sánh
// import ModalAdvanced from "../../components/Modal/ModalAdvanced";
// Bỏ import formatPrice nếu chỉ dùng cho so sánh
// import { formatPrice } from "../../utils/formatPrice";
// Bỏ import body-scroll-lock nếu chỉ dùng cho modal so sánh
// import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const FilterProduct = ({ data }) => {
  const navigate = useNavigate();
  // Bỏ các state và biến liên quan đến so sánh
  // const bodyStyle = document.body.style;
  // const [selectedItems, setSelectedItems] = useState([]);
  // const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    const path = slugify(data.title, { strict: true });
    navigate(`/${path}/${data._id}`);
  };

  // Bỏ useEffect liên quan đến modal
  // useEffect(() => {
  //   if (showModal === true) {
  //     disableBodyScroll(bodyStyle);
  //   } else {
  //     enableBodyScroll(bodyStyle);
  //   }
  // }, [showModal]);

  // Bỏ các hàm liên quan đến so sánh
  // const addToCompare = (item) => {
  //   setSelectedItems((selectedItems) => [...selectedItems, item]);
  // };

  // useEffect(() => {
  //   if (selectedItems.length === 2) {
  //     setShowModal(true);
  //   }
  // }, [selectedItems]);

  // const removeFromCompare = (item) => {
  //   const filteredItems = selectedItems.filter(
  //     (product) => product.id !== item.id
  //   );
  //   setSelectedItems((selectedItems) => filteredItems);
  // };

  if (!data) {
    return (
      <div className="h-[300px] bg-white flex items-center justify-center flex-col gap-y-6">
        <span className="text-xl font-medium">
          Không tìm thấy sản phẩm
        </span>
      </div>
    );
  }

  return (
    <div className="product-card bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="product-image relative">
        <img 
          src={data.ImgUrl} 
          alt={data.TenSP} 
          className="w-full h-[200px] object-contain mb-4"
          onClick={handleClick}
        />
        {data.inventory === 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            Hết hàng
          </span>
        )}
      </div>
      
      <h3 
        className="text-lg font-medium mb-2 line-clamp-2 h-[56px] cursor-pointer" 
        onClick={handleClick}
      >
        {data.TenSP}
      </h3>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-600 font-medium text-lg">
          {data.Gia.toLocaleString('vi-VN')}đ
        </span>
      </div>
      
      <div className="flex flex-col gap-1 text-sm text-gray-600 mb-4">
        <p>CPU: {data.CPU}</p>
        <p>RAM: {data.RAM}GB</p>
        <p>Bộ nhớ: {data.Storage}</p>
      </div>
      
      {/* Bỏ toàn bộ phần modal so sánh */}
      {/* {selectedItems.length === 2 && (
        <div>
          <ModalAdvanced
            visible={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedItems([]);
            }}
            bodyClassName="w-[1050px] bg-white p-10 rounded-lg relative z-10 content h-[600px] overflow-y-auto overflow-x-hidden"
          >
            ... toàn bộ nội dung bảng so sánh ...
          </ModalAdvanced>
        </div>
      )} */}
    </div>
  );
  
};

export default FilterProduct;
