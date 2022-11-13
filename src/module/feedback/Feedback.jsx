import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StatisticFeedback from "./StatisticFeedback";
import ModalAdvanced from "../../components/Modal/ModalAdvanced";
import { useState } from "react";
import Rating from "./Rating";
import FeedbackList from "./FeedbackList";
import {
  createFeedback,
  getFeedback,
} from "../../redux/feedback/feedbackSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";
import LoadingPage from "../../components/loading/LoadingPage";

const Feelback = ({ id, data }) => {
  const { current } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [review, setReview] = useState();
  const { feedback } = useSelector((state) => state.feedback);
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập");
      return;
    } else {
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (values) => {
    const data = {
      rating: values.stars,
      review: values.content,
      product: id,
    };
    try {
      const action = createFeedback(data);
      const resultAction = await dispatch(action);
      const result = unwrapResult(resultAction);
      toast.dismiss();
      toast.success("Cảm ơn bạn đã đánh giá sản phẩm", { pauseOnHover: false });
    } catch (error) {
      console.log(error.message);
      toast.dismiss();
      toast.warning("Bạn đã đánh giá sản phẩm rồi", { pauseOnHover: false });
    }
  };

  useEffect(() => {
    async function fetchData(id) {
      try {
        setLoading(true);
        const action = getFeedback(id);
        const resultAction = await dispatch(action);
        const data = unwrapResult(resultAction);
        setReview(data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData(id);
  }, [feedback?.data]);

  return (
    <div className="mt-10">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          {" "}
          <div className="container bg-white rounded-lg p-5">
            <span className="text-xl font-bold">
              Đánh giá & nhận xét {data?.title}
            </span>
            <StatisticFeedback data={review} />
            <div className="flex flex-col items-center gap-y-5 py-5">
              <span className="text-2xl ">Bạn đánh giá sao sản phẩm này</span>
              <button
                className="text-lg py-3 px-28 rounded-lg font-semibold text-white bg-red-600"
                onClick={handleClick}
              >
                Đánh giá ngay
              </button>
            </div>
            <FeedbackList data={review.data} />
          </div>
          <ModalAdvanced
            visible={showModal}
            onClose={() => {
              setShowModal(false);
            }}
            bodyClassName="w-[600px] bg-white p-10 rounded-lg relative z-10 content h-[600px] overflow-y-auto overflow-x-hidden"
          >
            <Rating
              onClose={handleClose}
              onSubmit={handleSubmit}
              id={data?._id}
            />
          </ModalAdvanced>
        </>
      )}
    </div>
  );
};

export default Feelback;
