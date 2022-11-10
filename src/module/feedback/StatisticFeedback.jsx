import React from "react";
import ProgressBar from "../../components/progressbar/ProgressBar";
import { FaStar } from "react-icons/fa";
const StatisticFeedback = () => {
  const stars = Array(5).fill(0);
  return (
    <div className="w-[1200px] h-[350px] bg-white rounded-lg mx-auto mt-6  border-2 border-solid feelback">
      <div className="flex flex-col items-center justify-center border-r-2 border-solid">
        <span className="text-3xl font-bold">4.6 / 5</span>
        <span className="flex items-center justify-center gap-x-3 mt-3">
          {stars.map((item, index) => (
            <FaStar key={index} color="#ffba5a" size={20} />
          ))}
        </span>
        <span className="mt-3 text-xl">87 đánh giá và nhận xét</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-y-5">
        <div className="flex flex-row items-center justify-between gap-x-5 ">
          <span className="flex flex-row items-center gap-x-2 ">
            5 <FaStar color="#ffba5a" size={20} />
          </span>
          <ProgressBar value={(76 / (76 + 10 + 1 + 0 + 0)) * 500} />
          <span>76 đánh giá</span>
        </div>
        <div className="flex flex-row items-center justify-between gap-x-5">
          <span className="flex flex-row items-center gap-x-2 ">
            4 <FaStar color="#ffba5a" size={20} />
          </span>
          <ProgressBar value={(10 / (76 + 10 + 1 + 0 + 0)) * 500} />
          <span>10 đánh giá</span>
        </div>
        <div className="flex flex-row items-center justify-between gap-x-5">
          <span className="flex flex-row items-center gap-x-2 ">
            3 <FaStar color="#ffba5a" size={20} />
          </span>
          <ProgressBar value={(1 / (76 + 10 + 1 + 0 + 0)) * 500} />
          <span>1 đánh giá</span>
        </div>
        <div className="flex flex-row items-center justify-between gap-x-5">
          <span className="flex flex-row items-center gap-x-2 ">
            2 <FaStar color="#ffba5a" size={20} />
          </span>
          <ProgressBar value={(0 / (76 + 10 + 1 + 0 + 0)) * 500} />
          <span>0 đánh giá</span>
        </div>
        <div className="flex flex-row items-center justify-between gap-x-5">
          <span className="flex flex-row items-center gap-x-2 ">
            1 <FaStar color="#ffba5a" size={20} />
          </span>
          <ProgressBar value={(0 / (76 + 10 + 1 + 0 + 0)) * 500} />
          <span>0 đánh giá</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticFeedback;
