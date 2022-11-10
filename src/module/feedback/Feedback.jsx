import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StatisticFeedback from "./StatisticFeedback";
import ModalAdvanced from "../../components/Modal/ModalAdvanced";
import { useState } from "react";
import Rating from "./Rating";
import FeedbackList from "./FeedbackList";

const Feelback = ({ data }) => {
  const { current } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (current === null) {
      toast.warning("Vui lòng đăng nhập");
      return;
    } else {
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = (values) => {
    console.log(values);
  };
  return (
    <div className="mt-10">
      <div className="container bg-white rounded-lg p-5">
        <span className="text-xl font-bold">
          Đánh giá & nhận xét {data[0].title}
        </span>
        <StatisticFeedback />
        <div className="flex flex-col items-center gap-y-5 py-5">
          <span className="text-2xl ">Bạn đánh giá sao sản phẩm này</span>
          <button
            className="text-lg py-3 px-28 rounded-lg font-semibold text-white bg-red-600"
            onClick={handleClick}
          >
            Đánh giá ngay
          </button>
        </div>
        <FeedbackList />
      </div>
      <ModalAdvanced
        visible={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        bodyClassName="w-[600px] bg-white p-10 rounded-lg relative z-10 content h-[600px] overflow-y-auto overflow-x-hidden"
      >
        <Rating onClose={handleClose} onSubmit={handleSubmit} />
      </ModalAdvanced>
    </div>
  );
};

export default Feelback;
