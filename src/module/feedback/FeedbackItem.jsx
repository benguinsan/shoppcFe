import React from "react";
import { format } from "date-fns";
import { FaStar } from "react-icons/fa";

const colors = {
  orange: "#ffba5a",
  gray: "#a9a9a9",
};
const FeedbackItem = ({ data }) => {
  const stars = Array(5).fill(0);
  return (
    <div className="flex flex-col w-[1200px] mx-auto mt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-x-5">
          <img
            src={data.img}
            alt=""
            className="rounded-full w-[50px] h-[50px] object-cover"
          />
          <span className="text-lg font-semibold">{data.name}</span>
        </div>
        <div className="flex items-center justify-end gap-x-5">
          <div className="text-[#8f8f8f] font-semibold text-base">
            {format(new Date(), "MM/dd/yyyy")}
          </div>
          <div className="text-[#8f8f8f] font-semibold text-base">
            {new Date().toLocaleTimeString("vi-VI")}
          </div>
        </div>
      </div>
      <div className="w-[1100px] bg-[#f3f4f6] mt-3 rounded-lg mx-auto flex flex-col p-5 items-start justify-between gap-y-4">
        <div className="flex items-center justify-start ">
          <span className="text-base font-medium">Đánh giá: </span> &nbsp;
          <span className="flex items-center gap-x-2">
            {stars?.length > 0 &&
              stars.map((item, index) => (
                <FaStar
                  key={index}
                  size={18}
                  color={data?.star > index ? colors.orange : colors.gray}
                />
              ))}
          </span>
        </div>
        <div className="flex items-center justify-start gap-x-2 flex-wrap">
          <span className="text-base font-medium">Nhận xét:</span>
          <span>{data.content}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackItem;
