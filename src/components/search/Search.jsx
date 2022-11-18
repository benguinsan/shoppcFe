import React from "react";
import { useSelector } from "react-redux";
import { action_status } from "../../utils/constants/status";
import LoadingPage from "../loading/LoadingPage";
import { formatPrice } from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";

const Search = ({ onClickItem, keyword }) => {
  const { product, status } = useSelector((state) => state.product);
  const navigate = useNavigate();

  const handleClick = (item) => {
    const path = slugify(item.title, { strict: true });
    navigate(`/${path}/${item._id}`);
    onClickItem();
  };

  return (
    <div className="absolute top-14 left-0 w-full rounded-lg h-[400px] z-10 bg-white shadow-lg overflow-hidden overflow-y-auto">
      {status === action_status.LOADING && <LoadingPage />}
      {status === action_status.SUCCEEDED && (
        <div className="flex flex-col items-start">
          {product.length > 0 &&
            product
              .filter((item) =>
                item.title.toLowerCase().includes(keyword.toLowerCase())
              )
              .map((item) => (
                <div
                  className="flex items-start  border-solid border-b-gray-200 w-full border-b-2 text-black hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleClick(item)}
                  key={item._id}
                >
                  <img
                    src={item?.images[0]}
                    alt=""
                    className="w-[110px] h-[110px]"
                  />
                  <div className="flex flex-col  justify-start p-5">
                    <span className="font-medium whitespace-nowrap line-clamp-1">
                      {item?.title}
                    </span>
                    <div className="font-medium text-lg text-blue-700">
                      {formatPrice(item?.promotion)}
                    </div>
                    <div className="flex items-center">
                      <span className="line-through font-medium text-gray-400">
                        {" "}
                        {formatPrice(item?.price)}
                      </span>
                      <span className="text-sm font-normal">
                        {" "}
                        - {item?.percent}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default Search;
