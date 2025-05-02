import React, { useEffect, useState } from "react";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";
import ProductItem from "../product/ProductItem";
import ModalAdvanced from "../../components/Modal/ModalAdvanced";
import { formatPrice } from "../../utils/formatPrice";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const FilterProduct = ({ data }) => {
  const navigate = useNavigate();
  const bodyStyle = document.body.style;
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    const path = slugify(data.title, { strict: true });
    navigate(`/${path}/${data._id}`);
  };

  useEffect(() => {
    if (showModal === true) {
      disableBodyScroll(bodyStyle);
    } else {
      enableBodyScroll(bodyStyle);
    }
  }, [showModal]);

  const addToCompare = (item) => {
    setSelectedItems((selectedItems) => [...selectedItems, item]);
  };

  useEffect(() => {
    if (selectedItems.length === 2) {
      setShowModal(true);
    }
  }, [selectedItems]);

  const removeFromCompare = (item) => {
    const filteredItems = selectedItems.filter(
      (product) => product.id !== item.id
    );
    setSelectedItems((selectedItems) => filteredItems);
  };

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
          src={data.images[0]} 
          alt={data.title} 
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
        {data.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-500 line-through text-sm">
          {data.price.toLocaleString('vi-VN')}đ
        </span>
        <span className="text-red-600 font-bold">
          {data.promotion.toLocaleString('vi-VN')}đ
        </span>
      </div>
      
      <div className="flex flex-col gap-1 text-sm text-gray-600 mb-4">
        <p>CPU: {data.cpu}</p>
        <p>RAM: {data.ram}GB</p>
        <p>Màn hình: {data.screen}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleClick}
        >
          Chi tiết
        </button>
        
        <button 
          className="border border-gray-300 px-3 py-2 rounded hover:bg-gray-100 transition"
          onClick={() => addToCompare(data)}
          disabled={selectedItems.length >= 2 && !selectedItems.some(item => item.id === data.id)}
        >
          So sánh
        </button>
      </div>
      
      {selectedItems.length === 2 && (
        <div>
          <ModalAdvanced
            visible={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedItems([]);
            }}
            bodyClassName="w-[1050px] bg-white p-10 rounded-lg relative z-10 content h-[600px] overflow-y-auto overflow-x-hidden"
          >
            <table className="table-product items-center table-fixed w-full">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-base font-semibold items-start">
                    Sản phẩm 1
                  </th>
                  <th className="text-base font-semibold">Sản phẩm 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-base font-semibold">Ảnh sản phẩm</td>
                  <td>
                    <img
                      src={selectedItems[0]?.images[0]}
                      alt=""
                      className="w-[200px] h-[200px] object-cover mx-auto"
                    />
                  </td>
                  <td>
                    <img
                      src={selectedItems[1]?.images[0]}
                      alt=""
                      className="w-[200px] h-[200px] object-cover mx-auto"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">Tên sản phẩm</td>
                  <td>
                    <span
                      className="text-base font-normal line-clamp-2 cursor-pointer"
                      title={selectedItems[0]?.title}
                    >
                      {selectedItems[0]?.title}
                    </span>
                  </td>
                  <td>
                    <span
                      className="text-base font-normal line-clamp-2 cursor-pointer"
                      title={selectedItems[1]?.title}
                    >
                      {selectedItems[1]?.title}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">Thương hiệu</td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[0]?.brand.name}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[1]?.brand.name}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="text-base font-semibold">Hệ điều hành</td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[0]?.os}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[1]?.os}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">Màu sắc</td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[0]?.color}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[1]?.color}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">CPU</td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[0]?.cpu}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[1]?.cpu}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">Màn hình</td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[0]?.screen}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[1]?.screen}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">Graphic Card</td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[0]?.graphicCard}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[1]?.graphicCard}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">Pin</td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[0]?.battery}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[1]?.battery}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">Nhu cầu</td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[0]?.demand}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal">
                      {selectedItems[1]?.demand}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">Ram</td>
                  <td>
                    <span className="text-base font-normal flex items-center gap-x-2">
                      {selectedItems[0]?.ram}
                      {Number(selectedItems[0]?.ram) -
                        Number(selectedItems[1]?.ram) >=
                        0 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="green"
                          className="w-10 h-10"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal flex items-center gap-x-2">
                      {selectedItems[1]?.ram}
                      {Number(selectedItems[1]?.ram) -
                        Number(selectedItems[0]?.ram) >=
                        0 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="green"
                          className="w-10 h-10"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">Khối lượng</td>
                  <td>
                    <span className="text-base font-normal flex items-center gap-x-2">
                      {selectedItems[0]?.weight}
                      {selectedItems[0]?.weight - selectedItems[1]?.weight <=
                        0 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="green"
                          className="w-10 h-10"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal flex items-center gap-x-2">
                      {selectedItems[1]?.weight}
                      {selectedItems[1]?.weight - selectedItems[0]?.weight <=
                        0 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="green"
                          className="w-10 h-10"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-semibold">Giá tiền</td>
                  <td>
                    <span className="text-base font-normal flex items-center gap-x-2">
                      {formatPrice(selectedItems[0]?.promotion)}
                      {selectedItems[0]?.promotion -
                        selectedItems[1]?.promotion <=
                        0 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="green"
                          className="w-10 h-10"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-normal flex items-center gap-x-2">
                      {formatPrice(selectedItems[1]?.promotion)}
                      {selectedItems[1]?.promotion -
                        selectedItems[0]?.promotion <=
                        0 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="green"
                          className="w-10 h-10"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </ModalAdvanced>
        </div>
      )}
    </div>
  );
};

export default FilterProduct;
